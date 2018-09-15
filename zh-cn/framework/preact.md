# 第三节 Preact源码分析

> 这是一篇关于类react框架的文章,以Preact为案例,分析类react的实现.

## 一、前言

preact一定程度上比react整体要快一些,因为考虑的场景少,简单粗暴,相比来说react还是行业的引领者.使用起来,没有绝对的性能好坏,只是场景不同.同样也适用在类RN的应用.

这篇文章希望可以给大家提供一些视角,站在系统和架构的角度上,从源码入手,分析真实的Preact实现,也包含了Preact的核心diff算法.

## 二、正文

如果想深入了解类react开发体系,还需要把redux、react-redux、preact-compat...

## 三、Preact整体流程

1. DOM创建过程;
2. 更新过程、diff流程;
3. 组件,销毁过程.

### 3.1 组件创建过程

如下图:

![preact-create](/assets/preact-create.png)

主流程:JSX->hyperscript->Virtual DOM

* JSX介绍

从JSX开始描述,Preact提供了一个h函数进行了页面的JSX到VNode的编译.然后通过render进行了VNode到真实dom转换.

关于语法转换的工具,JSX最好的还是babel.按照规则会把es6转换成es5.同时还能保证转换的性能.

JSX存在的意义,是让我们更好的书写组件.

### 步骤一:jsx->hyperscript

以一个示例来展示JSX语法,原则上小写是DOM标签,大写是组件.

```js
const name = "zhangsan";
<div item="{name}">
    hello, {name}
</div>
```

### 步骤二:hyperscript->VNode

h函数将数据编译成对象,这是一个序列化的过程,便于后面render方法可以识别.

### 步骤三:VNode->DOM

VNode描述虚拟DOM,是一种树状的数据结构而已,用来承载真实DOM的属性.用更少的数据结构表示一个真实的DOM,一个浏览器的DOM可能有几百个属性,实际上我们真正用到的只有几个属性.

进一步介绍一下VNode的数据结构,有attributes属性className、children以及nodeName这个组件的构造函数.

```js
{
    attributes: {
        className: "xxx"
    },
    children: [
        {nodeName: "li"}
    ],
    nodeName: {
        arguments: {...}
    }
}
```

h函数只解析一个节点,不会渲染多个节点,但是react本身就是一个入口,包含了所有的DOM节点.因此,依旧会递归渲染所有节点.

preact有一些独特的配置,比如/** @jsx h*/叫编译注释,为了避免在每个文件都写重复代码,在.babelrc文件中进行如下设置即可,这样工程中的jsx都用preact的h函数进行处理.

```js
{
    "plugins": [
        ["transform-react-jsx": {"pragma": "h"}]
    ]
}
```

### h函数的流程

* 首先经过babel转换后,已经是一个function或者是字符串,是一个可执行的JS语法片段.参数名称是nodename和attributes.以及余下的入参都是子节点.并且,h函数兼容了nodename != function,以及为boole类型这种.将children的数组拆分出来一起压入stack中.

举个例子:

```js
h(App, {
    className: "xxx",
    "data-index": str
    },
    "yyy"
);

VNode {
    attributes: {
        className: "xxx",
        data-index: "sdf"
    },
    children: [
        "yyy"
    ]
}
```

### render方法

h函数之后,就是preact的render方法,内部调用了diff方法

```js
export function render(vnode, parent, merge) {
    return diff(merge, vnode, {}, false, parent, false);
}
```

preact的diff包含创建节点和比较节点的功能,因此把比较和创建放到一起.

### 3.2 组件更新过程

diff方法就是将VNode节点进行创建和对比,下图画了主要的分支结构:

![preact-diff](/assets/preact-diff.png)

diff更新伴随着创建,因为preact只维护一套VNode节点,直接与真实DOM进行比较,因此,采用边比较、边创建、边删除、边更新; 无需维护两个虚拟DOM的比较, 比较完最后在全量更新.

1. diff递归比较创建,通过diffLevel进行层级判断.通过idiff进行深度比较和判断, diff需要注意一点:无法返回多个同级节点

