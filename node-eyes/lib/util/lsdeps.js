'use strict';

const util = require('util');
const path = require('path');

const readInstalled = require('read-installed');

exports.list = (cb) => {
    readInstalled(path.join(__dirname, '../../'), {depth: 1}, (err, data) => {
        if (err) {
            cb(err);
            return;
        }
        cb(null, Object.getOwnPropertyNames(data.dependencies).map((name) => {
            let deps = data.dependencies[name];
            let depsStr;
            if (deps.dependencies) {
                depsStr = Object.getOwnPropertyNames(deps.dependencies).map((name) => {
                    return name + '@' + deps.dependencies[name].version;
                }).join(', ');
            }
            return util.format('%s@%s%s', name, deps.version, depsStr ? ' (' + depsStr + ')' : '');
        }).join(', '));
    });
};