// var VError = require('verror');
function test() {
    throw new Error("test error");
    // var err = new VError("test error");
    // console.log(err.message);
}
function main() {
    setImmediate(() => test());
}
main();