2. idiff是diff方法的核心实现:即伴随着创建,伴随着比较,场景有三种情况:文本、组件、DOM对象.

  * 字符串diff: 字符串或数字,文本节点处理 创建/更新,如果是一个text类型,就直接返回

  ```js
  if (typeof vnode === 'string' || typeof vnode === 'number') {
      ...
  }
  ```

  * 组件diff: 针对组件进行渲染,就进行组件的差异化比较, nodeName:该组件的函数,如果是一个新建的组件,直接返回

  ```js
    let vnodeName = vnode.nodeName;
    if (typeof vnodeName === 'function') {
        ...
    }
  ```

  * dom diff: 考虑条件相对比较多

  ```js
    // 看一下是否svg,需要做特殊处理
    isSvgMode = vnodeName==='svg' ? true : vnodeName==='foreignObject' ? false : isSvgMode;
    
    // 如果不是一个已经存在的元素,或者类型有问题,就重新创建一个
    // 1) 类似dom是null || undefined这种
    // 2) isNamedNode[dom, vnodeName]判断节点类型是否相同
    // 如果不同,就创建新的节点类型,然后,将旧DOM以及它的子节点更新到新的DOM上面.
    // dom比较第一个策略,不同类型的DOM,将子节点移入,然后,就直接替换更新了.
    vnodeName = String(vnodeName);
    if (!dom || !isNamedNode(dom, vnodeName)) {
        ...
    }

    // 获取将要输出的dom节点
    let fc = out.firstChid;

    // 1) 判断是否是preact创建的节点,如果不是就把属性赋值.
    // 2) 注意[undefined == null]是true
    if (props == null) {
        ...
    }

    // 优化,场景是对于只有一个子节点,并且该子节点是文本节点
    // 并没有缓存vnode任何数据,就可以直接更新
    if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string') {
        ...
    }
    // 否则,存在子节点,或者新的孩子节点,就执行diff
    else if (vchildren && vchildren.length || fc != null) {
        ...
    }
    // 将props和attributes从vnode中应用到DOM元素
    diffAttributes(out, vnode.attributes, props);

    isSvgMode = prevSvgMode;
  ```

  * diff dom第一个策略:组件不同,卸载原有组件,创建替换为新的.

  由于DOM树这个场景比较特殊,如果组件类型不同,大部分情况下,表达的内容就不太一样,这个假设成立的可能性非常大,代码的语义化时一个很重要大事情.

  ```js
    // 该组件已经被渲染的时候,dom存在,构造函数类型没有改变,是组件或者组件没有被渲染完成
    if (c && isOwner && (!mountAll || c.component)) {
        setComponentProps(c, props, ASYNC_RENDER, context, mountAll); // 设定组件属性,更新该节点类型即可.
    } else {
        // 组件类型不同
        // 删除掉原有的旧DOM节点,对应的组件
        if (originalComponent && !isDirectOwner) {
            unmountComponent(originalComponent);
            dom = oldDom = null;
        }

        // 创建新vnode节点对应的新DOM组件
        c = createComponent(vnode.nodeName, props, context);

        if (dom && !c.nextBase) {
            c.nextBase = dom;
            oldDom = null;
        }

        // 更新属性
        setComponentProps(c, props, SYNC_RENDER, context, mountAll);
        dom = c.base;

        if (oldDom && dom !== oldDom) {
            oldDom._component = null;
            recollectModeTree(oldDom, false);
        }
    }
  ```

在DOM节点的场景下,有一个需要特殊注意的点,跟组件场景一样,如果存在节点不一样的时候, 创建更新即可,也就是类react框架的第一层策略.但是,这里注意,旧节点的子节点,全部移到新节点下面,而不是简单的删除.

在进行节点比较的时候,preact的idff只管当前层级节点的比较,子节点的比较他并不关心.交给innerDiffNode处理,而再innerDiffNode方法中,会看到第二个策略.

3. 比较子节点:innerDiffNode流程:

  * 将DOM的孩子节点分为2类:

  一类:带key放到keyed对象中, 另一类:不带key,放入children数组中;

  * 遍历当前:待更新的VNode的节点数组;

  * 进行比较更新,这是核心部分

  ```js
  // 使用VNode顺序遍历
  for (let i = 0; i < vlen; i++) {
      ...
  }
  // 有key匹配处理: 组件中key要避免使用索引来做处理,这样会导致被覆盖
  let key = vchild.key; // vnode节点是否有key
  if (key != null) {
      // 如果key存在...
  }
  // 无key就近原则
  // 从低到高,第一个匹配到规则,就退出, min初始值为0, childrenLen表示子节点数组长度
  for (j = min; j < childrenLen; j++) {
      ...
  }
  // 子节点继续递归处理
  // 将找到的节点,进行diff比较,其实就是递归比较当前子节点的子节点,如果找不到这个子节点就创建新的,然后更新到child上
  // vchild是当前child对应的VNode节点
  child = idiff(child, vchild, context, mountAll);

  // 更新到真实的DOM上的条件:子节点存在,并且不是父节点,并且不是对应顺序的旧DOM节点.
  if (child && child !== dom && child !== f) {
  }
  ```

### preact子节点比较策略流程图:

![preact-child-diff](/assets/preact-child-diff.png)

  * 如果VNode节点有key,就查key,如果key没查到,直接进入idiff创建;
  * 如果VNode节点没有key,进入循环,找第一个类型相同的节点,招到立即返回;
  * 进入idiff进行节点创建或者属性更新,真实DOM f = originalChildren[i]就被更新过;
  * 替换旧的DOM节点:如果更新后的child不是dom节点,并且不等于对应位置的原始DOM节点
    * f为空,一个节点没有,直接append到末尾,也就是第一个;
    * 更新后的节点和f节点的下一个节点相同,删除当前节点removeNode(f);
    * 插入到f节点前面.保证当前顺序是正确的.
  * 剩下的旧DOM节点:回收掉,两部分,一部分是有key,一部分无key.

  这里描述一下i是什么,i是遍历VNode的key,注意,VNode的就是即将要更新到DOM上面的新节点.所以通过i保证节点顺序的准确性.
  