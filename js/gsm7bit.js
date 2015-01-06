var Helper = require('./helper.js');
var dW = Helper.dW;
var dE = Helper.dE;
var dD = Helper.dD;
var dI = Helper.dI;
var Mask = Helper.Mask;
var getOctetFromPdu = Helper.getOctetFromPdu;
var getSubstringFromPdu = Helper.getSubstringFromPdu;

var DefaultAlphabet = new Mask('0x00', '0x7F', [
	new Mask('0x00', '@'),
	new Mask('0x01', '£'),
	new Mask('0x02', '$'),
	new Mask('0x03', '¥'),
	new Mask('0x04', 'è'),
	new Mask('0x05', 'é'),
	new Mask('0x06', 'ù'),
	new Mask('0x07', 'ì'),
	new Mask('0x08', 'ò'),
	new Mask('0x09', 'Ç'),
	new Mask('0x0A', '\n'), // Line Feed
	new Mask('0x0B', 'Ø'),
	new Mask('0x0C', 'ø'),
	new Mask('0x0D', '\r'), // Carriage Return
	new Mask('0x0E', 'Å'),
	new Mask('0x0F', 'å'),
	new Mask('0x10', 'Δ'),
	new Mask('0x11', '_'),
	new Mask('0x12', 'Φ'),
	new Mask('0x13', 'Γ'),
	new Mask('0x14', 'Λ'),
	new Mask('0x15', 'Ω'),
	new Mask('0x16', 'Π'),
	new Mask('0x17', 'Ψ'),
	new Mask('0x18', 'Σ'),
	new Mask('0x19', 'Θ'),
	new Mask('0x1A', 'Ξ'),
	new Mask('0x1B', 'ESCAPE'), // Escape character
	new Mask('0x1C', 'Æ'),
	new Mask('0x1D', 'æ'),
	new Mask('0x1E', 'ß'),
	new Mask('0x1F', 'É'),
	new Mask('0x20', ' '),
	new Mask('0x21', '!'),
	new Mask('0x22', '"'),
	new Mask('0x23', '#'),
	new Mask('0x24', '¤'),
	new Mask('0x25', '%'),
	new Mask('0x26', '&'),
	new Mask('0x27', '\''),
	new Mask('0x28', '('),
	new Mask('0x29', ')'),
	new Mask('0x2A', '*'),
	new Mask('0x2B', '+'),
	new Mask('0x2C', ','),
	new Mask('0x2D', '-'),
	new Mask('0x2E', '.'),
	new Mask('0x2F', '/'),
	new Mask('0x30', '0'),
	new Mask('0x31', '1'),
	new Mask('0x32', '2'),
	new Mask('0x33', '3'),
	new Mask('0x34', '4'),
	new Mask('0x35', '5'),
	new Mask('0x36', '6'),
	new Mask('0x37', '7'),
	new Mask('0x38', '8'),
	new Mask('0x39', '9'),
	new Mask('0x3A', ':'),
	new Mask('0x3B', ';'),
	new Mask('0x3C', '<'),
	new Mask('0x3D', '='),
	new Mask('0x3E', '>'),
	new Mask('0x3F', '?'),
	new Mask('0x40', '¡'),
	new Mask('0x41', 'A'),
	new Mask('0x42', 'B'),
	new Mask('0x43', 'C'),
	new Mask('0x44', 'D'),
	new Mask('0x45', 'E'),
	new Mask('0x46', 'F'),
	new Mask('0x47', 'G'),
	new Mask('0x48', 'H'),
	new Mask('0x49', 'I'),
	new Mask('0x4A', 'J'),
	new Mask('0x4B', 'K'),
	new Mask('0x4C', 'L'),
	new Mask('0x4D', 'M'),
	new Mask('0x4E', 'N'),
	new Mask('0x4F', 'O'),
	new Mask('0x50', 'P'),
	new Mask('0x51', 'Q'),
	new Mask('0x52', 'R'),
	new Mask('0x53', 'S'),
	new Mask('0x54', 'T'),
	new Mask('0x55', 'U'),
	new Mask('0x56', 'V'),
	new Mask('0x57', 'W'),
	new Mask('0x58', 'X'),
	new Mask('0x59', 'Y'),
	new Mask('0x5A', 'Z'),
	new Mask('0x5B', 'Ä'),
	new Mask('0x5C', 'Ö'),
	new Mask('0x5D', 'Ñ'),
	new Mask('0x5E', 'Ü'),
	new Mask('0x5F', '§'),
	new Mask('0x60', '¿'),
	new Mask('0x61', 'a'),
	new Mask('0x62', 'b'),
	new Mask('0x63', 'c'),
	new Mask('0x64', 'd'),
	new Mask('0x65', 'e'),
	new Mask('0x66', 'f'),
	new Mask('0x67', 'g'),
	new Mask('0x68', 'h'),
	new Mask('0x69', 'i'),
	new Mask('0x6A', 'j'),
	new Mask('0x6B', 'k'),
	new Mask('0x6C', 'l'),
	new Mask('0x6D', 'm'),
	new Mask('0x6E', 'n'),
	new Mask('0x6F', 'o'),
	new Mask('0x70', 'p'),
	new Mask('0x71', 'q'),
	new Mask('0x72', 'r'),
	new Mask('0x73', 's'),
	new Mask('0x74', 't'),
	new Mask('0x75', 'u'),
	new Mask('0x76', 'v'),
	new Mask('0x77', 'w'),
	new Mask('0x78', 'x'),
	new Mask('0x79', 'y'),
	new Mask('0x7A', 'z'),
	new Mask('0x7B', 'ä'),
	new Mask('0x7C', 'ö'),
	new Mask('0x7D', 'ñ'),
	new Mask('0x7E', 'ü'),
	new Mask('0x7F', 'à')
]);

var Gsm7Bit = {
	decodeSemiOctets: function(pdu, semioctets, udh) {
		return Gsm7Bit.decode(pdu, Math.floor(semioctets/2) + semioctets % 2, udh);
	},
	decodeSeptets: function(pdu, septets, udh) {
		return Gsm7Bit.decode(pdu, Math.ceil(septets * 7 / 8), udh);
	},
	decode: function(pdu, length, udh) {
		var cursor = 0;
		var text = '';
		var code = 0;
		var shift = 0;
		var skip = 0;
		
		var addChar = function(character) {
			if (skip-- > 0)	return;
			if (character == null) {
				dE('7bit character not found on Default Table: ' + (code & 0x7F).toString(16));
				character = ' ';
			} else if (character == 'ESCAPE') {
				dI('7bit ESCAPE character found, not supported. Substitute to space');
				character = ' ';
			}
			text += character;
		}
		
		if (udh !== null && udh !== undefined && udh.consumed !== undefined) {
			skip = Math.ceil(8*udh.consumed / 7);
		}
		
		for (var i = 0; i < length; i++) {
			var octet = getOctetFromPdu(pdu, cursor++);
			code = code + (octet << shift);
			shift++;
			var chr = DefaultAlphabet.findValue(code & 0x7F);
			addChar(chr);
			code = code >> 7;
			if (shift == 7) {
				chr = DefaultAlphabet.findValue(code & 0x7F);
				addChar(chr);
				shift = 0;
				code = 0;
			}
		}
		return {consumed: cursor, result: {Value: text, Data: getSubstringFromPdu(pdu, cursor)}};
	}
}


module.exports = Gsm7Bit;