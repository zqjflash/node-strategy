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

* 以用户为中心的绩效指标

![google-dev-performance](/assets/google-dev-performance.png)

* 页面加载

![google-dev-page-load](/assets/google-dev-page-load.png)

* 页面测试的不二利器 Pupperteer

![google-dev-page-test](/assets/google-dev-page-test.png)

chrome的无头浏览器,非常酷炫,大部分你手动在浏览器里面能做的事情,它都可以做.

例如: 截图并生成PDF、自动填写表格、UI测试、键盘输入、测试Chrome插件.

## 5、Flutter

RN的解决方案跟原生应用相比,差距还是比较大.但是flutter可能做的原生APP一样的性能,非常值得期待.此次开发者大会,推出了Flutter 预览版2.0

![google-dev-flutter](/assets/google-dev-flutter.png)

Flutter最大的特点是使用skia自己实现了View的渲染,摒弃了RN那一套通过Native实现渲染的方式.

* 只要它的渲染可以媲美native,超越类RN解决方案只是时间问题;
* 技术生态虽然不是一天建成的,但是技术选型,有时候已经预示了最后的结局;
* Google的技术开源,在节奏把控上整体比较节制;

__优化之前:先测量,这是正确的方式__

只有找到瓶颈,才是优化的开始,没有平白无故的优化和拍脑袋的性能数据;

目前阿里的闲鱼、腾讯的NOW在使用

## 6、一些感受

* Google很多的一线工程师,大都是PHD,整体团队都具备强劲的基础研究能力和创新能力,基础人才能力的差距,决定一个团队的高度;

* Google有一个叫"技术推广"的职位.负责推广和宣传谷歌的技术产品.是有技术背景的产品经理的角度.技术在这家公司是被足够尊重的.工程师文化还是非常浓重,把技术产品装成产品进行推广和宣传,让更多的开发者相信谷歌的文化和特质

* Google做的技术产品,更多的是在标准化方向,或者希望将这项技术逐步进化成行业标准,这一点在Web方向非常明显,还有关于技术推广本身,无论是在推动初级开发者学习上面,还是推广高级玩家共建社区都是实践了很多,对于基础文档的编写、社区的打招、邀请优秀的人才参加训练营,做了很多尝试.

* 新技术的尝试,或者技术输出的这两个角度上来看,作为工程师,在完成业务、追求技术成长、技术输出之间,如何达到一个平衡,是一个很需要慎重考虑的事情,技术储备在产品的短期发展中是很容易被忽视的,但是随着产品的长期迭代,时间一长,基础设施欠下的债,早晚都是要还的.

## 7. 附录

* 2018年的主题:依然是AI为主,也涵盖了ARcore、Wear OS、Flutter、Kotlin等,相关视频可以去bilibili上搜索

[2018上海Google开发者大会9.21上午](https://www.bilibili.com/video/av32144346?from=search&seid=8280270732172962964)

[2018 上海 Google 开发者大会 9.20 下午](https://www.bilibili.com/video/av32094051?from=search&seid=14515183215173293960)