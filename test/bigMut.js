console.log(bigMut("10", "1234")); // 12340
function bigMut(big, common) {
	big += "";
	common += "";
	if (big.length < common.length) {
		big = [common, common = big][0];
	}
	big = big.split("").reverse();
	var oneMutManyRes = [];
	var i = 0,
	len = big.length;
	for (; i < len; i++) {
		oneMutManyRes[oneMutManyRes.length] = oneMutMany(big[i], common) + getLenZero(i);
	}
	var result = oneMutManyRes[0];
	for (i = 1, len = oneMutManyRes.length; i < len; i++) {
		result = bigNumAdd(result, oneMutManyRes[i]);
	}
	return result;
}
function getLenZero(len) {
	len += 1;
	var ary = [];
	ary.length = len;
	return ary.join("0");
}
function oneMutMany(one, many) {
	one += "";
	many += "";
	if (one.length != 1) {
		one = [many, many = one][0];
	}
	one = parseInt(one, 10);
	var i = 0,
	len = many.length,
	resAry = [],
	addTo = 0,
	curItem,
	curRes,
	toSave;
	many = many.split("").reverse();
	for (; i <= len; i++) {
		curItem = parseInt(many[i] || 0, 10);
		curRes = curItem * one + addTo;
		toSave = curRes % 10;
		addTo = (curRes - curRes % 10) / 10;
		resAry.unshift(toSave);
	}
	if (resAry[0] == 0) {
		resAry.splice(0, 1);
	}
	return resAry.join("");
}
function bigNumAdd(big, common) {
	big += "";
	common += "";
	var maxLen = Math.max(big.length, common.length),
	bAry = big.split("").reverse(),
	cAry = common.split("").reverse(),
	i = 0,
	addToNext = 0,
	resAry = [],
	fn,
	sn,
	sum;
	for (; i <= maxLen; i++) {
		fn = parseInt(bAry[i] || 0);
		sn = parseInt(cAry[i] || 0);
		sum = fn + sn + addToNext;
		addToNext = (sum - sum % 10) / 10;
		resAry.unshift(sum % 10);
	}
	if (resAry[0] == 0) {
		resAry.splice(0, 1);
	}
	return resAry.join("");
}