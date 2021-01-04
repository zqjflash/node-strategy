# 第五节 react hooks

## useEffect不同写法的执行差别

* 不写第二个参数：会在函数组件初次渲染和每次重渲染的时候调用，包括props改变和state改变导致的更新；效果等同于componentDidMount + componentDidUpdate + componentWillUnmount

* 第二个参数为空数组
只在入栈的时候运行一次，效果相当于componentDidMount

* 使用返回值，返回值是一个函数，将会在组件销毁时候调用，相当于componentWillUnmount

```js
useEffect(() => {
  let id = setInterval(() => {...}, 1000);
  return () => clearInterval(id);
}, []);
```

* 在第二个参数中写入数据属性
除了初次入栈被执行以外，将只在数据属性改变的时候才运行useEffect内的函数。

* 不写第二个参数进行调用时和函数直接调用的区别
执行次数是一样的，区别在于useEffect是异步的，而函数内调用是同步的。

* 函数组件内多个useEffect的执行次序
组件加载时会依次执行各个useEffect，然后根据先后次序建立链表，而在effect执行时遍历链表，依次判断条件并执行effect函数。

