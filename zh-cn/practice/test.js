const md5 = require('js-md5');
const extObj = JSON.stringify({"spm":"a2141.7756461.2.6","page":1,"tabCode":"all","appVersion":"1.0","appName":"tborder"});
var code = md5(`30e59bed369e5dd53b51874e64c15e79&1505291891655&12574478&${extObj}`);