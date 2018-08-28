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

## No.8 判断2次方数 - 检查数字是否为2的幂 (原生和按位算法)

> 将2的幂次方写成二进制形式后,很容易就会发现有一个特点:二进制中只有一个1,并且1后面跟了n个0,因此问题可以转化为判断1后面是否跟了n个0就可以.

公式:

```js
(number & number - 1) == 0
```

2的幂次方换算二进制为10...0这样的形式.与上自己-1的位数,得到结果为0.

* 二进制按位与实现代码:

```js
function isPowerOfTwoBitwise(number) {
    if (number < 1) {
        return false;
    }
    return (number & (number - 1)) === 0;
}
isPowerOfTwoBitwise(8); // true
```

* 原生实现代码:

```js
function isPowerOfTwo(number) {
    if (number < 1) {
        return false;
    }
    let dividedNumber = number;
    while (dividedNumber !== 1) {
        if (dividedNumber % 2 !== 0) {
            return false;
        }
        dividedNumber /= 2;
    }
    return true;
}
isPowerOfTwo(8);
```

## No.9 杨辉三角形

1. 在杨辉三角中,每个数是它左上方和右上方的数之和;
2. 每行数字左右对称,由1开始逐渐变大;
3. 第n行的数字有n+1项;
4. 第n行数字和为2的(n-1)次方;
5. (a+b)的n次方展开式中的各项系数依次对应杨辉三角的第(n+1)行中的每一项;
6. 第n行的第m个数和第n-m个数相等,即C(n, m) = C(n, n-m),这是组合数性质.

实现代码:

```js
function pascalTriangle(lineNumber) {
    const currentLine = [1];
    const currentLineSize = lineNumber + 1;
    for (let numIndex = 1; numIndex < currentLineSize; numIndex += 1) {
        console.log(currentLine[numIndex - 1]);
        currentLine[numIndex] = currentLine[numIndex - 1] * (lineNumber - numIndex + 1) / numIndex;
    }
    return currentLine;
}
pascalTriangle(3); // [1, 3, 3, 1]
```

递归解法:

```js
function pascalTriangleRecursive(lineNumber) {
    if (lineNumber === 0) {
        return [1];
    }
    const currentLineSize = lineNumber + 1;
    const previousLineSize = currentLineSize - 1;
    const currentLine = [];
    const previousLine = pascalTriangleRecursive(lineNumber - 1);
    for (let numIndex = 0; numIndex < currentLineSize; numIndex += 1) {
        const leftCoefficient = (numIndex - 1) >= 0 ? previousLine[numIndex - 1] : 0;
        const rightCoefficient = numIndex < previousLineSize ? previousLine[numIndex] : 0;
        currentLine[numIndex] = leftCoefficient + rightCoefficient;
    }
    return currentLine;
}
pascalTriangleRecursive(3);
```

## No.10 整数拆分

> 在数论中,正整数n的分区(也称为整数分区)是将n写为正整数之和的一种方式,

```js
function integerPartition(number) {
    // 初始化一个二维数组,默认填充null
    const partitionMatrix = Array(number + 1).fill(null).map(() => {
        return Array(number + 1).fill(null);
    });

    // 设置二维数组横轴的值
    for (let numberIndex = 1; numberIndex <= number; numberIndex += 1) {
        partitionMatrix[0][numberIndex] = 0;
    }
    // 设置二维数组竖轴的值
    for (let summandIndex = 0; summandIndex <= number; summandIndex += 1) {
        partitionMatrix[summandIndex][0] = 1;
    }

    for (let summandIndex = 1; summandIndex <= number; summandIndex += 1) {
        for (let numberIndex = 1; numberIndex <= number; numberIndex += 1) {
            if (summandIndex > numberIndex) {
                partitionMatrix[summandIndex][numberIndex] = partitionMatrix[summandIndex - 1][numberIndex];
            } else {
                const combosWithoutSummand = partitionMatrix[summandIndex - 1][numberIndex];
                const combosWithSummand = partitionMatrix[summandIndex][numberIndex - summandIndex];
                partitionMatrix[summandIndex][numberIndex] = combosWithoutSummand + combosWithSummand;
            }
        }
    }
    return partitionMatrix[number][number];
}
integerPartition(2); // 2 0+2|1+1两种组合方式
```

## No.11 割圆术 - 基于N-gons的近似π计算

所谓“割圆术”,是用圆内接正多边形的面积去无限逼近圆面积并以此求取圆周率的方法.
“圆周率=圆周长/圆直径 = 圆周长/2*圆半径;

```js
const circleRadius = 1;
/**
 * @param {number} sideLength
 * @param {number} splitCounter
 * @param {number}
 */
function getNGonSideLength(sideLength, splitCounter) {
    if (splitCounter <= 0) {
        return sideLength;
    }
    const halfSide = sideLength / 2; // 方形一边长的一半
    const perpendicular = Math.sqrt((circleRadius ** 2) - (halfSide ** 2)); // **运算符表示求幂运算, 求另一直角边的长度
    const excessRadius = circleRadius - perpendicular; // 半径 - 直角边
    const splitSideLength = Math.sqrt((excessRadius ** 2) +(halfSide ** 2));
    return getNGonSideLength(splitSideLength, splitCounter - 1);
}
/**
 * @param {number} splitCount
 * @return {number}
 */
function getNGonSideCount(splitCount) {
    // 从六边形开始内接圆
    const hexagonSidesCount = 6;
    // 6, 12, 24, 48...
    return hexagonSidesCount * (splitCount ? 2 ** splitCount : 1);
}
/**
 * 计算圆周率值
 * @param {number} splitCount
 * @return {number}
 */
function liuhui(splitCount = 1) {
    const nGonSideLength = getNGonSideLength(circleRadius, splitCount - 1);
    const nGonSideCount = getNGonSideCount(splitCount - 1);
    const nGonPerimeter = nGonSideLength * nGonSideCount; // 内部多边形的周长
    const approximateCircleArea = (nGonPerimeter / 2) * circleRadius;
    return approximateCircleArea / (circleRadius ** 2); // 计算圆周率
}
liuhui(10);
```