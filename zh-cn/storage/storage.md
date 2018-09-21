# 第一节 数据库存储

## No.1 数据库范式有哪些?

* 第一范式: 数据库表的每一列都是不可分割的原子数据项,而不能是集合,数组等非原子数据项;
* 第二范式: 要求数据库表的每个实例或记录必须可以被唯一地区分,选取一个能区分每个实体的属性或属性组,作为实体的唯一标识;
* 第三范式: 要求一个关系中不包含已在其它关系已包含的非关键字信息.

## No.2 数据库的 M/S,M/M 等部署方式有什么区别?

|  属性  | Master/Slave |  Master/Master  |
| ------ | ------ | ------ |
|  一致性  | Eventually:当你写入一个新值后,有可能读不出来,但在某个时间窗口之后保证最终能读出来.比如:DNS,电子邮件,Amazon S3,Google搜索引擎这样的系统.   |   与M/S一样    |
|  事务  | 完整   | 本地 |
|  延迟  | 低延迟   | 低延迟      |
|  吞吐  | 高吞吐 | 高吞吐 |
|  数据丢失  | 部分丢失    | 部分丢失 |
|  熔断  | 只读    | 读/写  |

## No.3 索引有什么用?大致原理是什么?设计索引有什么注意点?

索引是一种用空间换时间的优化策略,把随机io转为顺序io,加快检索效率;
不过索引数量过多会降低写入的性能,因为在表中的数据更改时,所有的索引都将必须进行适当的调整.

在实际操作过程中,设计索引要考虑如下情况:

1. 选择唯一性索引;
2. 为经常需要排序、分组和联合操作的字段建立索引;
3. 为常作为查询条件的字段建立索引;
4. 限制索引的数目;
5. 尽量使用数据量少的索引;
6. 尽量使用前缀来索引;
7. 删除不再使用或者很少使用的索引.

## No.4 Mongodb连接问题(超时/断开等)有可能是什么问题导致的?

* 网络问题
* 任务跑不完,超过了driver的默认链接超时时间(如30s)
* Mongodb宕机了
* 超过了连接空闲时间(connection idle time)被断开
* fd不够用(ulimit设置)
* mongodb最大连接数不够用(可能是连接未复用导致)

## No.5 Mongodb有哪些常用优化措施?

* 开发阶段使用explain在写代码的阶段做性能分析;
* profile检测性能慢的语句,便于线上产品问题定位;

无论使用哪种方式定位出来问题,解决办法:

* 根据业务调整schema结构;
* 优化索引以及表分区

## No.6 Mongoose是什么?支持哪些特性?

Mongoose是mongodb的文档映射模型,主要由Schema,Model和Instance三个方面组成,Schema就是定义数据类型,Model就是把Schema和js类绑定到一起,Instance就是一个对象实例.常见Mongoose操作有save,update,find,findOne,findById,static方法等.

## No.7 什么情况下数据会出现脏数据?如何避免?

以一个实际的场景来分析:

从A账号中把余额读出来->对A账号做减法操作->把结果写回A账号中;
从B账号中把余额读出来->对B账号做加法操作->把结果写回B账号中;

针对上面这个case,为了数据的一致性,A账号和B账号的处理流程要么都成功执行,要么都失败,而且这个操作的过程中,对A、B账号的其它访问必须锁死,所谓锁死就是要排除其它的读写操作,否则就会出现脏数据(即数据一致性问题).

这个问题并不仅仅出现在数据库操作中,普通的并发以及并行操作都可能导致出现脏数据,避免出现脏数据通常是从架构上避免或者采用事务的思想处理.

## No.8 redis与memcached的区别?

* 区别一: 网络IO模型

Memcached是多线程,非阻塞IO复用的网络模型;
Redis使用单线程的IO复用模型,自己封装了一个简单的AeEvent事件处理框架,主要实现了epoll、kqueue和select.

* 区别二:内存管理方面

Memcached使用预分配的内存池的方式,使用slab和大小不同的chunk来管理内存;
Redis使用现场申请内存的方式来存储数据,并且使用free-list等方式来优化内存分配.

* 区别三:数据一致性问题

Memcached提供了cas命令,保证多并发时操作同一份数据的一致性;
Readis:采用事务,保证一串命令的原子性,中间不会被任何操作打断.

## No.9 redis支持哪些功能?

主要包括:set/get, hset/hget, publish/subscribe, expire

演示一段redis简单的应用代码:

```js
const redis = require("redis");
const client = redis.createClient();
client.set("foo","some fantastic value");
client.get("foo", function(err, reply) {
    console.log(reply.toString());
});
client.end();
```

## No.10 如何实现一个简单的Redis Session中间件?

以express框架为例:

```js
app.use(mySession({
    connection: {host: "127.0.0.1", port: 6379}, // Redis 连接信息maxAge: 3600, // session 的有效期
    sessionId: "my.sid" // session ID的cookie名称
}));
// 使用时直接req.session上添加或删除属性即可
```

## No.11 实现一个简单MySQL ORM模块?

```js
const orm = new MyORM({
    // mysql 连接信息
    connection: {host: "127.0.0.1", port: 3306, user: "root", password: "",
databse: "test"}
});
// 查询
orm.table("xxx").find(query).skip(0).limit(20).then(list => console.log("results", list);)
.catch(err=>console.log(err));
// 更新
orm.table("xxx").update(query, update).then(ret => console.log(ret))
.catch(err => console.log(err));
```

## No.12 MySQL索引背后的数据结构与算法原理

* 数据结构采用的是B+Tree:

  * 每个节点的指针上限为2d而不是2d+1;
  * 内节点不存储data,只存储key,叶子节点不存储指针;

mysql对B+Tree进行了优化,增加了顺序访问指针.在B+树的每个叶子节点增加一个指向相邻叶子节点的指针,就形成了带有顺序访问指针的B+Tree.这个目的是为了提高区间访问的性能.

* 索引算法实现

  * MyISAM中索引检索的算法:首先按照B+Tree搜索算法进行搜索,如果指定的Key存在,则取出其data域值,然后以data域的值为地址, 读取相应数据记录;
  * InnoDB,表数据文件本身就是按B+Tree组织的一个索引结构,这棵树的叶节点data域保存了完整的数据记录.这个索引的key是数据表的主键,因此InnoDB表数据文件本身就是主索引.因为InnoDB的数据文件本身要按主键聚集,所以InnoDB要求表必须有主键.
