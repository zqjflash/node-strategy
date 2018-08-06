module.export = fun;
var moduleB = require('./moduleB');
console.log(moduleB.fun());
function fun() {
    return {a: 1};
}