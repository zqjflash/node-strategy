'use strict';

const path = require('path');
const util = require('util');
const cluster = require('cluster');
const os = require('os');

const compareVersions = require('compare-versions');

const God = require('./God');
const constants = require('./constants');
const convert = require('./util/convert');
const cpu = require('./util/cpu');
const deps = require('./util/lsdeps');
// const Log = require('./log');
const pkg = require('../package.json');

// const tmaReport = require('./tma/tmaReport');
// const tmaMessage = require('./tma/tmaMessage');
// const tmaNotify = require('./tma/tmaNotify');

const bindEvents = () => {
    let exception = false;
    cluster.on('fork', (worker) => {
        console.info('worker(%s), forked.', worker.process.pid);
        let procStd = (pid, level) => {
            return (buf) => {
                buf.toString().split('\n').forEach((line) => {
                    if (line.length > 0) {
                        if (line[line.length - 1] === '\r') {
                            line = line.slice(0, -1);
                        }
                        Log.append(null, {
                            level: level,
                            msg: line,
                            meta: {
                                pid: pid
                            }
                        });
                    }
                });
            }
        };
        // if (Log.isLogToFile()) {
        //     worker.process.stdout.on('data', procStd(worker.process.pid, 'info'));
        //     worker.process.stderr.on('data', procStd(worker.process.pid, 'error'));
        // } else {
            worker.process.stdout.pipe(process.stdout);
            worker.process.stderr.pipe(process.stderr);
        // }
    }).on('online', (worker) => {
        console.info('worker(%s), online.', worker.process.pid);
    }).on('listening', (worker, address) => {
        console.info('worker(%s), listening on %s:%s', worker.process.pid, address.address || '', address.port);
    });

    God.events.on('message', (code, worker, args) => {
        switch (code) {
            case constants.GOD_MESSAGE.EXCEPTION_REACHED_COND:
                console.error('exception occurred more than %s times within %s seconds, exiting ...', constants.EXCEPTION_TOTAL, constants.EXCEPTION_TIME / 1000);
                // tmaNotify.report.error(util.format('exiting, exception occurred more than %s times within %s seconds', constants.EXCEPTION_TOTAL, constants.EXCEPTION_TIME / 1000), '');
                exception = true;
                break;
            case constants.GOD_MESSAGE.KILLING_ALL_WORKERS:
                console.info('killing all worker process ...');
                // tmaReport.destroy();
                // tmaMessage.destroy();
                // Log.close();
                break;
            case constants.GOD_MESSAGE.KILLING_WORKER:
                console.info('killing worker(%s) ...', worker.process.pid);
                break;
            case constants.GOD_MESSAGE.FORCE_KILL_WORKER:
                console.error('exceeded the graceful timeout, force kill worker(%s) ...', worker.process.pid);
                // tmaNotify.report.error('exceeded the graceful timeout, force kill worker', worker.process.pid);
                break;
            case constants.GOD_MESSAGE.ALL_WORKERS_STOPPED:
                console.info('all workers killed, really exiting now ...');
                setTimeout(() => {
                    process.exit(exception ? constants.CODE_UNCAUGHTEXCEPTION : 0);
                }, 100).unref(); // 取消setTimeout函数的回调函数调用
                break;
            case constants.GOD_MESSAGE.STOP_ZOMBIE_WORKER:
                console.error('detected zombie worker(%s), freemem %sM.', worker.process.pid, parseInt(os.freemem() / 1024 / 1024));
                // tmaNotify.report.error(util.format('detected zombie worker, freemem %sM.', parseInt(os.freemem() / 1024 / 1024)), worker.process.pid);
                break;
            case constants.GOD_MESSAGE.KILL_ERROR:
                console.error('kill worker(%s) failed, %s.', worker.process.pid, args || 'no error');
                // tmaNotify.report.error('kill worker failed', worker.process.pid);
                break;
        }
    }).on('exit', (worker, error, code, signal) => {
        if (error) {
            console.error('worker(%s), exit unexpected.', worker.process.pid);
            tmaNotify.report.error('worker exit unexpected', worker.process.pid);
            if (typeof error === 'string') {
                Log.append(null, {
                    level: 'error',
                    msg: error,
                    meta: {
                        pid: worker.process.pid
                    }
                });
            } else {
                console.info('worker(%s), exit normally%s.', worker.process.pid, convert.friendlyExit(code, signal, ' with'));
            }
        }
    });

    process.once('SIGINT', () => {
        console.info('received kill or Ctrl-C signal.');
        tmaNotify.report.info('stop');
        God.killAll();
    }).on('exit', (code) => {
        console.info('exit%s.', convert.friendlyExit(code, null, ' with'));
    });

    // tmaMessage.on('notify', (command, data, callback) => {
    //     let mesgObj = {
    //         cmd: command
    //     };
    //     if (data) {
    //         mesgObj.data = data;
    //     }
    //     // 发送给worker进程
    //     God.send(mesgObj);

    //     // 发送给主进程(自身)
    //     mesgObj.setRet = callback;
    //     process.emit('message', mesgObj);
    // }).on('shutdown', () => {
    //     console.info('received TMA shutdown signal.');
    //     tmaNotify.report.info('stop');
    //     God.killAll();
    // });

    process.on('message', function(message) {
        if (message) {
            switch (message.cmd) {
                case 'tma.setloglevel':
                    Log.setLevel(message.data, null);
                    break;
                case 'preheatCheck':
                    if (God.getStatus().every((status) => {
                        return status === constants.WORKER_STATUS.ONLINE;
                    })) {
                        message.setRet('success');
                    } else {
                        message.setRet('not ready');
                    }
                    break;
                case 'tma.viewversion':
                    message.setRet(pkg.version);
                    break;
            }
        }
    });
};

