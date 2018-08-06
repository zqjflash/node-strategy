module.exports = fun;
var moduleA = require('./moduleA');
console.log(moduleA.fun());
function fun() {
    return {b: 2};
}