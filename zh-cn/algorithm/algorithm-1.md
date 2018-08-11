# 第一节 前端工作中遇到的数据结构和算法

## No.1 递归

> 递归:就是自己调用自己,经典的应用场景就是DOM树查找

```js
function getElementById(node, id) {
    if (!node) {
        return null;
    }
    console.log(node.id);
    if (node.id === id) {
        return node;
    }
    for (var i = 0; i < node.childNodes.length; i++) {
        var found = getElementById(node.childNodes[i], id);
        if (found) {
            return found;
        }
    }
    return null;
}
```

## No.2 非递归:深度优先算法

> 深度优先算法最常用的是在DOM树查找中的实现

设计思路:修改nextElement的查找方式,如果有子节点,则下一个元素就是它的第一个子节点,否则,判断是否有相邻节点,如果有返回他的相邻元素.如果即没有子节点也没有相邻节点,就返回父节点的下一个相邻节点,然后重新进入循环队列.

```js
<div id="id-data-structure">
我是body
</div>

function getElementById(node, id) {
    whild(node) {
        if (node.id === id) {
            return node;
        }
        node = nextNode(node);
    }
}

function nextNode(node) {
    if (node.children.length) {
        return node.children(0);
    }

    if (node.nextElementSibling) {
        return node.nextElementSibling;
    }

    while (node.parentNode) {
        if (node.parentNode.nextElementSibling) {
            return node.parentNode.nextElementSibling;
        }
    }
    return null;
}

getElementById(document, "id-data-structure");
```

## No.3 哈希结构及相关算法

哈表表就是一种以键值对(key-indexed)存储数据的结构,我们只要输入待查找的值key,即可查找到其对应的值.

由于JavaScript Object数据类型是基于Hashtable实现 ,所以,当使用对象键值查找值时,浏览器引擎已经在底层通过哈希函数将每个键转化为数据的索引,并使用内建对哈希碰撞处理函数处理了碰撞冲突.

Object对象每一个key拥有一个独立无二的index,在javascript底层,我们其实是通过这个index获得想要的src的.
哈希查找算法需要一定的时间和空间,在计算机内存足够大时,哈希查找的时间复杂度趋近于O(1),是一种极有效率的查找算法!

ES6中的Map数据结构就是一种哈希表结构
