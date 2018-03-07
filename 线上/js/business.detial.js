$(function(){var asys=window.parent.asys,CompanyInfo,legal_ident_img,agent_img,admin_ident_img,type=util.getQueryParam("type"),id=util.getQueryParam("id");if(!type||!id){showAlert("信息有误");if(asys){asys.closeModal()}}function showAlert(msg){if(!msg){msg="请求数据失败！请稍后再试"}if(asys){asys.showAlert({title:"温馨提醒",msg:msg,isCancel:false})}else{alert(msg)}}function postInfo(data){data.id=id;$.ajax({type:"POST",url:util.getURL("Company/update_do"),data:data,dataType:"json",success:function(data){if(data.status){getInfo()}else{showAlert(data.info)}},error:function(){showAlert()}})}function getPartnerLists(){$.ajax({type:"POST",url:util.getURL("Partner/lists"),data:{limit:110000},dataType:"json",success:function(data){if(data.status){var obj=$("select[name='partner_id']"),partner_id=obj.attr("partner_id"),info=data.info,html="<option value=''>无</option>";$.each(info,function(key,value){html+="<option value='"+value.id+"' "+(value.id==partner_id?"selected='selected'":"")+">"+value.name+"</option>"});obj.html(html)}else{}},error:function(){}})}function getReason(){$.ajax({type:"POST",url:util.getURL("Company/reason_lists"),dataType:"json",success:function(data){if(data.status){var info=data.info,html="";$.each(info,function(key,val){html+='<label><input name="reason" type="checkbox" value="'+val.id+'" >'+val.reason+"</label> "});$(".reason_box").html(html)}},error:function(){}})}function setExamine(data){$.ajax({type:"POST",url:util.getURL("Company/check_do"),data:data,dataType:"json",success:function(data){if(data.status){getInfo()}else{showAlert(data.info)}},error:function(){showAlert()}})}function getInfo(){if(!id){return}$(".info_data").show();$("input.info_data").hide();$(".editBox").hide();$(".button_box").hide();if(type=="edit"){$(".edit").show()}$.ajax({type:"POST",url:util.getURL("Company/info"),data:{id:id},dataType:"json",success:function(data){if(data.status){var info=data.info,admin_type="",cert_status="未知";CompanyInfo=info;setDataInfo(info)}else{showAlert(data.info);if(asys){asys.closeModal()}}},error:function(){showAlert();if(asys){asys.closeModal()}}})}function setDataInfo(info){if(info.admin_type==1){admin_type="(公司法人)"}else{if(info.admin_type==2){admin_type="(非公司法人)"}}if(info.admin_name){$("p[name='admin_name']").html(info.admin_name+admin_type);$("input[name='admin_name']").val(info.admin_name)}else{$("p[name='admin_name']").html("");$("input[name='admin_name']").val("")}if(info.admin_mobile){$("p[name='admin_mobile']").html(info.admin_mobile);$("input[name='admin_mobile']").val(info.admin_mobile)}else{$("p[name='admin_mobile']").html("");$("input[name='admin_mobile']").val("")}if(info.admin_ident_no){$("p[name='admin_ident_no']").html(info.admin_ident_no);$("input[name='admin_ident_no']").val(info.admin_ident_no)}else{$("p[name='admin_ident_no']").html("");$("input[name='admin_ident_no']").val("")}if(info.admin_ident_img_url){$("img[name='admin_ident_img_url']").attr("src",info.admin_ident_img_url);$("input[name='admin_ident_img']").val(info.admin_ident_img);admin_ident_img=info.admin_ident_img}else{$("img[name='admin_ident_img_url']").next(".imgModal").hide();$("input[name='admin_ident_img']").val("");admin_ident_img=""}if(info.agent_img_url){$("img[name='agent_img_url']").attr("src",info.agent_img_url);$("input[name='agent_img']").val(info.agent_img);agent_img=info.agent_img}else{$("img[name='agent_img_url']").next(".imgModal").hide();$("input[name='agent_img']").val("");agent_img=""}if(info.name){$("p[name='name']").html(info.name);$("input[name='name']").val(info.name)}else{$("p[name='name']").html("");$("input[name='name']").val("")}if(info.credit_code){$("p[name='credit_code']").html(info.credit_code);$("input[name='credit_code']").val(info.credit_code);if(info.credit_type==1){$("#credit_type").html("社会统一信用代码")}else{if(info.credit_type==2){$("#credit_type").html("组织机构代码")}}}else{$("p[name='credit_code']").html("");$("input[name='credit_code']").val("");$("#credit_type").html("社会统一信用代码")}if(info.addr){$("p[name='addr']").html(info.addr);$("input[name='addr']").val(info.addr)}else{$("p[name='addr']").html("");$("input[name='addr']").val("")}if(info.legal_ident_no){$("p[name='legal_ident_no']").html(info.legal_ident_no);$("input[name='legal_ident_no']").val(info.legal_ident_no)}else{$("p[name='legal_ident_no']").html("");$("input[name='legal_ident_no']").val("")}if(info.legal_name){$("p[name='legal_name']").html(info.legal_name);$("input[name='legal_name']").val(info.legal_name)}else{$("p[name='legal_name']").html("");$("input[name='legal_name']").val("")}if(info.legal_ident_img_url){$("img[name='legal_ident_img_url']").attr("src",info.legal_ident_img_url);$("input[name='legal_ident_img']").val(info.legal_ident_img);legal_ident_img=info.legal_ident_img}else{$("img[name='legal_ident_img_url']").next(".imgModal").hide();$("input[name='legal_ident_img']").val("");legal_ident_img=""}if(info.bank&&info.bank.bank_name){$("p[name='bank_name']").html(info.bank.bank_name);$("input[name='bank_name']").val(info.bank.bank_name)}else{$("p[name='bank_name']").html("");$("input[name='bank_name']").val("")}if(info.bank&&info.bank.account_name){$("p[name='account_name']").html(info.bank.account_name);$("input[name='account_name']").val(info.bank.account_name)}else{$("p[name='account_name']").html("");$("input[name='account_name']").val("")}if(info.bank&&info.bank.card_number){$("p[name='card_number']").html(info.bank.card_number);$("input[name='card_number']").val(info.bank.card_number)}else{$("p[name='card_number']").html("");$("input[name='card_number']").val("")}if(info.bank&&info.bank.card_issuers){$("p[name='card_issuers']").html(info.bank.card_issuers);$("input[name='card_issuers']").val(info.bank.card_issuers)}else{$("p[name='card_issuers']").html("");$("input[name='card_issuers']").val("")}if(info.bank&&info.bank.bank_addr){$("p[name='bank_addr']").html(info.bank.bank_addr);$("input[name='bank_addr']").val(info.bank.bank_addr)}else{$("p[name='bank_addr']").html("");$("input[name='bank_addr']").val("")}if(info.term_start){$("label[name='term_start']").html(info.term_start);$("input[name='term_start']").val(info.term_start)}else{$("label[name='term_start']").html("");$("input[name='term_start']").val("")}if(info.term_end){$("label[name='term_end']").html(info.term_end);$("input[name='term_end']").val(info.term_end)}else{$("label[name='term_end']").html("");$("input[name='term_end']").val("")}if(info.partner_id!="0"){$("label[name='partner_name']").html(info.partner_name);$("select[name='partner_id']").attr("partner_id",info.partner_id)}else{$("label[name='partner_name']").html("")}if(info.bill_name){$("label[name='bill_name']").html(info.bill_name);$("input[name='bill_name']").val(info.bill_name)}else{$("label[name='bill_name']").html("");$("input[name='bill_name']").val("")}if(info.bill_no){$("label[name='bill_no']").html(info.bill_no);$("input[name='bill_no']").val(info.bill_no)}else{$("label[name='bill_no']").html("");$("input[name='bill_no']").val("")}if(info.bill_addr){$("label[name='bill_addr']").html(info.bill_addr);$("input[name='bill_addr']").val(info.bill_addr)}else{$("label[name='bill_addr']").html("");$("input[name='bill_addr']").val("")}if(info.bill_mobile){$("label[name='bill_mobile']").html(info.bill_mobile);$("input[name='bill_mobile']").val(info.bill_mobile)}else{$("label[name='bill_mobile']").html("");$("input[name='bill_mobile']").val("")}if(info.bill_type){$("label[name='bill_type']").html(info.bill_type);$("input[name='bill_type']").val(info.bill_type)}else{$("label[name='bill_type']").html("");$("input[name='bill_type']").val("")}if(info.bill_rece){$("label[name='bill_rece']").html(info.bill_rece);$("input[name='bill_rece']").val(info.bill_rece)}else{$("label[name='bill_rece']").html("");$("input[name='bill_rece']").val("")}if(info.cert_status==1){cert_status="待认证"}else{if(info.cert_status==2){cert_status="资料填写中"}else{if(info.cert_status==3){cert_status="待审核"}else{if(info.cert_status==4){cert_status="审核通过"}else{if(info.cert_status==5){cert_status="已驳回"}else{if(info.cert_status==6){cert_status="重新认证"}}}}}}if(type=="show"||(info.cert_status!=6&&info.cert_status!=3)){$("p[name='cert_status']").html(cert_status);$(".examine").show();$(".check_result").hide()}else{$("p[name='cert_status']").html("");$(".examine").hide();$(".check_result").show();getReason()}}function getAppleyLists(type){$.ajax({type:"POST",url:util.getURL("Company/apply_lists"),data:{com_id:id,type:type},dataType:"json",success:function(data){if(data.status){var obj,dataParamName=["code","create_time","scene_name","status",{products:["code","name","start_date","end_date","tgf","fwf"]}];if(type==1){obj=$("#product_detial table");dataParamName=["code","create_time",{products:["code","name","tgf.val","fwf.val"]}]}else{obj=$("#product_made table")}$.each(data.info,function(k,v){rowspans=[];tdLayer=1;var str="<tr>";str+=tdHtml(v,dataParamName,1);str+="</tr>";obj.find("tbody").append(str);if(tdLayer>1){for(var i=1;i<tdLayer;i++){var rowSpan=getMaxRowSpan(rowspans[i]);$.each(obj.find('tbody tr:last td[tdlayer="'+i+'"]'),function(key,value){$(this)[0].rowSpan=rowSpan});for(var j=1;j<rowSpan;j++){var str="<tr>";var data=util.objDataValue(v,rowspans[i][1]);if(data[i]){str+=tdHtml(data[i],rowspans[i][2])}str+="</tr>";obj.find("tbody").append(str)}}}});function tdHtml(v,dataParamName,layer){if(tdLayer<layer){tdLayer=layer}var str="";$.each(dataParamName,function(key,value){if(value instanceof Object){$.each(value,function(keys,values){var rowData=util.objDataValue(v,keys);if(!rowspans[layer]){rowspans[layer]=[]}rowspans[layer].push(rowData?rowData.length:1);rowspans[layer].push(keys);rowspans[layer].push(values);var data=util.objDataValue(v,keys+"[0]");str+=tdHtml(data,values,layer+1)})}else{var data=util.objDataValue(v,value);str+="<td "+value+' tdLayer="'+layer+'">'+(data?getStatusText(value,data):"-")+"</td>"}});return str}function getMaxRowSpan(data){var length=parseInt(data.length/3),max=0;for(var i=0;i<length;i++){if(max<data[i*3]){max=data[i*3]}}return max}function getStatusText(key,value){if(key=="status"){if(value==1){return"待签约"}else{if(value==2){return"已签约"}else{if(value==3){return"驳回"}else{if(value==4){return"已定制"}}}}}else{if(key=="tgf"||key=="fwf"){if(value.type==1){return value.val+"元"}else{return value.val+"%"}}else{return value}}}}else{showAlert(data.info);if(asys){asys.closeModal()}}},error:function(){showAlert();if(asys){asys.closeModal()}}})}getInfo();getAppleyLists(1);getAppleyLists(2);if(type=="show"){$(".edit").hide();$("input").remove();$("button:not(.cancle_modal)").remove();$(".check_result").hide();$(".examine").show();$(".bus_edit").remove();$(".bus_info").show();$(".cancle_modal_box").show()}else{getPartnerLists()}$("input[type='radio'][value='2']").click(function(){$("#reject_reason").show()});$("input[type='radio'][value='1']").click(function(){$("#reject_reason").hide()});$(".edit").click(function(){$(this).closest(".store_detial").find(".info_data").hide();$(this).closest(".store_detial").find("input.info_data").show();$(this).closest(".store_detial").find(".editBox").show();$(this).closest(".store_detial").find(".button_box").show();$(this).hide()});$(".edit_cancle").click(function(){$(this).closest(".store_detial").find(".edit").show();$(this).closest(".store_detial").find(".info_data").show();$(this).closest(".store_detial").find("input.info_data").hide();$(this).closest(".store_detial").find(".editBox").hide();$(this).closest(".store_detial").find(".button_box").hide();setDataInfo(CompanyInfo)});$(".edit_submit").click(function(){var t,isErr=false,data={},examine=false,is_bill_info=$(this).closest(".store_detial").hasClass("bill_info");formDom=$(this).closest(".store_detial").find(".postData");if($(this).attr("examine")==1){examine=true;t=$(this).closest(".check_result").find(".postData").serializeArray()}else{t=formDom.serializeArray()}isOuter=$("input[type='checkbox'][value='other']")[0].checked;$.each(t,function(){if(examine){if(this.value=="other"||(this.name=="memo"&&!isOuter)){}else{if((this.name=="memo"&&isOuter)||(isNaN(this.value)&&this.name!="type")){if(!data.memo){data.memo=[]}data.memo.push(this.value)}else{if(this.name=="reason"){if(!data.reason_ids){data.reason_ids=[]}data.reason_ids.push(this.value)}else{data[this.name]=this.value}}}}else{if(util.trimSpace(this.value,2)){data[this.name]=this.value}else{if(is_bill_info){data[this.name]=this.value}else{isErr=true;return}}}});if(examine){if(!data.type){showAlert("请选择通过或者驳回!");return}if(!data.reason_ids&&!data.memo&&data.type!="1"){showAlert("请选择驳回原因!");return}data.id=id;if(data.reason_ids){data.reason_ids=data.reason_ids.join(",")}if(data.memo){data.memo=data.memo.join(";")}setExamine(data);return}if(isErr){showAlert("请完善信息!");return}if(formDom.attr("name")=="admin"){if(!agent_img){showAlert("请上传代理人授权书!");return}if(!admin_ident_img){showAlert("请上传手持身份证照!");return}data.admin_ident_img=admin_ident_img;data.agent_img=agent_img}if(formDom.attr("name")=="business"){if(!legal_ident_img){showAlert("请上传营业执照!");return}data.legal_ident_img=legal_ident_img}postInfo(data)});$(".updataImg").fileinput({language:"zh",uploadUrl:util.getURL("FileUpload/ueditor_upload?dir=Picture"),allowedFileExtensions:["jpg","gif","png"],uploadAsync:false,showUpload:false,showRemove:false,showPreview:false,showCaption:false,showCancel:false,browseClass:"btn btn-primary",dropZoneEnabled:false,maxFileCount:1,enctype:"multipart/form-data",validateInitialCount:false,previewFileIcon:""}).on("filebatchuploadsuccess",function(event,data,previewId,index){if(data.response.status){var info=data.response.info;$(this).closest(".editBox").find("img").attr("src",info.img_url);eval($(this).attr("urlname")+"=info.img");$("input[name="+$(this).attr("urlname")+"]").val(info.img)}else{showAlert("上传有误!")}}).on("filebatchuploaderror",function(event,data,msg){$(".kv-upload-progress").addClass("hide");showAlert("上传有误!")}).on("filebatchselected",function(event,files){$(this).fileinput("upload")});$(".info_date").datetimepicker({language:"zh-CN",weekStart:1,todayBtn:1,autoclose:1,todayHighlight:1,minView:2,forceParse:0,format:"yyyy-mm-dd"});$(".imgModal").click(function(){var url=$(this).prev("img").attr("src");if(url){$("#showImg").find(".image").attr("src",url);$("#showImg").modal("show")}});$(".cancle_handle,.cancle_modal").click(function(){if(asys){asys.closeModal()}})});