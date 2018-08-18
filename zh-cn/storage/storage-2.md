# 第二节 缓存

## No.1 SW数据缓存在哪里?

存在一个全局的cacheStorage对象,底层其实在系统的一块共享内存区域.

## No.2 浏览器缓存200 from cache与304 Not Modified有什么差别?

* 触发200 from cache的条件有哪些?

  * 直接点击链接访问;
  * 输入网址按回车访问;
  * 二维码扫描;

* 触发304 Not Modified:

  * 刷新页面时触发;
  * 设置了长缓存、但Entity Tags没有移除时触发;


