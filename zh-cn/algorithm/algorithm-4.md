# 第四节 字符串

## No.1 莱温斯坦距离 - 两个序列之间的最小编辑距离

> 编辑距离的作用主要是用来比较两个字符串的相似度

编辑距离是指两个字符串之间,由一个转成另一个所需的最少编辑操作次数,如果它们的距离越大,说明它们越是不同.
许可的编辑操作包括将一个字符替换成另一个字符,插入一个字符,删除一个字符.

引入一个算法相似度公式:

```js
let str1 = "ivan1";
let str2 = "ivan2";
// 经过计算,1替换为2,转换了一个字符,所以距离是1,相似度=1 - 1/Math.Max(str1.length,str2.length)=0.8
```

算法过程:

1. str1或str2的长度为0返回另一个字符串的长度;
2. 初始化(n+1)*(m+1)的矩阵d,并让第一行和列的值从0开始增长.扫描两个字符串(n*m级),如果str1[i]=str2[i]用temp记录它,为0,否则temp记为1.然后在矩阵d[i,j]赋予 d[i-1,j]+1, d[i,j-1]+1, d[i-1,j-1]+temp三者中的最小值;
3. 扫描完后,返回矩阵的最后一个值d[n][m]即是它们的距离.

```js
function levenshteinDistance(a, b) {
    // 创建二维矩阵
    const distanceMatrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
    // 二维数组横轴
    for (let i = 0; i <= a.length; i+= 1) {
        distanceMatrix[0][i] = i;
    }
    // 二维数组竖轴
    for (let j = 0; j <= b.length; j+= 1) {
        distanceMatrix[j][0] = j;
    }

    for (let j = 1; j <= b.length; j += 1) {
        for (let i = 1; i <= a.length; i += 1) {
            const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
            distanceMatrix[j][i] = Math.min(
                distanceMatrix[j][i - 1] + 1, // 删除
                distanceMatrix[j - 1][i] + 1, // 插入
                distanceMatrix[j - 1][i - 1] + indicator, // 替换
            );
        }
    }

    return distanceMatrix[b.length][a.length];
}

levenshteinDistance("zqjflash", "myflash");
```


