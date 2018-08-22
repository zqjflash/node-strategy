# 第一节 构建与代码工具

## No.1 用什么工具保证一致的代码风格?为什么要这样?

Eslint, jsLint, JSCS这些工具可以帮助我们保证一致的代码风格,这个在团队协作时是非常重要的.这样团队成员才可以更快地修改代码,而不是每次去适应新的风格.

## No.2 什么是Stub?举例说明

桩代码(stub)就是在某些组件或模块中,模拟某些功能的代码,桩代码(stub)的作用是占位,让代码在测试过程中顺利运行.
示例代码,它实际的作用是写一个文件,但是这段代码并没有真正的做这件事:

```js
const fs = require("fs");
const writeFileStub = sinon.stub(fs, "writeFile", (path, data, cb) => {
    return cb(null);
});
expect(writeFileStub).to.be.called;
writeFileStub.restore();
```

## No.3 使用NPM包有哪些好处?

通过NPM,你可以安装和管理项目的依赖,并且能够指明依赖项的具体版本号,对于Node应用开发而言,你可以通过package.json文件来管理项目信息,配置脚本,以及指明项目依赖的具体版本.

## No.4 Yarn vs npm的特性差异

* 差异一:版本控制

yarn自带yarn.lock锁定文件记录,被确切安装上的模块的版本号;
npm需要开发者执行npm shrinkwrap命令生成npm-shrinkwrap.json文件;

* 差异二:并行安装

npm按照队列执行每个package串行执行;
yarn是同时执行所有任务,提高了性能;

## No.5 LiteHttp有哪些优点?

* 单线程:所有的方法都基于一个线程,绝不会跨线程;
* 灵活的架构:可以轻松的替换json自动化库;
* 轻量级:微小的开销;
* 多文件上传: 不需要额外的类库支持;
* 自动重定向:基于一定的次数,不会造成死循环;
* 禁用一种或多种网络:比如2G或3G.

## No.6 webpack的核心概念loader和chunk分别表示什么意思?

* loader:能转换各类资源,并处理成对应模块的加载器,loader间可以串行使用;
* chunk:code splitting后的产物,也就是按需加载的分块,装载了不同的module;
plugin:webpack的插件实体,在webpack中你经常可以看到compilation.plugin("xxx", callback),这些事件在打包时由webpack来触发.

## No.7 webpack编译和构建流程关键节点有什么?

* 解析webpack配置参数,合并从shell传入和webpack.config.js文件里配置的参数,生产最后的配置结果;
* 注册所有配置的插件,好让插件监听webpack构建生成周期的事件节点,以作出对应的反应;
* 从配置的entry入口文件开始解析文件构建AST语法树,找出每个文件所依赖的文件,递归下去;
* 在解析文件递归的过程中根据文件类型和loader配置找出合适的loader用来对文件进行转换;
* 递归完后得到每个文件的最终结果,根据entry配置生成代码块chunk;
* 输出所有chunk到文件系统;

## No.8 webpack4.0的配置流程是怎样的

```js
module.exports = {
    entry: './src/index.js', // 入口文件
    output: { // webpack如何输出
        path: path.resolve(__dirname, "dist"), // 定位,输出文件的目标路径
        filename: "[name].js"
    },
    module: { // 模块的相关配置
        rules: [ // 根据文件的后缀提供一个loader解析规则
        ],
        resolve: { // 解析模块的可选项
        },
        plugins: { // 插件的引用、压缩、分离美化
        }
    },
    devServer: { // 服务于webpack-dev-server内部封装了一个express
    }
};
```

## No.9 Gulp工具的优势以及常用插件有哪些?

PC端项目,我们推荐使用Gulp,Gulp基于Node.js中的stream工作流,效率更好,语法更自然,不需要编写复杂的配置文件.

* gulp-sass(sass编译)

示例代码:

```js
var sass = require("gulp-sass");
gulp.src("./sass/**/*.scss")
    .pipe(sass({
        outputStyle: "compressed"
    }))
    .pipe(gulp.dest("./dist/css"));
gulp.watch("./sass/**/*.scss", ["sass"]);
```

* gulp-minify-css(压缩css一行)
* gulp-uglify(压缩js代码)

```js
var uglify = require("gulp-uglify");
gulp.src("./js/*.js")
    .pipe(gulpif(condition, uglify(), concat("all.js"))) // condition为true执行uglify()

* gulp-sequence:顺序执行
```

## No.10 babel把ES6转成ES5的原理是什么?

1. 它就是个编译器,输入语言是ES6+,编译目标语言是ES5;
2. babel官方工作原理如下:

  * 解析: 将代码字符串解析成抽象语法树;
  * 变换: 对抽象语法树进行变换操作;
  * 再建: 根据变换后的抽象语法树再生成代码字符串.
