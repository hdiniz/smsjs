var Helper = require('./helper.js');
var FieldDef = require('./field_definitions.js');
var Gsm7Bit = require('./gsm7bit.js');
var Mask = Helper.Mask;
var Decoder = Helper.Decoder;
var dW = Helper.dW;
var dE = Helper.dE;
var dD = Helper.dD;
var dI = Helper.dI;
var getOctetFromPdu = Helper.getOctetFromPdu;
var getSubstringFromPdu = Helper.getSubstringFromPdu;
var getOctetFromPduAsString = Helper.getOctetFromPduAsString;
var toHexString = Helper.toHexString;

var UCS2 = {
	decode: function(psu, sms) {
	}
}

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

var AddressField = {
	decode: function(pdu, sms) {
		var Pdu = pdu;
		var cursor = 0;
		var isSmsc = sms.SMSC === undefined;
		var getNextOctet = function() {
			var a = Pdu.substr(Cursor, 2);
			Cursor = Cursor + 2;
			return !!a ? parseInt(a, 16) : null;
		}
		
		var length = getOctetFromPdu(pdu, cursor++);
		dI('Address length field: ' + length + ', isSmsc: ' + isSmsc);
		if (length <= 0) {
			if (!isSmsc) cursor++;
			return {consumed: cursor, result: {}};
		}
		
		var tp = getOctetFromPdu(pdu, cursor++);
		var type = FieldDef.TypeOfAddress.findValue(tp);
		if (type === null) {
			return {consumed: cursor, result: {}};
		}
		
		var plan = FieldDef.NumberingPlanIdentification.findValue(tp);
		if (plan === null) {
			return {consumed: cursor, result: {}};
		}
		
		var address = '';
		if ((tp & 0xF0) == 0xD0) { //Alphanumeric
			dI('Address type field is alphanumeric');
			var gsmtxt = Gsm7Bit.decodeSemiOctets(Pdu.substring(cursor*2), length);
			address = gsmtxt.result.Value;
			cursor += gsmtxt.consumed;	
		} else {
			var octets = Math.floor(length/2) + length % 2;
			if (isSmsc) {
				octets = length - 1;
			}
			for (var i = 0; i < octets; i++) {
				 var octet = getOctetFromPdu(pdu, cursor++).toString(16);
				 if (octet.length == 1) {
					octet = '0' + octet;
				 }
				 var semione = octet.substring(0,1);
				 var semitwo = octet.substring(1,2);
				 address += semitwo;
				 if (parseInt(semione, 16) != 0x0F) {
					address += semione;
				 }
			}
		}
		var data = getSubstringFromPdu(pdu, cursor);
		
		return {consumed: cursor, result: {Value: {Address: address, Type: type, Plan: plan}, Data: data}};
	}
}

var ProtocolIdentifier = { 
	decode: function(pdu, sms) {
		var cursor = 0;
		if (sms['TP-PI'] !== undefined && !sms['TP-PI'].Value.PID) {
			dI('Skiping TP-PID as indicated by TP-PI');
			return {consumed: 0, result: {}};
		}
		var pid = getOctetFromPduAsString(pdu, cursor++);
		var value = FieldDef.ProtocolIdentifier.findValue(pid);
		return {consumed: cursor, result: {Value: value, Data: pid}};
	}
}

