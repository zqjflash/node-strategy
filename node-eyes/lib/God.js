'use strict';

const os = require('os');
const cluster = require('cluster');
const path = require('path');

const treekill = require('super-treekill');
const constants = require('./constants');

const EventEmitter = new require('events').EventEmitter;
const events = new EventEmitter();

const minFreebytes = require('./util/mem').minFreebytes;

let exception_count = 0;
let workers_seq = [];
let exception_timer;
let heartbeat_time;

let env = {};

const allWorkers = () => {
    return Object.getOwnPropertyNames(cluster.workers).map((id) => {
        return cluster.workers[id];
    });
};

const setCluster = (args, execArgv) => {
    let settings = {
        exec: path.resolve(path.dirname(module.filename), 'ProcessContainer.js'),
        silent: true
    };
    if (args) {
        settings.args = args;
    }
    if (execArgv) {
        settings.execArgv = execArgv;
    }
    cluster.setupMaster(settings);
    cluster.on('exit', (worker, code, signal) => {
        let error = false;
        if (worker._hasError || code === constants.CODE_UNCAUGHTEXCEPTION) {
            error = true;
        }
        if (worker._errMesg) {
            error = worker._errMesg;
        }
        events.emit('exit', worker, error, code, signal);
    })
};