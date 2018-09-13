'use strict';

const assert = require('assert');
const fs = require('fs');

let cpuinfo = [];

exports.init = (cb) => {
    fs.readFile('/proc/cpuinfo', {encoding : 'ascii'}, (err, data) => {
        let result = {};
        if (err) {
            cb(new Error('get /proc/cpuinfo failed'));
            return;
        }
        data.split('\n').forEach((line) => {
            line = line.replace(/\t/g, '');
            let parts = line.split(':');
            if (parts.length === 2) {
                result[parts[0].replace(/\s/g, '_')] = parts[1].trim().split(' ', 1)[0];
            }
            if (line.length < 1) {
                cpuinfo.push(result);
                result = {};
            }
        });
        cpuinfo.pop();

        if (cpuinfo.length === 0) {
            cb(new Error('parse cpuinfo data err'));
        } else {
            cb();
        }
    });
};

exports.__defineGetter__('physicalCores', () => {
    let count = 0;
    let phyidList = [];
    assert(cpuinfo.length !== 0, 'init MUST BE called first!');

    cpuinfo.forEach((info) => {
        if (phyidList.indexOf(info['physical_id']) === -1) {
            count += parseInt(info['cpu_cores']);
            phyidList.push(info['physical_id']);
        }
    });
    return count;
});

exports.__defineGetter__('totalCores', () => {
    assert(cpuinfo.length !== 0, 'init MUST BE called first!');
    return cpuinfo.length;
});