var DcsGeneralDataCodingIndication = function(par) {
	var msgcls = FieldDef.DataCodingScheme.MessageClass.findValue(par);
	var hascls = (par & 0x10) == 0x10;
	var hascmp = (par & 0x20) == 0x20;
	var mrkdel = (par & 0xC0) == 0x40;
	
	return { 
		Value: {
			Class: hascls ? msgcls : 'No class',
			CharSet: FieldDef.DataCodingScheme.CharacterSet.findValue(par),
			Compression: hascmp,
			MarkedForDeletion: mrkdel
		},
		Data: par
	};
}
var DcsReservedCodingGroup = function(par) {
	return {Value: 'Reserved coding group', Data: par};
}
var DcsMessageWaitingIndicationGroup = function(par) {
	var ucs2 = (par & 0xF0) == 0xE0;
	var discard = (par & 0xF0) == 0xC0;
	var active = (par & 0x08) == 0x08;
	
	var result = {Value: {}, Data: par};
	result.Value.CharSet = ucs2 ? 'UCS2 (16bit)' : 'GSM 7 bit default alphabet'
	result.Value.Type = discard ? 'Discard' : 'Store';
	result.Value.Indication = active ? 'Active' : 'Inactive';
	result.Value.IndicationType = FieldDef.DataCodingScheme.IndicationType.findValue(par);
	
	return result;
}
var DcsCodingMessageClass = function(par) {
	var result = {Value: {}, Data: par};
	result.Value.CharSet = FieldDef.DataCodingScheme.CharacterSet.findValue(par);
	result.Value.Class = FieldDef.DataCodingScheme.MessageClass.findValue(par);
	return result;
}
var DataCodingScheme = {
	Decoder: new Decoder('0x00', '0xF0', [ 
		new Decoder('0x00', DcsGeneralDataCodingIndication),
		new Decoder('0x40-0xB0', DcsReservedCodingGroup),
		new Decoder('0xC0-0xE0', DcsMessageWaitingIndicationGroup),
		new Decoder('0xF0', DcsCodingMessageClass)
	]),
	decode: function(pdu, sms) {
		var cursor = 0;
		if (sms['TP-PI'] !== undefined && !sms['TP-PI'].Value.DCS) {
			dI('Skiping TP-DCS as indicated by TP-PI');
			return{consumed: 0, result: {}};
		}
		
		var dcs = getOctetFromPduAsString(pdu, cursor++);
		return {consumed: cursor, result: DataCodingScheme.Decoder.decode(dcs)};	
	}
}

var IntegerField = {
	decode: function(pdu) {
		cursor = 0;
		var mr = getOctetFromPduAsString(pdu, cursor++);
		return {consumed: cursor, result: {Value: mr, Data: mr}};
	}
}

var TimestampField = {
	decode: function(pdu) {
		cursor = 0;
		var result = {};
		result.Value = {};
		result.Data = '';
		
		var fields = ['Year', 'Month', 'Day', 'Hour', 'Minute', 'Second'];
		var values = [];
		for (var i = 0; i < fields.length; i++) {
			values[i] = getOctetFromPduAsString(pdu, cursor++);
			result.Value[fields[i]] = values[i].substr(1,1) + values[i].substr(0,1);
		}
		
		var zone = getOctetFromPduAsString(pdu, cursor++);
		var negative = (parseInt(zone, 16) & 0x08) == 0x08;
		zone = (parseInt(zone, 16) & 0xF7).toString(16);
		
		var timezone = (zone.substr(1,1) + zone.substr(0,1)) / 4;
		if (negative) timezone *= -1;
		
		result.Value.Timezone = timezone;
		result.Data = getSubstringFromPdu(pdu, cursor);
		return {consumed: cursor, result: result};
	}
}

var ValidityPeriodField = {
	decode: function(pdu, sms) {
		var vpf = sms['TP-VPF'].Data;
		if (vpf == '00') {
			return {consumed: 0, result: {Value: 'Not present', Data: null}};
		} 
		var vp;
		if (vpf == '10') { //relative
			var time;
			vp = parseInt(IntegerField.decode(pdu).result.Data, 16);
			if (vp >= 0 && vp <= 143) {
				time = (vp + 1) * 5; //minutes
			} else if (vp >= 144 && vp <= 167) {
				time = 12*60 + (vp - 143)*30; //minutes
			} else if (vp >= 168 && vp <= 196) {
				time = (vp - 166) * 24 *60; //minutes
			} else if (vp >= 197 && vp <= 255) {
				time = (vp - 192) * 7 * 24 * 60; //minutes
			}
			return {consumed: 1, result: {Value: time, Data: toHexString(vp)}};
		} else if (vpf == '08') { //absolute
			return TimestampField.decode(pdu);
		} else if (vpf == '18') { //enhanced
			dI('Enhanced timestamp not supported');
			vp = pdu.substr(0, 7*2);
			return {consumed: 7, result: {Value: 'Not supported', Data: toHexString(vp)}};
		}
	}
}

var UnsupportedField = {
	decode: function() {
		return {consumed: 0, result: {Value: 'Not supported', Data: null}};
	}
}

var FailureCauseField = {
	decode: function(pdu) {
		var cursor = 0;
		var fcs = getOctetFromPdu(pdu, cursor++);
		var value = FieldDef.FailureCause.findValue(fcs);
		return {consumed: cursor, result: {Value: value, Data: fcs}};
		
	}
}

