function reduce(arr, cb, initial=null) {
    function iterator(res, vals, index) {
        // res为动态数组的首个元素,vals为除首个元素之外的动态数组,index为传入的索引
        if (vals.length == 1) {
            return cb(res, vals[0], index);
        }
        return cb(res, vals[0], index).then((n) => iterator(n, vals.slice(1), index+1));
    }
    if (initial) {
        return iterator(initial, arr, 1);
    } else {
        return iterator(arr[0], arr.slice(1), 0);
    }
}
function cb(res, i, index) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(res + i);
        }, 1000);
    });
}
const result = reduce([1, 2, 3, 4, 5], cb);
result.then((n) => {
    console.log(n);
});