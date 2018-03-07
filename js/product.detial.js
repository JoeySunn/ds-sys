/* 
	产品信息页面js文件
		showAlert : 错误信息弹框
		getInfo  ：获取商户信息并渲染
		postInfo ：保存数据
		getAgeType ： 根据年龄type返回选择的类型
		getRelatClass ：获取分类列表
	以及各个按钮的点击事件监听，第三方控件的初始化
*/
$(function(){
	var asys=window.parent.asys,
		editor_desc,//图文详情的图文编辑器对象
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
			data 需要保存的数据
	*/
	function postInfo(data){
		if(!data){
			return;
		}
		data.id=id;
		data.save_module=1;
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
	/*	获取信息并渲染
			p[name=**]表示查看时显示的内容
			input[name=**]  表示编辑时输入框中显示的文字
			input[name=**][value=**]  表示编辑单选项或者多选项的指
		
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
				info_module:1
			},
			dataType:"json",
			success:function(data){
			  if(data.status){
				 var info=data.info;
				 if(url_type=="edit"){
					getRelatClass(1,info);
					getRelatClass(2,info);
				 }
				 $("img[name='image_url']").attr("src",(info.image_url?info.image_url:""));
				 $("input[name='image']").val(info.image?info.image:"");
				 $("p[name='code']").html(info.code?info.code:'');
				 $("p[name='name']").html(info.name?info.name:'');
				 $("input[name='title']").val(info.title?info.title:'');
				 $("p[name='title']").html(info.title?info.title:'');
				 $("input[name='insured_area']").val(info.insured_area?info.insured_area:'');
				 $("p[name='insured_area']").html(info.insured_area?info.insured_area:'');
				 $("input[name='ins_limit']").val(info.ins_limit?info.ins_limit:'');
				 $("p[name='ins_limit']").html(info.ins_limit?info.ins_limit:'');
				 $("input[name='link']").val(info.link?info.link:'');
				 $("p[name='link']").html(info.link?info.link:'');
				 if(info.butt_mode==1){
					 $("[name='butt_mode'][value='1']").click();
					 $("p[name='butt_mode']").html("平台对接");
				 }else if(info.butt_mode==2){
					 $("[name='butt_mode'][value='2']").click();
					 $("p[name='butt_mode']").html("外链产品");
				 }else{
					 $("p[name='butt_mode']").html("未知"); 
				 }
				 var typeStr=""
				 if(info.type==1){
					typeStr="产品推广";
					$("[name='type'][value='1']").prop("checked",true);
					if(url_type=="show"){
						$("#type_show_1").show();
					}else{
						$("#type_1").show();
					}
					
				 }else if(info.type==2){
					typeStr="产品定制";
					$("[name='type'][value='2']").prop("checked",true);
					if(url_type=="show"){
						$("#type_show_2").show();
					}else{
						$("#type_2").show();
					}
				 }else if(info.type==3){
					typeStr="产品推广;产品定制";
					$("[name='type'][value='2']").prop("checked",true);
					$("[name='type'][value='1']").prop("checked",true);
					if(url_type=="show"){
						$("#type_show_1").show();
						$("#type_show_2").show();
					}else{
						$("#type_1").show();
						$("#type_2").show();
					}
				 }else{
					 $("[name='type'][value='2']").prop("checked",false);
					$("[name='type'][value='1']").prop("checked",false);
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
					$("#type_1 [name=ins_type][value=1]").prop("checked",true);
				 }else if(info.ins_type==2){
					$("#type_show_1 .ins_box").html("健康险"); 
					$("#type_1 [name=ins_type][value=2]").prop("checked",true);
				 }else if(info.ins_type==3){
					$("#type_show_1 .ins_box").html("责任险"); 
					$("#type_1 [name=ins_type][value=3]").prop("checked",true);
				 }else if(info.ins_type==4){
					$("#type_show_1 .ins_box").html("财产险"); 
					$("#type_1 [name=ins_type][value=4]").prop("checked",true);
				 }else{
					$("#type_1 [name=ins_type][value=1]").prop("checked",false);
					$("#type_1 [name=ins_type][value=2]").prop("checked",false);
					$("#type_1 [name=ins_type][value=3]").prop("checked",false);
					$("#type_1 [name=ins_type][value=4]").prop("checked",false);
					$("#type_show_1 [name='ins']").hide();
				 }
				if(info.scene_name){
					$("#type_show_2").show();
					$("#type_show_2 #scene_box").html(info.scene_name); 
				}else{
					 $("#type_show_2").hide();
				}
				$("p[name='type']").html(typeStr);
				$("input[name='fit_people']").val(info.fit_people?info.fit_people:'');
				$("p[name='fit_people']").html(info.fit_people?info.fit_people:'');
				$("textarea[name='desc']").val(info.desc?info.desc:'');
				if(editor_desc){
					editor_desc.html(info.desc?info.desc:'');
				}
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
						$("input[name=extens][value='"+val.type+"']").prop('checked',true);
						$("p[name=extens]").html(extens.toString());
					});
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
					
				$("select[name=app_age_start_type]").val(app_age_start_type?app_age_start_type:1);
				$("select[name=app_age_start_type]").change();
				$("select[name=app_age_end_type]").val(app_age_end_type?app_age_end_type:1);
				$("select[name=app_age_end_type]").change();
				$("select[name=insrnt_age_start_type]").val(insrnt_age_start_type?insrnt_age_start_type:1);
				$("select[name=insrnt_age_start_type]").change();
				$("select[name=insrnt_age_end_type]").val(insrnt_age_end_type?insrnt_age_end_type:1);
				$("select[name=insrnt_age_end_type]").change();
				
				$("select[name=app_age_start]").val(app_age_start);
				$("select[name=app_age_end]").val(app_age_end);
				$("select[name=insrnt_age_start]").val(insrnt_age_start);
				$("select[name=insrnt_age_end]").val(insrnt_age_end);
				
				
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
	//根据年龄type返回选择的类型（1周岁，2月，3天）
	function getAgeType(type){
		return type==1?'周岁':type==2?'月':type==3?'天':'周岁';
	}
	/*
		获取分类列表，并渲染
			source：  来源（1-产品分类 2-行业场景）
			pInfo  ： 获取到的配置数据 （编辑用于选择是否勾选）
	*/
	function getRelatClass(source,pInfo){
		$.ajax({
			type:"POST",
			url:util.getURL("RelatClass/lists"),
			data:{
				limit:1000,
				source:source
			},
			dataType:"json",
			success:function(data){
			  if(data.status){
				 var info=data.info,dom,nameStr; 
				 if(source==1){
					 dom=$("#cls_box");
					 dom.html("");
					 nameStr="cls_id";
				 }else{
					 dom=$("#scene_box");
					 dom.html("");
					 nameStr="scene_id";
				 }
				 $.each(info,function(key,val){
					dom.append('<label><input name="'+nameStr+'" type="radio" value="'+val.id+'" >'+val.name+'</label>');
				 })
				 if(source==1){
					$("input[name=cls_id][value="+pInfo.cls_id+"]").prop('checked',true);
				 }else{
					$("input[name=scene_id][value="+pInfo.scene_id+"]").prop('checked',true); 
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
	}
	//根据type 显示效果不相同，show时将可以编辑的全部删除只能查看
	if(url_type=="show"){
		$(".edit").remove();
		$(".button_box").remove();
		$(".cancle_box").text("关闭");
	}else{
		$(".show").remove();
	}
	//开始年龄和结束年龄初始化
	var end='<option value="400">以上</option><option value="-1">以下</option>',start='';
	for(var i=0;i<=100;i++){
		start+='<option value="'+i+'">'+i+'</option>'
		end+='<option value="'+i+'">'+i+'</option>'
	}
	$(".start_age").html(start);
	$(".end_age").html(end);
	//年龄类型（1天，2月，3周岁）改变选择项监听，并渲染新的下拉选择框
	$(".age_type").change(function(){
		var type=this.value,
			html='',
			isEndAge=this.name.indexOf("end"),
			age=$(this).prev();
		if(isEndAge>-1){
			html+='<option value="400">以上</option><option value="-1">以下</option>'
		}
		if(type==3){
			for(var i=0;i<=180;i++){
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
	//合作类型 单选按钮的点击事件
	$("input[name='type']").click(function(){
		var value=this.value;
		if(this.checked){
			$("#type_"+value).show();
		}else{
			$("#type_"+value).hide();
		}
	});
	
	//产品类型 单选按钮的点击事件
	$("input[name='butt_mode']").click(function(){
		var value=this.value;
		if(value==1){
			$(".link_box").hide();
		}else{
			$(".link_box").show();
		}
	});
	//关闭产品信息的页面，只适用于在管理平台系统中操作时打开的页面，
	$("#cancle_btn").click(function(){
		if(asys){
			asys.closeModal();
		}
	});
	//保存并确认配置完成 按钮
	$("#confirm_btn").click(function(){
		var t=$("form").serializeArray(),isErr=false,data={},examine=false;
		//组装data对象
		$.each(t, function() {
			if(util.trimSpace(this.value,1)!=''){
				if(data[this.name]){
					data[this.name] +=","+this.value; 
				}else{
					data[this.name] = this.value; 
				}
			}else if(this.name=='insrnt_age_end' || this.name=='app_age_end' || this.name=='app_age_start'|| this.name=='insrnt_age_start'||this.name=='link'){
				data[this.name] = this.value; 
			}else{
				isErr=true;
			}
		});
		//合作类型数据转换
		if(data.type=='1'){
			data.scene_id='';
		}else if(data.type=='2'){
			data.cls_id='';
			data.ins_type='';
		}else if(data.type=='1,2'){
			data.type='3';
		}else{
			showAlert("请选择合作类型");
			return
		}
		if(data.butt_mode==1){
			data.link="";
		}else if(data.link==""){
			showAlert("请输入外链产品链接");
			return
		}
		//年龄数据转换 用于判断选择是否有误
		var app_age_start,app_age_end,insrnt_age_end,insrnt_age_start;
		if(data.app_age_start_type==1){
			app_age_start=parseInt(data.app_age_start)*365;
		}else{
			app_age_start=parseInt(data.app_age_start)
		}
		if(data.app_age_end_type==1){
			app_age_end=parseInt(data.app_age_end)*365;
		}else{
			app_age_end=parseInt(data.app_age_end)
		}
		if(data.insrnt_age_end_type==1){
			insrnt_age_end=parseInt(data.insrnt_age_end)*365;
		}else{
			insrnt_age_end=parseInt(data.insrnt_age_end)
		}
		if(data.insrnt_age_start_type==1){
			insrnt_age_start=parseInt(data.insrnt_age_start)*365;
		}else{
			insrnt_age_start=parseInt(data.insrnt_age_start)
		}
		if(isErr){
			showAlert("请完善配置信息");
		}else if(data.desc.length<6){
			showAlert("图文详情字数不够");
		}else if((app_age_start>app_age_end && data.app_age_end!=-1)||(data.app_age_start==0&&data.app_age_end==-1)){
			
			showAlert("投保人年龄区间选择有误");
		}else if((insrnt_age_start>insrnt_age_end && data.insrnt_age_end!=-1)||(data.app_age_start==0&&data.app_age_end==-1)){
			
			showAlert("被保险人年龄区间选择有误");
		}else{
			data.save_status=2;//表示保存
			postInfo(data);
		}
	});
	//暂存按钮 点击
	$("#save_btn").click(function(){
		var t=$("form").serializeArray(),isErr=false,data={},examine=false;
		$.each(t, function() {
			if(data[this.name]){
				data[this.name] +=","+util.trimSpace(this.value,1); 
			}else{
				data[this.name] = util.trimSpace(this.value,1); 
			}
		});
		if(data.type=='1'){
			data.scene_id='';
		}else if(data.type=='2'){
			data.cls_id='';
			data.ins_type='';
		}else if(data.type=='1,2'){
			data.type='3';
		}else{
			data.cls_id='';
			data.ins_type='';
			data.scene_id='';
		}
		data.save_status=1;//表示暂存
		postInfo(data);
	});
	//图片上传控件初始化 http://plugins.krajee.com/file-input
	$(".updataImg").fileinput({
			language: 'zh',
			uploadUrl:util.getURL("FileUpload/ueditor_upload?dir=Picture"), //上传的地址
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
	   }).on("filebatchuploadsuccess", function (event, data, previewId, index){//上传成功
			 if(data.response.status){
				var info=data.response.info;
				$("input[name=image]").val(info.img);
				$("img[name=image_url]").attr('src',info.img_url);
			 }else{
				showAlert("上传有误");				
			 }
	}).on("filebatchuploaderror", function (event, data, msg){
			$('.kv-upload-progress').addClass("hide");
			showAlert("上传有误");		
	}).on("filebatchselected", function(event, files) {
		$(this).fileinput("upload")
	});
	//图文编辑器初始化 配置详情可去：http://kindeditor.net/doc.php
    KindEditor.ready(function(K) {
		editor_desc=K.create('textarea[name=desc]', {
			allowImageUpload:true,//允许上传图片
			uploadJson:util.getURL("FileUpload/ueditor_upload"),
			afterUpload: function(){this.sync();},
			afterBlur: function(){this.sync();}
        });
		getInfo();
    });
	
	
});
