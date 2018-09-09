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

