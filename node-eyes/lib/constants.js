'use strict';

const conf = {
    ENTRY_POINT_NAME: ['server.js', 'app.js', 'start.js', 'index.js'],
    GRACEFUL_TIMEOUT: 1000 * 8,
    EXCEPTION_TOTAL: 2,
    EXCEPTION_TIME: 1000 * 10,
    APPLOG_MAX_FILES: 10,
    APPLOG_MAX_SIZE: 1024 * 1024 * 10,
    APPLOG_LEVEL: 'DEBUG',
    WORKER_STATUS: {
        ONLINE: 1,
        STOPPED: 2,
        STOPPING: 3,
        LAUNCHING: 4,
        ERRORED: 5   
    },
    GOD_MESSAGE: {
        EXCEPTION_REACHED_COND: 1,
        KILLING_ALL_WORKERS: 2,
        KILLING_WORKER: 3,
        FORCE_KILL_WORKER: 4,
        ALL_WORKERS_STOPPED: 5,
        STOP_ZOMBIE_WORKER: 6,
        KILL_ERROR: 7
    },
    CAN_START_WORKER: {
        OK: 1,
        NEED_TO_KILLALL: 2,
        ALREADY_SEND_CMD: 3
    },
    TMA_DEFAULT_APP: 'TestTMA',
    TMA_HEART_BEAT_INTERVAL: 10 * 1000,
    TMA_MONITOR: true,
    TMA_MONITOR_HTTP_THRESHOLD: 400,
    TMA_MONITOR_HTTP_SEPPATH: true,
    TMA_MONITOR_HTTP_SOCKETERR: true,
    WORKER_HEART_BEAT_TIMES: 5,
    WORKER_DETECT_INTERVAL: 5 * 60,
    CODE_UNCAUGHTEXCEPTION: 100,
    LONG_STACK: false,
    LONG_STACK_FILTER_USERCODE: false
};
module.exports = conf;