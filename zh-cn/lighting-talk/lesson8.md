# 第八篇: 谷歌开发者大会观后感

## 1. PWA老生常谈

* 从四个方面进行简单的描述: 快速、继承、可靠、有吸引力;
* PWA的方向更加的成熟,各浏览器厂商的支持更加完整;
* 新的功能上有一些补充,比如支付和登录.

![google-dev-pwa](/assets/google-dev-pwa.png)

## 2. AMP持续推广

AMP大致在2016年左右问世,之后百度也做了MIP.实现原理就是自定义html tag + AMP js + AMP的server cache.

从目前来看中国的网络是很好的,我们即将迎来5G时代,而国外的描述大都是3G.官方文档测试值`15%~85%`,但是,具体加速多少还是需要结合实际情况来, 不过使用AMP之后在搜索引擎中排名提升是比较能确定的.目前,百度、搜狗都支持了AMP.

![google-dev-amp](/assets/google-dev-amp.png)

## 3. web发展新趋势

* wasm另类的前后端同构:未来有可能是,在性能上突破传统终端的武器;
* web趋势有很多新的能力,越来越解禁原生的APP,并且对硬件支持也越来越好,比如调用相册、Canvas、扫描二维码、面部识别、文字识别、USB、录像等新的API.

* 还有一些更加强大的功能: web RTC和Screen sharescreen share可以把媒体流加载到任意元素上播放.webRTC现场做了个canvas+webRTC的演示,移动左边的canvas,右边的canvas会同步移动.BarCode Detector二维码探测,可以直接扫描二维码.Face Detector人脸检测,比如放到摄像头中使用.

使用简单的几行代码,就可以完成复杂的功能,使得web应用,更接近原生的Native能力.依托浏览器能力衍生出来的web生态,未来前端开发依旧前景繁荣.

![google-dev-web-new](/assets/google-dev-web-new.png)

## 4. Tooling for the web

页面性能的评估
