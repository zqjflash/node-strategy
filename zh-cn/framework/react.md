# 第一节 React框架

## No.1 React Keys的作用

key可以帮助React标志哪个列表项发生变化,添加或删除,应该给列表项元素内一个稳定的标识;
最好的方法是使用字符串唯一标识其兄弟列表项,大多方法是将数据的ID作为Key:

```js
const todoItems = todos.map((todo) => {
    <li key = {todo.id}>
        {todo.text}
    </li>
});
```
我们不推荐使用索引来作为key,因为当列表项顺序发生改变,渲染将会较慢

## No.2 React refs有什么作用?

ref属性能够让我们获取已经挂载的元素DOM节点,可以给某个JSX元素加上ref属性,记住一个原则:能不用ref就不用,特别是要避免用ref来做React本来就可以帮助你做到的页面自动更新的操作和事件监听


# 参考

## [React.js小书](http://huziketang.mangojuice.top/books/react/)