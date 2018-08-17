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


