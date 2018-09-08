const dgram = require('dgram');
const ProtoBuf = require("protobufjs");
const PORT = 11222;
const HOST = "127.0.0.1";
const shop = ProtoBuf.loadSync("./tma.shop.proto");
const shopMsg = shop.lookupType("tma.shop");

const shopReq = shop.lookupType("tma.shop.shopReq");
const shopRsp = shop.lookupType("tma.shop.shopRsp");

let payload = {
    name: "zqjflash"
};
let errMsg = shopReq.verify(payload);
if (errMsg) {
    throw Error(errMsg);
}
const req = shopReq.create(payload);
const reqBuffer = shopReq.encode(req).finish(); // 编码成buffer

const socket = dgram.createSocket({
    type: 'udp4',
    fd: 8080
}, (err, message) => {
    if (err) {
        console.log(err);
    }
    console.log(message);
});

socket.send(reqBuffer, 0, reqBuffer.length, PORT, HOST, (err, bytes) => {
    if (err) {
        throw err;
    }
    console.log('UDP message send to ' + HOST + ':' + PORT);
});

socket.on("message", (msg, rinfo) => {
    console.log("[UDP-CLIENT] Received message: " + shopRsp.decode(msg).reply + " from " + rinfo.address + ":" + rinfo.port);
    console.log(shopRsp.decode(msg));
    socket.close();
});

socket.on("close", () => {
    console.log("socket closed.");
});

socket.on("error", (err) => {
    socket.close();
    console.log("socket err");
    console.log(err);
});