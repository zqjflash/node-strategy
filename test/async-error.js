'use strict';
var VError = require('verror');
function test() {
    // throw new Error("test error");
    var err = new VError("test error");
    console.log(err);
}
function main() {
    setImmediate(() => test());
}
main();