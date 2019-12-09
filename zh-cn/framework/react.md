# 第一节 React框架

## No.1 什么是React组件挂载?

将组件渲染,并且构造DOM元素然后塞入页面的过程称为组件的挂载.

抽象结构如下:

```js
constructor()
render()
// 然后构造DOM元素插入页面
```

以一段代码示例来说分析挂载过程:

* 原始代码:

```js
ReactDOM.render(
    <Header />
    document.getElementById('root')
)
```

* 编译过程代码:

```js
ReactDOM.render(
    React.createElement(Header, null),
    document.getElementById('root')
)
```

* render过程

```js
// React.createElement实例化一个Header
const header = new Header(props, children);
// React.createElement中调用header.render方法渲染组件的内容
const headerJsxObject = header.render();

// ReactDOM用渲染后的JavaScript对象来构建真正的DOM元素
const headerDOM = createDOMFromObject(headerJsxObject);
// ReactDOM把DOM元素添加到页面上
document.getElementById('root').appendChild(headerDOM);
```

## No.2 React如何实现事件监听?

给需要监听事件的元素加上属性类似于onClick、onKeyDown这样的属性,在未经过特殊处理的时候,这些on*的事件监听只能用在普通的HTML标签上,而不能用在组件标签上.

注意事项:

* 事件监听函数默认会自动传入一个event对象,React封装了一层event对象;
* 事件中的this,由于React事件调用方法不是通过对象方法调用,而是直接通过函数调用,需要手动将实例方法bind到当前实例上.

```js
class Title extends Component {
    handleClickOnTitle (e) {
        console.log(e.target.innerHTML);
        console.log(this);
    }
    render() {
        return (
            <h1 onClick={this.handleClickOnTitle.bind(this)}>test</h1>
        )
    }
}
```


## No.3 React Keys的作用

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

## No.4 React refs有什么作用?

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

## No.5 Component与PureComponent的差异?

1. state状态变化时会触发Component组件重新渲染;
2. PureComponent组件相当于在shouldComponentUpdate加了以下逻辑;

```js
// 判断模块需不需要重新渲染
shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
}
```

注:如果某个组件的props或者是state频繁变动的话,那么根本不用换成PureComponent,用了反倒需要多次进行shallowEqual比较.

## No.6 React的render机制是什么?

* 入口调用ReactDOM.render();
* 获取当前的virtual DOM;
* 利用当前的virtual DOM与上次的virtual DOM做比较;
* 把改变的地方应用到真的DOM

注: 尽量不要触发render function;尽量保持virtual DOM的一致.

## No.7 shallowEqual与Immutable data structures

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

## No.8 如何给route组件赋值key?

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

## No.9 如何看待React与Preact的差异?

1. 虚拟DOM树结构不一样,在preact中,children在props中永远是数组,但react中可能是字符串、数字、null、undefined、数组、单个虚拟DOM;
2. ref机制也有差异,preact有些时候this.refs.xxx为undefined;
3. Children.map实现也不同,preact是对原来的虚拟DOM进行复制,并修改或添加上一个新的key值;
4. 事件系统也有差异,react的事件系统是基于冒泡的,preact是简单绑定元素节点上;
5. diff算法差异:preact没有考虑到children出现相同key的情况.

## No.10 React生命周期是什么样的?

* 完整生命周期过程:

在React16之前：生命周期其实主要分为四个阶段：组件初始化、组件挂载、组件更新、组件卸载；
  * 组件初始化：constructor
  * 组件挂载：componentWillMount -> render -> componentDidMount
  * 组件更新：
    * props属性更新：componentWillReceiveProps -> shouldComponentUpdate -> componentWillUpdate -> render -> componentDidUpdate
    * states状态更新：shouldComponentUpdate -> componentWillUpdate -> render -> componentDidUpdate
  * 组件卸载：componentWillUnmount

在React16及以后：生命周期变为三个阶段：组件挂载、组件更新、组件卸载
  * 组件挂载：constructor -> getDerivedStateFromProps -> render -> 更新DOM和refs -> componentDidMount
  * 组件更新：(new props,setState,forceUpdate) -> getDerivedStateFromProps -> shouldComponentUpdate -> render -> getSnapshotBeforeUpdate -> 更新DOM和refs -> componentDidUpdate
  * 组件卸载：componentWillUnmount

