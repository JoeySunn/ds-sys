/* 
	产品详情页面js文件
		showAlert : 错误信息弹框
		getInfo  ：获取产品信息和保障方案信息 并渲染
		showPremium ： 方案保费配置信息
		showItem ： 方案保障项目配置列表
		showAttr ： 方案属性信息
		getAgeType ：根据年龄type返回选择的类型
		getAgeSection ：根据年龄type返回选择的类型
*/
$(function(){
	var asys=window.parent.asys,dataInfo,
		has_attr,//是否需要配置属性，一旦有了之后的都需要显示这个td,
		attr_num,//属性配置项个数
		url_type=util.getQueryParam("type"),//页面状态，show为查看状态只能查看不能编辑，edit为编辑状态可编辑
		order=util.getQueryParam("order"),//order==1 表示从订单列表点击进入，不需要显示上架和预览按钮
		id=util.getQueryParam("id");//产品id
	if(!url_type || !id){
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
	//获取数据并渲染
	function getInfo(){
		if(!id){
			return;
		}
		//获取产品信息
		/*	
				p[name=**]、div[name=**] 等表示查看时显示的内容
				input[name=**]  表示编辑时输入框中显示的文字
				input[name=**][value=**]  表示编辑单选项或者多选项的值
		
		*/

		$.ajax({
			type:"POST",
			url:util.getURL("Product/info"),
			data:{
				id:id,
				info_module:0
			},
			dataType:"json",
			success:function(data){
			  if(data.status){
				  dataInfo=data.info;
				 var info=data.info;
				
				$("div[name='explain']").html(info.explain?info.explain:'');
				$("div[name='claim']").html(info.claim?info.claim:'');
				$("input[name=tgf_amt]").val(info.tgf_amt?info.tgf_amt:'');
				$("p[name=tgf_amt]").html(info.tgf_amt?info.tgf_amt:'');
				$("input[name=price]").val(info.price?info.price:'');
				$("p[name=price]").html(info.price?info.price:'');
				if(info.prem_calc==1){
					$("p[name=prem_calc]").text("按保险方案")
				}else if(info.prem_calc==2){
					$("p[name=prem_calc]").text("按年龄段")
				}else if(info.prem_calc==3){
					$("p[name=prem_calc]").text("按保险期间")
				}else{
					$("p[name=prem_calc]").text("未知");
				}				
				$("select[name=insurer_id]").val(info.insurer_id?info.insurer_id:'');
				$("select[name=insurer_id]").attr('insurer_id',info.insurer_id?info.insurer_id:'');
				$("p[name=insurer_name]").html(info.insurer_name?info.insurer_name:'');
				$("select[name=ins_id]").val(info.ins_id?info.ins_id:'');
				$("select[name=ins_id]").attr('ins_id',info.ins_id?info.ins_id:'');
				$("p[name=ins_name]").html(info.ins_name?info.ins_name:'');
				
				$("img[name='image_url']").attr("src",(info.image_url?info.image_url:""));
				 $("p[name='code']").html(info.code?info.code:'');
				 $("p[name='name']").html(info.name?info.name:'');
				 $("p[name='title']").html(info.title?info.title:'');
				 $("p[name='insured_area']").html(info.insured_area?info.insured_area:'');
				 $("p[name='ins_limit']").html(info.ins_limit?info.ins_limit:'');
				 $("input[name='link']").val(info.link?info.link:'');
				 $("p[name='link']").html(info.link?info.link:'');
				 if(info.butt_mode==1){
					 $("[name='butt_mode'][value='1']").prop("checked",true);
					 $("p[name='butt_mode']").html("平台对接");
				 }else if(info.butt_mode==2){
					 $("[name='butt_mode'][value='2']").prop("checked",true);
					 $("p[name='butt_mode']").html("外链产品");
				 }else{
					 $("p[name='butt_mode']").html("未知"); 
				 }
				 var typeStr=""
				 if(info.type==1){
					typeStr="产品推广";
					
					if(url_type=="show"){
						$("#type_show_1").show();
					}else{
						$("#type_1").show();
					}
					
				 }else if(info.type==2){
					typeStr="产品定制";
					
					if(url_type=="show"){
						$("#type_show_2").show();
					}else{
						$("#type_2").show();
					}
				 }else if(info.type==3){
					typeStr="产品推广;产品定制";
					
					if(url_type=="show"){
						$("#type_show_1").show();
						$("#type_show_2").show();
					}else{
						$("#type_1").show();
						$("#type_2").show();
					}
				 }else{
				
					$("#type_show_1").hide();
					$("#type_show_2").hide(); 
				 }
				 if(info.cls_name){
					 $("#type_show_1 [name='cls']").show();
					 $("#type_show_1 #cls_box").html(info.cls_name);
				 }else{
					 $("#type_show_1 [name='cls']").hide();
				 }
				$("#type_show_1 [name='ins']").show();
				 if(info.ins_type==1){
					$("#type_show_1 .ins_box").html("意外险");
				 }else if(info.ins_type==2){
					$("#type_show_1 .ins_box").html("健康险"); 
				 }else if(info.ins_type==3){
					$("#type_show_1 .ins_box").html("责任险"); 
				 }else if(info.ins_type==4){
					$("#type_show_1 .ins_box").html("财产险"); 
				 }else{
					$("#type_show_1 [name='ins']").hide();
				 }
				 if(info.scene_name){
					$("#type_show_2").show();
					 $("#type_show_2 #scene_box").html(info.scene_name); 
				 }else{
					 $("#type_show_2").hide();
				 }
				 $("p[name='type']").html(typeStr);
				 
				 $("p[name='fit_people']").html(info.fit_people?info.fit_people:'');
				 
				 $("div[name='desc']").html(info.desc?info.desc:'');
				if(info.exten){
					var extens=[];
					$.each(info.exten,function(key,val){
						if(val.type==1){
							extens.push("二维码");
						}else if(val.type==2){
							extens.push("推广链接");
						}else if(val.type==3){
							extens.push("APP接口");
						}
						
					});
					$("p[name=extens]").html(extens.toString());
				}else{
					$("p[name=extens]").html('');
				}
				var app_age_start=info.app_age_start,
					app_age_end=info.app_age_end,
					insrnt_age_start=info.insrnt_age_start,
					insrnt_age_end=info.insrnt_age_end,
					app_age_start_type=info.app_age_start_type,
					app_age_end_type=info.app_age_end_type,
					insrnt_age_start_type=info.insrnt_age_start_type,
					insrnt_age_end_type=info.insrnt_age_end_type;
				if(app_age_start==0 && app_age_end==400){
					$("p[name=app_age]").html("不限");
				}else if(app_age_end==400){
					$("p[name=app_age]").html(app_age_start+getAgeType(app_age_start_type)+'以上');
				}else if(parseInt(app_age_end)==-1){
					$("p[name=app_age]").html(app_age_start+getAgeType(app_age_start_type)+'以下');
				}else if(app_age_end_type==app_age_start_type){
					$("p[name=app_age]").html(app_age_start+'-'+app_age_end+getAgeType(app_age_end_type));
				}else{
					$("p[name=app_age]").html(app_age_start+getAgeType(app_age_start_type)+'-'+app_age_end+getAgeType(app_age_end_type));
				}
				if(insrnt_age_start==0 && insrnt_age_end==400){
					$("p[name=insrnt_age]").html("不限");
				}else if(insrnt_age_end==400){
					$("p[name=insrnt_age]").html(insrnt_age_start+getAgeType(insrnt_age_start_type)+'以上');
				}else if(parseInt(insrnt_age_end)==-1){
					$("p[name=insrnt_age]").html(insrnt_age_start+getAgeType(insrnt_age_start_type)+'以下');
				}else if(insrnt_age_end_type==insrnt_age_start_type){
					$("p[name=insrnt_age]").html(insrnt_age_start+'-'+insrnt_age_end+getAgeType(insrnt_age_start_type));
				}else{
					$("p[name=insrnt_age]").html(insrnt_age_start+getAgeType(insrnt_age_start_type)+'-'+insrnt_age_end+getAgeType(insrnt_age_end_type));
				}
				if(info.status==1){
					$("#save_btn").hide();
				}
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
		
		
		//获取保障方案配置信息
		$.ajax({
			type:"POST",
			url:util.getURL("Product/risk_lists"),
			data:{
				product_id:id
			},
			dataType:"json",
			success:function(data){
				if(data.status){
					var info=data.info;
					$("#risk tbody").html("");
					if(info){
						for(var i=0;i<info.length;i++){
							var risk=info[i],
								kind=null,
								html="<tr><td>"+(risk.risk_type?risk.risk_type:'-')+"</td><td>"+(risk.risk_name?risk.risk_name:'-')+"</td>";
							if(risk.has_attr==1){//是否需要配置属性
								$("#risk  .risk_attr").show();//显示属性列
								html+="<td class='operation'><a opName='attr_show'>查看</a></td>";
								has_attr=true;
							}else{
								html+="<td class='operation risk_attr' "+(has_attr?"":'hidden')+"></td>"
							}
							html+="<td class='operation'><a opName='item_config'>查看</a></td><td class='operation'><a opName='premium_config'>查看</a></td></tr>";
							$("#risk tbody").append(html);
							$('#risk tbody tr:last')[0].trData=risk;
						}	
					}else{
						$("#risk").html("<div class='noData'>暂无配置</div>");
					}
					binClick();
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
	/*
		方案保费配置信息
		 根据保费计算方式 来渲染不同类型的保费显示方式
			riskData : 保费查看按钮所在行的 数据
	*/
	function showPremium(riskData){
		var html='';
		$("#premium tbody").html("");
		$("#premium thead tr").html("");
		if(dataInfo.prem_calc==1){
			html="<th>方案名称</th><th>保险期间（天）</th><th>保费（元）</th><th class='"+(url_type=="show"?'hidden':'')+"'>操作</th>";
			$("#premium thead tr").html(html);
			$("#premium .add_btn_box").remove();
			html="<tr><td>"+riskData.risk_name+"</td><td>"+(riskData.risk_day?riskData.risk_day:'-')+"</td><td>"+(riskData.risk_price?riskData.risk_price:'--')+"</td><td class='operation "+(url_type=="show"?'hidden':'')+"'><a opName='edit'>编辑</a> </td></tr>"
			$("#premium tbody").html(html);
			$("#premium").modal("show");
		}else {
			$.ajax({
				type:"POST",
				url:util.getURL("Product/prem_lists"),
				data:{
					product_id:id,
					risk_type:riskData.risk_type
				},
				dataType:"json",
				success:function(data){
				  if(data.status){
					  var info=data.info,rowNun=info?info.length:0,kind;
					  $("#premium tbody").html("");
					if(dataInfo.prem_calc==2){
						html="<th>方案名称</th><th>保险期间（天）</th><th>年龄段</th><th>保费（元）</th>";
						$("#premium thead tr").html(html);
						$("#premium .add_btn_box").hide();
						html='<tr><td rowspan='+rowNun+'>'+riskData.risk_name+'</td><td rowspan='+rowNun+'>'+(riskData.risk_day?riskData.risk_day:'-')+'</td>';
						if(rowNun==0){
							html+="<td>-</td><td>-</td>"
						}else{
							kind=info[0];
							html+="<td>"+getAgeSection(kind.start_num,kind.end_num,kind.start_type,kind.end_type)+"</td>";
							html+="<td>"+kind.n_prm+"</td></tr>"	
						}
						$("#premium tbody").append(html);
						$('#premium tbody tr:last')[0].trData=kind;
						$('#premium tbody tr:last')[0].riskData=riskData;
						for(var j=1;j<rowNun;j++){
							kind=info[j];
							html="<tr><td>"+getAgeSection(kind.start_num,kind.end_num,kind.start_type,kind.end_type)+"</td>";
							html+="<td>"+kind.n_prm+"</td></tr>"	
							$("#premium tbody").append(html);
						}
					}else if(dataInfo.prem_calc==3){
						html="<th>方案名称</th><th>保险期间</th><th>保费（元）</th>";
						$("#premium thead tr").html(html);
						$("#premium .add_btn_box").hide();
						html='<tr><td rowspan='+rowNun+'>'+riskData.risk_name+'</td>';
						if(rowNun==0){
							html+="<td>-</td><td>-</td></tr>"
						}else{
							kind=info[0];
							if(kind.type==2){
								html+="<td>全年</td>"
							}else{
								html+="<td>"+kind.start_num+"天-"+kind.end_num+"天</td>"
							}
							html+="<td>"+kind.n_prm+"</td></tr>"	
						}
						$("#premium tbody").append(html);
						for(var j=1;j<rowNun;j++){
							kind=info[j];
							if(kind.type==2){
								html="<tr><td>全年</td>"
							}else{
								html="<tr><td>"+kind.start_num+"天-"+kind.end_num+"天</td>"
							}
							html+="<td>"+kind.n_prm+"</td></tr>"	
							$("#premium tbody").append(html);
						}
					}else if(dataInfo.prem_calc==4){
						html="<th>方案名称</th><th>年龄段</th><th>保险期间</th><th>保费（元）</th>";
						$("#premium thead tr").html(html);
						$("#premium .add_btn_box").hide();
						html='<tr><td rowspan='+rowNun+'>'+riskData.risk_name+'</td>';
						if(rowNun==0){
							html+="<td>-</td><td>-</td><td>-</td></tr>"
						}else{
							kind=info[0];
							html+="<td>"+(kind.attr_name?kind.attr_name:'')+"</td>";
							if(kind.type==2){
								html+="<td>全年</td>"
							}else{
								html+="<td>"+kind.start_num+"天-"+kind.end_num+"天</td>"
							}
							html+="<td>"+kind.n_prm+"</td></tr>"	
						}
						$("#premium tbody").append(html);
						for(var j=1;j<rowNun;j++){
							kind=info[j];
							html+="<tr><td>"+(kind.attr_name?kind.attr_name:'')+"</td>";
							if(kind.type==2){
								html="<td>全年</td>"
							}else{
								html="<td>"+kind.start_num+"天-"+kind.end_num+"天</td>"
							}
							html+="<td>"+kind.n_prm+"</td></tr>"	
							$("#premium tbody").append(html);
						}
					}
					$("#premium").modal("show");
				  }else{
					showAlert(data.info);
				  }
				},
				error:function(){
					showAlert();
				}
			})
		}
	}
	/*
		方案保障项目配置列表
			riskData 保障项目 查看按钮所在行的 数据
	*/
	function showItem(riskData){
		$.ajax({
				type:"POST",
				url:util.getURL("Product/kind_lists"),
				data:{
					product_id:id,
					risk_type:riskData.risk_type
				},
				dataType:"json",
				success:function(data){
				  if(data.status){
						$("#itemSee").modal("show");
						$("#itemSee tbody").html("");
						var info=data.info,rowNun=info?info.length:0,kind,html;
						$("#itemSee .add_btn_box").hide();
						html='<tr><td rowspan='+rowNun+'>'+(riskData.risk_name?riskData.risk_name:'--')+'</td>';
						if(rowNun==0){
							html+="<td>-</td><td>-</td><td>-</td><td>-</td>"
						}else{
							kind=info[0];
							html+="<td>"+(kind.kind_cde?kind.kind_cde:'--')+"</td><td>"+(kind.kind_name?kind.kind_name:'--')+"</td><td>"+(kind.n_amt?kind.n_amt:'--')+"</td><td>"+(kind.kind_desc?kind.kind_desc:'--')+"</td>";	
						}
						html+="</tr>";
						$("#itemSee tbody").append(html);
						$('#itemSee tbody tr:last')[0].trData=kind;
						$('#itemSee tbody tr:last')[0].riskData=riskData;
						for(var j=1;j<rowNun;j++){
							kind=info[j];
							html="<tr><td>"+(kind.kind_cde?kind.kind_cde:'--')+"</td><td>"+(kind.kind_name?kind.kind_name:'--')+"</td><td>"+(kind.n_amt?kind.n_amt:'--')+"</td><td>"+(kind.kind_desc?kind.kind_desc:'--')+"</td>"
							html+="</tr>"	
							$("#itemSee tbody").append(html);
							$('#itemSee tbody tr:last')[0].trData=kind;
							$('#itemSee tbody tr:last')[0].riskData=riskData;
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
	/*
		方案属性信息
			riskData 属性 查看按钮所在行的 数据
	*/
	function showAttr(riskData){
		$.ajax({
				type:"POST",
				url:util.getURL("Product/risk_attr_info"),
				data:{
					product_id:id,
					risk_type:riskData.risk_type
				},
				dataType:"json",
				success:function(data){
				  if(data.status){
					  $("#attr").modal("show");
					  $("#attr #editboxLabel").text(riskData.risk_name);
					  $("#attr input[name=risk_type]").val(riskData.risk_type);
					  $("#attr .form-horizontal").html("");
					  attr_num=data.info.length;
					  $.each(data.info,function(){
							var html='<div class="form-group">'
								+		'<label class="radio col-sm-3">'+this.attr_name+'</label>';
							$("#attr #cancle_btn").text("关闭");
								$("#attr #submit_btn").hide();
								if(this.options){
									for(var i=0;i<this.options.length;i++){
										if(this.options[i].is_select==1){
											html+='<label class="radio col-sm-3">'+this.options[i].name+'</label>'
										}
									}
								}
								html+="</div>";
							$("#attr .form-horizontal").append(html);
					  })
				  }else{
					showAlert(data.info);
				  }
				},
				error:function(){
					showAlert();
				}
			})
	}
	
	
	//根据年龄type返回选择的类型（1周岁，2月，3天）
	function getAgeType(type){
		return type==1?'周岁':type==2?'月':type==3?'天':'周岁';
	}
	/*
		根据年龄类型和年龄的规则 显示信息
			结束年龄字段是 400：表示以上
						   -1：表示以下
			type: （1周岁，2月，3天）
			0-以上表示 不限(不用管type类型)
			如果 开始年龄字段不是 0时 结束年龄字段是以上或者以下时 根据type判断下类型（1天以上/1周岁以上/1天以下/1周岁以下）
			如果 年龄类型相同则只用显示一个类型（1-4天/1-4周岁）
			如果 年龄类型不相同时分开显示类型（1天-4岁）
			
			
	*/
	function getAgeSection(app_age_start,app_age_end,app_age_start_type,app_age_end_type){
		if(app_age_start==0 && app_age_end==400){
			return '不限';
		}else if(app_age_end==400){
			return app_age_start+getAgeType(app_age_start_type)+'以上';
		}else if(parseInt(app_age_end)==-1){
			return app_age_start+getAgeType(app_age_start_type)+'以下';
		}else if(app_age_end_type==app_age_start_type){
			return app_age_start+'-'+app_age_end+getAgeType(app_age_end_type);
		}else{
			return app_age_start+getAgeType(app_age_start_type)+'-'+app_age_end+getAgeType(app_age_end_type);
		}
	}
	//方案配置表格中监听事件
	function binClick(){
		$('#risk .operation a').click(function(){
			var opName=$(this).attr("opName"),
				trData=$(this).closest('tr')[0].trData;
			opData=trData;
			if(opName=='premium_config'){
				showPremium(trData);
				
			}else if(opName=='item_config'){
				showItem(trData);
			}else if(opName=='attr_show'){
				showAttr(trData);
			}
		})
	}
	getInfo();
	//根据type 显示效果不相同，show时将可以编辑的全部删除只能查看
	if(url_type=="show"){
		$(".edit").remove();
	}
	//order==1 表示从订单列表点击进入，不需要显示上架和预览按钮
	if(order==1){
		$("#save_btn").hide();
		$("#preview_btn").hide();
	}
	//关闭产品信息的页面，只适用于在管理平台系统中操作时打开的页面，
	$("#cancle_btn").click(function(){
		if(asys){
			asys.closeModal();
		}
	});
	//预览事件
	$("#preview_btn").click(function(){
		window.open(util.getProductPreview(id));
	});
	$("#save_btn").click(function(){
		$.ajax({
			type:"POST",
			url:util.getURL("Product/status_do"),
			data:{
				id:id,
				type:1,
			},
			dataType:"json",
			success:function(data){
			  if(data.status){
				showAlert("上架成功");
				asys.closeModal();
				
			  }else{
				showAlert(data.info);
			  }
			},
			error:function(){
				showAlert();
			}
		});
	});
	
	
});
