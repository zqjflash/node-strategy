# 第五节 TypeScript

### void和undefined有什么区别？

void是JS中的一个运算符，在JS中判断是否是undefined，一般都这样写：

```js
function isUndefined(input) {
  return input === void 0;
}
```

undefined是术语、类型、值、属性，undefined可能会被重写。
