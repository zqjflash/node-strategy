'use strict';

// linux平台使用内核参数计算最低内存值

const os = require('os');
const fs = require('fs');

let minFreebytes = undefined;
// __defineGetter__方法可以为一个已经存在的对象设置访问器属性
exports.__defineGetter__('minFreebytes', () => {
    let min_free_kbytes;
    if (minFreebytes >= 0) {
        return minFreebytes;
    }
    if (os.platform() === 'linux') {
        try {
            min_free_kbytes = parseInt(fs.readFileSync('/proc/sys/vm/min_free_kbytes', 'ascii'));
            if (min_free_kbytes > 0) {
                minFreebytes = min_free_kbytes * 1024;
            } else {
                minFreebytes = 0;
            }
        } catch(e) {
            minFreebytes = 0;
        }
    } else {
        minFreebytes = 0;
    }
    return minFreebytes;
});