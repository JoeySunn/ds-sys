/*
	方案配置js文件
		showAlert ：错误信息弹框	
		getInfo ： 获取方案数据
		setKindInfo ： 保存方案项目数据
		setAttr ： 保存方案属性数据
		setPremiumInfo : 保存保费数据
		getPows : 获取方案配置中的权限
		showItem ： 获取项目配置
		showAttr ： 获取属性配置
		showPremium ： 方案保费配置信息
		getAgeType ：根据年龄type返回选择的类型
		getAgeSection ： 根据年龄类型和年龄的规则 显示信息
		itemBinClick ： 保障项目模态框中的点击事件
		premiumBinClick ： 保费模态框中的点击事件
		binClick ： 方案配置表格中监听事件
		addPremium ： 弹框html渲染，并绑定事件
		setPremiumNum ： 计算title
		premiumHtmlBin ： 事件绑定方法
		getPremiumHtml ： 获取保费配置html
		setKindNum ： 计算保证项目title
		showPreview ： 预览弹框显示
	其它dom事件的绑定
		
*/
$(function(){
	var asys=window.parent.asys,
		from_risk_type,//方案复制时，被复制的方案 risk_type
		item_num=2,//用于添加保险项目时创建不同的ID
		opData,//操作的方案数据
		has_attr,//是否需要配置属性，一旦有了之后的都需要显示这个td,
		attr_num,//属性配置项个数
		url_type=util.getQueryParam("type"),//页面状态，show为查看状态只能查看不能编辑，edit为编辑状态可编辑
		id=util.getQueryParam("id");//产品id
	if(!url_type || !id){
		showAlert("信息有误");
		if(asys){
			asys.closeModal();	//关闭模态框	
		}
	}
	//禁止回车提交，即回车会关闭模态框bug
	$(document).keydown(function(event){   
		if (event.keyCode == 13) {     
			$('form').each(function() {       
				event.preventDefault();     
			});  
		}
	});
	/*
		错误信息弹框
			msg:错误信息
	*/
	function showAlert(msg){
		if(!msg){
			msg="请求数据失败！请稍后再试";
		}
		if(asys){
			asys.showAlert({title:'温馨提醒',msg:msg,isCancel:false});
		}else{
			alert(msg);
		}
	}
	/*
		获取方案数据并渲染表格
			如果没有数据 则显示 "暂无配置" 否则渲染表格数据，如果数据中有为空数据则以’--‘代替；
			根据页面url中的type来判断 是否显示编辑 还是查看
			隐藏所有的按钮即a标签
			获取权限，来显示a标签
			绑定表格按钮对应事件
	*/
	function getInfo(){
		if(!id){
			return;
		}
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
								html="<tr><td>"+(risk.risk_type?risk.risk_type:'-')+"</td><td><label class='showBox'><label class='value'>"+(risk.risk_name?risk.risk_name:'-')+"</label><span class='glyphicon glyphicon-edit "+(url_type=="show"?'hidden':'')+"'></span></label></td>";
							if(risk.has_attr==1){//是否需要配置属性
								$("#risk  .risk_attr").show();//显示属性列
								html+="<td class='operation'>"+(url_type=="edit"?'<a opName="attr_edit">编辑</a>':"<a opName='attr_show'>查看</a>")+"</td>";
								has_attr=true;
							}else{
								html+="<td class='operation risk_attr' "+(has_attr?"":'hidden')+"></td>"
							}
							html+="<td class='operation'><a opName='item_config'>"+(url_type=="edit"?"配置":'查看')+"</a>"+(url_type=="edit"?(risk.has_kind==1?"<div><a opName='item_copy'>复制</a></div>":"")+"<div><a hidden opName='item_paste'>粘贴</a></div>":'')+"</td><td class='operation'><a opName='premium_config'>"+(url_type=="edit"?"配置":'查看')+"</a>"+(url_type=="edit"?(risk.has_kind==1?"<div><a opName='premium_copy'>复制</a></div>":"")+"<div><a hidden opName='premium_paste'>粘贴</a></div>":'')+"</td></tr>";
							$("#risk tbody").append(html);
							risk.prem_calc=data.url.prem_calc;
							$('#risk tbody tr:last')[0].trData=risk;
						}
						$("#risk .operation a").hide();
						getPows('authProduct_config',$("#risk"));
						binClick();	
					}else{
						$("#risk").html("<div class='noData'>暂无配置</div>");
						//删除所有预览按钮
						$("#attr_preview").remove();
						$("#item_preview").remove();
						$("#premium_preview").remove();
					}
					if(!has_attr){
						$("#attr_preview").remove();
					}
					if(data.url.prem_calc==1){
						$("p[name=prem_calc]").text("按保险方案")
					}else if(data.url.prem_calc==2){
						$("p[name=prem_calc]").text("按年龄段")
					}else if(data.url.prem_calc==3){
						$("p[name=prem_calc]").text("按保险期间")
					}else if(data.url.prem_calc==4){
						$("p[name=prem_calc]").text("按保险期限和年龄段")
					}else{
						$("p[name=prem_calc]").text("未知");
						$("#risk .operation a[opName=premium_config]").remove();//如果没有类型 则不能编辑保费
					}
				}else{
					showAlert(data.info);
					if(asys){
						asys.closeModal();	//关闭模态框	
					}
				}
			},
			error:function(){
				showAlert("数据请求失败！");
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
		$(".cancle_box").text("关闭");
		$(".submit_btn").remove();
	}else{
		$(".show").remove();
	}
	//保存方案项目数据
	function setKindInfo(){
		var kind_info=[],//方案项目配置数组
			isErr=false,//用于判断是否有错误
			postData={};//上传数据的对象
		$('#addKind form').each(function(i){//由于form 有多个，即可能会同时添加多个配置项
			var t=$(this).serializeArray(),data={},errorType=0,errorText;//错误信息类型：0 无错误 1，有空数据 2：保障金额输入有误
			$.each(t, function() {//当前from数据构造并判断有无空数据
				if(util.trimSpace(this.value,1)){
					data[this.name] = this.value; 
				}else if(this.name!='kind_id'){//保费配置id可为空，添加的时候无
					isErr=true;
				}
			});
			if(isErr){//判断当前表单是否有空数据
				errorType=1;
			}else if(isNaN(data.n_amt)||parseFloat(data.n_amt)<0){//判断当前表单保费是否字段是否输入正确
				errorType=2;
				isErr=true;
			}
			/*判断是否有错。
					如果有错则根据form个数组装不同的报错文字（根据 错误信息类型）
						如果多个form 则组装第几个有误的报错文字
						如果只有一个则不直接报错文字
						跳出each 循环
						
				*/
			if(errorType>0){
				if($('#addKind form').length>1){
					if(errorType==1){
						errorText='请完善第'+(i+1)+'个配置信息'
					}else{
						errorText='第'+(i+1)+'个保障金额输入有误'
					}
				}else{
					if(errorType==1){
						errorText='请完善配置信息'
					}else{
						errorText='保障金额输入有误'
					}
				}
				showAlert(errorText);
				return false;
			}
			kind_info.push(data);
		})
		var risk_type=$('#addKind').find("input[name=risk_type]").val();
		if(isErr){//如果有错误，只需不向下执行就可，循环中已显示错误弹框
			return;
		}
		if(!risk_type){
			showAlert("数据有误");
			if(asys){
				asys.closeModal();	//关闭模态框	
			}
			return;
		}
		postData.risk_type=risk_type;
		postData.product_id=id;
		postData.kind_info=JSON.stringify(kind_info);
		$.ajax({
			type:"POST",
			url:util.getURL("Product/kind_update_do"),
			data:postData,
			dataType:"json",
			success:function(data){
			  if(data.status){
				showAlert("保存成功");
				getInfo();
				if(opData){
					showItem(opData);
				}
				$('#addKind').modal('hide');
			  }else{
				showAlert(data.info);
			  }
			},
			error:function(){
				showAlert();
			}
		})
		
		
	}
	//保存方案属性数据
	function setAttr(){
		var attr_info=[],isErr=false,postData={};
		$('#attr form').each(function(i){//由于form 有多个，即可同时添加多个配置项
			var t=$(this).serializeArray(),data={};
			$.each(t, function() {//当前from表单构造数据并判断有无空数据
				if(util.trimSpace(this.value,1)){
					attr_info.push({attr_id:this.name.split("_")[1],code:this.value})
				}else{
					isErr=true;
				}
			});
			
		})
		var risk_type=$('#attr').find("input[name=risk_type]").val();
		if(isErr || attr_info.length< attr_num){//属性是否全部选择了
			showAlert("请完善配置信息");
			return;
		}
		if(!risk_type){//如果没有方案类型数据则 报错
			showAlert("数据有误");
			return;
		}
		//构造数据，并提交数据
		postData.risk_type=risk_type;
		postData.product_id=id;
		postData.attr_info=JSON.stringify(attr_info);
		$.ajax({
			type:"POST",
			url:util.getURL("Product/risk_attr_do"),
			data:postData,
			dataType:"json",
			success:function(data){
			  if(data.status){
				showAlert("保存成功");
				$('#attr').modal('hide');
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
		保存保费数据
			保费配置时 根据不同的保费结算方案，保存时服务器控制层不相同
	*/
	function setPremiumInfo(){
		if(opData.prem_calc==1){//按照方案时 保存需要保存方案中的保费
			var  risk_price=$('#addPremium input[name=n_prm]').val(),//获取输入的保费
				 risk_day=$('#addPremium input[name=risk_day]').val();//获取输入的保险期限
			if(isNaN(risk_price)||parseFloat(risk_price)<0){//判断输入信息
				showAlert("保费金额输入有误");
				return;
			}
			if(isNaN(risk_day)||parseInt(risk_day)<0 || risk_day.indexOf(".")>-1){//判断输入信息
				showAlert("请输入正确的保险期限");
				return;
			}
			//构造数据
			var postData={
				id:id,
				risk_type:opData.risk_type,
				risk_price:risk_price,
				risk_day:risk_day,
			}
			//保存数据
			$.ajax({
				type:"POST",
				url:util.getURL("Product/risk_update_do"),
				data:postData,
				dataType:"json",
				success:function(data){
				  if(data.status){
					showAlert("保存成功");
					//更新数据
					getInfo();//速度慢
					opData.risk_price=risk_price;//直接赋值然后下步好显示
					opData.risk_day=risk_day;//直接赋值然后下步好显示
					if(opData){
						showPremium(opData);
					}
					//关闭保费配置输入添加或者编辑弹框
					$('#addPremium').modal('hide');
				  }else{
					showAlert(data.info);
				  }
				},
				error:function(){
					showAlert();
				}
			})
		}else{//其他两个结算方式 保存保费数据
			var prem_info=[],//保费总配置数组
				isErr=false,//用于判断是否有错误
				postData={};//上传数据的对象
			$('#addPremium form').each(function(i){//由于form 有多个，即可同时添加多个配置项
				var t=$(this).serializeArray(),data={},errorType=0,errorText;//错误信息类型：0 无错误 1，有空数据 2：保障金额输入有误
				$.each(t, function() {//当前from数据构造并判断有无空数据
					if(util.trimSpace(this.value,1)){
						data[this.name] = this.value; 
					}else if(this.name!='prem_id'){//保费配置id可为空，添加的时候无
						isErr=true;
					}
				});
				if(isErr){//判断当前表单是否有空数据
					errorType=1;
				}else if(isNaN(data.n_prm)||parseFloat(data.n_prm)<0){//判断当前表单保费是否字段是否输入正确
					errorType=2;
					isErr=true;
				}
				/*判断是否有错。
					如果有错则根据form个数组装不同的报错文字（根据 错误信息类型）
						如果多个form 则组装第几个有误的报错文字
						如果只有一个则不直接报错文字
						跳出each 循环
						
				*/
				if(errorType>0){
					if($('#addPremium form').length>1){
						if(errorType==1){
							errorText='请完善第'+(i+1)+'个配置信息'
						}else{
							errorText='第'+(i+1)+'个保费金额输入有误'
						}
					}else{
						if(errorType==1){
							errorText='请完善配置信息'
						}else{
							errorText='保费金额输入有误'
						}
					}
					showAlert(errorText);
					return false;
				}
				if(opData.prem_calc==2){//如果是按照年龄段配置时 需要选择年龄或者天等信息则需要判断是否合规
					var start_num,end_num
					if(data.start_type==1){
						start_num=parseInt(data.start_num)*365;//将年转换成天
					}else{
						start_num=parseInt(data.start_num);
					}
					if(data.end_type==1){
						end_num=parseInt(data.end_num)*365;//将年转换成天
					}else{
						end_num=parseInt(data.end_num);
					}
					if((start_num>end_num && data.end_num!=-1)||(data.start_num==0&&data.end_num==-1)){
						if($('#addPremium form').length>1){
							errorText='第'+(i+1)+'个年龄区间选择有误';
						}else{
							errorText='年龄区间选择有误';
						}
						isErr=true;
					}
				}else{//如果是按照保险期间判断则需要 判断天数区间选择是否合规
					start_num=parseInt(data.start_num);
					end_num=parseInt(data.end_num);
					if(start_num>end_num && data.type==1){
						if($('#addPremium form').length>1){
							errorText='第'+(i+1)+'个时间区间选择有误';
						}else{
							errorText='时间区间选择有误';
						}
						isErr=true;
					}
				}
				//显示报错,并跳出each 循环
				if(isErr){
					showAlert(errorText);
					return false;
				}
				//如果是按照保险期间判断并且选择的是全年计划结束时间需要提交 365，开始时间是0
				if((opData.prem_calc==3 || opData.prem_calc==4) && data.type==2){
					data.start_num=0;
					data.end_num=365;
				}
				//将组装好的数据放入配置数组中
				prem_info.push(data);
			})
			var risk_type=$('#addPremium').find("input[name=risk_type]").val();//获取方案类型
			if(isErr){//如果有错误则不继续执行
				return;
			}
			if(!risk_type){//如果没有方案类型数据则 报错
				showAlert("数据有误");
				return;
			}
			//数据组装并post给服务器
			postData.risk_type=risk_type;
			postData.product_id=id;
			postData.prem_info=JSON.stringify(prem_info);
			$.ajax({
				type:"POST",
				url:util.getURL("Product/prem_update_do"),
				data:postData,
				dataType:"json",
				success:function(data){
				  if(data.status){
					showAlert("保存成功");
					//更新数据
					getInfo();
					if(opData){
						showPremium(opData);//重新渲染保费配置弹框
					}
					//关闭保费配置输入添加或者编辑弹框
					$('#addPremium').modal('hide');
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
		获取方案配置中的权限，并根据权限渲染数据
		在渲染权限按钮时会给a标签opName属性，一般情况下会使用权限的最后一部分如:
				权限 fcode：authProduct_config
				a标签的html就为 ：<a opName="config">保障方案</a>
		
			fcode： fcode
			jqDom : jquery 的Dom对象 
		
	*/
	function getPows(fcode,jqDom){
		$.ajax({
			type:"POST",
			url:util.getURL("Permissions/right_menu"),
			data:{
				fcode:fcode
			},
			dataType:"json",
			success:function(data){
			  if(data.status){
				for(var i=0;i<data.info.length;i++){
					var opName=data.info[i].fcode.split("_");
					//特殊权限处理
					if(data.info[i].fcode=='authProduct_config_item_config'){
						jqDom.find(".operation a[opName=item_config]").show();
					}else if(data.info[i].fcode=='authProduct_config_premium_config'){
						jqDom.find(".operation a[opName=premium_config]").show();
					}else if(data.info[i].fcode=='authProduct_config_attr_edit'){
						jqDom.find(".operation a[opName=attr_edit]").show();
					}else if(data.info[i].fcode=='authProduct_config_attr_show'){
						jqDom.find(".operation a[opName=attr_show]").show();
					}else if(data.info[i].fcode=='authProduct_config_item_copy'){
						jqDom.find(".operation a[opName=item_copy]").show();
					}else if(data.info[i].fcode=='authProduct_config_premium_copy'){
						jqDom.find(".operation a[opName=premium_copy]").show();
					}else if(opName[(opName.length-1)]=='add'){
						jqDom.find(".add_btn_box").show();
					}else{
						jqDom.find(".operation a[opName="+opName[(opName.length-1)]+"]").show();
					}
				}
			  }
			},
			error:function(){
				
			}
		})
	}
	
	/*
		获取项目配置，并渲染
			riskData : 项目配置 查看或者配置 按钮所在行的 数据
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
				  $("#itemSee").modal("show");//显示模态框
				  $("#itemSee tbody").html("");
				  var info=data.info,rowNun=info?info.length:0,kind,html;
					$("#itemSee .add_btn_box").hide();
					html='<tr><td rowspan='+rowNun+'>'+(riskData.risk_name?riskData.risk_name:'--')+'</td>';
					if(rowNun==0){//没有配置过
						html+="<td>-</td><td>-</td><td>-</td><td>-</td><td class='operation "+(url_type=="show"?'hidden':'')+"'><a opName='edit'>编辑</a></td>"
					}else{//配置过，先渲染第一个
						kind=info[0];
						html+="<td>"+(kind.kind_cde?kind.kind_cde:'--')+"</td><td>"+(kind.kind_name?kind.kind_name:'--')+"</td><td>"+(kind.n_amt?kind.n_amt:'--')+"</td><td>"+(kind.kind_desc?kind.kind_desc:'--')+"</td>"
						html+="<td class='operation "+(url_type=="show"?'hidden':'')+"'><a opName='edit'>编辑</a> <div><a opName='delete'>删除</a></div></td>"	
					}
					html+="</tr>";
					$("#itemSee tbody").append(html);
					//绑定数据
					$('#itemSee tbody tr:last')[0].trData=kind;
					$('#itemSee tbody tr:last')[0].riskData=riskData;
					//渲染之后的数据
					for(var j=1;j<rowNun;j++){
						kind=info[j];
						html="<tr><td>"+(kind.kind_cde?kind.kind_cde:'--')+"</td><td>"+(kind.kind_name?kind.kind_name:'--')+"</td><td>"+(kind.n_amt?kind.n_amt:'--')+"</td><td>"+(kind.kind_desc?kind.kind_desc:'--')+"</td>"
						html+="<td class='operation "+(url_type=="show"?'hidden':'')+"'><a opName='edit'>编辑</a> <div><a opName='delete'>删除</a></div></td></tr>"	
						$("#itemSee tbody").append(html);
						//绑定数据
						$('#itemSee tbody tr:last')[0].trData=kind;
						$('#itemSee tbody tr:last')[0].riskData=riskData;
					}
				//将所有操作的按钮 隐藏
				$("#itemSee .operation a").hide();
				//获取权限，显示按钮
				getPows('authProduct_config_item_config',$("#itemSee"));
				//绑定事件
				itemBinClick();
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
		获取属性配置，并渲染
			riskData :属性 查看或者配置 按钮所在行的 数据
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
					  $("#attr #editboxLabel").text(riskData.risk_name);//显示配置属性的 方案名称
					  $("#attr input[name=risk_type]").val(riskData.risk_type);//方案类型
					  $("#attr .form-horizontal").html("");//清除之前数据
					  attr_num=data.info.length;//记录可配置个数
					  $.each(data.info,function(){
							var html='<div class="form-group">'
								+		'<label class="radio col-sm-3">'+this.attr_name+'</label>';
							if(url_type=='edit'){//编辑样式
								//先渲染前俩个
								if(this.options && this.options[0]){
									html+='<div class="radio col-sm-4">'
									+			'<input type="radio" class="free_type" name="attr_'+this.attr_id+'" value="'+this.options[0].code+'" '+(this.options[0].is_select==1?'checked':'')+'> '+this.options[0].name
									+		'</div>';
								}
								if(this.options && this.options[1]){
									html+=		'<div class="radio col-sm-4">'
									+			'<input type="radio" class="free_type" name="attr_'+this.attr_id+'" value="'+this.options[1].code+'" '+(this.options[1].is_select==1?'checked':'')+'> '+this.options[1].name
									+		'</div>';
								}
								html+="</div>"
								if(this.options){//是否有选项
									for(var i=2;i<this.options.length;i+=2){//从第三个开始渲染，每次渲染两个
										html+='<div class="form-group">'
										+		'<label class="radio col-sm-3"></label>';
										if(this.options && this.options[i]){
											html+='<div class="radio col-sm-4">'
											+			'<input type="radio" class="free_type" name="attr_'+this.attr_id+'" value="'+this.options[i].code+'" '+(this.options[i].is_select==1?'checked':'')+'> '+this.options[i].name
											+		'</div>';
										}
										if(this.options && this.options[i+1]){
											html+='<div class="radio col-sm-4">'
											+			'<input type="radio" class="free_type" name="attr_'+this.attr_id+'" value="'+this.options[i+1].code+'" '+(this.options[i+1].is_select==1?'checked':'')+'> '+this.options[i+1].name
											+		'</div>';
										}
										html+='</div>';
									}
								}
							}else{//查看
								$("#attr #cancle_btn").text("关闭");
								$("#attr #submit_btn").hide();
								if(this.options){
									for(var i=0;i<this.options.length;i++){
										if(this.options[i].is_select==1){
											html+='<label class="radio col-sm-3">'+this.options[i].name+'</label>'
										}
									}
								}
								html+='</div>';
							}
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
	/*
		方案保费配置信息
		 根据保费计算方式 来渲染不同类型的保费显示方式
			riskData : 保费查看按钮所在行的 数据
	*/
	function showPremium(riskData){
		var html='',th_num;
		$("#premium tbody").html("");
		$("#premium thead tr").html("");
		if(riskData.prem_calc==1){//按照方案时
			html="<th>方案名称</th><th>保险期间（天）</th><th>保费（元）</th><th class='"+(url_type=="show"?'hidden':'')+"'>操作</th>";
			$("#premium thead tr").html(html);
			$("#premium .add_btn_box").remove();
			html="<tr><td>"+riskData.risk_name+"</td><td>"+(riskData.risk_day?riskData.risk_day:'-')+"</td><td>"+(riskData.risk_price?riskData.risk_price:'--')+"</td><td class='operation "+(url_type=="show"?'hidden':'')+"'><a opName='edit'>编辑</a> </td></tr>";
			$("#premium tbody").html(html);
			$("#premium").modal("show");
			$('#premium tbody tr:last')[0].riskData=riskData;//绑定数据
			//隐藏操作
			$("#premium .operation a").hide();
			//获取权限
			getPows('authProduct_config_premium_config',$("#premium"));
			premiumBinClick();
			th_num=(url_type=="show"?3:4);
			$("#premium .pop-box th").css("width",(100/th_num)+"%");
		}else {//其他两个结算方式
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
					  var info=data.info,
						rowNun=info?info.length:0,//需要合并单元格的个数 0代表没有配置过
						kind;
					  $("#premium tbody").html("");//清空之前的html
					if(riskData.prem_calc==2){//按照年龄
						//表头
						html="<th style='width:30%'>方案名称</th><th style='width:120px'>保险期间（天）</th><th>年龄段</th><th>保费（元）</th><th class='"+(url_type=="show"?'hidden':'')+"'>操作</th>";
						th_num=(url_type=="show"?4:5);
						$("#premium thead tr").html(html);
						$("#premium .add_btn_box").hide();
						html='<tr><td rowspan='+rowNun+'>'+riskData.risk_name+'</td><td rowspan='+rowNun+'><label class="showBox"><label class="value">'+(riskData.risk_day?riskData.risk_day:'-')+'</label><span class="glyphicon glyphicon-edit '+(url_type=="show"?'hidden':'')+'"></span></label></td>';
						if(rowNun==0){//没有配置过
							html+="<td>-</td><td>-</td><td class='operation "+(url_type=="show"?'hidden':'')+"'><a opName='edit'>编辑</a></td>"
						}else{//先渲染第一个数据
							kind=info[0];
							html+="<td>"+getAgeSection(kind.start_num,kind.end_num,kind.start_type,kind.end_type)+"</td>";
							html+="<td>"+kind.n_prm+"</td><td class='operation "+(url_type=="show"?'hidden':'')+"'><a opName='edit'>编辑</a> <div><a opName='delete'>删除</a> </div></td>"	
						}
						$("#premium tbody").append(html);
						//绑定数据
						$('#premium tbody tr:last')[0].trData=kind;
						$('#premium tbody tr:last')[0].riskData=riskData;
						//渲染之后的数据
						for(var j=1;j<rowNun;j++){
							kind=info[j];
							html="<tr><td>"+getAgeSection(kind.start_num,kind.end_num,kind.start_type,kind.end_type)+"</td>";
							html+="<td>"+kind.n_prm+"</td><td class='operation "+(url_type=="show"?'hidden':'')+"'><a opName='edit'>编辑</a>  <div><a opName='delete'>删除</a> </div></td></tr>"	
							$("#premium tbody").append(html);
							//绑定数据
							$('#premium tbody tr:last')[0].trData=kind;
							$('#premium tbody tr:last')[0].riskData=riskData;
						}
					}else if(riskData.prem_calc==3){//按照保险期间
						html="<th style='width:30%'>方案名称</th><th style='width:120px'>保险期间</th><th>保费（元）</th><th class='"+(url_type=="show"?'hidden':'')+"'>操作</th>";
						th_num=(url_type=="show"?3:4);
						$("#premium thead tr").html(html);
						$("#premium .add_btn_box").hide();
						html='<tr><td rowspan='+rowNun+'>'+riskData.risk_name+'</td>';
						if(rowNun==0){//没有配置过
							html+="<td>-</td><td>-</td><td class='operation "+(url_type=="show"?'hidden':'')+"'><a opName='edit'>编辑</a></td>"
						}else{//先渲染第一个数据
							kind=info[0];
							if(kind.type==2){//全年计划
								html+="<td>全年</td>"
							}else{//区间
								html+="<td>"+kind.start_num+"天-"+kind.end_num+"天</td>"
							}
							html+="<td>"+kind.n_prm+"</td><td class='operation "+(url_type=="show"?'hidden':'')+"'><a opName='edit'>编辑</a> <div><a opName='delete'>删除</a> </div></td>"	
						}
						$("#premium tbody").append(html);
						//绑定数据
						$('#premium tbody tr:last')[0].trData=kind;
						$('#premium tbody tr:last')[0].riskData=riskData;
						//渲染之后的数据
						for(var j=1;j<rowNun;j++){
							kind=info[j];
							if(kind.type==2){//全年计划
								html="<tr><td>全年</td>"
							}else{//区间
								html="<tr><td>"+kind.start_num+"天-"+kind.end_num+"天</td>"
							}
							html+="<td>"+kind.n_prm+"</td><td class='operation "+(url_type=="show"?'hidden':'')+"'><a opName='edit'>编辑</a>  <div><a opName='delete'>删除</a> </div></td></tr>"	
							$("#premium tbody").append(html);
							//绑定数据
							$('#premium tbody tr:last')[0].trData=kind;
							$('#premium tbody tr:last')[0].riskData=riskData;
						}
					}else if(riskData.prem_calc==4){//按照按保险期限和年龄段
						html="<th style='width:30%'>方案名称</th><th>年龄段</th><th style='width:120px'>保险期间</th><th>保费（元）</th><th class='"+(url_type=="show"?'hidden':'')+"'>操作</th>";
						th_num=(url_type=="show"?4:5);
						$("#premium thead tr").html(html);
						$("#premium .add_btn_box").hide();
						html='<tr><td rowspan='+rowNun+'>'+riskData.risk_name+'</td>';
						if(rowNun==0){//没有配置过
							html+="<td>-</td><td>-</td><td>-</td><td class='operation "+(url_type=="show"?'hidden':'')+"'><a opName='edit'>编辑</a></td>"
						}else{//先渲染第一个数据
							kind=info[0];
							html+="<td>"+(kind.attr_name?kind.attr_name:'')+"</td>";
							if(kind.type==2){//全年计划
								html+="<td>全年</td>"
							}else{//区间
								html+="<td>"+kind.start_num+"天-"+kind.end_num+"天</td>"
							}
							html+="<td>"+kind.n_prm+"</td><td class='operation "+(url_type=="show"?'hidden':'')+"'><a opName='edit'>编辑</a> <div><a opName='delete'>删除</a> </div></td>"	
						}
						$("#premium tbody").append(html);
						//绑定数据
						$('#premium tbody tr:last')[0].trData=kind;
						$('#premium tbody tr:last')[0].riskData=riskData;
						//渲染之后的数据
						for(var j=1;j<rowNun;j++){
							kind=info[j];
							html="<tr><td>"+(kind.attr_name?kind.attr_name:'')+"</td>";
							if(kind.type==2){//全年计划
								html+="<td>全年</td>"
							}else{//区间
								html+="<td>"+kind.start_num+"天-"+kind.end_num+"天</td>"
							}
							html+="<td>"+kind.n_prm+"</td><td class='operation "+(url_type=="show"?'hidden':'')+"'><a opName='edit'>编辑</a>  <div><a opName='delete'>删除</a> </div></td></tr>"	
							$("#premium tbody").append(html);
							//绑定数据
							$('#premium tbody tr:last')[0].trData=kind;
							$('#premium tbody tr:last')[0].riskData=riskData;
						}
					}
					$("#premium")[0].prem_attr=data.url.prem_attr;
					$("#premium").modal("show");//显示模态框
					$("#premium .operation a").hide();//隐藏所有的按钮即a标签
					//获取权限，来显示a标签
					getPows('authProduct_config_premium_config',$("#premium"));
					//表格中绑定数据
					premiumBinClick();
					$("#premium .pop-box th").css("width",(100/th_num)+"%");
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
	/*
		保障项目模态框中的点击事件
			
	*/
	function itemBinClick(){
		$('#itemSee .operation a').click(function(){
			var opName=$(this).attr("opName"),//获取操作的名称
				//获取绑定的数据
				trData=$(this).closest('tr')[0].trData,
				riskData=$(this).closest('tr')[0].riskData;
			if(opName=='edit'){//编辑
				$('#addKind').modal('show');	
				$('#addKind .add_btn_box').hide();	//编辑时不能添加新的
				$('#addKind  #editboxLabel').text("编辑记录");	
				//输入框中塞入数据
				$("#addKind input[name=risk_type]").val(riskData.risk_type);
				$("#addKind input[name=kind_id]").val(trData?trData.id:'');
				$("#addKind input[name=kind_cde]").val(trData?trData.kind_cde:'');
				$("#addKind input[name=kind_name]").val(trData?trData.kind_name:'');
				$("#addKind input[name=n_amt]").val(trData?trData.n_amt:'');
				$("#addKind input[name=n_prm]").val(trData?trData.n_prm:'');
				$("#addKind textarea[name=kind_desc]").val(trData?trData.kind_desc:'');
			}else if(opName=='delete'){//删除（弹框确认）
				config={
					title:'温馨提醒',
					msg:"您确认删除该保障项目？",
					confirmFun:function(){
						$.ajax({
							type:"POST",
							url:util.getURL("Product/kind_status_do"),
							data:{
								kind_id:trData.id,
								type:-1
							},
							dataType:"json",
							success:function(data){
								setTimeout(function(){
									if(data.status){
										showAlert("删除成功");
										//重新获取信息，并渲染
										getInfo();
										if(opData){
											showItem(opData);
										}
									  }else{
										showAlert(data.info);
									  }
								},500);
							},
							error:function(){
								setTimeout(function(){
									showAlert();
								},500)
							}
						})
					}
				}
				if(asys){
					var modal=asys.showAlert(config);
				}else{
					config.confirmFun();
				}
			}
		})
	}
	/*
		保费模态框中的点击事件
			
	*/
	function premiumBinClick(){
		$('#premium .operation a').click(function(){
			var opName=$(this).attr("opName"),//获取操作的名称
				//获取绑定的数据
				trData=$(this).closest('tr')[0].trData,
				riskData=$(this).closest('tr')[0].riskData;
			if(opName=='edit'){//编辑
				$('#addPremium').modal('show');	
				$("#addPremium .item_box").html("")
				addPremium(riskData.prem_calc);//渲染html
				$('#addPremium .add_btn_box').hide();	//隐藏添加新配置按钮
				$('#addPremium #editboxLabel').text("编辑记录");
				$("#addPremium").find('.item_del').hide();		
				$("#addPremium input[name=risk_type]").val(riskData.risk_type);
				//输入框中塞入数据
				if(riskData.prem_calc==1){
					$("#addPremium input[name=n_prm]").val(riskData.risk_price?riskData.risk_price:'');
					$("#addPremium input[name=risk_day]").val(riskData.risk_day?riskData.risk_day:'');
				}else if(trData){
					$("#addPremium input[name=prem_id]").val(trData.id?trData.id:'');	
					$("#addPremium select[name=start_num]").val(trData.start_num?trData.start_num:'');
					$("#addPremium select[name=end_num]").val(trData.end_num?trData.end_num:'');
					$("#addPremium select[name=start_type]").val(trData.start_type?trData.start_type:'');
					$("#addPremium select[name=end_type]").val(trData.end_type?trData.end_type:'');
					$("#addPremium input[name=n_prm]").val(trData.n_prm?trData.n_prm:'');
					if((riskData.prem_calc==3 ||riskData.prem_calc==4) && trData.type){
						$("#addPremium input[name=type][value="+trData.type+"]").click();
					}
					if(riskData.prem_calc==4){
						$("#addPremium select[name=attr_id]").val(trData.attr_id?trData.attr_id:'');
					}
				}
			}else if(opName=='delete'){//删除（弹框确认）
				config={
					title:'温馨提醒',
					msg:"您确认删除该保费配置吗？",
					confirmFun:function(){
						$.ajax({
							type:"POST",
							url:util.getURL("Product/prem_status_do"),
							data:{
								prem_id:trData.id,
								type:-1
							},
							dataType:"json",
							success:function(data){
								setTimeout(function(){
									if(data.status){
										showAlert("删除成功");
										getInfo();
										if(opData){
											showPremium(opData);
										}
									  }else{
										showAlert(data.info);
									  }
								},500);
							},
							error:function(){
								setTimeout(function(){
									showAlert();
								},500)
							}
						})
					}
				}
				//判断是否是后台系统打开，如果不是则直接运行，是的显示确认框
				if(asys){
					var modal=asys.showAlert(config);
				}else{
					config.confirmFun();
				}
			}
		})
		
		//表格直接中编辑点击事件
		$("table .showBox").click(function(){
			if(url_type=="show"){
				return;
			}
			var trData=$(this).closest('tr')[0].trData,
				html='<div class="form-group" style="margin-bottom: 0;">'
					+			'<label for="risk_day" class="col-sm-2 control-label">保险期限</label>'
					+			'<div class="col-sm-10">'
					+				'<input type="text" class="form-control" id="risk_day"  name="risk_day" placeholder="保险期限(天)">'
					+			'</div>'
					+		'</div>'
					+		'<label style="margin-bottom: 15px;padding-left: 67px;color: #7C7D84;">说明：保险期限为一年时，请输入365</label>'
					+			'<input type="hidden" name="risk_type" value="'+(trData.risk_type?trData.risk_type:'')+'"/>'
					+		'</div>';
			$("#eidtRisk form").html(html);
			
			$("#eidtRisk")[0].valueDom=[$(this).find(".value")];
			$("#eidtRisk")[0].editName=["risk_day"];
			$("#eidtRisk").modal("show");
		})
	}
	//方案配置表格中监听事件
	function binClick(){
		$('#risk .operation a').click(function(){
			var opName=$(this).attr("opName"),//获取操作名称
				//获取绑定的数据
				trData=$(this).closest('tr')[0].trData;
			opData=trData;
			if(opName=='premium_config'){
				showPremium(trData);//保费配置弹框
			}else if(opName=='item_config'){
				showItem(trData);//保费项目配置弹框
			}else if(opName=='attr_edit'){
				showAttr(trData);//属性配置弹框
			}else if(opName=='attr_show'){
				showAttr(trData);//属性配置弹框
			}else if(opName=='item_copy' || opName=='premium_copy'){
				 if(url_type=="show"){//如果不是编辑状态，则不能复制
					return;
				}
				var pasteName="item_paste";
				if(opName=="premium_copy"){
					pasteName="premium_paste";
				}
				$("#risk .operation a[opName=premium_paste]").hide();
				$("#risk .operation a[opName=premium_copy]").show();
				$("#risk .operation a[opName=item_paste]").hide();
				$("#risk .operation a[opName=item_copy]").show();
				//判断当前是复制 还是已经复制了
				if($(this).text()=='复制'){
					//记录被复制行的数据的risk_type 属性，隐藏所有复制按钮，显示粘贴按钮，点击的复制按钮现在改成“取消复制”，本单元格中的粘贴按钮隐藏
					from_risk_type=trData.risk_type;//记录被复制的type
					$("#risk .operation a[opName="+opName+"]").hide();//将复制按钮隐藏
					$("#risk .operation a[opName="+pasteName+"]").show();//显示粘贴按钮
					$(this).show();
					$(this).parent().parent().find("a[opName="+pasteName+"]").hide();
					$("#risk .operation a[opName=premium_copy]").text("复制");
					$("#risk .operation a[opName=item_copy]").text("复制");
					$(this).text("取消复制");
				}else if($(this).text()=='取消复制'){
					//将被复制的 risk_type清空，将取消复制变成 复制，隐藏粘贴，显示复制
					from_risk_type=null;
					$(this).text("复制");
				}
				
			}else if(opName=='item_paste' || opName=='premium_paste'){//粘贴
				 if(url_type=="show"){//如果不是编辑状态，则不能粘贴
					return;
				}
				if(!from_risk_type){//是否有被复制的 risk_type
					showAlert("请选择需要复制的方案");
					return;
				}
				var url="Product/kind_copy_do";
				if(opName=="premium_paste"){
					url="Product/prem_copy_do";
				}
				//确认弹框，
				var config={
					title:'温馨提醒',
					msg:"您确认复制到本方案中吗？",
					confirmFun:function(){
						$.ajax({
							type:"POST",
							url:util.getURL(url),
							data:{
								product_id:id,
								from_risk_type:from_risk_type,
								to_risk_type:trData.risk_type
							},
							dataType:"json",
							success:function(data){
								setTimeout(function(){
									if(data.status){
										showAlert("复制成功");
										getInfo();
									  }else{
										showAlert(data.info);
									  }
								},500);
							},
							error:function(){
								setTimeout(function(){
									showAlert();
								},500)
							}
						})
					}
				}
				//判断是否是后台系统打开，如果不是则直接运行，是的显示确认框
				if(asys){
					var modal=asys.showAlert(config);
				}else{
					config.confirmFun();
				}
				
			}
		})
		//表格直接中编辑点击事件
		$("table .showBox").click(function(){
			if(url_type=="show"){
				return;
			}
			var trData=$(this).closest('tr')[0].trData,
				html='<div class="form-group">'
					+			'<label for="risk_name" class="col-sm-2 control-label">方案名称</label>'
					+			'<div class="col-sm-10">'
					+				'<textarea type="text" class="form-control" id="risk_name"  name="risk_name" placeholder="请输入方案名称" rows=5 >'+(trData.risk_name?trData.risk_name:'')+'</textarea>'
					+			'</div>'
					+			'<input type="hidden" name="risk_type" value="'+(trData.risk_type?trData.risk_type:'')+'"/>'
					+		'</div>';
			$("#eidtRisk form").html(html);
			
			$("#eidtRisk")[0].valueDom=[$(this).find(".value")];
			$("#eidtRisk")[0].editName=["risk_name"];
			$("#eidtRisk").modal("show");
		})
	}
	//方案数据报错包括 方案名称 方案保险期限
	function setRisk(){
		var t=$("#eidtRisk form").serializeArray(),
			valueDom=$('#eidtRisk')[0].valueDom,//修改成功后需要改变显示文字的dom lists
			editName=$('#eidtRisk')[0].editName,//对应valueDom 的对象属性名称
			isErr=false,
			postData={};
		$.each(t, function() {//当前from表单构造数据并判断有无空数据
			if(util.trimSpace(this.value,1)){
				postData[this.name]=this.value;
			}else{
				showAlert("请完善配置信息");
				isErr=true;
				return false;
			}
		});
		if(!postData.risk_type){//如果没有方案类型数据则 报错
			showAlert("数据有误");
			return;
		}
		
		if(isErr){//属性是否全部选择了
			return;
		}
		if(postData.risk_day){
			if(isNaN(postData.risk_day)||parseInt(postData.risk_day)<0 || postData.risk_day.indexOf(".")>-1){//判断输入信息
				showAlert("请输入正确的保险期限");
				return;
			}
		}
		postData.id=id;
		$.ajax({
			type:"POST",
			url:util.getURL("Product/risk_update_do"),
			data:postData,
			dataType:"json",
			success:function(data){
			  if(data.status){
			  $("#eidtRisk").modal("hide");
				showAlert("保存成功");
				$.each(valueDom,function(i){
					this.text(postData[editName[i]]);//保存成功后将显示数据替换
				});
			  }else{
				showAlert(data.info);
			  }
			},
			error:function(){
				showAlert();
			}
		})
	}
	/*预览弹框显示*/
	function showPreview(btnId){
		if(!id){
			return;
		}
		var list_type;
		if(btnId=='attr_preview'){//属性
			list_type=2;
		}else if(btnId=='item_preview'){//项目
			list_type=3;
		}else if(btnId=='premium_preview'){//保费
			list_type=4;
		}else {
			return;
		}
		$.ajax({
			type:"POST",
			url:util.getURL("Product/risk_lists"),
			data:{
				product_id:id,
				list_type:list_type
			},
			dataType:"json",
			success:function(data){
				if(data.status){
					var info=data.info,
						th_num,
						prem_calc=data.url.prem_calc;
					$("#preview .pop-box").html("");
					var html='<table class="table table-bordered text_center">'
							+	'<thead>'
							+		'<tr class="bg_gird color_S">'
							+			'<th '+(prem_calc!=1&&list_type==4?"style='width:100px'":"")+'>方案代码</th>'
							+			'<th '+(prem_calc!=1&&list_type==4?"style='width:30%'":"")+'>方案名称</th>';
					if(list_type==2 && info[0].has_attr==0){//属性预览(是否需要配置属性  一个有属性每个都有故只需要取第一个)
						return;
					}else if(list_type==2 && info[0].has_attr==1){//属性预览(是否需要配置属性  一个有属性每个都有故只需要取第一个)
						html+=			'<th>方案属性</th>'
							+		'</tr>'	
							+ 	'</thead> '
							+	'<tbody>';
						th_num=3;
						$.each(info,function(i){
							html+="<tr class='"+(i%2==1?'even':'odd')+"'>"
								+		"<td>"+(this.risk_type?this.risk_type:'--')+"</td>"
								+		"<td>"+(this.risk_name?this.risk_name:'--')+"</td><td style='text-align: left;'>";
								$.each(this.attr_lists,function(){//循环属性
									html+="<div class='attr_box'><label>"+this.attr_name+":</label><label style='margin-left:10px'>"+(this.option_name?this.option_name:'')+"</label></div>";
								});
							html+= "</td></tr>";
						})
					}else if(list_type==3){//项目预览
						html+=			'<th>险别代码</th>'
							+			'<th>保障项目</th>'
							+			'<th>保险金额</th>'
							+			'<th>项目说明</th>'
							+		'</tr>'	
							+ 	'</thead> '
							+	'<tbody>';
						th_num=6;
						$.each(info,function(i){
							var class_name=(i%2==1?'even':'odd'),//奇偶个方案Class 用于颜色区分
								rowNum=this.kind_lists?this.kind_lists.length:1;//计算合并单元格数量
							html+="<tr class='"+class_name+"'>"
								+		"<td rowspan="+rowNum+">"+(this.risk_type?this.risk_type:'--')+"</td>"
								+		"<td rowspan="+rowNum+">"+(this.risk_name?this.risk_name:'--')+"</td>";
								if(!this.kind_lists){
									html+="<td>--</td><td>--</td><td>--</td><td>--</td></tr>";
								}else{
									$.each(this.kind_lists,function(j){//循环属性
										if(j!=0){//第一行已经有tr标签不需要添加
											html+="<tr  class='"+class_name+"'>";
										}
										html+=	"<td>"+(this.kind_cde?this.kind_cde:'--')+"</td>"
											+	"<td>"+(this.kind_name?this.kind_name:'--')+"</td>"
											+	"<td>"+(this.n_amt?this.n_amt:'--')+"</td>"
											+	"<td>"+(this.kind_desc?this.kind_desc:'--')+"</td></tr>";
									});
								}
						})
					}else if(list_type==4){//保费预览
						if(prem_calc==1){//按照方案
							html+=		'<th>保险期限</th>'
								+		'<th>保费</th>';
							th_num=4;
						}else if(prem_calc==2){//按照年龄
							html+=		'<th '+(prem_calc!=1?"style='width:100px'":"")+'>保险期限</th>'
								+		'<th>年龄段</th>'
								+		'<th>保费</th>';
							th_num=5;
						}else if(prem_calc==3){//按照保险天数
							html+=		'<th>保险期间</th>'
								+		'<th>保费</th>';
							th_num=4;
						}else if(prem_calc==4){//按照按保险期限和年龄段
							html+=		'<th>年龄段</th><th>保险期间</th>'
								+		'<th>保费</th>';
							th_num=5;
						}else {//无配置时 不予显示
							return;
						}
						html+=		'</tr>'	
							+ 	'</thead> '
							+	'<tbody>';
						$.each(info,function(i){
							var class_name=(i%2==1?'even':'odd'),//奇偶个方案Class 用于颜色区分
								rowNum=this.prem_lists?this.prem_lists.length:1;//计算合并单元格数量
							html+="<tr  class='"+class_name+"'>"
								+		"<td rowspan="+rowNum+">"+(this.risk_type?this.risk_type:'--')+"</td>"
								+		"<td rowspan="+rowNum+">"+(this.risk_name?this.risk_name:'--')+"</td>";
							if(prem_calc==2){//按照年龄时需要有保险期限单元格
								html+="<td rowspan="+rowNum+">"+(this.risk_day?this.risk_day:'--')+"</td>";
							}
							if(prem_calc==1){//按照方案时 直接读取 risk_day risk_price
								html+=	"<td>"+(this.risk_day?this.risk_day:'--')+"</td>"
									+	"<td>"+(this.risk_price?this.risk_price:'--')+"</td></tr>";
							}else if(!this.prem_lists){
								if(prem_calc==4){
									html+="<td>--</td>";
								}
								//不是按照年龄时 单元格少一个
								html+="<td>--</td><td>--</td></tr>";
							}else{
								$.each(this.prem_lists,function(j){//循环属性
									if(j!=0){//第一行已经有tr标签不需要添加
										html+="<tr  class='"+class_name+"'>";
									}
									if(prem_calc==3 || prem_calc==4){//按照保险天数
										if(prem_calc==4){
											html+="<td>"+(this.attr_name?this.attr_name:'')+"</td>";
										}
										if(this.type==2){//全年计划
											html+="<td>全年</td>";
										}else if(this.start_num && this.end_num){//区间(开始结束时间有数据)
											html+="<td>"+this.start_num+"天-"+this.end_num+"天</td>";
										}else{
											html+="<td>--</td>";
										}
										html+="<td>"+this.n_prm+"</td></tr>";
									}else if(prem_calc==2){//按照年龄
										html+="<td>"+getAgeSection(this.start_num,this.end_num,this.start_type,this.end_type)+"</td><td>"+(this.n_prm?this.n_prm:'--')+"</td></tr>";
									}	
								});
							}
						})
					}
					html+=	'</tbody>'
						+"</table>";
					$("#preview .pop-box").html(html);
					$("#preview").modal("show");
					$("#preview .pop-box th").css("width",(100/th_num)+"%");
				}else{
					showAlert(data.info);
					if(asys){
						asys.closeModal();	//关闭模态框	
					}
				}
			},
			error:function(){
				showAlert("数据请求失败！");
				if(asys){
					asys.closeModal();	//关闭模态框	
				}
			}
		})
	}
	
	//关闭产品信息的页面，只适用于在管理平台系统中操作时打开的页面，
	$("#cancle_btn").click(function(){
		if(asys){
			asys.closeModal();
		}
	});
	//保存项目配置按钮
	$('#addKind #submit_btn').click(function(){
		setKindInfo();	
	})
	//保存保费配置 按钮
	$('#addPremium #submit_btn').click(function(){
		setPremiumInfo();	
	})
	//属性保存按钮
	$('#attr #submit_btn').click(function(){
		setAttr();	
	})
	//属性保存按钮
	$('#eidtRisk #submit_btn').click(function(){
		setRisk();	
	})
	$(".preview").click(function(){
		showPreview(this.id)
	})
	/*费用配置相关开始*/
	
	//添加项目配置按钮
	$(".add_premium_btn").click(function(){
		$("#addPremium .item_box").html("")
		addPremium(opData.prem_calc);
		$('#addPremium  #editboxLabel').text("新增记录");
		$("#addPremium").modal("show");
		$('#addPremium .add_btn_box').show();
		$('#addPremium input[name=risk_type]').val(opData.risk_type);
	});
	//添加项目配置弹框中的 添加按钮
	$(".add_premium_item_btn").click(function(){
		addPremium(opData.prem_calc);
	});
	//弹框html渲染，并绑定事件
	function addPremium(prem_calc){
		$("#addPremium .item_box").append(getPremiumHtml(prem_calc));
		premiumHtmlBin();
		setPremiumNum();
	}
	//计算title （有多个区间设置，按照顺序显示区间1 区间2...）
	function setPremiumNum(){
		$("#addPremium .num_title").each(function(i){
			$(this).find('label').text("区间"+(i+1));
			if(i==0){//第一个区间不能被删除
				$(this).find('.item_del').hide();
			}
		});
	}
	//事件绑定方法
	function premiumHtmlBin(){
		//年龄类型（1天，2月，3周岁）改变选择项不相同
		$(".age_type").change(function(){
			var type=this.value,
				html='',
				isEndAge=this.name.indexOf("end"),
				age=$(this).parent().prev().find("select");
			if(isEndAge>-1){
				html+='<option value="400">以上</option><option value="-1">以下</option>'
			}
			if(type==3){
				for(var i=0;i<=183;i++){
					html+='<option value="'+i+'">'+i+'</option>'
				}
			}else if(type==2){
				for(var i=0;i<=36;i++){
					html+='<option value="'+i+'">'+i+'</option>'
				}
			}else if(type==1){
				for(var i=0;i<=100;i++){
					html+='<option value="'+i+'">'+i+'</option>'
				}
			}
			age.html(html);
		});
		//删除区间 按钮
		$("#addPremium .item_del").click(function(){
			var box=$(this).parent();
			box.next().remove();
			box.remove();
			setPremiumNum();
		});
		//区间中 如果是全年计划或者保险区间时  时间选择显示和隐藏
		$("#addPremium .time_type").click(function(){
			var type=this.value;
			if(type==1){
				$(this).closest(".form-group").next().show();
			}else{
				$(this).closest(".form-group").next().hide();
			}
		});
	}
	
	//获取保费配置html
	function getPremiumHtml(type){
		//开始年龄和结束年龄初始化
		var end='<option value="400">以上</option><option value="-1">以下</option>',start='',time_section='';
		for(var i=0;i<=100;i++){
			start+='<option value="'+i+'">'+i+'</option>'
			end+='<option value="'+i+'">'+i+'</option>'
		}
		for(var i=0;i<=183;i++){
			time_section+='<option value="'+i+'">'+i+'</option>'
		}
		var html='<div class="num_title"><label>区间</label><a class="item_del">删除</a></div>'
				+	'<form class="form-horizontal">';
			if(type==2){//按照年龄
				html+='<div class="form-group">'
				+			'<label for="n_prm" class="col-sm-2 control-label">年龄段</label>'
				+			'<div class="col-sm-10">'
				+				'<div class="col-sm-3 padding0">'
				+					'<select class="form-control start_age" name="start_num">'+ start
				+					'</select>'
				+				'</div>'
				+				'<div class="col-sm-2 padding0">'
				+					'<select class="form-control age_type"  name="start_type">'
				+						'<option value="3">天</option>'
				+						'<option selected="selected" value="1">周岁</option>'
				+					'</select>'
				+				'</div>'
				+				'<div class="col-sm-2 padding0" style="text-align:center">-</div>'
				+				'<div class="col-sm-3 padding0">'
				+					'<select class="form-control end_age" name="end_num">'+end
				+					'</select>'
				+				'</div>'
				+				'<div class="col-sm-2 padding0">'
				+					'<select class="form-control age_type" name="end_type">'
				+						'<option value="3">天</option>'
				+						'<option selected="selected" value="1">周岁</option>'
				+					'</select>'
				+				'</div>'
				+			'</div>'
				+		'</div>';
			}else if(type==3){//按照保险期间
				html+='<div class="form-group">'
				+			'<label for="n_prm" class="col-sm-2 control-label">保险期间</label>'
				+			'<div class="col-sm-10">'
				+				'<div class="col-sm-6 padding0">'
				+					'<input type="radio" class="free_type time_type" name="type" value="1" checked> 自选日期'
				+				'</div>'
				+				'<div class="col-sm-6 padding0">'
				+					'<input type="radio" class="free_type time_type" name="type" value="2"> 全年计划'
				+				'</div>'
				+			'</div>'
				+		'</div>'
				+		'<div class="form-group">'
				+			'<label for="n_prm" class="col-sm-2 control-label"></label>'
				+			'<div class="col-sm-10">'
				+				'<div class="col-sm-3 padding0">'
				+					'<select class="form-control time_section" name="start_num">'+time_section
				+					'</select>'
				+				'</div>'
				+				'<div class="col-sm-2 padding0">'
				+					'<select class="form-control" name="start_type">'
				+						'<option value="1">天</option>'
				+					'</select>'
				+				'</div>'
				+				'<div class="col-sm-2 padding0" style="text-align:center">-</div>'
				+				'<div class="col-sm-3 padding0">'
				+					'<select class="form-control time_section" name="end_num">'+time_section
				+					'</select>'
				+				'</div>'
				+				'<div class="col-sm-2 padding0">'
				+					'<select class="form-control" name="end_type">'
				+						'<option value="1">天</option>'
				+					'</select>'
				+				'</div>'
				+			'</div>'
				+		'</div>';
			}else if(type==4){//按保险期限和年龄段
				html+='<div class="form-group">'
					+			'<label for="n_prm" class="col-sm-2 control-label">年龄段</label>'
					+			'<div class="col-sm-10">'
					+				'<select class="form-control"  name="attr_id">';
				var prem_attr=$("#premium")[0].prem_attr;
				$.each(prem_attr,function(){
					html+='<option value="'+this.attr_id+'">'+this.attr_name+'</option>';
				});
				html+=				'</select>'
					+			'</div>'
					+		'</div>'
					+ '<div class="form-group">'
					+			'<label for="n_prm" class="col-sm-2 control-label">保险期间</label>'
					+			'<div class="col-sm-10">'
					+				'<div class="col-sm-6 padding0">'
					+					'<input type="radio" class="free_type time_type" name="type" value="1" checked> 自选日期'
					+				'</div>'
					+				'<div class="col-sm-6 padding0">'
					+					'<input type="radio" class="free_type time_type" name="type" value="2"> 全年计划'
					+				'</div>'
					+			'</div>'
					+		'</div>'
					+		'<div class="form-group">'
					+			'<label for="n_prm" class="col-sm-2 control-label"></label>'
					+			'<div class="col-sm-10">'
					+				'<div class="col-sm-3 padding0">'
					+					'<select class="form-control time_section" name="start_num">'+time_section
					+					'</select>'
					+				'</div>'
					+				'<div class="col-sm-2 padding0">'
					+					'<select class="form-control" name="start_type">'
					+						'<option value="1">天</option>'
					+					'</select>'
					+				'</div>'
					+				'<div class="col-sm-2 padding0" style="text-align:center">-</div>'
					+				'<div class="col-sm-3 padding0">'
					+					'<select class="form-control time_section" name="end_num">'+time_section
					+					'</select>'
					+				'</div>'
					+				'<div class="col-sm-2 padding0">'
					+					'<select class="form-control" name="end_type">'
					+						'<option value="1">天</option>'
					+					'</select>'
					+				'</div>'
					+			'</div>'
					+		'</div>';
			}else{//按照方案
				html+='<div class="form-group" style="margin-bottom: 0;">'
				+			'<label for="risk_day" class="col-sm-2 control-label">保险期限</label>'
				+			'<div class="col-sm-10">'
				+				'<input type="text" class="form-control" id="risk_day"  name="risk_day" placeholder="保险期限(天)">'
				+			'</div>'
				+		'</div>'
				+		'<label style="margin-bottom: 15px;padding-left: 67px;color: #7C7D84;">说明：保险期限为一年时，请输入365</label>';
			}
			html+='<div class="form-group">'
			+			'<label for="n_prm" class="col-sm-2 control-label">保费</label>'
			+			'<div class="col-sm-10">'
			+				'<input type="text" class="form-control" id="n_prm"  name="n_prm" placeholder="请输入保费(元)">'
			+			'</div>'
			+		'</div>'
			+		'<input type="hidden" name="prem_id" value=""/>'
			+	'</form>';
			return html;
	}
	/*费用配置相关结束*/
	/*项目配置相关开始*/
	
	
	//添加新的项目
	$(".add_kind_btn").click(function(){
		$("#addKind").modal("show");
		$('#addKind  #editboxLabel').text("新增记录");
		$("#addKind input[name=risk_type]").val(opData.risk_type);
		$('#addKind .add_btn_box').show();	
		$('#addKind input[name=kind_id]').val("");
	})
	
	//添加新的项目 弹框中 新增项目按钮
	$(".add_item_btn").click(function(){
		var html='<div class="num_title"><label>保障项目</label><a class="item_del">删除</a></div>'
			+	'<form class="form-horizontal">'
			+		'<div class="form-group">'
			+			'<label for="kind_cde'+item_num+'" class="col-sm-2 control-label">险别代码</label>'
			+			'<div class="col-sm-10">'
			+				'<input type="text" class="form-control" id="kind_cde'+item_num+'"  name="kind_cde" placeholder="请输入险别代码">'
			+			'</div>'
			+		'</div>'
			+		'<div class="form-group">'
			+			'<label for="kind_name'+item_num+'" class="col-sm-2 control-label">保障项目</label>'
			+			'<div class="col-sm-10">'
			+				'<input type="text" class="form-control" id="kind_name'+item_num+'"  name="kind_name" placeholder="请输入保障项目">'
			+			'</div>'
			+		'</div>'
			+		'<div class="form-group">'
			+			'<label for="n_amt'+item_num+'" class="col-sm-2 control-label">保障金额</label>'
			+			'<div class="col-sm-10">'
			+				'<input type="text" class="form-control" id="n_amt'+item_num+'"  name="n_amt" placeholder="请输入保障金额">'
			+			'</div>'
			+		'</div>'
			+		'<div class="form-group">'
			+			'<label for="kind_desc'+item_num+'" class="col-sm-2 control-label">项目说明</label>'
			+			'<div class="col-sm-10">'
			+				'<textarea type="text" class="form-control" id="kind_desc'+item_num+'"  name="kind_desc" placeholder="请输入项目说明" rows=5></textarea>'
			+			'</div>'
			+		'</div>'
			+	'</form>';
		$("#addKind .item_box").append(html);
		setKindNum();
		$("#addKind .item_del").click(function(){
			var box=$(this).parent();
			box.next().remove();
			box.remove();
			setKindNum();
		})
	});
	//项目配置模态框每次显示，清空之前添加的项目，并清除输入项（还原）
	$('#addKind').on('show.bs.modal', function(){
		$('#addKind form').each(function(i){
			if(i!=0){
				$(this).prev().remove();
				$(this).remove();
			}else{
				this.reset();
			}
		})
	})
	//计算保证项目title （有多个保障项目设置，按照顺序显示保障项目1 保障项目2...）
	function setKindNum(){
		$("#addKind .num_title").each(function(i){
			$(this).find('label').text("保障项目"+(i+1));
		});
	}
	/*项目配置相关结束*/
	//图片上传控件初始化·
	$(".updataImg").fileinput({
			language: 'zh',
			browseLabel:'导入excel',
			uploadUrl:util.getURL("FileUpload/ueditor_upload?dir=file&action=uploadfile"), //上传的地址
			allowedFileExtensions: ['jpg', 'gif', 'png'],//接收的文件后缀
			uploadAsync: false, //默认异步上传
			showUpload:false, //是否显示上传按钮
			showRemove :false, //显示移除按钮
			showPreview :false, //是否显示预览
			showCaption:false,//是否显示标题
			showCancel:false,
			browseClass:"btn btn-primary", //按钮样式    
			dropZoneEnabled: false,//是否显示拖拽区域
			maxFileCount:1, //表示允许同时上传的最大文件个数
			enctype:'multipart/form-data',
			validateInitialCount:false,
			previewFileIcon: "",
	   }).on("filebatchuploadsuccess", function (event, data, previewId, index){
			 if(data.response.status){
				getInfo();
			 }else{
				showAlert("上传有误");
			 }
	}).on("filebatchuploaderror", function (event, data, msg){
			$('.kv-upload-progress').addClass("hide");
			showAlert("上传有误");
	}).on("filebatchselected", function(event, files) {
		$(this).fileinput("upload")
	});
});
