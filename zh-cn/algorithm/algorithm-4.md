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

## No.2 汉明距离 - 符号不同的位置数

表示两个(相同长度)字对应位不同的数量,我们以d(x,y)表示两个字x,y之间的汉明距离.对两个字符串进行异或运算,并统计结果为1的个数,那么这个数就是汉明距离.

示例:

* 1011101与1001001 之间的汉明距离是2;
* 2143896与2233796之间的汉明距离是3;
* "toned"与"roses"之间的汉明距离是3.

```js
/**
 * @param {string} a
 * @param {string} b
 * @return {number}
 */
function hammingDistance(a, b) {
    if (a.length !== b.length) {
        throw new Error('两个比较字符串a、b的长度要相同');
    }
    let distance = 0;
    for (let i = 0; i < a.length; i += 1) {
        if (a[i] !== b[i]) {
            distance += 1;
        }
    }
    return distance;
}
```

## No.3 克努斯-莫里斯-普拉特算法 - 子串搜索

用案例来讲解KMP算法

1. 首先,字符串"BBC ABCDAB ABCDABCDABDE"的第一个字符与搜索词"ABCDABD"的第一个字符,进行比较.因为B与A不匹配,所以搜索词后移一位.

```js
BBC ABCDAB ABCDABCDABDE
|
ABCDABD
```

2. 因为B与A不匹配,搜索词再往后移

```js
BBC ABCDAB ABCDABCDABDE
 |
 ABCDABD
```

3. 就这样,直到字符串有一个字符,与搜索词的第一个字符相同为止.

```js
BBC ABCDAB ABCDABCDABDE
    |
    ABCDABD
```

4. 接着比较字符串和搜索词的下一个字符,还是相同

```js
BBC ABCDAB ABCDABCDABDE
    ||
    ABCDABD
```

5. 直到字符串有一个字符,与搜索词对应的字符不相同为止.

```js
BBC ABCDAB ABCDABCDABDE
          |
    ABCDABD
```

6. 这时,最自然的反应是,将搜索词整个后移一位,再从头逐个比较.这样做虽然可行,但是效率很差,因为你要把"搜索位置"移到已经比较过的位置,重比一遍.

```js
BBC ABCDAB ABCDABCDABDE
     |
     ABCDABD
```

7. 一个基本事实是,当空格与D不匹配时,你其实知道前面六个字符是"ABCDAB".KMP算法的想法是,设法利用这个已知信息,不要把"搜索位置"移回已经比较过的为止,继续把它向后移,这样就提高了效率.

8. 针对搜索词,算出一张《部分匹配表》.

```js
搜索词     A B C D A B D
部分匹配值  0 0 0 0 1 2 0
```

“部分匹配值”就是“前缀”和“后缀”的最长的共有元素的长度.以"ABCDABD"为例:

```js
"A"的前缀和后缀都为空集,共有元素的长度为0;
"AB"的前缀为[A],后缀为[B],共有元素的长度为0;
"ABC"的前缀为[A, AB], 后缀为[BC, C],共有元素的长度0;
"ABCD"的前缀为[A, AB, ABC],后缀为[BCD, CD, D],共有元素的长度为0;
"ABCDA"的前缀为[A, AB, ABC, ABCD], 后缀为[BCDA, CDA, DA, A],共有元素为"A",长度为1;
"ABCDAB"的前缀为[A, AB, ABC, ABCD, ABCDA], 后缀为[BCDAB, CDAB, DAB, AB, B],共有元素为"AB",长度为2;
"ABCDABD"的前缀为[A, AB, ABC, ABCD, ABCDA, ABCDAB],后缀为[BCDABD, CDABD, DABD, ABD, BD, D],共有元素的长度为0
```

代码实现:

```js
/**
 * 创建匹配表
 * @param {string} word
 * @return {number[]}
 */
function buildPatternTable(word) {
    const patternTable = [0];
    let prefixIndex = 0;
    let suffixIndex = 1;
    while (suffixIndex < word.length) {
        if (word[prefixIndex] === word[suffixIndex]) {
            patternTable[suffixIndex] = prefixIndex + 1;
            suffixIndex += 1;
            prefixIndex += 1;
        } else if (prefixIndex === 0) {
            patternTable[suffixIndex] = 0;
            suffixIndex += 1;
        } else {
            prefixIndex = patternTable[prefixIndex - 1];
        }
    }
    return patternTable;
}

/**
 * @param {string} text
 * @param {string} word
 * @return {number}
 */
function knuthMorrisPratt(text, word) {
    if (word.length === 0) {
        return 0;
    }
    let textIndex = 0;
    let wordIndex = 0;
    const patternTable = buildPatternTable(word);

    while (textIndex < text.length) {
        if (text[textIndex] === word[wordIndex]) {
            if (wordIndex === word.length - 1) {
                return (textIndex - word.length) + 1;
            }
            wordIndex += 1;
            textIndex += 1;
        } else if (wordIndex > 0) {
            wordIndex = patternTable[wordIndex - 1];
        } else {
            wordIndex = 0;
            textIndex += 1;
        }
    }
    return -1;
}
knuthMorrisPratt("BBC ABCDAB ABCDABCDABDE", "ABCDABD");
```
