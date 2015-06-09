require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/field_definitions.js":[function(require,module,exports){
var Helper = require('./helper.js');
var Mask = Helper.Mask;
var Decoder = Helper.Decoder;

var TypeOfAddress = new Mask('0x00', '0xF0', [
	new Mask('0x80', 'Unknown'),
	new Mask('0x90', 'International number'),
	new Mask('0xA0', 'National number'),
	new Mask('0xB0', 'Network specific number'),
	new Mask('0xC0', 'Subscriber number'),
	new Mask('0xD0', 'Alphanumeric - coded according to TS 23.038'),
	new Mask('0xE0', 'Abreviated number'),
	new Mask('0xF0', 'Reserved for extension')
]);

var NumberingPlanIdentification = new Mask('0x00', '0x0F', [
		new Mask('0x00', 'Unknown'),
		new Mask('0x01', 'ISDN/telephone numbering plan'),
		new Mask('0x03', 'Data numbering plan'),
		new Mask('0x04', 'Telex numbering plan'),
		new Mask('0x05', 'Service Centre Specific plan'),
		new Mask('0x06', 'Service Centre Specific plan'),
		new Mask('0x08', 'National numbering plan'),
		new Mask('0x09', 'Private numbering plan'),
		new Mask('0x0A', 'ERMES numbering plan'),
		new Mask('0x0F', 'Reserved for extension')
]);

var ProtocolIdentifier = new Mask('0x00', '0xC0', [
	new Mask('0x00', '0x20', [
		new Mask('0x00', 'SME-to-SME protocol'),
		new Mask('0x20', '0x1F', [
			new Mask('0x00', 'implicit - device type is specific to this SC, or can be concluded on the basis of the address'),
			new Mask('0x01', 'telex (or teletex reduced to telex format)'),
			new Mask('0x02', 'group 3 telefax'),
			new Mask('0x03', 'group 4 telefax'),
			new Mask('0x04', 'voice telephone (i.e. conversion to speech)'),
			new Mask('0x05', 'ERMES (European Radio Messaging System)'),
			new Mask('0x06', 'National Paging system (known to the SC)'),
			new Mask('0x07', 'Videotex (T.100/T.101)'),
			new Mask('0x08', 'teletex, carrier unspecified'),
			new Mask('0x09', 'teletex, in PSPDN'),
			new Mask('0x0A', 'teletex, in CSPDN'),
			new Mask('0x0B', 'teletex, in analog PSTN'),
			new Mask('0x0C', 'teletex, in digital ISDN'),
			new Mask('0x0D', 'UCI (Universal Computer Interface, ETSI DE/PS 3 01-3)'),
			new Mask('0x0E-0x0F', '(reserved, 2 combinations)'),
			new Mask('0x10', 'a message handling facility (known to the SC)'),
			new Mask('0x11', 'any public X.400-based message handling system'),
			new Mask('0x12', 'Internet Electronic Mail'),
			new Mask('0x13-0x17', '(reserved, 5 combinations)'),
			new Mask('0x18-0x1E', 'values specific to each SC, usage based on mutual agreement between the SME and the SC (7 combinations available for each SC)'),
			new Mask('0x1F', 'A GSM mobile station. The SC converts the SM from the received TP-Data-Coding-Scheme to any data coding scheme supported by that MS (e.g. the default).')
		])
	]),
	new Mask('0x40', '0x3F', [
		new Mask('0x00', 'Short Message Type 0'),
		new Mask('0x01', 'Replace Short Message Type 1'),
		new Mask('0x02', 'Replace Short Message Type 2'),
		new Mask('0x03', 'Replace Short Message Type 3'),
		new Mask('0x04', 'Replace Short Message Type 4'),
		new Mask('0x05', 'Replace Short Message Type 5'),
		new Mask('0x06', 'Replace Short Message Type 6'),
		new Mask('0x07', 'Replace Short Message Type 7'),
		new Mask('0x08-0x1E', 'Reserved'),
		new Mask('0x1F', 'Return Call Message'),
		new Mask('0x20-0x3C', 'Reserved'),
		new Mask('0x3D', 'ME Data download'),
		new Mask('0x3E', 'ME De-personalization Short Message'),
		new Mask('0x3F', 'SIM Data download ')
	]),
	new Mask('0x80', 'Reserved'),
	new Mask('0xC0', 'SC specific use')
]);

