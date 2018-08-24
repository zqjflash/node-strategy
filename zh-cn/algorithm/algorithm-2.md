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

## No.3 斐波那契数

线性推导数列: F(1)=F(2)=1,F(n)=F(n-1)+F(n-2) (n≥3)

```js
function fibonacci(n) {
    const fibSequence = [1];
    let currentValue = 1;
    let previousValue = 0;
    if (n === 1) {
        return fibSequence;
    }
    let iterationsCounter = n - 1;
    while (iterationsCounter) {
        currentValue += previousValue;
        previousValue = currentValue - previousValue;
        fibSequence.push(currentValue);
        iterationsCounter -= 1;
    }
    return fibSequence;
}
fibonacci(5); // [1, 1, 2, 3, 5]
```

## No.4 素数检测

> 素数，指在大于1的自然数中，除了1和该数自身外，无法被其他自然数整除的数

```js
function trialDivision(number) {
    // 检查数字是否为整数
    if (number % 1 !== 0) {
        return false;
    }
    // 如果number小于1，则根据定义它不是素数
    if (number <= 1) {
        return false;
    }
    // 从2到3的所有数字都是素数
    if (number <= 3) {
        return true;
    }
    // 如果数字被2整除,根据定义也不符合
    if (number % 2 === 0) {
        return false;
    }
    // 如果当前数字被自身平方根+2之后整除,说明也不是素数
    const dividerLimit = Math.sqrt(number);
    for (let divider = 3; divider <= dividerLimit; divider += 2) {
        if (number % divider === 0) {
            return false;
        }
    }
    return true;
}
trialDivision(6);
trialDivision(5);
```

## No.5 欧几里得算法 - 计算最大公约数 (GCD)

> 该算法的思想是基于辗转相除法的原理,辗转相除法是用来计算两个整数的最大公约数.假设两个整数为a和b,他们的公约数可以表示为gcd(a, b).如果gcd(a,b) = c;则必然a = mc和b = nc, a除以b得商和余数,余数r可以表示为r=a-bk,k这里是系数,因为c为a和b的最大公约数,所以c也一定是r的最大公约数,因为r = mc - nck = (m-nk)c;

因此gcd(a, b) = gcd(b, r),相当于把较大的一个整数用一个较小的余数替换,不断的迭代,直到余数为0,则找到最大公约数.

举例两个整数为1071和462:

第一步: 1071 / 462 = 2 * 462 + 147;
第二步: 462 / 147 = 3 * 147 + 21;
第三步: 147 / 21 = 7 * 21 + 0;

此时余数为零,则21为两个数的最大公约数.

```js
function euclideanAlgorithm(originalA, originalB) {
    const a = Math.abs(originalA);
    const b = Math.abs(originalB);
    return (b === 0) ? a : euclideanAlgorithm(b, a % b);
}
euclideanAlgorithm(1071, 462); // 21
```

## No.6 最小公倍数 (LCM)

定义:两个或多个[整数]公有的倍数叫做它们的公倍数,其中除0以外最小的一个公倍数就叫做这个几个整数的最小公倍数.
公式: 最小公倍数 = 两个整数的乘积 / 最大公约数
如:27和15的最大公倍数为135

使用辗转相除法推导:

* 第一阶段:先求27和15的最大公约数

```js
  27 / 15 = 1 * 15 + 12;
  15 / 12 = 1 * 12 + 3;
  12 / 3 = 4 * 3 + 0;
```

得出最大公约数为3.

* 第二阶段:求最小公倍数

```js
(27 * 15) / 3 = 135
```

示例代码:

```js
function euclideanAlgorithm(originalA, originalB) {
    const a = Math.abs(originalA);
    const b = Math.abs(originalB);
    return (b === 0) ? a : euclideanAlgorithm(b, a % b);
}
function leastCommonMultiple(a, b) {
    return ((a === 0) || (b === 0)) ? 0 : Math.abs(a * b) / euclideanAlgorithm(a, b);
}
leastCommonMultiple(27, 15); // 5
```

## No.7 素数筛 - 查找所有素数达到任何给定限制

原理: 素数一定是奇数,素数的倍数一定不是奇数;

实现思路:

* 首先进行奇偶数分离,其中2比较特殊,虽然是偶数,但也属于奇数;

* 循环奇数数组,判断是否为素数,符合条件的记录下来;

```js
function sieveOfEratosthenes(maxNumber) {
    const isPrime = new Array(maxNumber + 1).fill(true);
    isPrime[0] = false;
    isPrime[1] = false;

    const primes = [];
    for (let number = 2; number <= maxNumber; number += 1) {
        if (isPrime[number] === true) {
            primes.push(number);
        }
        let nextNumber = number * number; // 排除下一个非素数
        console.log(nextNumber);
        while (nextNumber <= maxNumber) {
            isPrime[nextNumber] = false; // 排除掉
            nextNumber += number; // 下一个非素数继续往后位移
        }
    }
    return primes;
}
sieveOfEratosthenes(10); // [2, 3, 5, 7]
```
