# 第二节 框架的状态管理

## No.1 Redux的三个部分Action、Reducer、及Store分别的作用是什么?

Redux的设计思想:

* 将Web应用看成是一个状态机,视图与状态是一一对应;
* 所有的状态保存在一个对象里面.

* Store是什么?

管理action和reducer及其关系的对象,主要提供以下功能:

  * 维护应用状态并支持访问状态(getState());
  * 支持监听action的分发,更新状态(dispatch(action));
  * 支持订阅store的变更(subscribe(listener)).

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

Action由View发出的通知,表示State应该要发生变化了;Action是一个JS对象.其中的type属性是必须的,表示Action的名称.payload:负载数据.

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

## No.2 Flux是什么?

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

## No.3 Redux与Mobx的差异

* 函数式与面向对象: Redux遵循函数式编程;Mobx面向对象角度考虑.
* 单一store与多store: Redux将所有共享的应用数据集中在一个大的store中;Mobx则通常按模块将应用状态划分,在多个独立的store中管理.
* 原生对象与可观察对象: Redux需要手动追踪所有状态对象的变更;Mobx可以监听可观察对象,当其变更时将自动触发监听.
* 不可变和可变: Redux状态对象通常是不可变的;
* react-redux与mobx-react:
  * 使用react-redux提供Provider和connect: Provider负责将Store注入React应用;connect负责将store state注入容器组件,并选择特定状态作为容器组件props传递.
  * 使用mobx-redux提供Provider和inject: Provider将所有stores注入应用;使用inject将特定store注入某组件,store可以传递状态或action,然后使用observer保证组件能相应store中的可观察对象(observable)变更,即store更新,组件视图响应式更新.
* 架构: Redux应用中需要配置,创建store,并使用redux-thunk或redux-saga中间件以支持异步action,然后使用Provider将Store注入应用;Mobx应用则可以直接将所有store注入应用;