var FailureCause = new Mask('0x00', '0xFF', [
	new Mask('0x00-0x7F', 'Reserved'),
	new Mask('0x80-0x8F', 'TP-PID errors'),
	new Mask('0x80', 'Telematic interworking not supported'),
	new Mask('0x81', 'Short message Type 0 not supported'),
	new Mask('0x82', 'Cannot replace short message'),
	new Mask('0x83-0x8E', 'Reserved'),
	new Mask('0x8F', 'Unspecified TP-PID error'),

	new Mask('0x90-0x9F', 'TP-DCS errors'),
	new Mask('0x90', 'Data coding scheme (alphabet) not supported'),
	new Mask('0x91', 'Message class not supported'),
	new Mask('0x92-0x9E', 'Reserved'),
	new Mask('0x9F', 'Unspecified TP-DCS error'),

	new Mask('0xA0-0xAF', 'TP-Command Errors'),
	new Mask('0xA0', 'Command cannot be actioned'),
	new Mask('0xA1', 'Command unsupported'),
	new Mask('0xA2-0xAE', 'Reserved'),
	new Mask('0xAF ', 'Unspecified TP-Command error'),

	new Mask('0xB0', 'TPDU not supported'),
	new Mask('0xB1 - BF', 'Reserved'),
	new Mask('0xC0', 'SC busy'),
	new Mask('0xC1', 'No SC subscription'),
	new Mask('0xC2', 'SC system failure'),
	new Mask('0xC3', 'Invalid SME address'),
	new Mask('0xC4', 'Destination SME barred'),
	new Mask('0xC5', 'SM Rejected-Duplicate SM'),
	new Mask('0xC6', 'TP-VPF not supported'),
	new Mask('0xC7', 'TP-VP not supported'),
	new Mask('0xC8-0xCF', 'Reserved'),

	new Mask('0xD0', 'SIM SMS storage full'),
	new Mask('0xD1', 'No SMS storage capability in SIM'),
	new Mask('0xD2', 'Error in MS'),
	new Mask('0xD3', 'Memory Capacity Exceeded'),
	new Mask('0xD4', 'SIM Application Toolkit Busy'),
	new Mask('0xD5', 'SIM data download error'),
	new Mask('0xD6-0xDF', 'Reserved'),

	new Mask('0xE0-0xFE', 'Values specific to an application'),
	new Mask('0xFF', 'Unspecified error cause')
]);

var Status = new Mask('0x00', '0x80', [
	new Mask('0x00', '0x7F', [
		//Short message transaction completed 
		new Mask('0x00', 'Short message received by the SME'),
		new Mask('0x01', 'Short message forwarded by the SC to the SME but the SC is unable to confirm delivery'),
		new Mask('0x02', 'Short message replaced by the SC'),
		//Reserved values
		new Mask('0x03-0x0F', 'Reserved'),
		new Mask('0x10-0x1F', 'Values specific to each SC'),
		//Temporary error, SC still trying to transfer SM
		new Mask('0x20', 'Congestion'),
		new Mask('0x21', 'SME busy'),
		new Mask('0x22', 'No response from SME'),
		new Mask('0x23', 'Service rejected'),
		new Mask('0x24', 'Quality of service not available'),
		new Mask('0x25', 'Error in SME'),
		new Mask('0x26-2F', 'Reserved'),
		new Mask('0x30-3F', 'Values specific to each SC'),
		//Permanent error, SC is not making any more transfer attempts
		new Mask('0x40', 'Remote procedure error'),
		new Mask('0x41', 'Incompatible destination'),
		new Mask('0x42', 'Connection rejected by SME'),
		new Mask('0x43', 'Not obtainable'),
		new Mask('0x44', 'Quality of service not available'),
		new Mask('0x45', 'No interworking available'),
		new Mask('0x46', 'SM Validity Period Expired'),
		new Mask('0x47', 'SM Deleted by originating SME'),
		new Mask('0x48', 'SM Deleted by SC Administration'),
		new Mask('0x49', 'SM does not exist (The SM may have previously existed in the SC but the SC no longer has knowledge of it or the SM may never have previously existed in the SC)'),
		new Mask('0x4A-4F', 'Reserved'),
		new Mask('0x50-5F', 'Values specific to each SC'),
		//Temporary error, SC is not making any more transfer attempts 
		new Mask('0x60', 'Congestion'),
		new Mask('0x61', 'SME busy'),
		new Mask('0x62', 'No response from SME'),
		new Mask('0x63', 'Service rejected'),
		new Mask('0x64', 'Quality of service not available'),
		new Mask('0x65', 'Error in SME'),
		new Mask('0x66-69', 'Reserved'),
		new Mask('0x6A-6F', 'Reserved'),
		new Mask('0x70-7F', 'Values specific to each SC')
	]),
	new Mask('0x80', 'Reserved')
]);

