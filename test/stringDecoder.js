// const StringDecoder = require('string_decoder').StringDecoder;
// const decoder = new StringDecoder('utf8');

// const cent = Buffer.from([0xC2, 0xA2]);
// console.log(decoder.write(cent)); // ¢

// const euro = Buffer.from([0xE2, 0x82, 0xAC]);
// console.log(decoder.write(euro)); // €

const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');
decoder.write(Buffer.from([0xE2]));
decoder.write(Buffer.from([0x82]));
console.log(decoder.end(Buffer.from([0xAC])));