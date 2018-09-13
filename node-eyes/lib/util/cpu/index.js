'use strict';

const os = require('os');
let cpuinfo;

if (os.platform() === 'win32') {
    cpuinfo = require('./win');
} else {
    cpuinfo = require('./posix');
}
exports.init = (cb) => {
    cpuinfo.init((err) => {
        if (err) {
            cpuinfo = require('./system');
        }
        exports.__defineGetter__('physicalCores', () => {
            return cpuinfo.physicalCores;
        });
        exports.__defineGetter__('totalCores', () => {
            return cpuinfo.totalCores;
        });
        cb(err);
    });
};