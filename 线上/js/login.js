$(function(){var a=false;if(isIE8){a=true}else{c()}function c(){a=false;$(".bar1").slideToUnlock({height:50,width:350,text:"右划验证",succText:"验证成功",bgColor:"#99bad4",textColor:"#787878",progressColor:"#7AC23C",succTextColor:"#fff",successFunc:function(){a=true}})}$("#chgPwd").click(function(){var f=$("#newPwd").val(),d=$("#againPwd").val();var e=this;if(!f){b("请输入新密码");return}if(f!=d){b("俩次输入的密码不相同");return}$(e).attr("disabled","disabled");$.ajax({type:"POST",url:"OpenDS/Manager/SystemAccount/chg_password",data:{password:f,type:1},success:function(g,i,h){if(g.status){window.location.href="OpenPlatform.html"}else{b(g.info);$(e).removeAttr("disabled")}},error:function(){b("请请求出错，请重试");$(e).removeAttr("disabled")}})});$("#login").click(function(){$("#myAlert").alert("close");var d=$("#username").val();var f=$("#password").val();var e=this;if(!d){b("请输入账号");return}if(!f){b("请输入密码");return}if(!a){b("请滑动验证条");return}$(e).attr("disabled","disabled");$.ajax({type:"POST",url:"OpenDS/Manager/SystemAccount/login_do",data:{account:d,password:f},success:function(g,i,h){if(g.status){if(g.info.is_chgpasswd==1){$("h3").html("初次登录，请修改密码");$(".login_box").hide();$(".chgPwd").show()}else{window.location.href="OpenPlatform.html"}}else{b(g.info);$(e).removeAttr("disabled")}},error:function(){b("请请求出错，请重试");$(e).removeAttr("disabled")}})});function b(e){var d='<div id="myAlert" class="alert alert-warning"><a href="#" class="close" data-dismiss="alert">&times;</a><strong>警告！</strong>'+e+"</div>";$("#myAlert").remove();$(".Platform_box").append(d)}});