var DataCodingScheme = {
	MessageClass: new Mask('0x00', '0x03', [
		new Mask('0x00', 'Class 0'),
		new Mask('0x01', 'Class 1 ME-specific'),
		new Mask('0x02', 'Class 2 (U)SIM specific message'),
		new Mask('0x03', 'Class 3 TE specific (see 3GPP TS 27.005)')
	]),
	CharacterSet: new Mask('0x00', '0x0C', [
		new Mask('0x00', 'GSM 7 bit default alphabet'),
		new Mask('0x04', '8 bit data'),
		new Mask('0x08', 'UCS2 (16bit)'),
		new Mask('0x0C', 'Reserved')
	]),
	IndicationType: new Mask('0x00', '0x03', [
		new Mask('0x00', 'Voicemail Message Waiting'),
		new Mask('0x01', 'Fax Message Waiting'),
		new Mask('0x02', 'Electronic Mail Message Waiting'),
		new Mask('0x03', 'Other Message Waiting')
	])
}

var InformationElements = new Mask('0x00', '0xFF', [
	new Mask('0x00', 'Concatenated short messages, 8-bit reference number'),
	new Mask('0x01', 'Special SMS Message Indication'),
	new Mask('0x02', 'Reserved'),
	new Mask('0x03', 'Value not used to avoid misinterpretation as <LF> character'),
	new Mask('0x04', 'Application port addressing scheme, 8 bit address'),
	new Mask('0x05', 'Application port addressing scheme, 16 bit address'),
	new Mask('0x06', 'SMSC Control Parameters'),
	new Mask('0x07', 'UDH Source Indicator'),
	new Mask('0x08', 'Concatenated short message, 16-bit reference number'),
	new Mask('0x09', 'Wireless Control Message Protocol'),
	new Mask('0x0A', 'Text Formatting'),
	new Mask('0x0B', 'Predefined Sound'),
	new Mask('0x0C', 'User Defined Sound (iMelody max 128 bytes)'),
	new Mask('0x0F', 'Predefined Animation'),
	new Mask('0x0E', 'Large Animation (16*16 times 4 = 32*4 =128 bytes)'),
	new Mask('0x0F', 'Small Animation (8*8 times 4 = 8*4 =32 bytes)'),
	new Mask('0x10', 'Large Picture (32*32 = 128 bytes)'),
	new Mask('0x11', 'Small Picture (16*16 = 32 bytes)'),
	new Mask('0x12', 'Variable Picture'),
	new Mask('0x13', 'User prompt indicator'),
	new Mask('0x14', 'Extended Object'),
	new Mask('0x15', 'Reused Extended Object'),
	new Mask('0x16', 'Compression Control'),
	new Mask('0x17', 'Object Distribution Indicator'),
	new Mask('0x18', 'Standard WVG object'),
	new Mask('0x19', 'Character Size WVG object'),
	new Mask('0x1A', 'Extended Object Data Request Command'),
	new Mask('0x1B-0x1F', 'Reserved for future EMS features (see subclause 3.10'),
	new Mask('0x20', 'RFC 5322 E-Mail Header'),
	new Mask('0x21', 'Hyperlink format element'),
	new Mask('0x22', 'Reply Address Element'),
	new Mask('0x23', 'Enhanced Voice Mail Information'),
	new Mask('0x24', 'National Language Single Shift'),
	new Mask('0x25', 'National Language Locking Shift'),
	new Mask('0x26-6F', 'Reserved for future use'),
	new Mask('0x70-0x7F', 'SIM Toolkit Security Headers'),
	new Mask('0x80-0x9F', 'SME to SME specific use'),
	new Mask('0xA0-0xBF', 'Reserved for future use'),
	new Mask('0xC0-0xDF', 'SC specific use'),
	new Mask('0xE0-0xFF', 'Reserved for future use')
]);

