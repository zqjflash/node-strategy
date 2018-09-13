'use strict';

const os = require('os');

exports.__defineGetter__('physicalCores', () => {
    return 0;
});
exports.__defineGetter__('totalCores', () => {
    return os.cpus() ? os.cpus().length : 1;
});