引入Hook之后对应的生命周期的关系：
  * 组件挂载：useState <=> constructor
  * 组件更新：useEffect <=> componentDidMount,componentDidUpdate,componentWillUnmount;
  * dom更新：useRef <=> 更新DOM和refs
  * forceUpdate <=> useState|useReducer

1. 可选的static方法;

2. constructor构造函数;

  * 关于组件自身的状态初始化工作都会放在这里处理,例如组件的state的初始化;

```js
constructor () {
    super();
    this.state = {
        date: new Date()
    };
}
```

3. getChildContext获取子元素内容;
4. componentWillMount模块渲染前;注:此时组件还没挂载完成

  * 组件启动的动作,包括像Ajax数据拉取操作,定时器启动等;

```js
componentWillMount() {
    ajax.get("http://xxx.com/api/user", (userData) => {
        this.setState({userData});
    });
}
```

5. componentDidMount模块渲染后;作用:有些组件的启动工作是依赖DOM的,例如动画的启动.
6. componentWillReceiveProps组件从父组件接收新的props之前;
7. shouldComponentUpdate判断模块需不需要重新渲染;
使用场景：用来阻止重新渲染，也可以使用componentWillReceiveProps根据props更新state触发重新渲染但不会触发额外render。

8. componentWillUpdate组件开始重新渲染之前调用;
9. componentDidUpdate模块渲染结束;
10. componentWillUnmount 组件从页面销毁的时候,做一些清理任务,比如删除定时器等;

```js
componentWillUnmount () {
    clearInterval(this.timer);
}
```

11. 点击回调或者事件处理器如onClickSubmit()或onChangeDescription();
12. render里的getter方法;
13. 可选的render方法
14. render()方法

## No.11 组件的state和setState的作用是什么?

React.js的state就是用来存储组件可变化的显示形态;
setState方法由父类Component所提供,当我们调用这个函数的时候,React.js会更新组件的状态state,并且重新调用render方法.
setState不会马上修改state,而是采用合并消息以后再统一重新渲染组件.

## No.12 组件的props作用是什么?

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

## No.13 state与props有什么区别?

* state的主要作用是用于组件保存、控制、修改自身的可变状态;
* props的主要作用是让使用该组件的父组件可以传入参数来配置该组件;

记住一个简单的规则:尽量少地用state,尽量多地用props.

## No.14 更新阶段的组件生命周期是什么样的?

更新阶段组件的生命周期如下:

1. shouldComponentUpdate(nextProps, nextState): 通过这个方法控制组件是否重新渲染;
2. componentWillReceiveProps(nextProps): 组件从父组件接收到新的props之前调用;
3. componentWillUpdate(): 组件开始重新渲染之前调用;
4. componentDidUpdate(): 组件重新渲染并且把更改变更到真实的DOM以后调用.

## No.15 PropTypes和组件参数的验证是怎样的?

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

## No.16 React与Vue的区别?

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

## No.17 dangerouslySetHTML和style属性的作用是什么?

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

## No.18 props.children和容器类组件是什么关系?

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

## No.19 什么是高阶组件?

* 高阶组件就是一个函数,传给它一个组件,它返回一个新的组件.
* 作用就是为了组件之间的代码复用,组件可能有着某些相同的逻辑,把这些逻辑抽离出来,放到高阶组件中进行复用.高阶组件内部的包装组件和被包装组件之间通过props传递数据.
* 高阶组件的设计模式就是装饰者模式,通过组合的方式达到很高的灵活程度.

看一个高阶组件的示例:

```js
// wrapWithLoadData.js
import React, {Component} from 'react';
export default (WrappedComponent, name) => {
    class NewComponent extends Component {
        constructor() {
            super();
            this.state = {data: null}
        }
        // 模块渲染前
        componentWillMount() {
            let data = localStorage.getItem(name);
            this.setState({data});
        }
        render() {
            return <WrappedComponent data={this.state.data} />
        }
    }
    return NewComponent;
};
```