var FirstByte = {

	SMTI: { 
		Name: 'TP-MTI',
		Mask: new Mask('0x00', '0x03', [
			new Mask('0x00', {Data: '00', Value:'SMS-DELIVER-REPORT'}),
			new Mask('0x01', {Data: '01', Value:'SMS-SUBMIT'}),
			new Mask('0x02', {Data: '02', Value:'SMS-COMMAND'}),
			new Mask('0x03', {Data: '02', Value:'Reserved'})
		])
	},
	RMTI: {
		Name: 'TP-MTI',
		Mask: new Mask('0x00', '0x03', [
			new Mask('0x00', {Data: '00', Value:'SMS-DELIVER'}),
			new Mask('0x01', {Data: '01', Value:'SMS-SUBMIT-REPORT'}),
			new Mask('0x02', {Data: '02', Value:'SMS-STATUS-REPORT'}),
			new Mask('0x03', {Data: '02', Value:'Reserved'})
		])
	},

	MMS: {
		Name: 'TP-MMS',
		Mask: new Mask('0x00', '0x04', [
			new Mask('0x00', {Data:'00', Value: 'More messages are waiting'}),
			new Mask('0x04', {Data: '04', Value: 'No more messages are waiting'})
		])
	},

	RD: {
		Name: 'TP-RD',
		Mask: new Mask('0x00', '0x04', [
			new Mask('0x00', {Data: '00', Value:'Instruct the SC to accept an SMS-SUBMIT for an SM still held in the SC which has the same TP-MR and the same TP-DA as a previously submitted SM from the same OA'}),
			new Mask('0x04', {Data: '04', Value:'Instruct the SC to reject an SMS-SUBMIT for an SM still held in the SC which has the same TP-MR and the same TP-DA as a previously submitted SM from the same OA'})
		])
	},

	LP: { 
		Name: 'TP-LP',
		Mask: new Mask('0x00', '0x08', [
			new Mask('0x00', {Data: '00', Value:'The message has not been forwarded and is not a spawned message'}),
			new Mask('0x08', {Data: '08', Value:'The message has either been forwarded or is a spawned message'})
		])
	},

	VPF: { 
		Name: 'TP-VPF',
		Mask: new Mask('0x00', '0x18', [
			new Mask('0x00', {Data: '00', Value:'TP-VP field not present'}),
			new Mask('0x10', {Data: '10', Value:'TP-VP field present - relative format'}),
			new Mask('0x08', {Data: '08', Value:'TP-VP field present - enhanced format'}),
			new Mask('0x18', {Data: '18', Value:'TP-VP field present - absolute format'})
		])
	},

	SRI: { 
		Name: 'TP-SRI',
		Mask: new Mask('0x00', '0x20', [
			new Mask('0x00', {Data:'00', Value:'A status report shall not be returned'}),
			new Mask('0x20', {Data:'20', Value:'A status report shall be returned'})
		])
	},

	SRQ: { 
		Name: 'TP-SRQ',
		Mask: new Mask('0x00', '0x20', [
			new Mask('0x00', {Data:'00', Value:'The SMS-STATUS-REPORT is the result of a SMS-SUBMIT'}),
			new Mask('0x20', {Data:'20', Value:'The SMS-STATUS-REPORT is the result of an SMS-COMMAND e.g. an Enquiry'})
		])
	},

	SRR: { 
		Name: 'TP-SRR',
		Mask: new Mask('0x00', '0x20', [
			new Mask('0x00', {Data: '00', Value:'A status report is not requested'}),
			new Mask('0x20', {Data:'20', Value:'A status report is requested'})
		])
	},

	UDHI: { 
		Name: 'TP-UDHI',
		Mask: new Mask('0x00', '0x40', [
			new Mask('0x00', {Data: '00', Value:'The TP-UD field contains only the short message'}),
			new Mask('0x40', {Data:'40', Value:'The TP-UD field contains a header'})
		])
	},

	RP: { 
		Name: 'TP-RP',
		Mask: new Mask('0x00', '0x80', [
			new Mask('0x00', {Data:'00', Value: 'Reply path is not set in this SMS-SUBMIT/DELIVER'}),
			new Mask('0x80', {Data:'80', Value:'Reply path is set in this SMS-SUBMIT/DELIVER'})
		])
	}
}

