# 第十二节 文件

## No.1 Node.js内置的fs模块架构是什么样子的?

fs模块主要由下面几部分组成:

1. POSIX文件Wrapper,对应于操作的原生文件操作;
2. 文件流fs.createReadStream和fs.createWriteStream;
3. 同步文件读写fs.readFileSync和fs.writeFileSync;
4. 异步文件读写fs.readFile和fs.writeFile.