var StatusField = {
	decode: function(pdu) {
		var cursor = 0;
		var st = getOctetFromPdu(pdu, cursor++);
		var value = FieldDef.Status.findValue(st);
		return {consumed: cursor, result: {Value: value, Data: st}};
	}
}

var ParameterIndicatorField = {
	decode: function(pdu) {
		var cursor = 0;

		var pi = getOctetFromPdu(pdu, cursor++);
		var multipi = (pi & 0x80) == 0x80
		
		if (multipi) {
			dD('The is more than one TP-PI, not supported');
		}
		
		var udl = (pi & 0x04) == 0x04;
		var dcs = (pi & 0x02) == 0x02;
		var pid = (pi & 0x01) == 0x01;
		
		return {consumed: cursor, result: {Value: {UDL: udl, DCS: dcs, PID: pid}, Data: pi}};
	}
}

var UserDataField = {
	
	decode: function(pdu, sms) {
		var cursor = 0;
		
		if (sms['TP-PI'] !== undefined && !sms['TP-PI'].Value.UDL) {
			dI('Skiping TP-UD as indicated by TP-PI');
			return {consumed: 0, result: {}};
		}
	
		dI('Parsing User Data');
	
		var udhi = sms['TP-UDHI'].Data == '40';
		var udl = sms['TP-UDL'].Data;
		var charset = sms['TP-DCS'].Value.CharSet;
		if (charset == null || charset === undefined) {
			charset = 'GSM 7 bit default alphabet';
		}
		
		var udh = {};
		if (udhi) {
			dI('UDH present');
			udh = UserDataField.decodeUDH(pdu, sms);
			cursor += udh.consumed;
		}
		
		var ud = {consumed: 0}
		if (charset == 'GSM 7 bit default alphabet') {
			dI('Decoding User Data as GSM 7 Bit alphabet');
			ud = Gsm7Bit.decodeSeptets(pdu, udl, udh);
		} else if (charset == '8 bit data') {
			dI('Decoding User Data as 8 bit data');
			if (udh.result.Value.DestPort != undefined && udh.result.Value.DestPort == 2948) {
				dI('Destination port is WSP Push Port, decoding as Wap Push');
				dI('Wap push decoding not implemented');
			}
		} else if (charset == 'UCS2 (16bit)') {
			dI('Decoding User Data as UCS2 (16 bit)');
		} else {
		}
		
		cursor += ud.consumed;
		ud = ud.result;
		udh = udh.result;
		return {consumed: cursor, result: {Value:{UD:ud, UDH: udh}, Data: pdu}};
		
	},
	
	decodeUDH: function(pdu, sms) {
		var Pdu = pdu;
		var cursor = 0;

		var udhLength = getOctetFromPdu(pdu, cursor++);
		dI('UDH Length: ' + udhLength);
		if (udhLength <= 0) {
			return {consumed: Cursor, result: {}};
		}
		
		var result = {IE: []};
		while ((cursor-1) < udhLength) {
			var ieId = getOctetFromPdu(pdu, cursor++);
			var ieLength = getOctetFromPdu(pdu, cursor++);
			var ieData = '';
			if (ieLength > 0) {
				for (var j = 0; j < ieLength; j++) { 
					ieData += getOctetFromPduAsString(pdu, cursor++);
				}
				
				dI('Found Information Element: ' + ieId.toString(16) + ', Length: ' + ieLength.toString(16) + ', Data: ' + ieData.toString(16));
				
				if (ieId == 0x04) { //Port addressing 8bit
					result.DestPort = parseInt(ieData.substr(0, 2), 16);
					result.OrigPort =parseInt(ieData.substr(2, 2), 16);
					dI('8 bit port addressing, dest: ' + result.DestPort + ', orig: ' + result.OrigPort);
				} else if (ieId == 0x05) { //Port addressing 16bit
					result.DestPort = parseInt(ieData.substr(0, 4), 16);
					result.OrigPort = parseInt(ieData.substr(4, 4), 16);
					dI('16 bit port addressing, dest: ' + result.DestPort + ', orig: ' + result.OrigPort);
				}
				
				if (ieId == 0x00) { //8bit concatenated message
					result.ConcatMsgReference = ieData.substr(0,2);
					result.TotalConcatMsgs = ieData.substr(2, 2);
					result.ConcatMsgSeqNumber = ieData.substr(4, 2);
					dI('8bit concatenated message, reference: ' + result.ConcatMsgReference + ', total: ' + result.TotalConcatMsgs + ', sequence: ' + result.ConcatMsgSeqNumber);
				} else if (ieId == 0x08) { //16bit concatenated message
					result.ConcatMsgReference = ieData.substr(0,4);
					result.TotalConcatMsgs = ieData.substr(4, 2);
					result.ConcatMsgSeqNumber = ieData.substr(6, 2);
					dI('16bit concatenated message, reference: ' + result.ConcatMsgReference + ', total: ' + result.TotalConcatMsgs + ', sequence: ' + result.ConcatMsgSeqNumber);
				}
			}
			result.IE.push({ID: toHexString(ieId), Length: ieLength, Data: ieData, Description: FieldDef.InformationElements.findValue(ieId)});
			
		}
		return {consumed: cursor, result: {Value: result, Data: getSubstringFromPdu(pdu, cursor)}};
	}
}

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

