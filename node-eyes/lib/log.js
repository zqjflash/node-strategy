'use strict';

const path = require('path');
const cluster = require('cluster');

const winston = require('winston');
const winstonTma = require('./util/winston-tma');

let servername;
let dirname;

const isLogToFile = () => {
    return !!(servername && dirname);
};

const initLogger = (name, type, options) => {
    let transport;
    let logger;

    if (!isLogToFile()) {
        logger = winston.loggers.add(name, {
            transports: [new winston.transports.Console({
                formatter: winstonTma.Formatter.Detail()
            })]    
        });
        logger.emitErrs = true;
        logger.setLevels(winston.config.tma.levels);
        return true;
    }

    transport = winston.transports[type === 'TmaRotate' ? 'TmaBase' : type];

    if (!transport) {
        return false;
    }

    if (name !== '_global') {
        options.filename = path.join(dirname, servername + '_' + name + '.log');
    } else {
        options.filename = path.join(dirname, servername + '.log');
    }

    transport = new transport(options);

    if (type === 'TmaRotate') {
        transport.on('checkfile', () => {
            winston.transports.TmaRotate.Master.start(this.filename, this.interval, options.maxFiles, options.maxSize, '_');
        });
    }

    logger = winston.loggers.add(name, {transports: [transport]});
    logger.emitErrs = true;
    logger.setLevels(winston.config.tma.levels);

    return true;
};

exports.prepare = (name, dir) => {
    dirname = dir;
    servername = name;

    winston.addColors(winston.config.tma.colors);
    cluster.on('worker_message', (worker, message) => {
        let data = message.data;
        if (message.cmd === 'log::rotate') {
            winston.transports.TmaRotate.Master.start(data.filename, data.interval, data.maxFiles, data.maxSize, data.concatStr);
        }
    });
};

exports.init = (name, type, options) {
    name = name || '_global';
    if (winston.loggers.has(name)) {
        return true;
    }
    return initLogger(name, type, options);
};

exports.append = (name, data) => {
    name = name || '_global';
    let logger = winston.loggers.get(name);
    if (logger && typeof logger[data.level] === 'function') {
        logger.log(data.level, data.msg, data.meta);
    }
};

exports.setLevel = (level, name) => {
    let keys;

    if (typeof level !== 'string') {
        return false;
    }
    level = level.toLowerCase();

    if (Object.getOwnPropertyNames(winston.config.tma.levels).indexOf(level) === -1) {
        return false;
    }

    switch (typeof name) {
        case 'object':
            keys = ['_global'];
            break;
        case 'string':
            keys = [name];
            break;
        default:
            keys = Object.getOwnPropertyNames(winston.loggers.loggers);
            break;
    }

    keys.forEach((key) => {
        let logger = winston.loggers.loggers[key];
        Object.getOwnPropertyNames[logger.transports].forEach((name) => {
            logger.transports[name].level = level;
        });
    });

    return true;
};

exports.close = () => {
    winston.transports.TmaRotate.Master.close();
};

exports.isLogToFile = isLogToFile;
