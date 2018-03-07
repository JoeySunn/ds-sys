$(function () {
		var isSliderSuc=false;//用于判断是否滑动完成
		if(isIE8){
			isSliderSuc=true;
		}else{
			unlock();
		}
		//滑动控件初始化方法
		function unlock(){
			isSliderSuc=false;
			$('.bar1').slideToUnlock({
				height : 50,
				width : 350,
				text : '右划验证',
				succText : '验证成功',
				bgColor : '#99bad4',
				textColor : '#787878',
				progressColor : '#7AC23C',
				succTextColor : '#fff',
				successFunc:function(){
					isSliderSuc=true;
				}
			});
		}
		
		//第一次登陆修改密码
		$("#chgPwd").click(function(){
			var pwd=$("#newPwd").val(),
			 againPwd=$("#againPwd").val();
			 var btn=this;
			 if(!pwd){
				showAlert("请输入新密码");
				return;
			 }
			 if(pwd!=againPwd){
				showAlert("俩次输入的密码不相同");
				return;
			 }
			 $(btn).attr("disabled","disabled");
			 $.ajax({
				type : "POST",
				url : "OpenDS/Manager/SystemAccount/chg_password",
				data : {
					password:pwd,
					type:1
					
				}, 
				success : function(res, textStatus, jqXHR){
				   //alert(JSON.stringify(res));
					if(res.status){
						window.location.href="OpenPlatform.html";
					}else{
						showAlert(res.info);
						$(btn).removeAttr("disabled");
					}			
				},
				error:function(){
					showAlert("请请求出错，请重试");	
					$(btn).removeAttr("disabled");					
				}
			});
		})
		//登陆
		$("#login").click(function(){
			$("#myAlert").alert('close');
			var usename=$("#username").val();
			var pwd=$("#password").val();
			var btn=this;
			if(!usename){
				showAlert("请输入账号");
				return;
			}
			if(!pwd){
				showAlert("请输入密码");
				return;
			}
			if(!isSliderSuc){
				showAlert("请滑动验证条");
				return;
			}
			
			$(btn).attr("disabled","disabled");//禁用按钮
			$.ajax({
				type : "POST",
				url : "OpenDS/Manager/SystemAccount/login_do",
				data : {
					account:usename,
					password:pwd
					
				}, 
				success : function(res, textStatus, jqXHR){
				   //alert(JSON.stringify(res));
					if(res.status){
						if(res.info.is_chgpasswd==1){//判断是否需要修改密码如果需要显示修改密码框
							$("h3").html("初次登录，请修改密码");
							$(".login_box").hide();
							$(".chgPwd").show();
							
						}else{
							window.location.href="OpenPlatform.html";//进入页面
						}
					}else{
						showAlert(res.info);
						$(btn).removeAttr("disabled");//启用按钮
					}			
				},
				error:function(){
					showAlert("请请求出错，请重试");
					$(btn).removeAttr("disabled");	//启用按钮				
				}
			});
		})
	//错误显示
       function showAlert(content){
		 var html='<div id="myAlert" class="alert alert-warning">'+
					'<a href="#" class="close" data-dismiss="alert">&times;</a>'+
					'<strong>警告！</strong>'+content+
				'</div>'
		$("#myAlert").remove();
		$(".Platform_box").append(html);
	   } 
    })