var FieldDecoders = {
	'TP-DA': {
		decode: AddressField.decode
	},
	'TP-OA': {
		decode: AddressField.decode
	},
	'TP-RA': {
		decode: AddressField.decode
	},
	 'TP-VP': {
		decode: ValidityPeriodField.decode
	},
	 'TP-CT': {
		decode: UnsupportedField.decode
	},
	'TP-MN': {
		decode: IntegerField.decode
	},
	'TP-PID': {
		decode: ProtocolIdentifier.decode
	},
	'TP-DCS': {
		decode: DataCodingScheme.decode
	},
	'TP-SCTS': {
		decode: TimestampField.decode
	},
	'TP-FCS': {
		decode: FailureCauseField.decode
	},
	'TP-MR': {
		decode: IntegerField.decode
	},
	'TP-DT': {
		decode: TimestampField.decode
	},
	'TP-ST': {
		decode: StatusField.decode
	},
	 'TP-PI': {
		decode:ParameterIndicatorField.decode
	},
	'TP-UDL': {
		decode: function(pdu, sms) {
			if (sms['TP-PI'] !== undefined && !sms['TP-PI'].Value.UDL) {
				dI('Skiping TP-UDL as indicated by TP-PI');
				return {consumed: 0, result: {}};
			}
			var res = IntegerField.decode(pdu, sms);
			res.result.Value = parseInt(res.result.Value, 16);
			return res;
		}
	},
	'TP-UD': {
		decode: UserDataField.decode
	},
	'TP-CL': {
		decode: UnsupportedField.decode
	},
	'TP-CD': {
		decode: UnsupportedField.decode
	}
}

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

var SmsDecoder = function() {}

SmsDecoder.prototype.getNextOctet = function () {
	var a = this.Pdu.substr(this.Cursor*2, 2);
    this.Cursor = this.Cursor + 1;
    return !!a ? parseInt(a, 16) : null;
}

SmsDecoder.prototype.decode = function (pdu, direction, hasSmsc, isRpError) {
	this.Cursor = 0;
	this.Pdu = pdu;
	this.Direction = (direction === null || direction === undefined) ? 'Receive' : direction;
	this.hasSmsc = (hasSmsc === null || hasSmsc === undefined) ? true : hasSmsc;
	this.isRpError = (isRpError === null || isRpError === undefined) ? false : isRpError;
	this.Sms = {};
	
	this.decodeSmsc();
	
	var typedef;
	if (this.Direction == 'Send') {
		typedef = FieldDef.SmsSendType;
		dI('SMS direction: Send'); 
	} else {
		typedef = FieldDef.SmsRecvType;
		dI('SMS direction: Receive'); 
	}
	
	var fbyte = this.getNextOctet();
	this.decodeFirstByte(fbyte, typedef);
	
	
	var fielddef = typedef.Fields.findValue(fbyte);
	this.decodeFields(fielddef);
	return this.Sms;
}

SmsDecoder.prototype.decodeSmsc = function() {
	if (this.hasSmsc) {
		dI('Parsing SMSC @ ' + this.Cursor);
		this.Sms.SMSC = AddressField.decode(this.Pdu, true);
		this.Cursor += this.Sms.SMSC.consumed;
		this.Sms.SMSC = this.Sms.SMSC.result;
	} else {
		this.Sms.SMSC = '';
	}
}

