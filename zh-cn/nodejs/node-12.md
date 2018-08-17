# 第十二节 文件

## No.1 Node.js内置的fs模块架构是什么样子的?

fs模块主要由下面几部分组成:

1. POSIX文件Wrapper,对应于操作的原生文件操作;
2. 文件流fs.createReadStream和fs.createWriteStream;
3. 同步文件读写fs.readFileSync和fs.writeFileSync;
4. 异步文件读写fs.readFile和fs.writeFile.

## No.2 Node.js读写文件有多少种方法?

* 针对读操作的有三种: readFile, read, createReadStream;
* 针对写操作的有三种: writeFile, write, createWriteStream;

1. readFile方法是将要读取的文件内容完整读入缓存区,再从该缓存区中读取文件内容,对应的同步方法是readFileSync;
2. writeFile方法是将要写入的文件内容完整的读入缓存区,然后一次性的将缓存区中的内容写入到文件,对应的同步方法是writeFileSync;

注:这两种方法都是将文件内容视为一个整体,在读写大文件的时候,可能会造成内存暴涨.

3. read:不断地将文件中的一小块内容读入缓存区,最后从该缓存区中读取文件内容,对应同步方法是readSync;
4. write:将需要写入的数据放到一个内存缓存区,待缓存区写满后再将缓存区的内容写入到文件中,对应同步方法是writeSync;

注: 这两种方法会将文件分成一块一块逐步操作,在读写文件过程中允许执行其他操作.无法满足从文件中读取部分数据.

5. createReadStream:创建一个将文件内容读取为流数据的ReadStream对象;
6. createWriteStream:创建一个将流数据写入到文件中的WriteStream对象;

## No.3 怎么读取JSON配置文件?

主要有2种方式:

* 第一种是利用Node.js内置的require("data.json")机制,直接得到js对象;
* 第二种是读入文件的内容,然后用JSON.parse(content)转换成js对象;

二者的区别是:
require机制情况下,如果多个模块都加载了同一个json文件,那么其中一个改变了js对象,其它跟着改变,这是由Node.js模块的缓存机制造成的,因为只有一个js模块对象;第二种方式则可以随意改变加载后的js变量,而且各模块互不影响,因为他们都是独立的,是多个js对象.

## No.4 fs.watch和fs.watchFile有什么区别,怎么应用?

二者主要用来监听文件变动(包括内容改动和名字、时间戳等任何变化)在官方文档两个方法都标注“Unstable”.

* fs.watch利用操作系统原生机制来监听;

这个方法是通过监听操作系统提供的各种“事件”(内核发出的消息)实现的.这个不同的平台实现的细节不一致,导致这个方法不能保证在所有平台上可用.

* fs.watchFile则是定期检查文件状态变更,适用于网络文件系统,但是相比fs.watch有些慢,因为不是实时机制.

这个方法原理是使用轮询(每隔一个固定的时间去检查文件是否改动).而且这个时间间隔是可以通过参数设置的.

* 使用建议:

如果真正需要使用这个功能,优先使用watch(),如果在你的目标平台上无法正常使用,再考虑使用watchFile(),不过要小心,千万不要用watchFile()监视太多文件,会导致内存暴涨.
另外,watch()在mac上的问题,可以使用现有的封装库gaze