实际引用高阶组件示例:

```js
import wrapWithLoadData from './wrapWithLoadData';
class InputWithUserName extends Component {
    render () {
        return <input value={this.props.data} />
    }
}
InputWithUserName = wrapWithLoadData(InputWithUserName, 'username');
export default InputWithUserName;
```

wrapWithLoadData高阶组件挂载的时候会先去localStorage加载数据,渲染的时候再通过props.data传给真正的InputWithUserName.

## No.20 关注过React DOM未来可以朝哪些方向优化?

* 停止在value属性中映射输入值,因为这并不是DOM的工作方式;

* 在React根目录而不是document对象中添加事件.

* onChange迁移到onInput,并且不要填充不受控制的组件.

* 大大简化事件系统.

* className->class.

## No.21 异步加载渲染数据的React组件

* 顶部一个搜索框，下面一个列表数据，搜索框输入时实时查询并渲染新的数据。组件不限制Class Component或者Function Component+Hooks，熟悉Hooks推荐使用Hooks。
（基本功能、loading+请求异常状态、搜索防抖、Hooks实现-正确理解使用useEffect，通过依赖变更触发effect，而不是手动触发fetchData、Class实现)

```js
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

let timer;

function App() {
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState(inputValue);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 模拟 fetch
        const data = await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve([{ name: "a" }, { name: "b" }]);
          }, 0.5 * 1000);
        });
        setData(data);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };

    fetchData();
  }, [searchValue]);

  function handleInputValueChange(e) {
    const value = e.target.value;
    setInputValue(value);

    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      setSearchValue(value);
    }, 0.3 * 1000);
  }

  return (
    <div>
      <div>
        <input
          placeholder="关键词"
          value={inputValue}
          onChange={handleInputValueChange}
        />
        当前搜索词：{searchValue}
      </div>
      <div>
        {error && <div>{error.message}</div>}
        {loading ? (
          <div>loading....</div>
        ) : (
          data.map(item => {
            return <div>{item.name}</div>;
          })
        )}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
```

## No.22 实现一个normalize函数，能将输入的特定字符串转化为特定的结构化数据。

字符串仅由小写字母和[,]组成，且字符串不会包含多余的空格。
示例一：'abc' --> {value: 'abc'}
示例二：'[abc[bcd[def]]]' -> {value: 'abc', children: {value: 'bcd', children: {value: 'def'}}}

```js
function normalize(str) {
    // your code here
    return obj;
}
```

实现代码：

```js
function normalize(str) {
    const pattern = /\[(\w+)\]/g;
    let matched, pop = [];
    while (matched = str.match(pattern)) {
        str = str.replace(pattern, function(m, s) {
            pop.unshift(s);
            return '';
        });
    }
    if (str) {
        return {
            value: str
        }
    }
    let o;
    pop.reduce((obj, currentValue) => {
        if (!o) {
            o = obj;
        }
        obj.value = currentValue;
        obj.children = {};
        return obj.children;
    }, {});
    return o;
}
normalize('[abc[bcd[def]]]');
```

## No.23 实现一个金额展示格式化的函数formatAmount,金额展示规则为整数部分每三位用逗号分隔，小数部分展示两位。输入数据不是数字时返回"-"。

举例：
```js
formatAmount(2688) => "2,688.00"
formatAmount("2e6") => "2,000,000.00"
formatAmount(-2.33333333) => "-2.33"
formatAmount("Alibaba") => "-"
```

```js
function formatAmount(num) {
    let amount = +num;
    if (num === null || amount !== amount) {
        return '-';
    }
    const isNagative = (amount < 0);
    if (isNagative) {
        amount = -amount;
    }
    const str = amount.toFixed(2);
    let [integer, fraction] = str.split('.');
    let slicedInteger = [];
    while (integer.length) {
        slicedInteger.unshift(integer.slice(-3));
        integer = integer.slice(0, Math.max(integer.length - 3, 0));
    }
    return `${isNagative ? '-' : ''}${slicedInteger.join(',')}.${fraction}`;
}
```

# 参考

## [React.js小书](http://huziketang.mangojuice.top/books/react/)