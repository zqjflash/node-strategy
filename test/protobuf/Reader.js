const ProtoBuf = require("protobufjs");
const fs = require("fs");

ProtoBuf.load("./tma.video.js", (err, root) => {
    let video = root.lookupType("tma.video");

    let buffer = fs.readFile('./test.log', (err, data) => {
        if (!err) {
            console.log(data); // 看看Node里的Buffer格式
            let message = video.decode(data);
            console.log(message);
        }
    });
});