var Fields = {
	DA: {
		Name: 'TP-DA'
	},
	OA: {
		Name: 'TP-OA'
	},
	RA: {
		Name: 'TP-RA'
	},
	VP: {
		Name: 'TP-VP'
	},
	CT: {
		Name: 'TP-CT'
	},
	MN: {
		Name: 'TP-MN'
	},
	PID: {
		Name: 'TP-PID'
	},
	DCS: {
		Name: 'TP-DCS'
	},
	SCTS: {
		Name: 'TP-SCTS'
	},
	FCS: {
		Name: 'TP-FCS'
	},
	MR: {
		Name: 'TP-MR'
	},
	DT: {
		Name: 'TP-DT'
	},
	ST: {
		Name: 'TP-ST'
	},
	PI: {
		Name: 'TP-PI'
	},
	UDL: {
		Name: 'TP-UDL'
	},
	UD: {
		Name: 'TP-UD'
	},
	CL: {
		Name: 'TP-CL'
	},
	CD: {
		Name: 'TP-CD'
	}
}

var SmsSendType = { 
	FirstByteMask: new Mask('0x00', '0x03', [
		new Mask('0x00', [				//SMS-DELIVER-REPORT
			FirstByte.SMTI,
			FirstByte.UDHI
		]),	
		new Mask('0x01', [				//SMS-SUBMIT
			FirstByte.SMTI,
			FirstByte.RD,
			FirstByte.VPF,
			FirstByte.RP,
			FirstByte.UDHI,
			FirstByte.SRR
		]),
		new Mask('0x02', [				//SMS-COMMAND
			FirstByte.SMTI,
			FirstByte.SRR,
			FirstByte.UDHI
		]),
		new Mask('0x03', [				//Reserved
			FirstByte.SMTI
		])
	]),
	Fields: new Mask('0x00', '0x03', [
		new Mask('0x00', [				//SMS-DELIVER-REPORT
			Fields.FCS,
			Fields.PI,
			Fields.PID,
			Fields.DCS,
			Fields.UDL,
			Fields.UD
		]),	
		new Mask('0x01', [				//SMS-SUBMIT
			Fields.MR,
			Fields.DA,
			Fields.PID,
			Fields.DCS,
			Fields.VP,
			Fields.UDL,
			Fields.UD
		]),
		new Mask('0x02', [				//SMS-COMMAND
			Fields.MR,
			Fields.PID,
			Fields.CT,
			Fields.MN,
			Fields.DA,
			Fields.CL,
			Fields.CD
		]),
		new Mask('0x03', [				//Reserved
		])
	])
}

var SmsRecvType = {
	FirstByteMask: new Mask('0x00', '0x03', [
		new Mask('0x00', [				//SMS-DELIVER
			FirstByte.RMTI,
			FirstByte.MMS,
			FirstByte.LP,
			FirstByte.RP,
			FirstByte.UDHI,
			FirstByte.SRI
		]),	
		new Mask('0x01', [				//SMS-SUBMIT-REPORT
			FirstByte.RMTI,
			FirstByte.UDHI
		]),
		new Mask('0x02', [				//SMS-STATUS-REPORT
			FirstByte.RMTI,
			FirstByte.UDHI,
			FirstByte.MMS,
			FirstByte.LP,
			FirstByte.SRQ
		]),
		new Mask('0x03', [				//Reserved
			FirstByte.RMTI
		])
	]),
	Fields: new Mask('0x00', '0x03', [
		new Mask('0x00', [				//SMS-DELIVER
			Fields.OA,
			Fields.PID,
			Fields.DCS,
			Fields.SCTS,
			Fields.UDL,
			Fields.UD
		]),	
		new Mask('0x01', [				//SMS-SUBMIT-REPORT
			Fields.FCS,
			Fields.PI,
			Fields.SCTS,
			Fields.PID,
			Fields.DCS,
			Fields.UDL,
			Fields.UD
		]),
		new Mask('0x02', [				//SMS-STATUS-REPORT
			Fields.MR,
			Fields.RA,
			Fields.SCTS,
			Fields.DT,
			Fields.ST,
			Fields.PI,
			Fields.PID,
			Fields.DCS,
			Fields.UDL,
			Fields.UD
		]),
		new Mask('0x03', [				//Reserved
		])
	])
}

