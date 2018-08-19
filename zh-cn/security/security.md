# 第一节 安全

## No.1 如何保证密码比较的安全性?

比较密码时,不能泄露任何信息,因此比较必须在固定时间完成,否则可以使用timing attacks来攻击你的应用.
问题原因:Node.js使用V8引擎,从性能角度优化代码,会逐个比较字符串的字母,一旦发现不匹配时就停止比较,攻击者的密码越准确,比较时间越长,因此攻击者可以通过比较时间的长短来判断密码的正确性

```js
// 问题代码
function checkApiKey(apiKeyFromDb, apiKeyReceived) {
    if (apiKeyFromDb === apiKeyReceived) {
        return true;
    }
    return false;
}
```

可以使用cryptiles解决这个问题:

```js
function checkApiKey(apiKeyFromDb, apiKeyReceived) {
    return cryptiles.fixedTimeComparison(apiKeyFromDb, apiKeyReceived);
}
```

## No.2 加密是如何保证用户密码的安全性?

Node.js的crypto模块封装了诸多的加密功能,包括oepnSSL的哈希,HMAC,加密、解密、签名和验证函数等;
Node.js的加密貌似有点问题,某些算法算出来跟别的语言不一样,Node.js默认不补全填充量;
使用客户端的加密:能够增加传输过程中被第三方嗅探到密码后破解的成本,对于游戏,在客户端加密是防止外挂/破解等;
在服务端加密(如md5)是避免管理数据库的DBA或者攻击者数据库之后直接拿到明文密码,从而提高安全性.

## No.3 TLS与SSL有什么区别?

TLS(传输层安全协议)和SSL只是不同阶段的产物,存在三个特性:

* 机密性:SSL协议使用密钥加密通信数据;
* 可靠性:服务器和客户都会被认证,客户的认证是可选的;
* 完整性:SSL协议对传送的数据进行完整性检查;

## No.4 HTTPS能否被劫持?

如果PKI受到攻击,那么HTTPS也一样不安全,证书由CA机构签发,一般浏览器遇到非权威的CA机构是会告警的,但是如果你在某些特殊的情况下信任了某个未知机构/证书,那么也可能被劫持.

## No.5 XSS攻击是什么?有什么危害?

是一种代码注入方式,为了与CSS区分所以被称作XSS,早期常见于网络论坛,起因是网站没有对用户的输入进行严格的限制,使得攻击者可以将脚本上传到帖子让其他人浏览器到有恶意脚本的页面.

当其他用户浏览到这些网页时,就会执行这些恶意脚本,对用户进行Cookie窃取/会话劫持/钓鱼欺骗等各种攻击.

## No.6 过滤html标签能否防止XSS?请列举不能的情况?

不能完全防止XSS.比如遇到下面这些情况:

1. 使用图片url来上传脚本进行攻击;

```js
<img src="javascript:alert('xss')" />
```

2. 使用各种方式规避检查,例如空格、回车、Tab

```js
<img src="javas cript: alert('xss')" />
```

3. 还可以通过各种编码转换(URL编码、Uincode编码、HTML编码、ESCAPE等)来绕过检查

```js
<img src="javascrip&#116&#58alert(/xss/)">
```

## No.7 CSRF是什么?如何防范?

跨站请求伪造:例如利用你在A站(攻击目标)的cookie/权限等,在B站(恶意/钓鱼网站)拼装A站的请求.

预防:

1. 同源检查:检查一下两个header, Origin header和Referer Header;
2. CSRF token: 前后端约定一个计算token的规则(进行cookie转token).

## No.8 如何避免中间人攻击?

中间人(Man-in-the-middle attach, MITM)是指攻击者与通讯的两端分别创建独立的联系,并交换其所收到的数据,使通讯的两端认为他们正在通过一个私密的连接与对方直接对话,但事实上整个会话都被攻击者完全控制.

对于通信过程中的MITM,常见的方案是通过PKI/TLS预防,即使是通过存在第三方中间人的wifi你通过HTTPS访问的页面依旧是安全的,而HTTP协议是明文传输,则没有任何预防可言.

不常见的还有强力的互相认证,你确认他之后,他也确认你一下,延迟测试,统计传输时间,如果通讯延迟过高,则认为可能存在第三方中间人.