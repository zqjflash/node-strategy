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

ref属性能够让我们获取已经挂载的元素DOM节点,可以给某个JSX元素加上ref属性,记住一个原则:能不用ref就不用,特别是要避免用ref来做React本来就可以帮助你做到的页面自动更新的操作和事件监听.

下面是几个适合使用refs的情况:

1. 处理焦点、文本选择或媒体控制,示例代码:

```js
class AutoFocusInput extends Component {
    // 模版渲染后
    componentDidMount() {
        this.input.focus();
    }
    render() {
        return (
            <input ref={(input) => this.input = input} />
        )
    }
}
ReactDOM.render(
    <AutoFocusInput />,
    document.getElementById("root")
);
```

2. 触发强制动画;

3. 集成第三方DOM库;

```js
class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.creatRef();
    }
}
```

访问Refs:当一个ref属性被传递给一个render函数中的元素时,可以使用ref中的current属性对节点的引用进行访问.

```js
const node = this.myRef.current;
```

## No.3 Redux的三个部分Action、Reducer、及Store分别的作用是什么?

* Action

在Redux中,action主要用来传递操作State信息,以JS Object的形式存在,一般是创建函数来生产action.

```js
function addFile(name) {
    return {type: 'ADD_FILE', name: name};
}
```

* Reducer

初始化state和switch case
实际上可以将一个个大的reducer拆分成一个个小的reducer.

* combineReducers()

调用一系列reducer,并根据对应的key来筛选出state中的一部分数据给相应的reducer.这样也意味着每一个小的reducer将只能处理state的一部分数据.

* Store是什么?

用来专门生产这种state和dispatch的集合,这样别的App也可以用这种模式

示例代码:

```js
function createStore(state, stateChanger) {
    const getState = () => state;
    const dispatch = (action) => stateChanger(state, action);
    return {getState, dispatch};
}
```

## No.4 Component与PureComponent的差异?

1. state状态变化时会触发Component组件重新渲染;
2. PureComponent组件相当于在shouldComponentUpdate加了以下逻辑;

```js
// 判断模块需不需要重新渲染
shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
}
```

注:如果某个组件的props或者是state频繁变动的话,那么根本不用换成PureComponent,用了反倒需要多次进行shallowEqual比较.

## No.5 React的render机制是什么?

* 入口调用ReactDOM.render();
* 获取当前的virtual DOM;
* 利用当前的virtual DOM与上次的virtual DOM做比较;
* 把改变的地方应用到真的DOM

注: 尽量不要触发render function;尽量保持virtual DOM的一致.

## No.6 shallowEqual与Immutable data structures

* 首先:shallowEqual与Immutable数据相关;
* 其次:必须使用扩展运算符来创建对象,示例代码如下:

```js
const props = {
    id: 1,
    list: [1, 2, 3]
};
const nextProps = {
    ...props,
    list: [...props.list, 4]
};
props.list === nextProps.list; // false
```


# 参考

## [React.js小书](http://huziketang.mangojuice.top/books/react/)