module.exports = {
	TypeOfAddress: TypeOfAddress,
	NumberingPlanIdentification: NumberingPlanIdentification,
	ProtocolIdentifier: ProtocolIdentifier,
	FailureCause: FailureCause,
	Status: Status,
	DataCodingScheme: DataCodingScheme,
	InformationElements: InformationElements,
	FirstByte: FirstByte,
	SmsRecvType: SmsRecvType,
	SmsSendType: SmsSendType
}
},{"./helper.js":2}],"/sms.js":[function(require,module,exports){
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
		new Decoder('0x00-0x3F', DcsGeneralDataCodingIndication),
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
		
		var dcs = getOctetFromPdu(pdu, cursor++);
		var result = DataCodingScheme.Decoder.decode(dcs);
		result.Data = toHexString(result.Data);
		return {consumed: cursor, result: result};	
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
		} else if (vpf == '18') { //absolute
			return TimestampField.decode(pdu);
		} else if (vpf == '08') { //enhanced
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
					dI('port addressing, 8 bit dest: ' + result.DestPort + ', orig: ' + result.OrigPort);
				} else if (ieId == 0x05) { //Port addressing 16bit
					result.DestPort = parseInt(ieData.substr(0, 4), 16);
					result.OrigPort = parseInt(ieData.substr(4, 4), 16);
					dI('port addressing, 16bit dest: ' + result.DestPort + ', orig: ' + result.OrigPort);
				}
				
				if (ieId == 0x00) { //8bit concatenated message
					result.ConcatMsgReference = ieData.substr(0,2);
					result.TotalConcatMsgs = ieData.substr(2, 2);
					result.ConcatMsgSeqNumber = ieData.substr(4, 2);
					dI('concatenated message, 8bit reference: ' + result.ConcatMsgReference + ', total: ' + result.TotalConcatMsgs + ', sequence: ' + result.ConcatMsgSeqNumber);
				} else if (ieId == 0x08) { //16bit concatenated message
					result.ConcatMsgReference = ieData.substr(0,4);
					result.TotalConcatMsgs = ieData.substr(4, 2);
					result.ConcatMsgSeqNumber = ieData.substr(6, 2);
					dI('concatenated message, 16bit reference: ' + result.ConcatMsgReference + ', total: ' + result.TotalConcatMsgs + ', sequence: ' + result.ConcatMsgSeqNumber);
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
	this.Sms.FirstByte = toHexString(fbyte);
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

//var dec = new SmsDecoder();
//var lol = dec.decode('07915512499995694009D0437658FEF63FF5411160411511888C0B05040B8423F00003C903025201872F060370702D310001872006033230302E3136392E3132362E303130000187210685018722060361702D310001C6530187230603383739390001010101C655018711060361702D310001871006AB0187070603436C61726F20466F746F0001870806036D6D732E636C61726F2E636F6D2E627200018709068901C65A01', 'Receive', true, false);
//console.log(lol);

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

},{"./field_definitions.js":"/field_definitions.js","./gsm7bit.js":1,"./helper.js":2}],1:[function(require,module,exports){
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
		if (isNaN(semioctets) && semioctets !== null && semioctets !== undefined) {
			semioctets = parseInt(semioctets, 16);
		}
		return Gsm7Bit.decode(pdu, Math.floor(semioctets/2) + semioctets % 2, udh);
	},
	decodeSeptets: function(pdu, septets, udh) {
		if (isNaN(septets) && septets !== null && septets !== undefined) {
			septets = parseInt(septets, 16);
		}
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
			dI('Gsm7Bit.decode(): skipping ' + skip + ' due to udh');
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
		dI('Gsm7Bit.decode():');
		dI(text);
		return {consumed: cursor, result: {Value: text, Data: getSubstringFromPdu(pdu, cursor)}};
	}
}


module.exports = Gsm7Bit;
},{"./helper.js":2}],2:[function(require,module,exports){
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var dW = function(m) {
	if (document !== undefined && document.getElementById("console") !== null && document.getElementById("console") !== undefined) {
		document.getElementById("console").value += m + '\n';
	}
	console.warning(m);
}

var dE = function(m) {
	if (document !== undefined && document.getElementById("console") !== null && document.getElementById("console") !== undefined) {
		document.getElementById("console").value += m + '\n';
	}
	console.error(m);
}

var dD = function(m) {
	if (document !== undefined && document.getElementById("console") !== null && document.getElementById("console") !== undefined) {
		document.getElementById("console").value += m + '\n';
	}
	console.error(m);
}

var dI = function(m) {
	if (document !== undefined && document.getElementById("console") !== null && document.getElementById("console") !== undefined) {
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

},{}]},{},[]);
