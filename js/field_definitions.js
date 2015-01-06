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