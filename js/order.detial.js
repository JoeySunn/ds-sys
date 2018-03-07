/* 
	订单详情页面js文件
		showAlert : 错误信息弹框
		getInfo  ：获取商户信息并渲染
		
	以及各个按钮的点击事件监听
*/
$(function(){
	var asys=window.parent.asys,
		id=util.getQueryParam("id"),//订单id
		isIns=util.getQueryParam('isIns');//用于区分保险公司还是平台（两边显示不相同）
	if(!id){
		showAlert("信息有误");
		if(asys){
			asys.closeModal();	//关闭模态框	
		}
	}
	/*
		错误信息弹框
			msg:错误信息 如果msg为空则默认 “请求数据失败！请稍后再试”
		
	*/
	function showAlert(msg){
		if(!msg){
			msg="请求数据失败！请稍后再试"
		}
		if(asys){
			asys.showAlert({title:'温馨提醒',msg:msg,isCancel:false})
		}else{
			alert(msg)
		}
	}
	/*	获取信息并渲染
			p[name=**]、div[name=**] 等表示查看时显示的内容
			input[name=**]  表示编辑时输入框中显示的文字
			input[name=**][value=**]  表示编辑单选项或者多选项的值
		
	*/
	function getInfo(){
		if(!id){
			showAlert("信息有误");
			if(asys){
				asys.closeModal();	//关闭模态框	
			}
		}
		$.ajax({
			type:"POST",
			url:util.getURL("Policy/info"),
			data:{
				id:id
			},
			dataType:"json",
			success:function(data){
			  if(data.status){
				var info=data.info,admin_type="",cert_status='未知';
				$("p[name=order_no]").html(info.order_no?info.order_no:'');
				$("p[name=product_id]").html(info.product_id?info.product_id:'');
				if(isIns==1){
					$("p[name=company_name]").parent().hide();
				}else{
					$("p[name=company_name]").html(info.company_name?info.company_name:'');
				}
				$("p[name=ins_name]").html(info.ins_name?info.ins_name:'');
				$("p[name=app_name]").html(info.app_name?info.app_name:'');
				var app_mobile=info.app_mobile,
					app_ident_no=info.app_ident_no;
				if(isIns==1&& app_mobile){
					app_mobile=app_mobile.replace( /^(\d{3})\d{4}(\d{4})$/, "$1****$2");
				}
				if(isIns==1&& app_ident_no){
					app_ident_no=app_ident_no.substr(0,4)+'***********'+app_ident_no.substr((app_ident_no.length-4));
				}
				
				$("p[name=app_mobile]").html(app_mobile?app_mobile:'');
				$("p[name=app_ident_no]").html(app_ident_no?app_ident_no:'');
				
				var app_ident_type="";
				if(info.app_ident_type==1){
					app_ident_type="身份证";
				}else{
					app_ident_type="未知";
				}
				$("p[name=app_ident_type]").html(app_ident_type);
				$("p[name=app_email]").html(info.app_email?info.app_email:'');
				for(var i=0;i<info.insrnt_lists.length;i++){
					var insrnt=info.insrnt_lists[i];
					var html='<div class="order_detial">'
							+		'<div class="head"><h4>被保人信息</h4></div>'
							+		'<div class="order_info">'
							+		'<div class="rowbox">'
							+			'<div>'
							+				'<p class="order_info_left">是否是本人：</p>'
							+				'<p name="insrnt_relat"></p>'
							+			'</div>'
							+			'<div>'
							+				'<p class="order_info_left"></p>'
							+				'<p></p>'
							+			'</div>'
							+	   '</div>' 
							+	   '<div class="rowbox insrnt">'
							+		 '<div>'
							+			'<p class="order_info_left">姓名：</p>'
							+			'<p name="insrnt_name"></p>'
							+		 '</div>'
							+		 '<div>'
							+			'<p class="order_info_left"></p>'
							+			'<p></p>'
							+		 '</div>'
							+	   '</div> '
							+	   '<div class="rowbox insrnt">'
							+		' <div>'
							+			'<p class="order_info_left">证件类型：</p>'
							+			'<p name="insrnt_ident_type"></p>'
							+		 '</div>'
							+		 '<div>'
							+			'<p class="order_info_left">证件号码：</p>'
							+			'<p name="insrnt_ident_no"></p>'
							+		 '</div>'
							+	   '</div> '
							+	   '<div class="rowbox insrnt">'
							+		 '<div>'
							+			'<p class="order_info_left">联系方式：</p>'
							+			'<p name="insrnt_mobile"></p>'
							+		 '</div>'
							+		 '<div>'
							+			'<p class="order_info_left"></p>'
							+			'<p></p>'
							+		 '</div>'
							+	   '</div>'
							+	 '</div>'
							+  '</div>';
					$("#insrnt_box").append(html);
					var insrntDom=$("#insrnt_box .order_detial:last");
					if(info.app_ident_no==insrnt.insrnt_ident_no){
						insrntDom.find("p[name=insrnt_relat]").html("本人");
						insrntDom.find(".insrnt").hide();
					}else{
						insrntDom.find("p[name=insrnt_relat]").html("非本人");
						insrntDom.find(".insrnt").show();
					}
					insrntDom.find("p[name=insrnt_name]").html(insrnt.insrnt_name?insrnt.insrnt_name:'');
					var insrnt_ident_no=insrnt.insrnt_ident_no,
						insrnt_mobile=insrnt.insrnt_mobile;
					if(isIns==1&& insrnt_mobile){
						insrnt_mobile=insrnt_mobile.replace( /^(\d{3})\d{4}(\d{4})$/, "$1****$2");
					}
					if(isIns==1&& insrnt_ident_no){
						insrnt_ident_no=insrnt_ident_no.substr(0,4)+'***********'+insrnt_ident_no.substr((insrnt_ident_no.length-4));
					}
					insrntDom.find("p[name=insrnt_ident_no]").html(insrnt_ident_no?insrnt_ident_no:'');
					var insrnt_ident_type="";
					if(insrnt.insrnt_ident_type==1){
						insrnt_ident_type="身份证";
					}else{
						insrnt_ident_type="未知";
					}
					insrntDom.find("p[name=insrnt_ident_type]").html(insrnt_ident_type);
					insrntDom.find("p[name=insrnt_mobile]").html(insrnt_mobile?insrnt_mobile:'');
				}
				
				
				$("p[name=bgn_tm]").html(info.bgn_tm?info.bgn_tm:'');
				$("p[name=end_tm]").html(info.end_tm?info.end_tm:'');
				$("p[name=policy_no]").html(info.policy_no?info.policy_no:'');
				var exten="未知";
				if(info.exten==1){
					exten="二维码";
				}else if(info.exten==2){
					exten="链接";
				}else if(info.exten==3){
					exten="API接口";
				}
				$("p[name=exten]").html(exten);
				var under_status="未知";
				if(info.under_status==0){
					under_status="未承保";
				}else if(info.under_status==1){
					under_status="成功";
				}else if(info.under_status==2){
					under_status="失败";
				}
				$("p[name=under_status]").html(under_status);
				var status="未知";
				if(info.status==1){
					status="核保中";
				}else if(info.status==2){
					status="核保失败";
				}else if(info.status==3){
					status="待支付";
				}else if(info.status==4){
					status="已支付";
				}
				$("p[name=status]").html(status);
				$("p[name=issue_time]").html(info.issue_time?info.issue_time:'');
				$("p[name=create_time]").html(info.create_time?info.create_time:'');
				$("p[name=product_name]").html(info.product.name?info.product.name:'');
				$("p[name=product_code]").html(info.product.code?info.product.code:'');
				$("p[name=risk_name]").html(info.risk_name?info.risk_name:'');
				var detailDom=$("table[name=detail]");
				detailDom.children("tbody").html("")
				$.each(info.detail,function(k,v){
					var html="<tr>";
					html+="<td>"+v.kind_name+"</td>";
					html+="<td>"+v.n_amt+"</td>";
					html+="<td>"+v.n_prm+"</td>";
					html+="</tr>";
					detailDom.children("tbody").append(html);
				});
				
			  }else{
				showAlert(data.info);
				if(asys){
					asys.closeModal();	//关闭模态框	
				}
			  }
			},
			error:function(){
				showAlert();
				if(asys){
					asys.closeModal();	//关闭模态框	
				}
			}
		})
	}
	//关闭订单详情的页面，只适用于在管理平台系统中操作时打开的页面，
	$('.btn-default').click(function(){
		if(asys){
			asys.closeModal();
		}
	})
	getInfo();
	
});