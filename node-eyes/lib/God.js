'use strict';

const os = require('os');
const cluster = require('cluster');
const path = require('path');

const treekill = require('super-treekill');
const constants = require('./constants');

const EventEmitter = new require('events').EventEmitter;
const events = new EventEmitter();

const minFreebytes = require('./util/mem').minFreebytes;

let exception_count = 0;
let workers_seq = [];
let exception_timer;
let heartbeat_time;

let env = {};

const allWorkers = () => {
    return Object.getOwnPropertyNames(cluster.workers).map((id) => {
        return cluster.workers[id];
    });
};

const setCluster = (args, execArgv) => {
    let settings = {
        exec: path.resolve(path.dirname(module.filename), 'ProcessContainer.js'),
        silent: true
    };
    if (args) {
        settings.args = args;
    }
    if (execArgv) {
        settings.execArgv = execArgv;
    }
    cluster.setupMaster(settings);
    cluster.on('exit', (worker, code, signal) => {
        let error = false;
        if (worker._hasError || code === constants.CODE_UNCAUGHTEXCEPTION) {
            error = true;
        }
        if (worker._errMesg) {
            error = worker._errMesg;
        }
        events.emit('exit', worker, error, code, signal);
    }).on('exit', (worker) => {
        let exitedAfterDisconnect = typeof worker.exitedAfterDisconnect === 'boolean' ? worker.exitedAfterDisconnect : worker.suicide;
        workers_seq[worker._seq] = false;
        worker._status = constants.WORKER_STATUS.STOPPED;
        if (worker._timerId) {
            clearTimeout(worker._timerId);
            delete worker._timeId;
        }
        if (!exitedAfterDisconnect || worker._hasError) {
            switch (canStartWorker()) {
                case constants.CAN_START_WORKER:
                    startWorker();
                    break;
                case constants.CAN_START_WORKER.NEED_TO_KILLALL:
                    killAll();
                    break;
            }
        }
        if (workers_seq.every((exists) => {
            return exists !== true;
        })) {
            destroy();
        }
    }).on('online', (worker) => {
        worker._status = constants.WORKER_STATUS.ONLINE;
    }).on('worker_message', (worker, message) => {
        let cmd = message.cmd;
        let data = message.data;
        let seq = null;
        if (typeof cmd !== 'string') {
            return;
        }
        if (cmd.indexOf('process.msg:') === 0) {
            seq = cmd.slice(12);
            if (seq === 'all') {
                allWorkers().forEach((worker) => {
                    worker.send(message);
                });
            } else {
                seq = parseInt(seq);
                if (!isNaN(seq)) {
                    allWorkers().forEach((worker) => {
                        if (worker._seq === seq) {
                            worker.send(message);
                        }
                    });
                }
            }
            return;
        }
        switch (cmd) {
            case 'god:err': 
                worker._hasError = true;
                worker._errMesg = data;
                return;
            case 'god:alive':
                worker._heartbeat = process.uptime();
                return;
        }
    });
};

const setArgs = (args) => {
    if (args['env'] && typeof args['env'] === 'object') {
        env = args['env'];
    }
    env['eyes_args'] = {};

    // 入口脚本
    env['eyes_args']['exec_script'] = path.resolve(process.cwd(), args['script']);

    // 进程权限
    if (args['run_as_user']) {
        env['eyes_args']['process_user'] = args['run_as_user'];
    }

    if (args['run_as_group']) {
        env['eyes_args']['process_group'] = args['run_as_group'];
    }

    // 心跳
    if (typeof args['keepaliveTime'] === 'number' && !isNaN(args['keepaliveTime'])) {
        env['eyes_args']['process_keepalive'] = args['keepaliveTime'];
    }

    // 日志设置
    if (args['log'] && args['name']) {
        env['eyes_args']['log_main'] = path.join(args['log'], args['name'] + '.log');
        env['eyes_args']['log_maxsize'] = constants.APPLOG_MAX_SIZE;
        env['eyes_args']['log_maxfiles'] = constants.APPLOG_MAX_FILES;
        env['eyes_args']['log_level'] = constants.APPLOG_LEVEL;
    }

    // http监控设置
    env['eyes_args']['http_threshold'] = constants.TMA_MONITOR_HTTP_THRESHOLD;
    env['eyes_args']['http_seppath'] = constants.TMA_MONITOR_HTTP_SEPPATH;
    env['eyes_args']['http_socketerr'] = constants.TMA_MONITOR_HTTP_SOCKETERR;

    // 堆栈长度设置
    env['eyes_args']['long_stack'] = constants.LONG_STACK;
    env['eyes_args']['stack_usercode'] = constants.LONG_STACK_FILTER_USERCODE;

    // 环境参数
    if (args['node_args']) {
        env['eyes_args']['node_args'] = args['node_args'].join(',');
    }

    if (args['name']) {
        env['eyes_args']['exec_name'] = args['name'];
    }

    // 序列化eyes_args
    env['eyes_args'] = JSON.stringify(env['eyes_args']);

    // 公共env

    if (args['http_ip']) {
        env['HTTP_IP'] = args['http_ip'];
        env['IP'] = args['http_ip'];
    }

    if (args['http_port']) {
        env['HTTP_PORT'] = args['http_port'];
        env['PORT'] = args['http_port'];
    }

    if (args['config']) {
        env['TMA_CONFIG'] = args['config'];
    }
    if (typeof args['tmaMonitor'] === 'boolean') {
        env['TMA_MONITOR'] = args['tmaMonitor'];
    }
};