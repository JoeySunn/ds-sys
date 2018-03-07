/* 
	条款说明页面js文件
		showAlert : 错误信息弹框
		getInfo  ：获取商户信息并渲染
		postInfo ：保存数据
		图文编辑器初始化
	以及各个按钮的点击事件监听
*/
$(function(){
	var asys=window.parent.asys,
		editor_explain,//条款说明图文编辑器的对象
		url_type=util.getQueryParam("type"),//页面状态，show为查看状态只能查看不能编辑，edit为编辑状态可编辑
		id=util.getQueryParam("id");//产品ID
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
	//图文编辑器初始化 配置详情可去：http://kindeditor.net/doc.php
    KindEditor.ready(function(K) {
		editor_explain=K.create('textarea[name=explain]', {
			allowImageUpload:true,//允许上传图片
			uploadJson:util.getURL("FileUpload/ueditor_upload"),
			afterUpload: function(){this.sync();},
			afterBlur: function(){this.sync();}
        });
		getInfo();
    });
	/*
		保存数据
		 data:需要保存的数据
	*/
	function postInfo(data){
		if(!data){
			return;
		}
		data.id=id;
		data.save_module=3;//写死状态，表示条款说明保存
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
				info_module:3
			},
			dataType:"json",
			success:function(data){
				if(data.status){
					var info=data.info;
					$("textarea[name='explain']").val(info.explain?info.explain:'');
					if(editor_explain){
						editor_explain.html(info.explain?info.explain:'');
					}
					$("div[name='explain']").html(info.explain?info.explain:'');
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
	//事件监听
	$("input[name='type']").click(function(){
		var value=this.value;
		if(this.checked){
			$("#type_"+value).show();
		}else{
			$("#type_"+value).hide();
		}
	});
	//关闭条款说明的页面，只适用于在管理平台系统中操作时打开的页面，
	$("#cancle_btn").click(function(){
		if(asys){
			asys.closeModal();
		}
	});
	//保存并确认配置完成 按钮
	$("#confirm_btn").click(function(){
		var t=$("form:first").serializeArray(),isErr=false,data={},examine=false;
		$.each(t, function() {
			if(this.value){
				if(data[this.name]){
					data[this.name] +=","+this.value; 
				}else{
					data[this.name] = this.value; 
				}
			}else{
				isErr=true;
			}
		});
		if(isErr){
			showAlert("请完善配置信息");
		}else{
			data.save_status=2;
			postInfo(data);
		}
	});
	//暂存按钮
	$("#save_btn").click(function(){
		var t=$("form:first").serializeArray(),isErr=false,data={},examine=false;
		$.each(t, function() {
			if(data[this.name]){
				data[this.name] +=","+this.value;
			}else{
				data[this.name] = this.value;
			}
		});
		data.save_status=1;
		postInfo(data);
	});
	
});
