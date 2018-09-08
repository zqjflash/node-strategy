const ProtoBuf = require("protobufjs");
const fs = require("fs");

ProtoBuf.load("./tma.video.js", (err, root) => {
    let video = root.lookupType("tma.video");

    let payload = {
        "id": 12,
        "str": "video"
    };
    
    let errMsg = video.verify(payload);
    if (errMsg) {
        throw Error(errMsg);
    }
    
    // 创建数据
    let videoMsg = video.create(payload);
    let buffer = video.encode(videoMsg).finish();
    console.log(buffer);
    fs.writeFile('./test.log', buffer, (err) => {
        if (!err) {
            console.log('done!');
        }
    });
});