SmsDecoder.prototype.decodeFirstByte = function(fbyte, typedef) {
	dI('Parsing first byte: ' + fbyte.toString(16) + ' @ ' + (this.Cursor-1));
	

	var fbytedef = typedef.FirstByteMask.findValue(fbyte);
	for (var i = 0; i < fbytedef.length; i++) {	
		var name = fbytedef[i].Name;
		var field  =  fbytedef[i].Mask.findValue(fbyte);
		var data = field.Data;
		var value = field.Value;
		dI(name + ': ' + data);
		this.Sms[fbytedef[i].Name] = {
			Data: data,
			Value: value
		};
	}
}

SmsDecoder.prototype.decodeFields = function(fielddef) {
	for (var i = 0; i < fielddef.length; i++) {
		var field = fielddef[i];		
		dI('Parsing field: ' + field.Name + ' @ ' + this.Cursor);
		var result = FieldDecoders[field.Name].decode(this.Pdu.substring(this.Cursor*2), this.Sms);
		this.Sms[field.Name] = !!result ? result.result : '';
		this.Cursor += result.consumed;
	}
}

module.exports = SmsDecoder;
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

/*var dec = new SmsDecoder();
//var lol = dec.decode('07911326040000F0040B911346610089F60000208062917314080CC8F71D14969741F977FD07', 'Receive');
var lol = dec.decode('07915591191035005100098199595500F40000FF36050003D90202CAE572B95C2E97E5F93A1A7D369FCFF9F3F98CAEA3D1E8F3F98C46A3D1E8F3F97C46A3CFE7F3F97C3E03', 'Send', true, true);
console.log(lol);
console.log(lol['TP-UD']);
for(var i in lol) {
	console.log(i);
}*/
/*
SMS-DELIVER - WAP PUSH, provisioning - 3 part
07915512499995694009D0437658FEF63FF5411160411532888C0B05040B8423F000031803012506311F2FB6918192443143353142353138463439443944333432363244373137424344363234363542314534434535360081EA030B6A00C54503312E310001C6560187070603506F7274616C20436C61726F000101C6510187150603677072732E736D61727474727573742E636F6D000187070603506F7274616C20436C61
07915512499995694009D0437658FEF63FF5411160411562888C0B05040B8423F00003180302726F0001871C0603687474703A2F2F7761702E636C61726F2E636F6D2E62720001C65201872F060370702D310001872006033230302E3136392E3132362E303131000187210685018722060361702D310001C6530187230603383739390001010101C655018711060361702D310001871006AB0187070603506F7274616C2043
07915512499995694409D0437658FEF63FF541116041157288870B05040B8423F000031803036C61726F0001870806037761702E636C61726F2E636F6D2E627200018709068901C65A01870C069A01870D0603636C61726F0001870E0603636C61726F00010101C600015501873606037732000187070603506F7274616C20436C61726F000187390603677072732E736D61727474727573742E636F6D00010101
*/
/*
SMS-SUBMIT - 7bit alphabet - 1 part
07915591191035001100098199595500f40000ff0ad3f61c34af8bdb693a
*/
/*
SMS-SUBMIT - 7bit alphabet - 1 part - VP 1 hora
07915591191035001100098199595500f400000b10d3f61c34af8bdb693a28867ecbc3
*/
/*
SMS-SUBMIT - 7bit alphabet - 1 part - ask delivery report
07915591191035003100098199595500f40000ff16d3f6bc35af8bdb693ae8fe0291cbecb4bd2ccf03
*/
/*
SMS-STATUS-REPORT - /\
079155111910601206D5098199595500F4412192313402884121923134328800
*/
/*
SMS-SUBMIT - 7bit alphabet - 1 part - ask delivery report - numero invalido 079155911910350031000d81997868454386f80000ff15ce7abb2c7f83d2ee303b4d8683e675713b4d07
*/
/*
SMS-STATUS-REPORT - /\ - claro - status - vp expired??
079155111910601206D60D81997868454386F8412192316493884121923164938846
*/

/*
SMS-DELIVER - 7bit alphabet - 1 part
0791550005121452240D91551199595500F40000412192413014880BD3F6BC452EB3D3F6B21C
*/

/*
SMS-SUBMIT - ucs2 - 1 part
07915591191035003100098199595500f40008ff0c0055007300630032002000e7
*/

/*
SMS-SUBMIT - 7bit - 2 part
07915591191035005100098199595500F40000FF36050003D90202CAE572B95C2E97E5F93A1A7D369FCFF9F3F98CAEA3D1E8F3F98C46A3D1E8F3F97C46A3CFE7F3F97C3E03
*/