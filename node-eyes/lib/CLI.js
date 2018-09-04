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
};
