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

## No.4 字符串快速查找 - 子串搜索

Rabin-Karp算法,是由M.O.Rabin和R.A.Karp发明的一种基于散列的字符串查找算法.通常情况下,基于散列的字符串查找步骤是:

1. 首先计算模式字符串的散列函数;
2. 然后利用相同的散列函数计算文本中所有可能的M个字符的子字符串的散列函数值并寻找匹配;

不过这种方法比暴力查找还慢,因为计算散列值会涉及字符串中的每个字符.Rabin和Karp对上述方法进行了改进,发明了一种能够在常数时间内算出M个字符的子字符串散列值的方法.

* 基本思想:以文本"3141592653589793",模式串"26535"为例.

比较思路如下:

寻找一个大素数(作为散列表的大小),通过"除留余数法"计算模式串的散列值.然后依次计算文本中的相同长度子串的散列值,进行比较.

```js
// charAt(j)

索引j 0  1  2  3  4
----------------------
     2  6  5  3  5  % 997 = 613
```

```js
// txt.charAt(i)
i    0  1  2  3  4  5  6  7  8  9  10  11  12  13  14  15
----------------------------------------------------------
     3  1  4  1  5  9  2  6  5  3   5   8   9   7   9   3  
0    3  1  4  1  5  % 997 = 508
1       1  4  1  5  9  % 997 = 201
2          4  1  5  9  2  % 997 = 715
3             1  5  9  2  6  % 997 = 971
4                5  9  2  6  5  % 997 = 442
5                   9  2  6  5  3  % 997 = 929
6 <- return i = 6      2  6  5  3   5  % 997 = 613(匹配) 
```

递推文本串的散列值:

以Ti表示文本字符T[i],Xi表示文本字符串T[i...M-1~i]的整数值,其中M为模式串长度,则:

可以在初识时求得字符串T[i...M-1~i]的hash值,即X[i] % P = hash(txt, 0, M - 1),其中P为大素数;
然后通过上述公式递推就可以得到字符串T[i+1...M-1]的hash值,即X[i+1] % P.

性能分析:RK算法,由于通过计算模式串和文本子串的散列值来做相等性比较,所以有一定概率出现冲突,即散列值相同但是字符串不匹配.
出现冲突的概率与大素数的选择有关,概率约为1/Q(Q为大素数的值),实际应用中,该算法是可靠的,只有极小的概率会出现冲突.时间复杂度是O(N).

```js
const DEFAULT_BASE = 37;
const DEFAULT_MODULUS = 101;
class PolynomialHash {
    /**
     * @param {number} [base]
     * @param {number} [modulus]
     */
    constructor({base = DEFAULT_BASE, modulus = DEFAULT_MODULUS} = {}) {
        this.base = base;
        this.modulus = modulus;
    }
    /**
     * @param {string} word
     * @return {number}
     */
    hash(word) {
        const charCodes = Array.from(word).map(char => this.charToNumber(char));
        let hash = 0;

        for (let charIndex = 0; charIndex < charCodes.length; charIndex += 1) {
            hash *= this.base;
            hash += charCodes[charIndex];
            hash %= this.modulus;
        }
        return hash;
    }

    /**
     * @param {number} prevHash
     * @param {string} prevWord
     * @param {string} newWord
     * @return {number}
     */
    roll(prevHash, prevWord, newWord) {
        let hash = prevHash;
        const prevValue = this.charToNumber(prevWord[0]);
        const newValue = this.charToNumber(newWord[newWord.length - 1]);

        let prevValueMultiplier = 1;
        for (let i = 1; i < prevWord.length; i += 1) {
            prevValueMultiplier *= this.base;
            prevValueMultiplier %= this.modulus;
        }

        hash += this.modulus;
        hash -= (prevValue * prevValueMultiplier) % this.modulus;

        hash *= this.base;
        hash += newValue;
        hash %= this.modulus;
        return hash;
    }

    /**
     * @param {string} char
     * @return {number}
     */
    charToNumber(char) {
        let charCode = char.codePointAt(0);
        const surrogate = char.codePointAt(1);
        if (surrogate !== undefined) {
            const surrogateShift = 2 ** 16;
            charCode += surrogate * surrogateShift;
        }
        return charCode;
    }
}

function rabinKarp(text, word) {
    const hasher = new PolynomialHash();
    const wordHash = hasher.hash(word);

    let prevFrame = null;
    let currentFrameHash = null;

    for (let charIndex = 0; charIndex <= (text.length - word.length); charIndex += 1) {
        const currentFrame = text.substring(charIndex, charIndex + word.length);
        if (currentFrameHash === null) {
            currentFrameHash = hasher.hash(currentFrame);
        } else {
            currentFrameHash = hasher.roll(currentFrameHash, prevFrame, currentFrame);
        }
        prevFrame = currentFrame;

        if (wordHash === currentFrameHash && text.substr(charIndex, word.length) === word) {
            return charIndex;
        }
    }
    return -1;
}
rabinKarp("3141592653589793", "26535"); // 6
```

## No.5 最长公共子串

> 最长公共子串问题是寻找两个或多个已知字符串最长的子串.此问题与最长公共子序列问题的区别在于子序列不必是连续的,而子串却必须是.

求两个字符串的最长公共子串,如"abcdefg"和adefgwgeweg"的最长公共子串"defg"(子串必须是连续的)

解法: 对于较短的那个字符串,假设其长度为n,依次找到它的长度为n, n-1, n-2, ...1的若干的子串,若另外那个较长的字符串包含了较短字符串的某个子串,则找到了二者的最长公共子串.

```js
function maxSubstring(strOne, strTwo) {
    if (strOne.length == 0 || strTwo.length == 0) {
        return;
    }

    // 二者中较长的字符串
    let maxString = "";
    // 二者中较短的字符串
    let minString = "";

    if (strOne.length < strTwo.length) {
        maxString = strTwo;
        minString = strOne;
    } else {
        minString = strTwo;
        maxString = strOne;
    }

    // 遍历较短的字符串,并依次减少短字符串的字符数量,判断长字符串是否包含该子串
    for (let i = 0; i < minString.length; i++) {
        let end = minString.length - i; // 动态获取尾部边界
        for (let begin = 0; end <= minString.length; begin++) {
            end++;
            let current = minString.substring(begin, end);
            // 子串是否在大的字符串里面
            if (maxString.indexOf(current) != -1) {
                return current;
            }
        }
    }
    return "";
}
maxSubstring("abcdefg", "adefgwgeweg"); // "defg"
```




