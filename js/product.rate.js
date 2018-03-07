/*
	费率配置js文件
		showAlert ：错误信息弹框	
		getInfo ： 获取方案数据
		postInfo ：保存数据
		getInsurer ： 获取保险公司列表
		getInsurance ： 获取经纪公司列表
		allCalc ： 费率算法方法的集合的方法
		setValueDisabled ： 输入框的禁用和启用的判断（固定还是比例选择判断）
		inputDisabled ： 输入框的禁用和启用（输入类容判断）
		setPlatValue ： 平台收益计算
		setTDFTip ： 通道费占比提醒
		setInsFWDValue ： 经纪公司服务费计算
		setInsurerFWFValue ： 设置保险公司服务费
		含税和不含税选择、结算时间类型、费用输入框、费用类型、保费去向选择、销售费用率输入、关闭按钮、经纪费输入、保存并配置完成按钮、暂存按钮等事件的监听
		
*/
$(function(){
	var asys=window.parent.asys,
		url_type=util.getQueryParam("type"),//页面状态，show为查看状态只能查看不能编辑，edit为编辑状态可编辑
		id=util.getQueryParam("id");//产品ID
	if(!url_type || !id){//如果没有状态或者id 则代表数据有问题 则关闭弹框并弹框提醒
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
	/*
		保存数据
			data:需要保存的数据
	*/
	function postInfo(data){
		if(!data){
			return;
		}
		data.id=id;
		data.save_module=2;
		$.ajax({
			type:"POST",
			url:util.getURL("Product/edit_do"),
			data:data,
			dataType:"json",
			success:function(data){
			  if(data.status){
				showAlert("保存成功");
				if(asys){
					asys.closeModal();	//关闭模态框	
				}
			  }else{
				showAlert(data.info);
			  }
			},
			error:function(){
				showAlert();
			}
		})
	}
	
	//将所有费率输入框禁用，除了费用率
	$(".free_val").val("");
	$(".free_val").attr("disabled",'true');
	$("input[name=xsf_val]").removeAttr("disabled");
	/*
		获取数据并渲染
			p[name=**]、div[name=**] 等表示查看时显示的内容
			input[name=**]  表示编辑时输入框中显示的文字
			input[name=**][value=**]  表示编辑单选项或者多选项的值
	
	*/
	function getInfo(){
		if(!id){
			return;
		}
		$.ajax({
			type:"POST",
			url:util.getURL("Product/info"),
			data:{
				id:id,
				info_module:2
			},
			dataType:"json",
			success:function(data){
			  if(data.status){
				 var info=data.info;
				 if(url_type=="edit"){
					getInsurer(info);
					getInsurance(info);
				 }
				 
				$("input[name=tgf_amt]").val(info.tgf_amt?info.tgf_amt:'');
				$("p[name=tgf_amt]").html(info.tgf_amt?info.tgf_amt:'');
				$("input[name=price]").val(info.price?info.price:'');
				$("p[name=price]").html(info.price?info.price:'');
				
				$("select[name=insurer_id]").val(info.insurer_id?info.insurer_id:'');
				$("select[name=insurer_id]").attr('insurer_id',info.insurer_id?info.insurer_id:'');
				$("p[name=insurer_name]").html(info.insurer_name?info.insurer_name:'');
				$("select[name=ins_id]").val(info.ins_id?info.ins_id:'');
				$("select[name=ins_id]").attr('ins_id',info.ins_id?info.ins_id:'');
				$("p[name=ins_name]").html(info.ins_name?info.ins_name:'');
				if(info.prem_to){
					$("input[name=prem_to][value='"+info.prem_to+"']").click();
					if(info.prem_to==1){
						$("p[name=prem_to_text]").text("经纪公司收保费");
					}else{
						$("p[name=prem_to_text]").text("商户收保费");
					}
				}
				if(info.settle_date && info.settle_date.type){
					$("input[name=settle_date_type][value='"+info.settle_date.type+"']").click();
					var type=""
					if(info.settle_date.type==1){
						type='出单时间';
					}else{
						type='保险起期';
					}
					$("p[name=settle]").html(type+"+"+(info.settle_date.val?info.settle_date.val:'0')+'天');
					$("input[name=settle_date_val]").val(info.settle_date.val?info.settle_date.val:'0')
				}else{
					$("p[name=settle]").html();
					$("input[name=settle_date_val]").val("0")
				}
				if(info.xsf && info.xsf.prem_set_type){
					$("input[name=xsf_prem_set_type][value='"+info.xsf.prem_set_type+"']").click();
					$("p[name=prem_set]").html(info.xsf.prem_set_type==1?'仅通过经纪公司结算':"可通过多方结算（经纪公司、平台、商户）");
				}
				if(info.xsf && info.xsf.tax_type){
					$("input[name=xsf_tax_type][value='"+info.xsf.tax_type+"']").click();
					$("input[name=xsf] .taxValue").html(info.xsf.tax_type==1?'含税':"不含税");
					$("input[name=jjf_xsf_tax_type][value='"+info.xsf.tax_type+"']").click();
					$("input[name=jjf] .taxValue").html(info.xsf.tax_type==1?'含税':"不含税");
				}
				if(info.xsf && info.xsf.type){
					$("input[name=xsf_type][value='"+info.xsf.type+"']").click();
					$("input[name=xsf_val]").val(info.xsf.val>=0?info.xsf.val:'');
					$("input[name=xsf_val]").change();
					var type=""
					if(info.xsf.type==1){
						type='固定金额';
						$("p[name=xsf] .unit").html("元");
					}else{
						type='比例';
						$("p[name=xsf] .unit").html("%");
					}
					$("p[name=xsf] .value").html(info.xsf.val>=0?info.xsf.val:'');
					$("p[name=xsf] .title").html(type);
				}else{
					$("p[name=xsf] .value").html('');
					$("p[name=xsf] .unit").html("");
					$("p[name=xsf] .title").html("");
				}
				if(info.jjf && info.jjf.type){
					$("input[name=jjf_type][value='"+info.jjf.type+"']").click();
					$("input[name=jjf_val]").val(info.jjf.val>=0?info.jjf.val:'');
					$("input[name=jjf_val]").change();
					var type=""
					if(info.jjf.type==1){
						type='固定金额';
						$("p[name=jjf] .unit").html("元");
					}else{
						type='比例';
						$("p[name=jjf] .unit").html("%");
					}
					$("p[name=jjf] .value").html(info.jjf.val>=0?info.jjf.val:'');
					$("p[name=jjf] .title").html(type);
				}else{
					$("p[name=jjf] .value").html('');
					$("p[name=jjf] .unit").html("");
					$("p[name=jjf] .title").html("");
				}
				
				if(info.fwf_ins && info.fwf_ins.type){
					$("input[name=fwf_ins_type][value='"+info.fwf_ins.type+"']").click();
					$("input[name=fwf_ins_val]").val(info.fwf_ins.val>=0?info.fwf_ins.val:'');
					var type=""
					if(info.fwf_ins.type==1){
						type='固定金额';
						$("p[name=fwf_ins] .unit").html("元");
					}else{
						type='比例';
						$("p[name=fwf_ins] .unit").html("%");
					}
					$("p[name=fwf_ins] .value").html(info.fwf_ins.val>=0?info.fwf_ins.val:'');
					$("p[name=fwf_ins] .title").html(type);
				}else{
					$("p[name=fwf_ins] .value").html('');
					$("p[name=fwf_ins] .unit").html("");
					$("p[name=fwf_ins] .title").html("");
				}
				if(info.fwf_insurer && info.fwf_insurer.type){
					$("input[name=fwf_insurer_type][value='"+info.fwf_insurer.type+"']").click();
					$("input[name=fwf_insurer_val]").val(info.fwf_insurer.val>=0?info.fwf_insurer.val:'');
					var type=""
					if(info.fwf_insurer.type==1){
						type='固定金额';
						$("p[name=fwf_insurer] .unit").html("元");
					}else{
						type='比例';
						$("p[name=fwf_insurer] .unit").html("%");
					}
					$("p[name=fwf_insurer] .value").html(info.fwf_insurer.val>=0?info.fwf_insurer.val:'');
					$("p[name=fwf_insurer] .title").html(type);
				}else{
					$("p[name=fwf_insurer] .value").html('');
					$("p[name=fwf_insurer] .unit").html("");
					$("p[name=fwf_insurer] .title").html("");
				}
				
				if(info.tgf_insurer && info.tgf_insurer.type){
					$("input[name=tgf_insurer_type][value='"+info.tgf_insurer.type+"']").click();
					$("input[name=tgf_insurer_val]").val(info.tgf_insurer.val>=0?info.tgf_insurer.val:'');
					var type=""
					if(info.tgf_insurer.type==1){
						type='固定金额';
						$("p[name=tgf_insurer] .unit").html("元");
					}else{
						type='比例';
						$("p[name=tgf_insurer] .unit").html("%");
					}
					$("p[name=tgf_insurer] .value").html(info.tgf_insurer.val>=0?info.tgf_insurer.val:'');
					$("p[name=tgf_insurer] .title").html(type);
				}else{
					$("p[name=tgf_insurer] .value").html('');
					$("p[name=tgf_insurer] .unit").html("");
					$("p[name=tgf_insurer] .title").html("");
				}
				if(info.tgf_ins && info.tgf_ins.type){
					$("input[name=tgf_ins_type][value='"+info.tgf_ins.type+"']").click();
					$("input[name=tgf_ins_val]").val(info.tgf_ins.val>=0?info.tgf_ins.val:'');
					var type=""
					if(info.tgf_ins.type==1){
						type='固定金额';
						$("p[name=tgf_ins] .unit").html("元");
					}else{
						type='比例';
						$("p[name=tgf_ins] .unit").html("%");
					}
					$("p[name=tgf_ins] .value").html(info.tgf_ins.val>=0?info.tgf_ins.val:'');
					$("p[name=tgf_ins] .title").html(type);
				}else{
					$("p[name=tgf_ins] .value").html('');
					$("p[name=tgf_ins] .unit").html("");
					$("p[name=tgf_ins] .title").html("");
				}
				if(info.tdf && info.tdf.type){
					$("input[name=tdf_type][value='"+info.tdf.type+"']").click();
					$("input[name=tdf_val]").val(info.tdf.val>=0?info.tdf.val:'');
					setTDFTip();
					var type=""
					if(info.tdf.type==1){
						type='固定金额';
						$("p[name=tdf] .unit").html("元");
					}else{
						type='比例';
						$("p[name=tdf] .unit").html("%");
					}
					$("p[name=tdf] .value").html(info.tdf.val>=0?info.tdf.val:'');
					$("p[name=tdf] .title").html(type);
				}else{
					$("p[name=tdf] .value").html('');
					$("p[name=tdf] .unit").html("");
					$("p[name=tdf] .title").html("");
				}
				if(info.tgf_plat && info.tgf_plat.type){
					$("input[name=tgf_plat_type][value='"+info.tgf_plat.type+"']").click();
					$("input[name=tgf_plat_val]").val(info.tgf_plat.val>=0?info.tgf_plat.val:'');
					var type=""
					if(info.tgf_plat.type==1){
						type='固定金额';
						$("p[name=tgf_plat] .unit").html("元");
					}else{
						type='比例';
						$("p[name=tgf_plat] .unit").html("%");
					}
					$("p[name=tgf_plat] .value").html(info.tgf_plat.val>=0?info.tgf_plat.val:'');
					$("p[name=tgf_plat] .title").html(type);
				}else{
					$("p[name=tgf_plat] .value").html('');
					$("p[name=tgf_plat] .unit").html("");
					$("p[name=tgf_plat] .title").html("");
				}
				
				if(info.qdf && info.qdf.type){
					$("input[name=qdf_val]").val(info.qdf.val>=0?info.qdf.val:'');
					$("input[name=qdf_type][value='"+info.qdf.type+"']").click();
					var type=""
					if(info.qdf.type==1){
						type='固定金额';
						$("p[name=qdf] .unit").html("元");
					}else{
						type='比例';
						$("p[name=qdf] .unit").html("%");
					}
					$("p[name=qdf] .value").html(info.qdf.val>=0?info.qdf.val:'');
					$("p[name=qdf] .title").html(type);
				}else{
					$("p[name=qdf] .value").html('');
					$("p[name=qdf] .unit").html("");
					$("p[name=qdf] .title").html("");
				}
				if(info.plat && info.plat.type){
					$("input[name=plat_val]").val(info.plat.val>=0?info.plat.val:'');
					$("input[name=plat_type][value='"+info.plat.type+"']").click();
					var type=""
					if(info.qdf.type==1){
						type='固定金额';
						$("p[name=plat] .unit").html("元");
					}else{
						type='比例';
						$("p[name=plat] .unit").html("%");
					}
					$("p[name=plat] .value").html(info.plat.val>=0?info.plat.val:'');
					$("p[name=plat] .title").html(type);
				}else{
					$("p[name=plat] .value").html('');
					$("p[name=plat] .unit").html("");
					$("p[name=plat] .title").html("");
				}
				allCalc();
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
	//获取保险公司列表
	function getInsurer(pInfo){
		$.ajax({
			type:"POST",
			url:util.getURL("Insurer/lists"),
			data:{
				limit:1000,
			},
			dataType:"json",
			success:function(data){
			  if(data.status){
				 var dom=$("select[name=insurer_id]");
				 dom.html("");
				 $.each(data.info,function(key,val){
					 dom.append('<option value="'+val.id+'">'+val.name+'</option>');
				 });
				 dom.val(pInfo.insurer_id);
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
		});
	}
	//获取经纪公司列表
	function getInsurance(pInfo){
		$.ajax({
			type:"POST",
			url:util.getURL("Insurance/lists"),
			data:{
				limit:1000,
			},
			dataType:"json",
			success:function(data){
			  if(data.status){
				 var dom=$("select[name=ins_id]");
				 dom.html("");
				 $.each(data.info,function(key,val){
					 dom.append('<option value="'+val.id+'">'+val.name+'</option>');
				 });
				dom.val(pInfo.ins_id);
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
	getInfo();
	
	//根据type 显示效果不相同，show时将可以编辑的全部删除只能查看
	if(url_type=="show"){
		$(".edit").remove();
		$(".button_box").remove();
		$(".cancle_box").text("关闭");
	}else{
		$(".show").remove();
	}
	//事件监听和费用关系的联动
	
	//结算时间 输入类容监听
	$(".free_val,input[name=settle_date_val]").on("input",function(){
		var value=util.trimSpace(this.value);
		if(isNaN(value)){
			$(this).val("");
			return;
		}
		if(value<0){
			$(this).val("");
			return;
		}
	});
	
	//结算模式是可通过多方结算（经纪公司、平台、商户） 含税和不含税选择
	$("input[name=xsf_tax_type]").click(function(){
		$("input[name=xsf_val]").change();
		allCalc()
	})
	//结算模式是仅通过经纪公司结算  含税和不含税选择
	$("input[name=jjf_xsf_tax_type]").click(function(){
		$("input[name=jjf_val]").change();
		allCalc()
	})
	
	//结算时间类型 内容变化监听
	$("input[name=settle_date_val]").change(function(){
		var value=util.trimSpace(this.value);
		if(value==''){
			return;
		}
		if(isNaN(value)){
			$(this).val("");
			return;
		}
		if(value<0){
			$(this).val("");
			return;
		}
		$(this).val(parseInt(value));
	});
	//费用输入框 内容变化监听数字有效性判断
	$(".free_val").change(function(){
		var value=util.trimSpace(this.value);
		if(value==''){
			allCalc();
			return;
		}
		if(isNaN(value)){
			$(this).val("");
			return;
		}
		if(value<0){
			$(this).val("");
			return;
		}
		
		if(value.indexOf(".")>-1){
			$(this).val(parseFloat(value).toFixed(4));	
		}
		allCalc(this);
	});
	//费用类型，1 固定  2 比例
	$(".free_type").click(function(){
		var value=this.value,
			name=this.name,
			unitDom=$(this).closest("p").find(".unit"),
			tipDom=$(this).closest("p").find(".free_tip");
		
		if(value==1){
			unitDom.html("元");				
			tipDom.hide();
			$("#"+name.split('_')[0]+"_info .title").html("固定金额");
			$("#"+name.split('_')[0]+"_info .unit").html("元");
			
		}else{
			unitDom.html("%");
			tipDom.show();
			$("#"+name.split('_')[0]+"_info .title").html("比例");
			$("#"+name.split('_')[0]+"_info .unit").html("%");
		}
		allCalc();
	});
	//保费去向选择
	$("input[name=xsf_prem_set_type]").change(function(){
		var xsf_prem_set_type=$("input[name=xsf_prem_set_type]:checked").val();
		if(xsf_prem_set_type==1){
			$("#xsf_tax_box").hide();
			$("#fwf_insurer_box").hide();
			$("#tgf_insurer_box").hide();
			$("#xsf_tax_box .tax_box").hide();
			$("#jjf_box .tax_box").show();
		}else{
			$("#xsf_tax_box").show();
			$("#fwf_insurer_box").show();
			$("#tgf_insurer_box").show();
			$("#xsf_tax_box .tax_box").show();
			$("#jjf_box .tax_box").hide();
		}
		$("#free_config input[type=text]").val("");
		$("input[name=xsf_val]").change();
		$("input[name=jjf_val]").change();
		allCalc();
	});
	//销售费用率 右边文字提醒加计算（根据含税不含税）
	$("input[name=xsf_val]").change(function(){
		var xsf_tax_type=$("input[name=xsf_tax_type]:checked").val(),
			tip="价税分离比例：",
			xsf_val=this.value,
			free_tip=$(this).parent().parent().find(".free_tip");
		if(isNaN(xsf_val)){
			$(this).val("");
			free_tip.text("");
			return;
		}
		if(xsf_val<0){
			$(this).val("");
			free_tip.text("");
			return;
		}
		if(xsf_val==''){
			$(this).val("");
			free_tip.text("");
			return;
		}
		if(xsf_tax_type==2){
			tip+=xsf_val+"%";
		}else{
			var xsf=parseFloat(xsf_val)/1.06
			tip+=xsf_val+"/1.06≈"+(xsf.toFixed(4))+'%';
		}
		free_tip.text(tip);
	});
	// 经纪费 右边文字提醒加计算（根据含税不含税）
	$("input[name=jjf_val]").change(function(){
		var xsf_tax_type=$("input[name=jjf_xsf_tax_type]:checked").val(),
			tip="价税分离比例：",
			xsf_val=this.value,
			xsf_prem_set_type=$("input[name=xsf_prem_set_type]:checked").val(),
			free_tip=$(this).parent().parent().find(".free_tip");
		if(xsf_prem_set_type==2){
			free_tip.text("");
			return;
		}
		if(isNaN(xsf_val)){
			$(this).val("");
			free_tip.text("");
			return;
		}
		if(xsf_val<0){
			$(this).val("");
			free_tip.text("");
			return;
		}
		if(xsf_val==''){
			$(this).val("");
			free_tip.text("");
			return;
		}
		if(xsf_tax_type==2){
			tip+=xsf_val+"%";
		}else{
			var xsf=parseFloat(xsf_val)/1.06
			tip+=xsf_val+"/1.06≈"+(xsf.toFixed(4))+'%';
		}
		free_tip.text(tip);
	});
	//费率算法方法的集合的方法
	function allCalc(obj){
		setValueDisabled(obj);
		setTDFTip();
		setPlatValue();
	}
	/*
		输入框的禁用和启用的判断（固定还是比例选择判断）
			如果有一个选择固定则所有的都不用js，提示也隐藏，并且所有输入框启用
			结算模式是仅通过经纪公司结算 则不用判断  销售费用率  技术服务费 推广费的type
			
	*/
	function setValueDisabled(obj){
		var xsf_type=$("input[name=xsf_type]:checked").val(),
			jjf_type=$("input[name=jjf_type]:checked").val(),
			fwf_insurer_type=$("input[name=fwf_insurer_type]:checked").val(),
			tgf_insurer_type=$("input[name=tgf_insurer_type]:checked").val(),
			tdf_type=$("input[name=tdf_type]:checked").val(),
			fwf_ins_type=$("input[name=fwf_ins_type]:checked").val(),
			tgf_ins_type=$("input[name=tgf_ins_type]:checked").val(),
			tgf_plat_type=$("input[name=tgf_plat_type]:checked").val(),
			plat_type=$("input[name=plat_type]:checked").val(),
			xsf_val=parseFloat($("input[name=xsf_val]").val()),
			jjf_val=parseFloat($("input[name=jjf_val]").val()),
			xsf_prem_set_type=$("input[name=xsf_prem_set_type]:checked").val(),
			qdf_type=$("input[name=qdf_type]:checked").val();
		
		if(xsf_prem_set_type==2 && xsf_type=='2' && jjf_type=='2' && fwf_insurer_type=='2' && tgf_insurer_type=='2' && tdf_type=='2' && fwf_ins_type=='2' && tgf_ins_type=='2' && tgf_plat_type=='2' && qdf_type=='2' && plat_type=='2'){
			
			inputDisabled(obj);
		}else if(xsf_prem_set_type==1 && jjf_type=='2' && tdf_type=='2' && fwf_ins_type=='2' && tgf_ins_type=='2' && tgf_plat_type=='2' && qdf_type=='2' && plat_type=='2'){
			inputDisabled(obj)
		}else{
			$(".free_val").removeAttr("disabled");
			$(".free_tip").hide()
		}
	}
	/*
		输入框的禁用和启用（输入类容判断）
			结算模式是可通过多方结算（经纪公司、平台、商户）：
				输入销售费用率后 经纪费和推广费变成可输入，
					输入完经纪费和推广费后自动计算保险公司技术服务费
				输入经纪费有  经纪公司的通道费和推广费可输入
					输入完 经纪公司的通道费和推广费后自动计算经纪公司技术服务费
				保险公司和经纪公司配置完成后方可输入平台推广费和市场拓展费
					输入完 平台 推广费和市场拓展费后自动计算平台收益
			结算模式是仅通过经纪公司结算
				输入经纪费后 经纪公司的通道费和推广费可输入
					输入完 经纪公司的通道费和推广费后自动计算经纪公司技术服务费
				保险公司和经纪公司配置完成后方可输入平台推广费和市场拓展费
					输入完 平台 推广费和市场拓展费后自动计算平台收益
	*/
	function inputDisabled(obj){
		var xsf_type=$("input[name=xsf_type]:checked").val(),
			jjf_type=$("input[name=jjf_type]:checked").val(),
			fwf_insurer_type=$("input[name=fwf_insurer_type]:checked").val(),
			tgf_insurer_type=$("input[name=tgf_insurer_type]:checked").val(),
			tdf_type=$("input[name=tdf_type]:checked").val(),
			fwf_ins_type=$("input[name=fwf_ins_type]:checked").val(),
			tgf_ins_type=$("input[name=tgf_ins_type]:checked").val(),
			tgf_plat_type=$("input[name=tgf_plat_type]:checked").val(),
			plat_type=$("input[name=plat_type]:checked").val(),
			xsf_val=parseFloat($("input[name=xsf_val]").val()),
			jjf_val=parseFloat($("input[name=jjf_val]").val()),
			xsf_prem_set_type=$("input[name=xsf_prem_set_type]:checked").val(),
			qdf_type=$("input[name=qdf_type]:checked").val();
		if(obj && parseFloat(obj.value)>100){
			$(obj).val("");
		}
		if(xsf_prem_set_type==2 && !(xsf_val>0)){
			$(".free_val").val("");
			$(".free_val").attr("disabled",'true');
			$("input[name=xsf_val]").removeAttr("disabled");
		}else if(xsf_prem_set_type==1 &&  !(jjf_val>0)){
			$(".free_val").val("");
			$(".free_val").attr("disabled",'true');
			$("input[name=jjf_val]").removeAttr("disabled");
		}else{
			$(".free_val").removeAttr("disabled");
			$(".fwf").attr("disabled",'true');
			$(".free_tip").show();
			setInsurerFWFValue();
			setInsFWDValue();
		}
		if(!$("input[name=jjf_val]").val()||(parseFloat($("input[name=jjf_val]").val()))<0){
			$("input[name=tdf_val]").val("");
			$("input[name=tgf_ins_val]").val("");
			$("input[name=tdf_val]").attr("disabled",'true');
			$("input[name=tgf_ins_val]").attr("disabled",'true');
		}
		var fwf_ins_val=$("input[name=fwf_ins_val]").val(),
			jjf_val=$("input[name=jjf_val]").val(),
			fwf_insurer_val=$("input[name=fwf_insurer_val]").val();
		if(xsf_prem_set_type==1 &&(!jjf_val || parseFloat(jjf_val)<0 || !fwf_ins_val ||parseFloat(fwf_ins_val)<0)){
			$("input[name=tgf_plat_val]").val("");
			$("input[name=qdf_val]").val("");
			$("input[name=tgf_plat_val]").attr("disabled",'true');
			$("input[name=qdf_val]").attr("disabled",'true');
		}else if((xsf_prem_set_type==2 && (!fwf_ins_val || !fwf_insurer_val || parseFloat(fwf_ins_val)<0 || parseFloat(fwf_insurer_val)<0))){
			$("input[name=tgf_plat_val]").val("");
			$("input[name=qdf_val]").val("");
			$("input[name=tgf_plat_val]").attr("disabled",'true');
			$("input[name=qdf_val]").attr("disabled",'true');
		}
	}
	/*
		平台收益计算
			费用关系：
			1）结算模式是可通过多方结算（经纪公司、平台、商户）：平台收益=技术服务费A+技术服务费B-推广费C-市场拓展费
			2）结算模式是仅通过经纪公司结算 平台收益=技术服务费B-推广费C-市场拓展费
			如果小于0时则代表计算有误，弹框提醒
	*/
	function setPlatValue(){
		var tgf_plat_val=parseFloat($("input[name=tgf_plat_val]").val()),
			qdf_val=parseFloat($("input[name=qdf_val]").val()),
			fwf_insurer_val=parseFloat($("input[name=fwf_insurer_val]").val()),
			fwf_ins_val=parseFloat($("input[name=fwf_ins_val]").val()),
			xsf_prem_set_type=$("input[name=xsf_prem_set_type]:checked").val(),
			plat=$("input[name=plat_val]");
		if(xsf_prem_set_type==1 && plat.attr('disabled') && qdf_val>=0 && tgf_plat_val>=0 && fwf_ins_val>=0){
			var rer=(fwf_ins_val-qdf_val-tgf_plat_val).toFixed(4)
			if(rer<0){
				showAlert("费用关系有误");
				plat.val("");
			}else{
				plat.val(rer);
			}
		}else if(xsf_prem_set_type==2 && plat.attr('disabled') && qdf_val>=0 && tgf_plat_val>=0 && fwf_insurer_val>=0 && fwf_ins_val>=0){
			var rer=(fwf_insurer_val+fwf_ins_val-qdf_val-tgf_plat_val).toFixed(4)
			if(rer<0){
				showAlert("费用关系有误");
				plat.val("");
			}else{
				plat.val(rer);
			}
		}else if(plat.attr('disabled')){
			plat.val("");
		}
	}
	/*
		通道费占比提醒
			1.通道费占保费比例的换算公式为：
				1）结算模式是可通过多方结算（经纪公司、平台、商户）：经纪费比例*通道费比例
				2）结算模式是仅通过经纪公司结算  
					含税时：经纪费比例/1.06*通道费比例
					不含税时：经纪费比例*通道费比例
			2.配置人员输入通道费比例后，系统换算出其占保费的比例，并以提示文本的形式展示在输入框右侧
			如果小于0时则代表计算有误，弹框提醒
	*/
	function setTDFTip(){
		var tip="系统换算结果：通道费占保费比例≈",
			jjf_val=parseFloat($("input[name=jjf_val]").val()),
			fwf_insurer=$("input[name=fwf_insurer_val]"),
			jjf_xsf_tax_type=$("input[name=jjf_xsf_tax_type]:checked").val(),
			xsf_prem_set_type=$("input[name=xsf_prem_set_type]:checked").val(),
			tdf_val=parseFloat($("input[name=tdf_val]").val()),
			free_tip=$("input[name=tdf_val]").parent().parent().find(".free_tip");
		if(xsf_prem_set_type==2 && jjf_val>=0 && tdf_val>=0){
			var rer=(jjf_val*tdf_val/100).toFixed(4)
			if(rer<0){
				showAlert("费用关系有误");
				free_tip.text("");
			}else{
				free_tip.text(tip+rer+'%');
			}
		}else if(xsf_prem_set_type==1 && jjf_val>=0 && tdf_val>=0){
			var rer;
			if(jjf_xsf_tax_type==1){
				rer=(parseFloat((jjf_val/1.06).toFixed(4))*tdf_val/100).toFixed(4)
			}else{
				rer=(jjf_val*tdf_val/100).toFixed(4)
			}
			if(rer<0){
				showAlert("费用关系有误");
				free_tip.text("");
			}else{
				free_tip.text(tip+rer+'%');
			}
		}else{
			free_tip.text("");
		}
			
	}
	/*
		经纪公司服务费计算
		费用关系：
			1）结算模式是可通过多方结算（经纪公司、平台、商户）：技术服务费B比例=经纪费比例-通道费比例（占保费）-推广费B比例
			1）结算模式是仅通过经纪公司结算  
				含税时：技术服务费B比例=经纪费/1.06-(经纪费/1.06*通道费/100)-经纪公司推广费
				不含税时：技术服务费B比例=经纪费-(经纪费*通道费/100)-经纪公司推广费
		如果小于0时则代表计算有误，弹框提醒
	*/
	function setInsFWDValue(){
		var tdf_val=parseFloat($("input[name=tdf_val]").val()),
			jjf_val=parseFloat($("input[name=jjf_val]").val()),
			tgf_ins_val=parseFloat($("input[name=tgf_ins_val]").val()),
			jjf_xsf_tax_type=$("input[name=jjf_xsf_tax_type]:checked").val(),
			xsf_prem_set_type=$("input[name=xsf_prem_set_type]:checked").val(),
			fwf_ins=$("input[name=fwf_ins_val]"),
			value;
		if(fwf_ins.attr('disabled') && tdf_val>=0 && jjf_val>=0 && tgf_ins_val>=0){
			if(xsf_prem_set_type==1){
				var rer
				if(jjf_xsf_tax_type==1){
					rer=(parseFloat((jjf_val/1.06).toFixed(4))-((parseFloat((jjf_val/1.06).toFixed(4))*tdf_val/100)+tgf_ins_val)).toFixed(4);
				}else{
					rer=(jjf_val-(jjf_val*tdf_val/100)-tgf_ins_val).toFixed(4)
				}
				if(rer<0){
					showAlert("费用关系有误");
					fwf_ins.val("");
				}else{
					fwf_ins.val(rer);
				}
			}else{
				var rer=(jjf_val-(jjf_val*tdf_val/100)-tgf_ins_val).toFixed(4)
				if(rer<0){
					showAlert("费用关系有误");
					fwf_ins.val("");
				}else{
					fwf_ins.val(rer);
				}
			}
			
		}else if(fwf_ins.attr('disabled')){
			fwf_ins.val("");
		}
	}
	/*
		设置保险公司服务费
		费用关系：
			1）选择含税时：技术服务费A比例=销售费用率/1.06-经纪费比例-推广费A比例
			2）选择不含税时：技术服务费A比例=销售费用率-经纪费比例-推广费A比例
		如果小于0时则代表计算有误，弹框提醒
	*/
	function setInsurerFWFValue(){
		var xsf_val=parseFloat($("input[name=xsf_val]").val()),
			jjf_val=parseFloat($("input[name=jjf_val]").val()),
			xsf_tax_type=$("input[name=xsf_tax_type]:checked").val(),
			tgf_insurer_val=parseFloat($("input[name=tgf_insurer_val]").val()),
			fwf_insurer=$("input[name=fwf_insurer_val]"),
			value;
		if(fwf_insurer.attr('disabled') && xsf_val>=0 && jjf_val>=0 && tgf_insurer_val>=0){
			if(xsf_tax_type==2){
				value=xsf_val-jjf_val-tgf_insurer_val;
			}else{
				value=parseFloat((xsf_val/1.06).toFixed(4))-jjf_val-tgf_insurer_val;
			}
			if(value<0){
				showAlert("费用关系有误");
				fwf_insurer.val("");
			}else{
				fwf_insurer.val(value.toFixed(4));
			}
			
		}else if(fwf_insurer.attr('disabled')){
			fwf_insurer.val("");
		}
			
	}
	//运行保费结算模式 改变方法，进行初始化
	$("input[name=xsf_prem_set_type]").change();
	//关闭费率配置的页面，只适用于在管理平台系统中操作时打开的页面，
	$("#cancle_btn").click(function(){
		if(asys){
			asys.closeModal();
		}
	});
	//保存并配置完成按钮
	$("#confirm_btn").click(function(){
		var t=$("form").serializeArray(),isErr=false,data={},isErrNum=false;
		$.each(t, function() {
			if(util.trimSpace(this.value,2)){
				if(this.name.indexOf("val")>-1 &&(isNaN(this.value)||parseFloat(this.value)<0)){
					isErrNum=true;
				}else if(data[this.name]){
					data[this.name] +=","+this.value; 
				}else{
					data[this.name] = this.value; 
				}
				
			}else{
				isErr=true;
			} 
		 
		});
		data.fwf_insurer_val=$("input[name=fwf_insurer_val]").val();
		data.fwf_ins_val=$("input[name=fwf_ins_val]").val();
		data.plat_val=$("input[name=plat_val]").val();
		if(isErrNum){
			showAlert("请输入正数");
			return;
		}
		if(data.xsf_prem_set_type==1){
			data.xsf_tax_type=data.jjf_xsf_tax_type;
			delete data.jjf_xsf_tax_type;
			if(data.jjf_val && data.tdf_val && data.fwf_ins_val && data.tgf_ins_val && data.tgf_plat_val && data.qdf_val && data.plat_val){
				data.save_status=2;
				postInfo(data);
			}else{
				showAlert("请完善配置信息");
			}
		}else{
			if(isErrNum){
				showAlert("请输入正数");
			}else if(isErr){
				showAlert("请完善配置信息");
			}else{
				data.save_status=2;
				postInfo(data);
			}
		}
		
	});
	//暂存按钮
	$("#save_btn").click(function(){
		var t=$("form").serializeArray(),isErr=false,data={},examine=false;
		$.each(t, function() {
			if(data[this.name]){
				data[this.name] +=","+util.trimSpace(this.value,2); 
			}else{
				data[this.name] = util.trimSpace(this.value,2); 
			}
		});
		data.fwf_insurer_val=$("input[name=fwf_insurer_val]").val();
		data.fwf_ins_val=$("input[name=fwf_ins_val]").val();
		data.plat_val=$("input[name=plat_val]").val();
		if(data.xsf_prem_set_type==1){
			data.xsf_tax_type=data.jjf_xsf_tax_type;
			delete data.jjf_xsf_tax_type;
		}
		if(data.type){
			if(data.type=='1,2'){
				data.type='3';
			}
		}
		data.save_status=1;
		postInfo(data);
	});
	
});