const initLog = (name, dir) => {
    // Log.prepare(name, dir);

    // Log.init(null, 'TmaRotate', {
    //     maxFiles: constants.APPLOG_MAX_FILES,
    //     maxSize: constants.APPLOG_MAX_SIZE
    // });

    // Log.init('eyes', 'TmaRotate', {
    //     maxFiles: constants.APPLOG_MAX_FILES,
    //     maxSize: constants.APPLOG_MAX_SIZE
    // });

    // Log.setLevel(constants.APPLOG_LEVEL, null);
};

const outRedirect = () => {
    let register = (level) => {
        return () => {
            // Log.append('eyes', {
            //     level: level,
            //     msg: util.format.apply(util, arguments),
            //     meta: {
            //         pid: process.pid
            //     }
            // });
        };
    };
    console.info = register('info');
    console.warn = register('warn');
    console.error = register('error');
};

// 获取work进程参数
const getWorkerArgs = (script, opts) => {
    let args = {};
    let obj;
    args['script'] = script;
    if (opts.scriptArgs) {
        args['script_args'] = opts.scriptArgs;
    }
    if (opts.nodeArgs) {
        args['node_args'] = opts.nodeArgs;
    }
    // work进程标题
    args['name'] = typeof opts.name === 'string' ? opts.name : path.basename(script, path.extname(script));

    // 运行自定义的进程环境
    if (opts.env) {
        args['env'] = opts.env;
    }

    if (opts.httpAddress) {
        obj = convert.extractAddress(opts.httpAddress);
        if (obj) {
            args['http_ip'] = obj.ip;
            args['http_port'] = obj.port;
        }
    }

    if (opts.runAsUser) {
        args['run_as_user'] = opts.runAsUser;
    }
    if (opts.runAsGroup) {
        args['run_as_group'] = opts.runAsGroup;
    }

    if (!isNaN(opts.maxMemoryRestart)) {
        if (!Array.isArray(args['node_args'])) {
            args['node_args'] = [];
        }
        args['node_args'].push('--max-old-space-size=' + opts.maxMemoryRestart);
    }
    if (opts.config) {
        args['config'] = opts.config;
    }

    if (!isNaN(opts.keepaliveTime)) {
        args['keepaliveTime'] = opts.keepaliveTime;
    }

    if (typeof opts.tmaMonitor === 'boolean') {
        args['tmaMonitor'] = opts.tmaMonitor;
    }

    if (opts.log) {
        args['log'] = path.join(opts.log, args['name'].replace('.', '/') + '/');
    }
    return args;
};

