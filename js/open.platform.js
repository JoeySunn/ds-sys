var sysData={},
	asys=(function(){
	/*
	本项中主要进行了
		1.左侧导航
		2.数据请求的总方法(将post请求封装)
		3.模态框的显示 包括alert形式和在tab中的模态框两种模态框
		4.tab标签页的渲染 包括标签页滚动
		5.表格渲染
		6.分页控制
		7.所有的模态框关闭事件
		8.时间控件渲染
		9.右击菜单显示
	*/
var TOTAL_PAGE=9,//分页最多展示几个
	tab_n=1,//表格数量，用于创建不同id的表格
	isRightMenu=false,//是否需要右击菜单
	tabTopLeft=0,//tab标签右移动了多少距离
	IS_SORT_TABLE=false,//表格是否支持点击表头排序
	HOST="";//服务器地址和请求url的地址配置
	//模态框弹框的html
	function modalHtml(id){
		var html='<div class="modal fade" id="'+(id?id:'editbox')+'"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
				'<div class="modal-dialog">'+
					'<div class="modal-content">'+
						'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
						' <div class="modal-header">'+
							'<h4 class="modal-title text_center"></h4>'+
						' </div>'+
					  '<div class="modal-body">'+
						' <div class="pop-box">'+
						' </div>'+
					 ' </div>'+
					  '<div class="modal-footer text_center">'+
						'<button type="button" class="btn btn-default " data-dismiss="modal" style="width: 86px;" >取消</button>'+
						'<button type="button" class="btn btn-primary " style="margin-left: 60px;width: 86px;" >确认</button>'+
					 ' </div>'+
					'</div>'+
				 ' </div>'+
				'</div>';
	
		return html;
	}
	var open_sys={
		/*
			系统初始化
				禁用右键菜单
				给tr绑定右击事件，并点击其他位置时隐藏右击菜单
				监听浏览器窗口大小变化
				tab标签滚动方向键事件绑定
				退出按钮监听
		*/
		init:function(){
			if(isRightMenu){
				document.oncontextmenu=asys.defaultMenu; // IE中禁止右键默认菜单；
				$(".tab-content").on("contextmenu","tr",function(){
					asys.defaultMenu(); 
					rownum=$(this).attr('data-id'); //获取所单击行的id
					asys.menuEvent(event,rownum);
				 
				});
				$(document).on("click",".right",function(){
					asys.hiddenMenu()
				});
			}
			//监听浏览器窗口大小变化
			$(window).resize(function() {
			  asys.tabBoxHeight();
			  asys.showMoveBtn();
			});
			//tab标签滚动方向键事件绑定
			var timeId;//定时器id 
			$(".tab_top_right").click(function(){
				asys.tabMoveRight();
				
			})
			$(".tab_top_right").mousedown(function(){//长按事件
				timeId=setInterval(function(){//每100秒运行一次移动事件
					asys.tabMoveRight();
				},100);
			})
			$(".tab_top_left").click(function(){
				asys.tabMoveLeft();
			})
			$(".tab_top_left").mousedown(function(){//长按事件
				timeId=setInterval(function(){//每100秒运行一次移动事件
					asys.tabMoveLeft();
				},100);
			})
			//鼠标移动或者松开后 清除定时器，
			$(".tab_top_left,.tab_top_right").mouseout(function(){
				clearTimeout(timeId);  
			})
			$(".tab_top_left,.tab_top_right").mouseup(function(){
				clearTimeout(timeId);  
			})
		},
		//获取模态框弹框的html，并返回
		modalHtml:function(id){
			return modalHtml(id);
		},
		//隐藏右击菜单
		hiddenMenu:function (){
			var tabid=asys.getTabId();
			$(tabid).children(".client_menu").css("visibility","hidden");
		},
		//去掉系统右击菜单
		defaultMenu:function (){
			window.event.returnValue=false;
			return false;
		},
		//tab中表格距标签栏的高度
		tabBoxHeight:function(){
			$('.search-checkstate').each(function(){
				var offsetTop=$(this)[0].clientHeight;
				$(this).parent().find(".table_box").each(function(){
					$(this)[0].style.top=offsetTop+"px";
				});
			})
		},
		/*	
			tab标签绑定shown事件，方便切换标签时表格和标签栏的距离
			并计算表格距离标签栏的高度
		*/
		tabBin:function (){
			$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
				asys.tabBoxHeight();
			});
			asys.tabBoxHeight();
		},
		//获取当前活动tab的dom并返回
		getTabId:function(){
			return $(".tabs_top").children("li[class='active']").children('a').attr('href')
		},
		
		//关闭当前tab中的所有模态框
		closeModal:function(){
			var tabid=asys.getTabId();
			var modalList= $(tabid).find(".modal");
			modalList.modal('hide');
		},
		/*
			post请求 如果错误提示为‘用户未登录!'跳转到登陆页面 数据post之前会将数据前后空格删除掉
			config: 弹框配置
				url: 请求的url 为没有使用过 OPEN。url 的字符串
				params：请求的参数
				successFun:请求成功运行方法,有则运行 并将数据传给改方法
				statusErrorFun: 请求成功但状态有误运行方法, 有则运行 并将数据传给改方法
				errorFun:请求失败运行方法,有则运行
				isShwoAlert:是否弹错误提醒;默认弹框提醒
				
		*/
		post:function(config){
			config.isShwoAlert=config.isShwoAlert==undefined?true:config.isShwoAlert;//如果没有设置弹框是否提现时将isShwoAlert设置为true
			$.each(config.params,function(key,val){
				config.params[key]=OPEN_FUN.goFun("util.trimSpace",val);//删除前后空格
			});
			$.ajax({
				type:"POST",
				url:util.getURL(config.url),
				data:config.params,
				dataType:"json",
				success:function(data){
					if(data.status){
						if(config.successFun){
							config.successFun(data);
						}
					}else{
					  if(data.info=='用户未登录!'){
							window.location.href='index.html';
					  }else{
						if(config.isShwoAlert){
							asys.showAlert({title:'温馨提醒',msg:data.info,isCancel:false})
						}  
						if(config.statusErrorFun){
							config.statusErrorFun(data);
						}  
					  }	
						
					}
				},
				error:function(){
					if(config.isShwoAlert){
						asys.showAlert({title:'温馨提醒',msg:'数据请求失败！',isCancel:false})
					}
					if(config.errorFun){
						config.errorFun();
					}
				}
		  })
		},
		/*
			警告框 (默认3s消失）
			config: 警告框配置
				html:警告框内容，如果没有则不显示,
				isAutoHide:是否自动消失，默认消失（3秒后消失）
				hideSec:自动隐藏毫秒数设置（没有则3秒后消失）
				alertType:警告框样式alert-success 成功  alert-info消息 alert-warning警告 alert-danger错误 默认为alert-success
		*/
		alerts:function(config){
			if(!config.html){
				return;
			}
			if(!config.alertType){
				config.alertType='alert-success'
			}
			var html="";
			if(config.isAutoHide){
				config.alertType+=' alert-dismissable';
				html='<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
			}
			$(".alertBox").append('<div class="alert '+config.alertType+'">'+html+config.html+'</div>');
			var alertDom=$(".alertBox .alert:last")
			if(!config.isAutoHide){
				var sec=3000;
				if(config.hideSec){
					sec=parseInt(config.hideSec);
				}
				setTimeout(function(){
					alertDom.remove();
				},sec);
			}
			
		},
		/*
			弹框
			config: 弹框配置
				title:弹框标题，如果没有标题栏隐藏,
				msg:弹框主要内容区域，可以文字或者html,必要，如果没有则不显示
				isConfirm:是否有确认按钮，默认true
				isCancel:是否有取消按钮，默认true
				confirmFun：点击确认后运行方法，如果为空则只是隐藏弹框
				cancelFun：点击取消后运行方法，如果为空则只是隐藏弹框
				confirmText:确认按钮的文字，默认为 确认
				cancelText：取消按钮文字 默认为 取消
				
		*/
		showAlert:function (config){
			if(!config.msg){
				return;
			}
			config.isConfirm=config.isConfirm==undefined?true:config.isConfirm;
			config.isCancel=config.isCancel==undefined?true:config.isCancel;
			var confirmDom=$('#confirm');
			if(config.title){
				confirmDom.find(".modal-header").show();
				confirmDom.find(".modal-title").text(config.title);
			}else{
				confirmDom.find(".modal-header").hide();
			}
			confirmDom.find(".pop-box").html(config.msg);   
			//取消之前的绑定事件
			confirmDom.find(".btn-default").unbind();
			confirmDom.find(".btn-primary").unbind();
			//确认按钮方法
			confirmDom.find(".btn-primary").click(function(){
				confirmDom.modal('hide');
				if(config.confirmFun){
					config.confirmFun(confirmDom);
				}
			}); 
			//取消按钮方法
			confirmDom.find(".btn-default").click(function(){
				confirmDom.modal('hide');
				if(config.cancelFun){
					config.cancelFun(confirmDom);	
				}
			});		
			if(!config.isConfirm){
				confirmDom.find(".btn-primary").hide();
			}else{
				confirmDom.find(".btn-primary").show();
			}
			if(!config.isCancel){
				confirmDom.find(".btn-default").hide();
			}else{
				confirmDom.find(".btn-default").show();
			}
			if(config.confirmText){
				confirmDom.find(".btn-primary").text(config.confirmText);
			}else{
				confirmDom.find(".btn-primary").text("确认");
			}
			if(config.cancelText){
				confirmDom.find(".btn-default").text(config.cancelText);
			}else{
				confirmDom.find(".btn-default").text("取消");
			}

			if(!config.isConfirm && !config.isCancel){
				confirmDom.find(".modal-footer").hide();
			}else{
				confirmDom.find(".modal-footer").show();
			}
			confirmDom.modal('show');

		},
		
		/*
			在活动的tab中显示弹框  并返回改模态框的dom
			isAdd: 是否是添加模态框，（为了显示俩个模态框），如果是新添加：不删除之前的非add模态框，但会删除之前添加的add类型的模态框
										如果不是新添加：删除之前所有模态框
			config: 弹框配置
				title:弹框标题，如果没有标题栏隐藏,
				html:弹框主要内容区域html,必要
				isFull：是否全屏显示
				isConfirm:是否有确认按钮，默认true
				isCancel:是否有取消按钮，默认true
				confirmFun：点击确认后运行方法，如果为空则只是隐藏弹框
				cancelFun：点击取消后运行方法，如果为空则只是隐藏弹框
				confirmText:确认按钮的文字，默认为确认
				cancelText：取消按钮文字，默认为取消
				hideFun：弹框关闭后运行方法
		*/
		showModalHtml:function (config,isAdd){
			//如果没有html参数 则不做任何操作
			if(!config.html){
				return;
			}
			//判断是否隐藏按钮，如果没有则默认true
			config.isConfirm=config.isConfirm==undefined?true:config.isConfirm;
			config.isCancel=config.isCancel==undefined?true:config.isCancel;
			var tabid=asys.getTabId(),//获取当前活动tab的dom
				modalList= $(tabid).find(".modal");//查找当前活动tab中的所有模态框
			//是否为添加类型
			if(!isAdd){
				modalList.remove();	
			}else{
				$(tabid).find("#addModal").remove();
			}
			$(tabid).append(modalHtml(isAdd?'addModal':''));
			
			if(isAdd){
				modalList= $(tabid).find("#addModal");	
			}else{
				modalList= $(tabid).find(".modal");
			}
			//是否有标题，如果没有则隐藏标题栏
			if(config.title){
				modalList.find(".modal-header").show();
				modalList.find(".modal-title").text(config.title);
			}else{
				modalList.find(".modal-header").hide();
			}
			//给确认按钮绑定方法
			modalList.find(".btn-primary").click(function(){
				if(config.confirmFun){
					config.confirmFun(modalList);
				}else{
					modalList.modal('hide');
				}
			}); 
			//给取消按钮绑定方法
			modalList.find(".btn-default").click(function(){
				modalList.modal('hide');
				if(config.cancelFun){
					config.cancelFun(modalList)	
				}
			});
			//绑定模态框关闭后方法
			modalList.on('hide.bs.modal',config.hideFun);
			//显示和隐藏按钮，并设置按钮文字
			if(!config.isConfirm){
				modalList.find(".btn-primary").hide();
			}else{
				modalList.find(".btn-primary").show();
			}
			if(!config.isCancel){
				modalList.find(".btn-default").hide();
			}else{
				modalList.find(".btn-default").show();
			}
			if(config.confirmText){
				modalList.find(".btn-primary").text(config.confirmText);
			}else{
				modalList.find(".btn-primary").text("确认");
			}
			if(config.cancelText){
				modalList.find(".btn-default").text(config.cancelText);
			}else{
				modalList.find(".btn-default").text("取消");
			}
			if(!config.isConfirm && !config.isCancel){
				modalList.find(".modal-footer").hide();
			}else{
				modalList.find(".modal-footer").show();
			}
			//是否是全屏
			if(config.isFull){
				modalList.find(".modal-dialog").css({'position': 'absolute','left': '0','right': '0','top': '0','bottom':'0','width': 'auto','margin': '0'});
				modalList.find(".modal-dialog .modal-content").css({'height': '100%'});
				modalList.find(".modal-dialog .modal-body").css({'height': '100%'});
			}
			//将文字或者html加入到模态框主显示区域
			modalList.find(".pop-box").html(config.html);
			modalList.modal('show'); 
			return modalList;

		},
		/*
			树形结构html构造
				循环数据构造html标签，并将数据中的funName绑定到html中，之后点击时获取该方法，然后运行。如果没有点击时将不会运行任何方法
			navdata:数据
			isCheck:是否有复选框
			layer:层级
			isPower:是否是按钮级
			返回 html标签
		*/
		treeHtml:function (navdata,isCheck,layer,isPower){
		   var navstr="";
		   $.each(navdata,function(key,value){
			   navstr+= '<li>'+(isCheck?('<input name="power" treeType="'+(isPower?"power":"tree")+'" layer="'+layer+'" value="'+value.fcode+'" type="checkbox" class="checkbox">'):'')+'<label class="icon_up"></label><a href="#" data-ischeck="'+(isCheck?'1':'0')+'" data-fcode="'+value.fcode+'"  data-funname="'+(value.funname?value.funname:'')+'" >'+value.title+'</a></li>';
				if(value.tree||(isCheck && value.power)){
					navstr+= '<ul show="true">';
					if(value.tree){
						navstr+=asys.treeHtml(value.tree,isCheck,layer+1);
					}else if(isCheck && value.power){
						navstr+=asys.treeHtml(value.power,isCheck,layer+1,true);
					}
					navstr+='</ul>';
				}
		   });
		   return navstr;
		},
		/*
			树形结构初始化
			点击事件如果已添加过则打开对应标签页
		*/
		leftnav:function (){
			$(".st_tree").SimpleTree({
			/* 单击左侧菜单子菜单时触发*/
				click:function(a){
					//获取被点击的左侧导航的标签的funname fcode isCheck等属性
					var funname= $(a).data("funname"),
						fcode= $(a).data("fcode"),
						ischeck= $(a).data("ischeck"),
						isShowTab=false;
					//如果点击的是复选框则不进行打开标签操作
					if(ischeck==1){
						return
					}	
					//如果没有funname 则不进行打开标签操作
					if(!funname){
						return;	
					}
					asys.setTabActve(fcode,funname,$(a).text());
				}
			});
		},
		/*
			标签栏渲染
				如果打开的标签栏中有对应的fcode则打开该标签，如果没有则新建;
			fcode:需要打开或新建的fcode
			funname:对应的渲染方法；
		*/
		setTabActve:function(fcode,funname,title){
			var isShowTab=false;
			//获取所有打开的标签，查看是否fcode是否有被点击的左侧导航的fcode相同的，如果有则切换到该标签
			$(".tabs_top").children("li").children("a").each(function(){
				if($(this).data("fcode")== fcode){
					$(this).trigger('click');
					isShowTab=true;
					return;
				}
			})
			//是否需要新建标签，故打开的标签的fcode 没有被点击的左侧导航的fcode相同的
			if(!isShowTab){
				tabInfo=asys.addTab(title,fcode,OPEN_FUN.getParam('OPEN.'+fcode+'.header'));
				OPEN_FUN.goFun(funname.substr(0,funname.length-2),tabInfo);
				
			}
			asys.onNavBin();
			//标签栏是否出现滚动条
			asys.showMoveBtn()
		},
		//标签栏事件绑定（右击事件弹出自定义右击菜单）
		onNavBin:function(){
			//鼠标右键监听
			$(".tabs_top li").on('contextmenu',function(e){
				e.preventDefault();//阻止系统右键
				var coord=asys.getMousePos(event); //获取鼠标点击位置
				//计算位置，并显示右键菜单
				if(coord.x + 100 > screen.availWidth){
				var left=coord.x - 90 + 'px';
					$(".nav_menu").css("left",left);
				}else{
					$(".nav_menu").css("left",coord.x + 'px');
				}
				if(coord.y + 122 > screen.availHeight){
					var top=coord.y - 122 + 'px';
					$(".nav_menu").css("top",top);
				}else{
					$(".nav_menu").css("top",coord.y + 'px');
				}
				$(".nav_menu").css("visibility","visible");
				$(".nav_menu")[0].navDom=this;//记录当前标签的dom，留待之后选择的时候用
				return false;	
			});
			//右击菜单 点击事件
			$(".nav_menu li").click(function(){
				var type=$(this).data("type"),//type: 1 关闭当前,2 关闭非当前,3 关闭右边所有, 4 关闭左边所有
					navDom=$(".nav_menu")[0].navDom;
				if(type==1){//关闭当前
					$(navDom).find(".tabs_top_close").click();
				}else if(type==2){//关闭非当前
					$(navDom).siblings().find(".tabs_top_close").click();
				}else if(type==3){
					$(navDom).nextAll().find(".tabs_top_close").click();
				}else if(type==4){
					$(navDom).prevAll().find(".tabs_top_close").click();
				}
				if($(navDom).parent().find("li.active").length==0){//判断是否有激活的标签，如果没有激活当前的
					$(navDom).children('a').trigger('click');
				}
			})
			$(document).click(function(){
				$(".nav_menu").css("visibility","hidden");
			});
		},
		//设置标签栏的宽度
		setNavWidth:function(){
			var width=$(".Robot_tab .tabs_top").children("li").length*100; //添加tab标签;
			$(".Robot_tab .tabs_top").css("width",width);
			asys.showMoveBtn();
		},
		//查找活动标签的位置，并移动到对应位置
		tabActivePosition:function(){
			var boxDom=$(".tab_top_box"),
				navBox=$(".tabs_top"),
				activeLi=navBox.find('li.active'),
				boxWidth=boxDom.width(),
				navBoxWidth=navBox.width(),
				maxScrollLeft=navBoxWidth-boxWidth;
				offsetLeft=activeLi[0].offsetLeft;
			if(maxScrollLeft>0 && offsetLeft-boxWidth+104>0){
				boxDom.scrollLeft(offsetLeft-boxWidth+104);
				tabTopLeft=offsetLeft-boxWidth+104;
			}else{
				boxDom.scrollLeft(0);
				tabTopLeft=0
			}
			
		},
		//是否需要显示标签栏左右移动按钮
		showMoveBtn:function(){
			var boxDom=$(".tab_top_box"),
				navBox=$(".tabs_top"),
				boxWidth=boxDom.width(),
				navBoxWidth=navBox.width(),
				maxScrollLeft=navBoxWidth-boxWidth;
			if($(".main_op").is(":hidden")){
				return;
			}
			if(maxScrollLeft>0){
				$('.move_btn').show();
				$(".tab_top_box").css('left','42px');
				$(".tab_top_box").css('right','42px');
				asys.tabActivePosition()
			}else{
				$(".tab_top_box").css('left','0px');
				$(".tab_top_box").css('right','0px');
				$('.move_btn').hide();
			}
			
		},
		//标签栏右移
		tabMoveRight:function(){
			var boxDom=$(".tab_top_box"),
				navBox=$(".tabs_top"),
				boxWidth=boxDom.width(),
				navBoxWidth=navBox.width(),
				maxScrollLeft=navBoxWidth-boxWidth;
			if(maxScrollLeft>0){
				if(tabTopLeft+20>maxScrollLeft){
					tabTopLeft=maxScrollLeft;
				}else{
					tabTopLeft+=20;
				}
				
				boxDom.scrollLeft(tabTopLeft);
			}else{
				boxDom.scrollLeft(0);
				tabTopLeft=0;
			}
		},
		//标签栏左移
		tabMoveLeft:function(){
			if(tabTopLeft-20<0){
				tabTopLeft=0;
			}else{
				tabTopLeft-=20;
			}
			$(".tab_top_box").scrollLeft(tabTopLeft);
		},
		
		 /*
			动态添加tab栏， 将titl fcode等信息拼接到标签的a标签中留待以后使用
			tabmenu:标签名称，
			tableHeader：表格头部配置项，如果有则创建表格并显示表格头部
			isTwoTable: 是否有俩张表格
			
			return返回新建标签的 don信息 包括 标签（非头部标签页）的dom，表格dom
			
		*/
		addTab:function (tabmenu,fcode,tableHeader){
			var tabId="data_table"+tab_n,
				tabInfo={},
				tab_bar='<li class="active"><a href="#tab'+tab_n+'" title="'+tabmenu+'" data-fcode="'+fcode+'"  data-toggle="tab">'+tabmenu+'<span class="glyphicon glyphicon-remove-sign tabs_top_close"></span></a></li>',
				tab_pane= '<div class="tab-pane active" id="tab'+tab_n+'"></div>';
				$(".Robot_tab .tab-content").children("div").removeClass('active'); 
				$(".tabs_top").children("li").removeClass('active'); 
				$(".Robot_tab .tab-content").append(tab_pane);
				tabInfo.tabDom=$("#tab"+tab_n);
				if(tableHeader){//如果有表格头部则渲染表格
					tabInfo.tableDom=asys.addTable(tabInfo.tabDom,tableHeader,tableHeader.isTwoTable,tabId);
				}
			tab_n++;//已经渲染的tab标签数用于生成不同的id
			$(".Robot_tab .tabs_top").append(tab_bar); //添加tab标签;
			asys.setNavWidth()//设置标签栏的宽度
			return tabInfo;	
		},
		/*
			添加表格 注意 表格是被初始化后被隐藏的
			  jqDom: 需要点击表格的jquery dom
			  tableTile:表格头部
			  isTwoTable 是否是俩个表格
			  tabId: 创建表格对应的id
			return 返回添加表格的jquery dom，如果俩个表格的返回的是数组 
		*/
		
		addTable:function(jqDom,tableTile,isTwoTable,tabId){
			if(isTwoTable){
				var classManagestr= '<div class="classManage">'+
					'<div class="classManage_left">'+
					 '<div class="classManage_head">'+
					 '</div>'+
					 '<div class="classManage_body">';
				classManagestr+=getTableHtml(tableTile[0],tabId+'_1'); //渲染表格1
				classManagestr+=     '</div></div>'
				classManagestr+=     '<div class="classManage_right">'
				classManagestr+=      '<div class="classManage_head">'
				classManagestr+=      '</div>'
				classManagestr+=      '<div class="classManage_body">'
				classManagestr+=getTableHtml(tableTile[1],tabId+'_2');//渲染表格2
				classManagestr+=  '</div></div>'
				classManagestr+=  '</div>'
				jqDom.append(classManagestr);
				return [$("#"+(tabId+'_1')),$("#"+tabId+"_2")];
			}else{
				var table='<div class="table_box" hidden>'+getTableHtml(tableTile,tabId)+'</div>';
				jqDom.append(table);
				return $("#"+tabId);
				
			}
			//拼接表格对应的html，并返回对应的html	
			function getTableHtml(tableTile,tabId){
				 var html='<div class="fixed_table_container"><div class="scroll_box"><div class="fixed-table-header"></div><div class="fixed-table-body"><table id='+(tabId?tabId:'info')+' class="table table-striped table-condensed text_center"><thead><tr>', per=100;
				 if(tableTile.isCheck){
					 per=98;
					html+='<th style="width:2%;"><div class="th-inner" style="width:2%;"><input name="btSelectAll" type="checkbox" class="checkbox"></div></th>'; 
				 }
				 var pro=per/tableTile.title.length;
				 $.each(tableTile.title,function(key,value){
				  html+='<th style="width:'+pro+'%;"><div class="th-inner ellipsis" style="width:'+pro+'%;">'+value+'</div></th>';
				  })
				  html+='</tr></thead><tbody></tbody></table></div><div></div>'
				  return html;
			}
		},
		/*
			添加查询或者按钮盒子
				obj：tab标签jquery dom，
				html：查询或者按钮盒子的html标签
				getDataFun: 获取数据方法
		*/
		addSearch:function(obj,html,getDataFun){
			/*将筛选栏添加到tab中*/              
			obj.prepend(html);
			//重置按钮绑定事件
			obj.find(".search_box .btn-default").click(function(){
				var t = $(this).closest(".form-inline")[0].reset();	
				getDataFun(1);			
			});
			//查询按钮绑定事件
			obj.find(".search_box .btn-primary").click(function(){
				var data = {};
				var t = $(this).closest(".form-inline").serializeArray();
				$.each(t, function() {
				  data[this.name] = this.value;
				});
				getDataFun(1,data);
			});
			
		},
		/*
			表格头部点击排序方法
			
				tableDom:表格jqDom
				dataParamName: 表格列对应的 数据属性名称
					
		*/
		tableSort:function(tableDom,dataParamName){
			if(!IS_SORT_TABLE){//判断是否系统是否需要点击头部排序
				return;
			}
			var th=tableDom.find("th");//获取th
			$.each(dataParamName,function(i){//给th中绑定field 和样式
				th.eq(i).find("div").attr("data-field",this).addClass("sort");
			});
			th.find(".sort").unbind();//解绑方法
			th.find(".sort").click(function(){//绑定方法
				var self=this,
					getData=tableDom[0].getDataFun,
					param={},
					field=$(self).data("field"),
					sort_type=self.sort_type;
				th.find(".order").remove();//删除所有列的排序
				$.each(th,function(){//设置其他列的默认排序
					var btn=$(this).find("div")[0];
					if(self!=btn){
						btn.sort_type="DESC";
					}
				});
				//设置本列的排序
				if(sort_type=='DESC'){
					self.sort_type='ASC';
					$(self).append('<span class="order"><span class="caret"></span></span>');
					param.sort=JSON.stringify([{'sort_name':field},{"sort_type":"ASC"}]);
					getData('',param);
				}else{
					self.sort_type='DESC';
					$(self).append('<span class="order dropup"><span class="caret"></span></span>');
					param.sort=JSON.stringify([{'sort_name':field},{"sort_type":"DESC"}]);
					getData('',param);
				}
			});
		},
		
		/*
			渲染表格中的内容，根据配置中的表格配置判断是否需要合并单元格
			合并单元格数据 为 对象中有数组并且需要在表格中显示则为合并单元格
				config:配置参数
					tableDom：表格jquery dom
					data：数据
					paramConfig：表格对应配置，
					optionClick：操作单元格中点击事件绑定的方法
					trDblClick: tr标签双击事件绑定的方法,如果有则监听 无则不监听,
					checkVlaue:选中框value中的值对应参数，如果有值代表有复选框
					setOpname：权限管理的方法，用于渲染操作中的按钮
					
		*/
		tableCont:function(config){
			config.tableDom.parent().find(".noData").remove();
			config.tableDom.find('tbody').html("");//清除原有的tbody 下的所有html标签
			asys.tableSort(config.tableDom,config.paramConfig.dataParamName);
			$.each(config.data,function(k,v){//循环数据
				var str= '<tr>';
				if(config.checkVlaue){
					str+= '<td tdlayer=1><input name="btSelect" type="checkbox" value="'+eval('v.'+config.checkVlaue)+'"  class="checkbox"></div></td>';
				}
				var trInfo=tdHtml(v,config.paramConfig.dataParamName,1);
				str+=trInfo.str;
				if(config.paramConfig.power && config.setOpname){//操作栏渲染，
					str+=config.setOpname(config.paramConfig.power,v,false);
				}
				if(config.paramConfig.powers && config.setOpname){//第二个操作栏渲染
					str+=config.setOpname(config.paramConfig.powers,v,true);
				}
				str+= '</tr>';
				config.tableDom.find('tbody').append(str);//将tr标签追加到表格最后
				var trDom=config.tableDom.find('tbody tr:last')[0]//获取刚刚添加的tr标签
				trDom.trData=v;//将行数据绑定到tr标签的dom中；
				trDom.isFirst=true;//是否第一个tr用于表格操作的时候数据处理提供判断
				if(trInfo.layer>1){//判断是需要合并单元格
					rowSpan=tdMerge(v,v,2,trInfo.rowspans,trDom);//渲染其他tr数据,并获取到第一层需要合并单元格数量
					$(trDom).find('td[tdlayer=1]').attr("rowSpan",rowSpan?rowSpan:1);//查找所有层级为1的单元格，并设置其合并单元格数量
				}
			});	
			/*
				合并单元格渲染
					v 数据（整个数据包括所有合并单元格的数据）
					lists 上一级数据
					tdLayer 当前td的层级
					rowspans： 当前层级的合并单元格数据，
					trDom 表格对应jquery dom用于添加tr标签
			*/
			function tdMerge(v,lists,tdLayer,rowspans,trDom){
				var data=util.objDataValue(lists,rowspans[1]),rowSpan=1;//获取当前层级的数据，设置合并默认合并单元格数量
				//如果有数据 并且数据调试为1条时 并判断是否有是否有下级合并单元格如果有则递归调用合并单元格渲染
				if(data && data.length==1){
					if(rowspans[3].length>0){
						rowSpan=tdMerge(v,data[0],tdLayer+1,rowspans[3],trDom);//递归调用渲染数据，整个数据对象，包括 当前数据对象（0是因为只有一条故0），层级加一，下一级合并单元格的数据，和表格dom对象	
						$(trDom).find('td[tdlayer='+(tdLayer)+']').attr("rowSpan",rowSpan?rowSpan:1);//查找所有层级为本层的单元格，并设置其合并单元格数量
					}
					return rowSpan;//返回本层的合并单元格数量
				}
				//如果没有数据则返回 返回本层合并单元格为1
				if(!data){
					return 1;
				}
				
				var rowSpanCount=0//本层合并单元格总数量
				//循环数据
				$.each(data,function(k,val){
					if(k==0){//如果是第1条数据，因为之前的已经渲染故不需要渲染了，但是如果该数据下有合并单元格则需要递归调用本方法
						if(rowspans[3].length>0){
							rowSpan=tdMerge(v,val,tdLayer+1,rowspans[3],trDom);//递归调用渲染数据，整个数据对象，包括 当前数据对象（0是因为只有一条故0），层级加一，下一级合并单元格的数据，和表格dom对象	
							$(trDom).find('td[tdlayer='+(tdLayer)+']').attr("rowSpan",rowSpan?rowSpan:1)//查找所有层级为本层的单元格，并设置其合并单元格数量
						}
						rowSpanCount+=rowSpan;//总数量加上本次合并单元格数量
						return;
					}
					//渲染数据
					var str= '<tr>';
					var trInfo=tdHtml(val,rowspans[2],tdLayer);
					str+=trInfo.str;
					if(config.paramConfig.power){//操作栏渲染，
						str+=config.setOpname(config.paramConfig.power,v,false,val);
					}
					str+= '</tr>';
					config.tableDom.find('tbody').append(str);//将tr标签追加到表格最后
					var trLastDom=config.tableDom.find('tbody tr:last')[0]//获取刚刚添加的tr标签
					trLastDom.trData=v;//将行数据绑定到tr标签的dom中；
					trLastDom.isFirst=false;//是否第一个tr用于表格操作的时候数据处理提供判断
					trLastDom.layerData=val;//本层数据
					if(rowspans[3].length>0){//如果有下级合并单元格则递归调用合并单元格渲染方法
						rowSpan=tdMerge(v,val,tdLayer+1,rowspans[3],trLastDom);
					}
					$(trLastDom).find('td[tdlayer='+(tdLayer)+']').attr("rowSpan",rowSpan?rowSpan:1)//查找所有层级为本层的单元格，并设置其合并单元格数量
					rowSpanCount+=rowSpan;//总数量加上本次合并单元格数量
				})
				return rowSpanCount;
			}
			/*			
					注:（数据渲染有用到递归调用）
					td 数据渲染，如果有合并单元格则只渲染第一条
						v 数据
						dataParamName:td中需要渲染的数据的参数名称
						layer：表格中的合并单元格层级，1一级为合并数最大的，并将改等级渲染到tr标签中，之后合并单元格的时候用于查找并合并对应的单元格数量
				return 返回
					str: td的html标签如果分页的话 只要第一条数据
					layer 但其创建的td最低层级 （数字越小越高），这样用于判断总共分为多少层，
					rowspans：合并单元格的一些数据数组形式 【0】当前等级的下一级有多少条数据
														   【1】 当前等级的下一级对应的参数名
														   【2】当前等级的下一级对应的参数名中数组中对应的参数名称
														   【3】当前等级的下一级中是否有还有合并单元格 如果有则是 数组对应 之前的规则,并一直递归下去
			*/
			function tdHtml(v,dataParamName,layer){
				var str="",rowspans,rowspan=[];
				//循环td中需要渲染的数据的参数名称
				$.each(dataParamName,function(key,value){
					if(value instanceof Object &&  !(value instanceof Array)){//判断参数名称是否是对象并且不是数组，如果true 表示需要合并单元格，进入合并单元格数据采集，并渲染第一条数据
						$.each(value,function(keys,values){
							var rowData=util.objDataValue(v,keys);
							rowspan.push(rowData?rowData.length:1);
							rowspan.push(keys);
							rowspan.push(values);
							var data=util.objDataValue(v,keys+"[0]");//获取下级数据并赋值
							var tr=tdHtml(data,values,layer+1);//递归调用渲染下一级数据
							rowspan.push(tr.rowspans);//将返回值中的合并单元格数据加入到本次合并当然有数据中
							layer=tr.layer;//或者最低层级并赋值
							str+= tr.str;//加上 tb标签的html
						});
					}else{
						
						var data;
						if(value instanceof Array){//判断是否是数组
							data={};
							$.each(value,function(){
								data[this]=util.objDataValue(v,this);//获取数据中对应的对象数值
							})
						}else{
							data=util.objDataValue(v,value);//获取数据中对应的对象数值
						}
						str+= '<td name='+value+' tdLayer="'+layer+'">'+(data?config.paramConfig.getValueText(value,data,config.paramConfig.name):'-')+'</td>';//将数值转换为表格显示的文字或者其他类容，在配置参数中有对应的转换数值的方法：getValueText 传入但其参数名和数值，如果数据为空或者空字符串则显示“-”
					}
						
				});
				return {str:str,layer:layer,rowspans:rowspan};
			}
			/*
				获取当前层级需要合并的单元格数量（已废弃）
					需要合并单元格数量为当前等级以下所有等级合并单元格数量之和，
					如果下级合并数量为1则合并数量为0
			*/
			
			function getMaxRowSpan(data,arr_layer){
				var max=0;
				if(arr_layer>1){
					max+=getMaxRowSpan(data[3],arr_layer-1);
				}else{
					max=data[0]==1?0:data[0]
				}
				return max;
			}
			
			asys.tabBin();//tab标签事件绑定,tab标签的显示事件和计算表格距离标签栏的距离，计算的是中间搜索栏和操作按钮栏的高度
			//监听操作列 的单元格下的a标签单击事件
			config.tableDom.find('.operation a').click(config.optionClick);//操作单元格中a标签绑定事件
			if(config.trDblClick){
				//监听tr标签双击事件
				config.tableDom.find('tbody tr').dblclick(config.trDblClick);
			}
			if(config.checkVlaue){//全选按钮绑定事件
				config.tableDom.find("input[name=btSelectAll]").click(function(){
					
					if(this.checked){
						config.tableDom.find("[name = btSelect]:checkbox:not([disabled='disabled'])").prop("checked", true);
					}else{
						 config.tableDom.find("[name = btSelect]:checkbox").prop("checked",false);
					}
				})
			}
			config.tableDom.closest(".table_box").show();//将表格显示
			//表格列拖动控件 配置可参考http://www.bacubacu.com/colresizable/ 有做源码改动可查看控件注释
			config.tableDom.colResizable({
				  liveDrag:true, 
				  gripInnerHtml:"<div class='grip'></div>", 
				  draggingClass:"dragging", 
				  resizeMode:'overflow'
			});
			if(!config.data||config.data.length==0){
				config.tableDom.parent().append("<div class='noData'>无符合查询条件的结果</div>")
			}
		},
		
		/*
			分页控制
				config:分页配置
					dom:jquery dom ，在改dom内最后添加分页 必要如果没有则不显示分页
					page：第几页 默认第一页
					count: 总共数据数量 必要如果没有则不显示分页
					limit：每页数据数量 默认10条
					getDataFun: 点击页码运行的方法
					
		*/
		pagination:function (config){
			if(!config.dom){//如果表格id 或者总的数据量没有则不进行下步
				return;
			}
			var pagestr=  '<div aria-label="Page navigation" class="pages"> <ul class="pagination">';
			if(config.count<config.limit){//总的数据量小于每页条数 不进行页码条显示
				pagestr+='<li>'
				+         '<a aria-label="refresh" style="margin-left:10px">'
				+           '<span class="glyphicon glyphicon-refresh"></span>'
				+         '</a>'
				+       '</li>'
			}else{
				var limit=config.limit?config.limit:10,//是否有配置每页最小页数，如果没有则显示为10条
					page=config.page?config.page:1,//是否有配置当前页码数，如果没有则为第一页
					countPage=Math.ceil(config.count/config.limit),//获取总的页码数
					pageNum=TOTAL_PAGE,//展示的页面数量，配置项配置
					startPage=1;//开始页数
				page=parseInt(page);//转换成整数
				//判断总的页码数是否大于或等于 需要展示的页面条数，如果小于则不需要进行页码数字转换
				if(countPage>=pageNum){
					//获取开始的页码数				//如果当前页码数大于展示的页码条数的一半，并且总的页码数大于当前页码数加上展示的页码条数的一半减去一个则开始的页码数为当前页面数减去需要展示的页面数的一半加一个
					if(page>Math.ceil(pageNum/2) && countPage>(page+(Math.ceil(pageNum/2))-1)){
						startPage=(page-Math.ceil(pageNum/2))+1;
					}else if(page>Math.ceil(pageNum/2)){
						startPage=countPage-pageNum+1;
					}
					
					
					//其他时候开始页码数为1
				}else{
					pageNum=countPage;
				}
				// 上一个页面的按钮，如果但其页面为第一页时则禁用上一页按钮
				pagestr+='<li '+(page==1?'class="disabled"':'')+'>'
							+         '<a aria-label="Previous">'
							+           '<span aria-hidden="true">&laquo;</span>'
							+         '</a>'
							+       '</li>';
				//页码拼接
				for(var i=0;i<pageNum;i++){
					pagestr+='<li '+(startPage==page?'class="active"':'')+'><a aria-label="'+startPage+'" >'+startPage+'</a></li>';
					startPage++;
				}
				//下一页按钮和刷新按钮  如果当前位最后页面则禁用下一页按钮
				pagestr+= '<li '+(page==countPage?'class="disabled"':'')+'>'
							+         '<a aria-label="Next">'
							+           '<span aria-hidden="true">&raquo;</span>'
							+         '</a>'
							+       '</li>'
							+       '<li>'
							+         '<a aria-label="refresh" style="margin-left:10px">'
							+           '<span class="glyphicon glyphicon-refresh"></span>'
							+         '</a>'
							+       '</li>';
				//如果总页码数大于显示页数则显示输入页码跳转控件
				if(countPage>TOTAL_PAGE){			
					pagestr+='<li>'
						+         '<span  style="margin-left:10px">共'+countPage+'页</span>'
						+		  '</li>'
						+       '<li>'
						+          '<span class="input_box"><input type="text" class="form-control pageNum" placeholder="页数"></span>'
						+		'</li>'
						+		'<li>'
						+         '<a aria-label="jump_btn">'
						+           '<span>跳转</span>'
						+         '</a>'
						+       '</li>';
				}
			}
			pagestr+=  '</ul></div>';
			
			// 将原有的分页删除
			var pageBox=config.dom.find(".pages");
			if(pageBox.length!=0){
				pageBox.remove()
			}
			//渲染新的分页
			config.dom.append(pagestr);
			config.dom.find(".pages .pageNum").on("input",function(){
				var value=OPEN_FUN.goFun("util.trimSpace",this.value);
				if(isNaN(value)){
					$(this).val("");
					return;
				}
				value=parseInt(value);
				if(value<0){
					$(this).val("");
					return;
				}	
				$(this).val(value);
			});
			//绑定分页按钮事件
			asys.binPageEvent(config.dom.find(".pages"),config.getDataFun,page,countPage);
		},
		/*
			分页栏a标签绑定点击事件
				obj：分页jquery dom
				getDataFun: 获取数据方法
				page 当前页码数
				countPage 数据总页码数量
		*/
		binPageEvent:function(obj,getDataFun,page,countPage){
			obj.on("click","a",function(){
				if($(this).attr("aria-label")=='refresh'){//刷新
					getDataFun(1);
				}else if($(this).attr("aria-label")=='Previous' && !$(this).parent().hasClass('disabled')){//上一页,如果被禁用则不做操作
					getDataFun(--page);
				}else if($(this).attr("aria-label")=='Next' && !$(this).parent().hasClass('disabled')){//下一页,如果被禁用则不做操作
					getDataFun(++page);
				}else if($(this).attr("aria-label")=='jump_btn'){
					var value=OPEN_FUN.goFun("util.trimSpace",obj.find(".pageNum").val());
					if(value==''){
						asys.showAlert({title:'温馨提醒',msg:'请输入需要跳转到的页码',isCancel:false})
						return;
					}
					if(isNaN(value)){
						asys.showAlert({title:'温馨提醒',msg:'请输入数字',isCancel:false})
						return;
					}
					value=parseInt(value);
					if(value<=0){
						asys.showAlert({title:'温馨提醒',msg:'请输入正数',isCancel:false})
						return;
					}
					if(countPage<value){
						asys.showAlert({title:'温馨提醒',msg:'超过最大页码数了！',isCancel:false})
						return;
					}
					getDataFun(value);
				}else if(!isNaN($(this).attr("aria-label"))){//点击的是页码，获取点击页面的页面数
					getDataFun(parseInt($(this).attr("aria-label")));
				}
			});
		},
		/*
			时间控件 http://www.bootcss.com/p/bootstrap-datetimepicker/
			obj: dom 
			config:配置参数
		*/
		datePicker:function(obj,config){
			var pickerConfig={
					language:  'zh-CN',
					weekStart: 1,
					todayBtn:  1,
					autoclose: 1,
					todayHighlight: 1,
					minView: 2,
					forceParse: 0
				}
			pickerConfig=$.extend(pickerConfig,config);
			$(obj).datetimepicker(pickerConfig);
		},
		/*以页面为参考，获取鼠标点击位置,考虑页面滚动，*/
		getMousePos:function (event) {
			var e = event || window.event,
				scrollX = document.documentElement.scrollLeft || document.body.scrollLeft,
				scrollY = document.documentElement.scrollTop || document.body.scrollTop,
				x = e.pageX || e.clientX + scrollX,
				y = e.pageY || e.clientY + scrollY;
			return { 'x': x, 'y': y };
		},
		//右键菜单显示
		menuEvent:function (event){
			var coord=asys.getMousePos(event), //获取鼠标点击位置
				tabid=asys.getTabId();
			if(coord.x + 100 > screen.availWidth){
			var left=coord.x - 90 + 'px';
				$(tabid).children(".client_menu").css("left",left);
			}else{
				$(tabid).children(".client_menu").css("left",coord.x + 'px');
			}
			if(coord.y + 122 > screen.availHeight){
				var top=coord.y - 122 + 'px';
				$(tabid).children(".client_menu").css("top",top);
			}else{
				$(tabid).children(".client_menu").css("top",coord.y + 'px');
			}
			$(tabid).children(".client_menu").css("visibility","visible");
			return false;	
		},
		/*
			下拉根据输入类容实时请求渲染数据 https://select2.org
				jqDom: jquery的获取到的dom
				url: 请求的方法，
				successFun:请求成功后处理数据方法，注意此方法必须返回对象并且有results的对象属性，不然显示不了数据
		*/
		select2Init:function(jqDom,url,successFun){
			jqDom.select2({
				ajax: {
					 type:'POST',
					 url: util.getURL('Product/lists'),
					 dataType: 'json',
					 delay: 250,
					 data: function (params) {
						 return {
							 search_val: params.term,
							 limit:1000
						 };
					 },
					 results: function (data, params) {
						 if(data.status){
							 return successFun(data);
						 }
					 },
					 cache: true
				 },
				 placeholder:'请选择',//默认文字提示
				 language: "zh-CN",
				 allowClear: true,//允许清空
				 dropdownCssClass: "bigdrop", 
				 escapeMarkup: function (markup) { return markup; }, // 自定义格式化防止xss注入
				 minimumInputLength: 1,//最少输入多少个字符后开始查询
				 formatResult: function formatRepo(repo){return repo.text;}, // 函数用来渲染结果
				 formatSelection: function formatRepoSelection(repo){return repo.text;} // 函数用于呈现当前的选择
				 
			})
		}
	}
	return open_sys;
}());

