'use strict';

const assert = require('assert');
const wmic = require('wmic');
let physicalCores;
let totalCores;

exports.init = (cb) => {
    wmic.get_values('cpu', 'NumberOfCores, NumberOfLogicalProcessors', null, (err, result) => {
        if (err) {
            cb(new Error('exec wmic failed'));
            return;
        }
        physicalCores = parseInt(result.NumberOfCores);
        totalCores = parseInt(result.NumberOfLogicalProcessors);

        if (isNaN(physicalCores) || isNaN(totalCores) || physicalCores <= 0 || totalCores <= 0) {
            cb(new Error('parse cpuinfo data err'));
        } else {
            cb();
        }
    });
};

exports.__defineGetter__('physicalCores', () => {
    assert(physicalCores > 0, 'init MUST BE called first!');
    return physicalCores;
});

exports.__defineGetter__('totalCores', () => {
    assert(totalCores > 0, 'init MUST BE called first!');
    return totalCores;
});