const setConstants = (opts) => {
    if (!isNaN(opts.gracefulShutdown)) {
        constants.GRACEFUL_TIMEOUT = opts.gracefulShtdown;
    }
    if (opts.config) {
        if (constants.GRACEFUL_TIMEOUT > 1000) {
            constants.GRACEFUL_TIMEOUT -= 1000;
        } else {
            constants.GRACEFUL_TIMEOUT = 0;
        }
    }
    // !isNaN表示数值型
    if (!isNaN(opts.exceptionMax)) {
        constants.EXCEPTION_TOTAL = opts.exceptionMax;
    }
    if (!isNaN(opts.exceptionTime)) {
        constants.EXCEPTION_TIME = opts.exceptionTime;
    }
    if (!isNaN(opts.keepaliveTime)) {
        constants.WORKER_DETECT_INTERVAL = opts.keepaliveTime;
    }
    if (!isNaN(opts.applogMaxFiles)) {
        constants.APPLOG_MAX_SIZE = opts.applogMaxFiles;
    }
    if (opts.applogLevel) {
        constants.APPLOG_LEVEL = opts.applogLevel;
    }
    if (typeof opts.tmaMonitor === 'boolean') {
        constants.TMA_MONITOR = opts.tmaMonitor;
    }
    if (!isNaN(opts.tmaMonitorHttpThreshold)) {
        constants.TMA_MONITOR_HTTP_THRESHOLD = opts.tmaMonitorHttpThreshold;
    }
    if (typeof opts.tmaMonitorHttpSeppatch === 'boolean') {
        constants.TMA_MONITOR_HTTP_SEPPATH = opts.tmaMonitorHttpSeppatch;
    }
    if (typeof opts.tmaMonitorHttpSocketerr === 'boolean') {
        constants.TMA_MONITOR_HTTP_SOCKETERR = opts.tmaMonitorHttpSocketerr;
    }
    if (typeof opts.longStack === 'boolean') {
        constants.LONG_STACK = opts.longStack;
    }
    if (typeof opts.longStackFilterUsercode === 'boolean') {
        constants.LONG_STACK_FILTER_USERCODE = opts.longStackFilterUsercode;
    }
    if (constants.LONG_STACK && compareVersions(process.versions.node, '8.2.0') < 0) {
        constants.LONG_STACK = false;
    }
    if (!constants.LONG_STACK) {
        constants.LONG_STACK_FILTER_USERCODE = false;
    }
};

const initTmaComponent = (args, opts) => {
    if (opts.tmaNode) {
        console.info('tma node:', opts.tmaNode);
        tmaReport.init(args['name'], opts.container, opts.tmaNode);
        tmaReport.reportVersion(pkg.version || process.version);
        tmaReport.keepAlive();
    }
    if (opts.tmaLocal) {
        console.info('local interface:', opts.tmaLocal);
        tmaMessage.startServer(args['name'], opts.tmaLocal);
    }
    if (opts.config) {
        tmaNotify.init(opts.config);
    }
};

const startWorker = (opts) => {
    let instances;
    if (!isNaN(opts.instances) && opts.instances > 0) {
        instances = opts.instances;
    } else {
        if (opts.instances === -1) { // 最大实例数
            instances = cpu.totalCores;
        } else {
            // 自动选配实例数,物理核心数
            if (cpu.physicalCores > 0 && cpu.totalCores > cpu.physicalCores) {
                instances = cpu.physicalCores;
            } else {
                instances = cpu.totalCores;
            }
        }
    }
    instances = instances || 1;

    console.info('forking %s workers ...', instances);
    God.startWorker(instances);
};

const deviceInfo = () => {
    if (cpu.physicalCores !== 0) {
        return util.format('%s arch, %d cpus, %d physical cores, %s platform, %s', os.arch(), cpu.totalCores, cpu.physicalCores, os.platform, os.hostname());
    } else {
        return util.format('%s arch, %d cpus, %s platform, %s', os.arch(), cpu.totalCores, os.platform(), os.hostname());
    }
};

// 程序入口
exports.start = (script, opts) => {
    let args = getWorkerArgs(script, opts);
    setConstants(opts);
    process.title = util.format('%s: master process', path.resolve(process.cwd(), script));
    initLog(args['name'], args['log']);
    outRedirect();

    console.info('starting eyes ...');
    console.info('node:', process.version);
    console.info('version:', 'v' + pkg.version);

    deps.list((err, depslist) => {
        if (!err) {
            console.info('dependencies:', depslist);
        }
        console.info('options:', util.inspect(args).replace(/[\n|\r]/g, '')); // 回车或换行
        cpu.init((err) => {
            if (err) {
                console.warn('%s, callback to use os.cpus()', err);
            }
            console.info('device:', deviceInfo());
            bindEvents();
            God.prepare(args);
            initTmaComponent(args, opts);
            startWorker(opts);
            // tmaNotify.report.info('restart');
        });
    });
};