$(function(){
	
	/*
		初始化水平主导航(头部导航栏渲染)
	*/
	asys.post({
		url:'Permissions/head_menu',
		params:{},
		successFun:function(data){
			if(data.status){
				var nav_data=data.info;
				var mainNavstr="";
				  mainNavstr+='<ul>';
				$.each(nav_data,function(k,mainNav){
				  mainNavstr +='<li class="" data-funname="'+mainNav.fcode+'"><a>'+mainNav.title+'</a></li>';
			  })
				 mainNavstr+='</ul>';
			  $("#Platform_nav").html(mainNavstr);
			}
	   }
	});
	//获取登陆账号信息，
	//将账户名称显示到退出按钮旁边
	//记录账户信息
	asys.post({
		url:'SystemAccount/info',
		params:{},
		successFun:function(data){
			sysData.acc_info=data.info
			$("#admin_name").text(data.info.account);
		}
	});
	
	//退出按钮监听，点击后执行退出接口，并显示登陆页面
	$("#outSys").click(function(){
		var config={
			url:'SystemAccount/logout_do',
			params:{},
			successFun:function(data){
			}
		}
		asys.post(config);
		setTimeout(function(){
			window.location.href="index.html";
		},100);
	});
	//用户名称操作按钮点击（右上角用户名点击事件）
	var isAdminOp=false;
	$("#admin_btn").click(function(){
		$(".admin_op_box").show();
		isAdminOp=false;
	});
	//修改密码
	$("#pwd_edit").click(function(){
		OPEN_FUN.goFun("resetPwd");
	});
	$(document).on("click",function(){
		if(isAdminOp){
			$(".admin_op_box").hide();	
		}else{
			isAdminOp=true;
		}
	});
	/*水平导航条被单击时动态添加侧导航*/
	$(document).on("click","#Platform_nav li",function(){
		//主操作区域显示，并隐藏欢迎区域
		$(".main_op").show();
		$(".welcome").hide();
		//获取方法名称 
	   var funname=$(this).data('funname');
		$(this).addClass('active').siblings().removeClass('active');//给点击的dom添加css 并且删除之前选择的css样式
		//获取被选择项下方的子节点
		OPEN_FUN.goFun("getChsild",funname);
	   
	})
	
	/*关闭显示的选项卡*/
	$(".tabs_top").on("click",".tabs_top_close",function(){
		var attr=$(this).parent().attr('href');
		var num=$(this).parent().parent('li').nextAll().length;
		$(attr).remove();
		//如果当前标签是激活状态则需要将其临近的标签激活
		if($(this).parent().parent('li').hasClass("active")){
			/*判断是否为最后一个Tab标签*/
			if(num==0){
				$(this).parent().parent('li').prev('li').children('a').trigger('click');
				$($(this).parent().parent('li').prev('li').children('a').attr('href')).addClass('active');
			}else{
				$(this).parent().parent('li').next('li').children('a').trigger('click');
				$($(this).parent().parent('li').next('li').children('a').attr('href')).addClass('active');
			}
		}
		$(this).parent().parent('li').remove();
		//关闭后需要重新计算tab标签栏的宽度
		asys.setNavWidth();
		/*当关闭所有标签页时，欢迎页面显示*/
		if($(".tabs_top").children().length == 0){
			$(".welcome").show();
			$(".main_op").hide();
			$("#Platform_nav li").removeClass('active');
		}
	})
	asys.init();	
});

 
    

   

     

     
	





