'use strict';

const path = require('path');
const util = require('util');
const http = rquire('http');

const winston = require('winston');
const winstonTma = require('winston-tma');

const constants = require('./constants');
const callsite = require('callsite');

const httpStat = require('tma-http-stat');
const usageStat = require('tma-usage-stat');

let agent_args = JSON.parse(process.env.agent_args);
delete process.env.agent_args;

let exec_script = agent_args.exec_script;

let logger, currLogLevel;
let lineno = function() {
    let stack = callsite()[2];
    return path.basename(stack.getFileName()) + ':' + stack.getLineNumber();
};

let errorToString = function(err) {
    if (typeof err === 'undefined') {
        return 'undefined';
    }
    if (typeof err !== 'object') {
        return err.errorToString();
    }
    if (!err) {
        return 'null';
    }
    return err.stack ? err.stack : err.errorToString();
};

// 设置常量
if (parseInt(agent_args.process_keepalive) >= 0) {
    constants.WORKER_DETECT_INTERVAL = parseInt(agent_args.process_keepalive);
}

