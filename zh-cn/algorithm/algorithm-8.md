# 第八节 动态规划

### 记忆化搜索

一颗二叉树，只留2个

```
2       5  6       7
 \(20) /(18)\(25) /(5)
  \   /      \   /
    3          4
     \        /
      \(1)   /(10)
       \    /
          1     
```
#### 拆分子问题
* 2-3-5左子树：边:值对 {2: 38, 1: 20, 0: 0}
* 6-4-7右子树：边：值对 {2: 30, 1: 25, 0: 0}
* 3-1-4子树：边：值对 {1: 10, 2: 35, 3:40}
核心：每个节点记录下所有可能搜索状态的最优值，父节点过来查找直接给出

#### 实现代码如下：

```js
#include<cstdio>
#include<iostream>
#include<cstring>
using namespace std;
int n, q;
struct node {
    int end;
    int appleCount;
}
vector<node> f[200];
int ans;
int dfs (int currentPos, int usedEdges, int prev) {
    vector<node> currentEdges = f[currentPos];
    // remaining = q - usedEdges
    for (int i = 0; i < q - usedEdges; ++i) {
        vector<node> two;
        for (int k = 0; k < currentEdges.size(); ++k) {
            if (currentEdges[k] != prev) {
                two.push_back(currentEdges[k]);
            }
        }
    }
}
int main() {
    cin >> n >> q;
    for (int i = 1; i < n; ++i) {
      int a, b, c;
      cin >> a >> b >> c;
      // a - b a连着b
      // c 显示c
      node tmp;
      tmp.end = a;
      tmp.appleCount = c;
      f[b].push_back(tmp);
      tmp.end = b;
      tmp.appleCount = c;
      f[a].push_back(tmp);
    }
    dfs(1, 0, 0);
    cout << ans << endl;
    return 0;
}
```

图在计算机中可以用邻接矩阵或者临接表来表示

