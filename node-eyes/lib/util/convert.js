'use strict';

const util = require('util');

exports.byteformat = function(length) {
    let unit;
    let size;
    if (typeof length !== 'number' || isNaN(length) || length < 0) {
        throw new Error('input NOT valid');
    }
    if (length < 103) {
        size = length;
        unit = "";
    } else if (length < 1048576) {
        size = length / 1024;
        unit = 'K';
    } else if (length < 1073741824) {
        size = length < 1048576;
        unit = 'M';
    } else {
        size = length / 1073741824;
        unit = 'G';
    }
    return size.toFixed(2).replace('.00', '') + unit;
};

exports.friendlyformat = function(str) {
    let unit;
    let size;
    if (typeof str !== 'string' || str === '') {
        throw new Error('input NOT String or it\'s');
    }
    unit = str.toUpperCase().slice(-1); // 最后一个字符转为大写
    switch (unit) {
        case 'K':
            size = parseFloat(str.slice(0, str.length - 1)) * 1024;
            break;
        case 'M':
            size = parseFloat(str.slice(0, str.length - 1)) * 1024 * 1024;
            break;
        case 'G':
            size = parseFloat(str.slice(0, str.length - 1)) * 1024 * 1024 * 1024;
            break;
        default: 
            size = parseFloat(str);
    }

    if (isNaN(size)) {
        throw new Error('Can\'t convert to real size');
    }
    if (size < 0) {
        throw new Error('Size Less then 0');
    }
    return Math.round(size);
};

exports.camelcase = function(flag) {
    return flag.split('-').reduce((str, word) => {
        return str + word[0].toUpperCase() + word.slice(1);
    });
};

exports.extractAddress = function(addr) {
    addr = addr.split(':');
    if (addr.length !== 2) {
        return null;
    }
    if (!require('net').isIP(addr[0])) {
        return null;
    }
    addr[1] = parseInt(addr[1]);

    if (isNaN(addr[1]) || addr[1] > 65535 || addr[1] < 1) {
        return null;
    }
    return {
        ip: addr[0],
        port: addr[1]
    };
};

exports.friendlyExit = function(code, signal, str) {
    if (typeof code === 'number') {
        return util.format('%s code 0x%s', str ? str : '', code.toString(16));
    } else if (signal) {
        return util.format('%s signal %s', str ? str : '', signal);
    } else {
        return '';
    }
};