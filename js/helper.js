//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var dW = function(m) {
	if (typeof document !== 'undefined' && document.getElementById("console") !== null && document.getElementById("console") !== undefined) {
		document.getElementById("console").value += m + '\n';
	}
	console.warning(m);
}

var dE = function(m) {
	if (typeof document !== 'undefined' && document.getElementById("console") !== null && document.getElementById("console") !== undefined) {
		document.getElementById("console").value += m + '\n';
	}
	console.error(m);
}

var dD = function(m) {
	if (typeof document !== 'undefined' && document.getElementById("console") !== null && document.getElementById("console") !== undefined) {
		document.getElementById("console").value += m + '\n';
	}
	console.error(m);
}

var dI = function(m) {
	if (typeof document !== 'undefined' && document.getElementById("console") !== null && document.getElementById("console") !== undefined) {
		document.getElementById("console").value += m + '\n';
	}
	console.log(m);
}

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var Mask = function(key, mask, value) {
	this.K = key;
	if (value === undefined) {
		this.V = mask;
	} else {
		this.M = mask;
		this.V = value;
	}
}

Mask.prototype.isEndOfLine = function() {
	return (this.M === null || this.M === undefined);
}

Mask.prototype.isMatch = function(mskPar) {
	if (this.K.indexOf('-') === -1) { //direct comparision
		return mskPar == this.K;
	} else {
		var values = this.K.split('-');
		if (values.length > 2) return false; //not suported
		if (values[0] == '' || values[1] == '') return false; //one is empty
		if (mskPar >= parseInt(values[0]) && mskPar <= parseInt(values[1])) {
			return true;
		}
		return false;
	}
}

Mask.prototype.findValue = function(par) {
	if (this.isEndOfLine()) return this.V;
	for (var i = 0; i < this.V.length; i++) {
		if (this.V[i].isMatch(this.M & par)) {
			return this.V[i].findValue(par);
		}
	}
	return null;
}

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

var Decoder = function(key, mask, func) {
	Mask.call(this, key, mask, func);
}
Decoder.prototype = new Mask();
Decoder.prototype.decode = function(par) {
	var func = this.findValue(par);
	if (func == null) {
		dE('Decoder could not find function for: ' + this.K.toString(16));
	}
	return func(par);
}

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

var getOctetFromPdu = function(pdu, index) {
	var a = pdu.substr(index*2, 2);
	return !!a ? parseInt(a, 16) : null;
}

var getSubstringFromPdu = function(pdu, length) {
	return pdu.substring(0, length*2);
}

var getOctetFromPduAsString = function(pdu, index) {
	var a = getOctetFromPdu(pdu, index).toString(16);
	if (a.length == 1) {
		a = '0' + a;
	}
	return a.toUpperCase();
}

var toHexString = function(octet) {
	var a = octet.toString(16);
	if (a.length == 1) {
		a = '0' + a;
	}
	a = a.toUpperCase();
	return a;
}

module.exports.Mask = Mask;
module.exports.Decoder = Decoder;
module.exports.dW = dW;
module.exports.dE = dE;
module.exports.dD = dD;
module.exports.dI = dI;
module.exports.getOctetFromPdu = getOctetFromPdu;
module.exports.getOctetFromPduAsString = getOctetFromPduAsString;
module.exports.getSubstringFromPdu = getSubstringFromPdu;
module.exports.toHexString = toHexString;
