const fs = require('fs');
console.log('beginning of the program');
const promise = new Promise(resolve => {
    console.log('this is promise function!');
    resolve('resolved message');
});
promise.then(() => {
    console.log('this is the first resolved promise');  
}).then(() => {
    console.log('this is the second resolved promise');
});
process.nextTick(() => {
    console.log('this is the process next tick now');
});
fs.readFile('index.html', () => {
    console.log('index.html');
    setTimeout(() => {
        console.log('readFile setTimeout with 0ms delay');
    }, 0);
    setImmediate(() => {
        console.log('readFile setImmediate callback');
    });
});

setTimeout(() => {
    console.log('setTimeout with 0ms delay');
}, 0);

setImmediate(() => {
    console.log('setImmediate callback');
});