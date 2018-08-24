# 第一节 React框架

## No.1 React Keys的作用

* key可以帮助React标志哪个列表项发生变化,添加或删除,应该给列表项元素内一个稳定的标识;大多数使用数据的ID作为key:

```js
const todoItems = todos.map((todo) => {
    <li key = {todo.id}>
        {todo.text}
    </li>
});
```

我们不推荐使用索引来作为key,因为当列表项顺序发生改变,渲染将会较慢

* 在渲染diff-dom时,将会极大的降低时间复杂度.

```js
// tree1
<ul>
    <li key="1">1</li>
    <li key="2">2</li>
</ul>

// tree2
<ul>
    <li key="1">1</li>
    <li key="3">3</li>
    <li key="2">2</li>
</ul>
```

react通过key来发现tree2的第二个元素不是原先tree1的第二个元素,原先的第二个元素被挪到下面去了,因此在操作的时候就会直接指向insert操作,来减少dom操作的性能开销.

## No.2 React refs有什么作用?

可以给某个JSX元素加上ref属性,通过ref属性能够让我们获取已经挂载的元素DOM节点,记住一个原则:能不用ref就不用,特别是要避免用ref来做React本来就可以帮助你做到的页面自动更新的操作和事件监听.

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

Redux的设计思想:

* 将Web应用看成是一个状态机,视图与状态是一一对应;
* 所有的状态保存在一个对象里面.

* Store是什么?

保存数据的地方,可以看成是一个容器,整个应用只能有一个Store,Redux提供createStore这个函数来生成Store.

示例代码:

```js
import {createStore} from 'redux';
const store = createStore(fn);
function fn(state, stateChanger) {
    const getState = () => state;
    const dispatch = (action) => stateChanger(state, action);
    return {getState, dispatch};
}
```

* State是什么?

Store对象包含所有数据.如果想得到某个时刻的数据,就要对Store生成快照.这种时刻的数据集合就叫做State.
当前时刻的State,可以通过store.getState()拿到.

```js
import {createStore} from 'redux';
const store = createStore(fn);
const state = store.getState();
```

Redux规定,一个State对应一个View.只要State相同,View就相同.

* Action

Action由View发出的通知,表示State应该要发生变化了;Action是一个对象.其中的type属性是必须的,表示Action的名称.

```js
const action = {
    type: 'ADD_TODO',
    payload: 'Learn Redux'
}
```

Action表示当前发生的事情,改变State的唯一办法,就是使用Action.它会运送数据到Store;

* Reducer

Store收到Action以后,必须给出一个新的State,这样View才会发生变化.这种State的计算过程就叫做Reducer.
Reducer是一个函数,它接受Action和当前State作为参数,返回一个新的State.

```js
const reducer = function (state, action) {
    // ...
    return new_state;
}
```

* combineReducers()

combineReducers做的就是产生一个整体的Reducer函数,该函数根据State的key去执行相应的子Reducer,并将返回结果合并成一个大的State对象.

下面是一个combineReducers的简单实现:

```js
const combineReducers = reducers => {
    return (state = {}, action) => {
        return Object.keys(reducers).reduce(
            (nextState, key) => {
                nextState[key] = reducers[key](state[key], action);
                return nextState;
            },
            {}
        );
    };
}
```

## No.4 Flux是什么?

Flux将应用分成四个部分:

* View: 视图层;
* Action(动作): 视图层发出的消息(比如mouseClick);
* Dispatcher(派发器): 用来接收Actions、执行回调函数;
* Store(数据层): 用来存放应用的状态,一旦发生变动,就提醒Views要更新页面.

Flux的最大特点是数据的“单向流动”.看一张图示:

![flux](/assets/flux.png)

1. 用户访问View;
2. View发出用户的Action;
3. Dispatcher收到Action,要求Store进行相应的更新;
4. Store更新后,发出一个"change"事件;
5. View收到"change"事件后,更新页面;


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

## No.7 如何给route组件赋值key?

通常情况下我们是没法传props给route组件的,解决方案是createElement方法.

```js
class App extends Component {
    static createElement = (Component, ownProps) => {
        // ...
        return <Component key={userId} {...ownProps} />
    };
    render() {
        return (
            <Provider store={store}>
                <Router createElement={App.createElement} ...>
                </Router>
            </Provider>
        )
    };
}
```

## No.8 如何看待React与Preact的差异?

1. 虚拟DOM树结构不一样,在preact中,children在props中永远是数组,但react中可能是字符串、数字、null、undefined、数组、单个虚拟DOM;
2. ref机制也有差异,preact有些时候this.refs.xxx为undefined;
3. Children.map实现也不同,preact是对原来的虚拟DOM进行复制,并修改或添加上一个新的key值;
4. 事件系统也有差异,react的事件系统是基于冒泡的,preact是简单绑定元素节点上;
5. diff算法差异:preact没有考虑到children出现相同key的情况.

## No.9 React生命周期是什么样的?

1. 可选的static方法;
2. constructor构造函数;
3. getChildContext获取子元素内容;
4. componentWillMount模块渲染前;
5. componentDidMount模块渲染后;
6. componentWillReceiveProps组件从父组件接收新的props之前;
7. shouldComponentUpdate判断模块需不需要重新渲染;
8. componentWillUpdate组件开始重新渲染之前调用;
9. componentDidUpdate模块渲染结束;
10. componentWillunmount模块将从DOM中清除,做一些清理任务;
11. 点击回调或者事件处理器如onClickSubmit()或onChangeDescription();
12. render里的getter方法;
13. 可选的render方法
14. render()方法

