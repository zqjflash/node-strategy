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
const Log = require('./log');
const pkg = require('../package.json');

const tmaReport = require('./tma/tmaReport');
const tmaMessage = require('./tma/tmaMessage');
const tmaNotify = require('./tma/tmaNotify');

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
        if (Log.isLogToFile()) {
            worker.process.stdout.on('data', procStd(worker.process.pid, 'info'));
            worker.process.stderr.on('data', procStd(worker.process.pid, 'error'));
        } else {
            worker.process.stdout.pipe(process.stdout);
            worker.process.stderr.pipe(process.stderr);
        }
    }).on('online', (worker) => {
        console.info('worker(%s), online.', worker.process.pid);
    }).on('listening', (worker, address) => {
        console.info('worker(%s), listening on %s:%s', worker.process.pid, address.address || '', address.port);
    });

    God.events.on('message', (code, worker, args) => {
        switch (code) {
            case constants.GOD_MESSAGE.EXCEPTION_REACHED_COND:
                console.error('exception occurred more than %s times within %s seconds, exiting ...', constants.EXCEPTION_TOTAL, constants.EXCEPTION_TIME / 1000);
                tmaNotify.report.error(util.format('exiting, exception occurred more than %s times within %s seconds', constants.EXCEPTION_TOTAL, constants.EXCEPTION_TIME / 1000), '');
                exception = true;
                break;
            case constants.GOD_MESSAGE.KILLING_ALL_WORKERS:
                console.info('killing all worker process ...');
                tmaReport.destroy();
                tmaMessage.destroy();
                Log.close();
                break;
            case constants.GOD_MESSAGE.KILLING_WORKER:
                console.info('killing worker(%s) ...', worker.process.pid);
                break;
            case constants.GOD_MESSAGE.FORCE_KILL_WORKER:
                console.error('exceeded the graceful timeout, force kill worker(%s) ...', worker.process.pid);
                tmaNotify.report.error('exceeded the graceful timeout, force kill worker', worker.process.pid);
                break;
            case constants.GOD_MESSAGE.ALL_WORKERS_STOPPED:
                console.info('all workers killed, really exiting now ...');
                setTimeout(() => {
                    process.exit(exception ? constants.CODE_UNCAUGHTEXCEPTION : 0);
                }, 100).unref(); // 取消setTimeout函数的回调函数调用
                break;
            case constants.GOD_MESSAGE.STOP_ZOMBIE_WORKER:
                console.error('detected zombie worker(%s), freemem %sM.', worker.process.pid, parseInt(os.freemem() / 1024 / 1024));
                tmaNotify.report.error(util.format('detected zombie worker, freemem %sM.', parseInt(os.freemem() / 1024 / 1024)), worker.process.pid);
                break;
            case constants.GOD_MESSAGE.KILL_ERROR:
                console.error('kill worker(%s) failed, %s.', worker.process.pid, args || 'no error');
                tmaNotify.report.error('kill worker failed', worker.process.pid);
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

    tmaMessage.on('notify', (command, data, callback) => {
        let mesgObj = {
            cmd: command
        };
        if (data) {
            mesgObj.data = data;
        }
        // 发送给worker进程
        God.send(mesgObj);

        // 发送给主进程(自身)
        mesgObj.setRet = callback;
        process.emit('message', mesgObj);
    }).on('shutdown', () => {
        console.info('received TMA shutdown signal.');
        tmaNotify.report.info('stop');
        God.killAll();
    });

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
    Log.prepare(name, dir);

    Log.init(null, 'TmaRotate', {
        maxFiles: constants.APPLOG_MAX_FILES,
        maxSize: constants.APPLOG_MAX_SIZE
    });

    Log.init('eyes', 'TmaRotate', {
        maxFiles: constants.APPLOG_MAX_FILES,
        maxSize: constants.APPLOG_MAX_SIZE
    });

    Log.setLevel(constants.APPLOG_LEVEL, null);
};
