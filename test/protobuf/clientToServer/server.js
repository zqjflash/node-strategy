const PORT = 11222;
const HOST = "127.0.0.1";
const ProtoBuf = require("protobufjs");
const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const shop = ProtoBuf.loadSync("./tma.shop.proto");
const shopMsg = shop.lookupType("tma.shop");

const shopReq = shop.lookupType("tma.shop.shopReq");
const shopRsp = shop.lookupType("tma.shop.shopRsp");

server.on("listening", () => {
    const address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', (message, remote) => {
    console.log(remote.address + ":" + remote.port + ' - ' + message);
    console.log(shopReq.decode(message) + "from client!");
    let payload = {
        retCode: 0,
        reply: "server response!"
    }
    let errMsg = shopRsp.verify(payload);
    if (errMsg) {
        throw Error(errMsg);
    }
    const rsp = shopRsp.create(payload);
    const rspBuffer = shopRsp.encode(rsp).finish(); // 编码成buffer

    server.send(rspBuffer, 0, rspBuffer.length, remote.port, remote.address, (err, bytes) => {
        if (err) {
            throw err;
        }
        console.log('UDP message reply to ' + remote.address + ':' + remote.port);
    });
});
server.bind(PORT, HOST);