## No.9 组件的state和setState的作用是什么?

React.js的state就是用来存储组件可变化的显示形态;
setState方法由父类Component所提供,当我们调用这个函数的时候,React.js会更新组件的状态state,并且重新调用render方法.
setState不会马上修改state,而是采用合并消息以后再统一重新渲染组件.

## No.10 组件的props作用是什么?

props作用是让React.js组件具有一定的"可配置"性,每个组件都可以接受一个props参数,它是一个对象,包含了所有你对这个组件的配置.

React.js组件使用defaultProps默认配置来实现,示例代码:

```js
class LikeButton extends Component {
    static defaultProps = {
        xxx: xxx
    };
    // ...
}
```

## No.11 state与props有什么区别?

* state的主要作用是用于组件保存、控制、修改自身的可变状态;
* props的主要作用是让使用该组件的父组件可以传入参数来配置该组件;

记住一个简单的规则:尽量少地用state,尽量多地用props.

## No.12 更新阶段的组件生命周期是什么样的?

更新阶段组件的生命周期如下:

1. shouldComponentUpdate(nextProps, nextState): 通过这个方法控制组件是否重新渲染;
2. componentWillReceiveProps(nextProps): 组件从父组件接收到新的props之前调用;
3. componentWillUpdate(): 组件开始重新渲染之前调用;
4. componentDidUpdate(): 组件重新渲染并且把更改变更到真实的DOM以后调用.

## No.13 PropTypes和组件参数的验证是怎样的?

1. 首先,安装一个React提供的第三方库prop-types;

2. 其次,配置参数规则

```js
static propTypes = {
    comment: PropTypes.object.isRequired
};
```

3. 再次,设置参数默认值

```js
static defaultProps = {
    comment: {}
};
```

## No.14 React与Vue的区别?

1. 监听数据变化的实现原理不同

React默认通过比较引用的方式,vue通过getter/setter以及一些函数劫持;

2. 数据流的不同

React数据流: Parent-(Props)->child-(state)->DOM
Vue2.x数据流: Parent-(Props)->child-(v-modle)->DOM

3. 组件通信的区别

直接看图:

![react-vs-vue](/assets/react-vs-vue.png)

4. 模版渲染方式不同

表层:模版语法不同,React是通过JSX渲染模版,Vue是通过扩展HTML预发进行渲染;
深层:模版原理不同,React通过原生JS实现,Vue通过指令来实现;

5. Vuex和Redux的区别

在Redux中,我们每个组件都需要显示的用connect把需要的props和dispatch连接起来,Redux只能进行dispatch,并不能直接调用reducer进行修改.
Vuex既可以dispatch action也可以commit updates

## No.15 dangerouslySetHTML和style属性的作用是什么?

出于安全考虑的原因(XSS攻击),在React.js当中所有的表达式插入的内容都会被自动转移.如果在页面中要把一个富文本的标签结构渲染在页面,就需要使用dangerouslySetHTML属性,示例代码如下:

```js
render () {
    return (
        <div className="editor-wrapper" dangerouslySetInnerHTML={{__html: this.state.content}} />
    );
}
```

style接受一个对象,这个对象里面是这个元素的CSS属性键值对,原来的CSS属性中带-的元素都必须去掉,改用驼峰命名.
示例代码如下:

```js
<div style={{fontSize: '12px', color: '#ff0000'}}>hello world</div>
```

实际运用中,我们可以用props或者state中的数据生成样式对象再传给元素,然后用setState就可以修改样式,非常灵活.

## No.16 props.children和容器类组件是什么关系?

使用自定义组件的时候,可以在其中嵌套JSX结构,嵌套的结构在组件内部都可以通过props.children获取到,这种组件的编写方式在编写容器类型的组件当中非常有用.

容器类组件示例代码:

```js
class Layout extends Component {
    render() {
        return (
            <div className="two-cols-layout">
                <div className="sidebar">
                    {this.props.children[0]}
                </div>
                <div className="main">
                    {this.props.children[1]}
                </div>
            </div>
        );
    }
}
```

嵌套Layout组件示例代码:

```js
ReactDOM.render(
    <Layout>
        <div>sidebar</div>
        <div>main content</div>
    </Layout>,
    document.getElementById("root")
);
```

## No.17 什么是高阶组件?

高阶组件就是一个函数,传给它一个组件,它返回一个新的组件.
作用就是为了组件之间的代码复用,组件可能有着某些相同的逻辑,把这些逻辑抽离出来,放到高阶组件中进行复用.高阶组件内部的包装组件和被包装组件之间通过props传递数据.

```js
const NewComponent = higherOrderComponent(OldComponent);
```

简单的高阶组件示例:

```js
import React, {Component} from 'react';
export default (WrappedComponent) => {
    class NewComponent extends Component {
        // 可以做很多自定义逻辑
        render () {
            return <WrappedComponent />
        }
    }
    return NewComponent;
}
```

高阶组件的设计模式就是装饰者模式,通过组合的方式达到很高的灵活程度.


# 参考

## [React.js小书](http://huziketang.mangojuice.top/books/react/)