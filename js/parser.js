$(document).ready ( function(){
        $('[data-toggle="tooltip"]').tooltip();
})
doStuff = function() {
        $('#outputtable #outputtablefields').empty();
        $('#console').val('');

        $('#userdataheader').hide();
        $('#userdatatableheader').hide();
        $('#userdatatableheader #userdataheaderfields').empty();
        $('#userdata').hide();
        $('#userdatatable').hide();
        $('#userdatatable #userdatafields').empty();
        
        
        //Get input PDU & decode
        //var s = document.getElementById("smspdu").value;
        var SmsDecoder = require('/sms.js');
        var FieldDef = require('/field_definitions.js');
        
        var pdu = $('#smspdu').val();
        var smsdirection = document.getElementById('smsdirection').selectedIndex == 0 ? 'Receive' : 'Send';
        var containSmsc = document.getElementById('pducontainssmsc').selectedIndex == 0 ? true : false;
        var isFromRpError = document.getElementById('pdufromrperror').selectedIndex == 0 ? false : true;
        
        var dec = new SmsDecoder();
        var lol = dec.decode(pdu, smsdirection, containSmsc, isFromRpError);
        console.log(lol);
        //If SMSC, add SMSC
        
        if(containSmsc) {
                $("#outputtable tbody").append('<tr id="SMSC"><td class="col-md-1"><b>SMSC</b></td><td class="tdvalue col-md-9">' + lol['SMSC'].Value + '</td><td class="col-md-2 tddata">' + lol['SMSC'].Data + '</td></tr>');
                var smscvalue = lol['SMSC'].Value;
                if (typeof smscvalue === 'object') {
                        $('tr#SMSC td.tdvalue').empty();
                        var smsctable = '<table class="table table-hover table-bordered"><tbody>';
                        for (var j in smscvalue) {
                                smsctable += '<tr><td class="col-md-1"><b>' + j + '</b></td><td>' + smscvalue[j] + '</td></tr>';
                        }
                        smsctable += '</tbody></table>';
                        $('tr#SMSC td.tdvalue').append($(smsctable));
                }
        }
        
        var smstype = smsdirection == 'Receive' ? FieldDef.SmsRecvType : FieldDef.SmsSendType;
        
        //Get only First Byte fields		
        var firstbytedef = smstype.FirstByteMask.findValue(lol['TP-MTI'].Data);
        for (var i in firstbytedef) {
                $("#outputtable #outputtablefields").append('<tr id=' + firstbytedef[i].Name + '><td class="col-md-1"><b>' + firstbytedef[i].Name + '</b></td><td class="tdvalue col-md-9">' + lol[firstbytedef[i].Name].Value + '</td><td class="col-md-2 tddata">' + lol[firstbytedef[i].Name].Data + '</td></tr>');
        }
        
        //Get other fields, except User Data
        var fielddef = smstype.Fields.findValue(lol['TP-MTI'].Data);
        for (var i in fielddef) {
                if (lol[fielddef[i].Name] === undefined || lol[fielddef[i].Name] === null) continue;
                if (fielddef[i].Name == 'TP-UD') continue;
                $("#outputtable #outputtablefields").append('<tr id=' + fielddef[i].Name + '><td class="col-md-1"><b>' + fielddef[i].Name + '</b></td><td class="tdvalue col-md-9">' + lol[fielddef[i].Name].Value + '</td><td class="col-md-2 tddata">' + lol[fielddef[i].Name].Data + '</td></tr>');
                var valueobject = lol[fielddef[i].Name].Value;
                if (typeof valueobject === 'object') {
                        $('tr#' + fielddef[i].Name + ' td.tdvalue').empty();
                        var table = '<table class="table table-hover table-bordered"><tbody>';
                        for (var j in valueobject) {
                                table += '<tr><td class="col-md-1"><b>' + j + '</b></td><td>' + valueobject[j] + '</td></tr>';
                        }
                        table += '</tbody></table>';
                        $('tr#' + fielddef[i].Name + ' td.tdvalue').append($(table));
                }
        }
        
        //If User Data Header
        if(lol['TP-UDHI'].Data == '40') {	
                
                var IEs = lol['TP-UD'].Value.UDH.Value.IE;
                console.log( lol['TP-UD'].Value.UDH);
                for (var i in IEs) {
                        $("#userdataheadertable #userdataheaderfields").append('<tr><td class="col-md-1"><b>' + IEs[i].ID + '</b></td><td class="tdvalue col-md-9">' + IEs[i].Description + '</td><td class="col-md-2 tddata">' + IEs[i].Data + '</td></tr>');
                }
                $('td#userdataheaderlength').html(lol['TP-UD'].Value.UDH.Data.length / 2 - 1);
                $('td#userdataheaderdata').html(lol['TP-UD'].Value.UDH.Data);
                $('#userdataheader').show();
                $('#userdataheadertable').show();
        }
        //If User Data
        if(lol['TP-UDL'].Value > 0) {
            $('td#userdatadata').html(lol['TP-UD'].Value.UD.Data);
            $('#userdata').show();
            $('#userdatatable').show();
            $("#userdatatable #userdatafields").append('<tr><td><pre>' + lol['TP-UD'].Value.UD.Value + '</pre></td></tr>');
        }
        
        //Show output table
        $('#outputtable').show();
        $('#consoledebug').show();
        
}
