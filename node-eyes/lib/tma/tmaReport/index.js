'use strict';
const TmaClient = require('tma-rpc').client;
const NodeF = require('./NodeFProxy');

const constants = require('../../constants');

let serverInfo;
let timer_id;
let client;
let emptyfn = function() {};

exports.init = function(name, connString) {
    let name = name.split('.');
    serverInfo = new NodeF.tma.serverInfo();

    if (name.length > 1) {
        serverInfo.application = name[0];
        serverInfo.serverName = name[1];
    } else {
        serverInfo.application = constants.TMA_DEFAULT_APP;
        serverInfo.serverName = name[0];
    }
    serverInfo.pid = process.pid;
    client = TmaClient.stringToProxy(NodeF.tma.ServerFProxy, connString);
};

exports.keepAlive = function(interval) {
    if (!timer_id) {
        timer_id = setInterval(() => {
            client && client.keepAlive(serverInfo).catch(emptyfn);
        }, interval || constants.TMA_HEART_BEAT_INTERVAL);
    }
};

exports.destroy = function() {
    if (timer_id) {
        clearInterval(timer_id);
        timer_id = undefined;
    }
    if (client) {
        TmaClient.disconnect();
        client = undefined;
    }
    serverInfo = undefined;
};

exports.reportVersion = function(version) {
    client && client.reportVersion(serverInfo.application, serverInfo.serverName, version).catch(emptyfn);
};
