# 第二节 数学

## No.1 Bit操控 - set/get/update/clear位,乘以/除以 二进制位,变负等;

以getBit方法为示例代码:

```js
// >> 表示将number的二进制向右移b(<32)位,丢弃被移出的位
// & 对于每一个比特位,只有两个操作数相应的比特位都是1时,结果才位1,否则为0

function getBit(number, bitPosition) {
    return (number >> bitPosition) & 1;
}
getBit(1, 0);
```

分析: 

* number值传入1,转成二进制(31个零,省略号代替)00000...00001;
* 按位右移0位,二进制值保持不变;
* 按位与上1,这是相当于两个二进制(31个零,省略号代替)00000...00001数按位与运算,最后一位都是1,结果也为1

## No.2 阶乘

```js
function factorial(number) {
    let result = 1;
    for (let i = 2; i <= number; i+= 1) {
        result *= i;
    }
    return result;
}
factorial(2);
```

注:需要注意JS针对大数的阶乘,需要考虑使用String或数组的方式来实现,否则会出现精度下降;
