/**
	右侧导航所有的点击事件页面渲染相关方法
	表格的渲染
	右侧导航栏的渲染

*/

var OPEN_FUN=(function(){
	/*
		OPEN:	
			分页每页最多数据条数配置 limit（数值）
			echart折线图配置 echart(方法 返回echart的配置对象值)
			页面公共html字符串
				chan_add_html 		  渠道管理添加html字符串
				rate_html   		  费率配置html字符串
				stat_html   		  结算统计html字符串
			echart 					  参数配置,
			表头和表格中对应数据的参数名等等配置（注：名称必须和配置参数里面的fcode相同）
				companyList：         商户列表配置
				companyExpand         产品推广列表配置
				companyWill:          产品推广商户意向单列表
				productMade： 		  产品定制列表配置
				productClass： 		  产品类目配置
				sceneClass：		  行业场景配置
				authProduct：		  授权产品配置项
				productLib：		  产品库配置项
				orderLists：		  订单列表配置
				insOrderLists：		  保险公司订单列表配置
				linkOrderLists：	  外链记录列表配置
				roleAdmin：           角色管理列表配置
				accountLists：        账号管理列表配置
				operLog:              操作日志列表配置
				insStatis：           保险公司统计配置
				brokersStatis:        经纪公司统计配置
				platStatis：          运营平台统计配置
				channelStatis：       渠道统计配置
				chanIns：			  渠道保险公司管理列表配置
				chanBrokers：		  渠道经纪公司管理列表配置
				chanChannel：		  渠道销售渠道管理列表配置
				chanVIP：			  渠道VIP商户管理列表配置
				
				income：			  结算收入列表的除去表头的其它配置
				expend：			  结算支出列表的除去表头的其它配置
				
				insInBrokers：		  保险公司经纪公司收入列表表头配置
				insInCom：		  	  保险公司商户收入列表表头配置
				insExpBrokers：		  保险公司经纪公司支出列表表头配置
				insExpPlat：		  保险公司平台支出列表表头配置
				insExpCom：			  保险公司商户支出列表表头配置
				channelIn：			  渠道收入列表表头配置
				brokersIn：			  经纪公司收入列表表头配置
				platInIns：			  平台保险公司收入列表表头配置
				platInBrokers：		  平台经纪公司收入列表表头配置
				brokersExpCom：		  经纪公司商户支出列表表头配置
				brokersExpPlat：	  经纪公司平台支出列表头配置
				brokersExpIns: 		  经纪公司保险公司支出列表表头配置
				platExpCom：		  平台商户支出列表表头配置
				platExpChannel：	  平台渠道支出列表表头配置
				detailed：			  账单明细总配置项
			订单统计信息  		getStatisInfo
			订单分布统计 		getStatisLists
			统计概览页面渲染 	setStatPage
			查看账单明细模态框显示 showDetailed
			发票信息录入  		showInvo
			确认对账或者确认打款   showAccount
			确认收票或者查看发票信息  showInvoInfo
			结算类型配置    	balTypeHtml
			费率结算 		 	rateAlocHtml
			订单导出   			export_xls
			商户等级文字转换   	getLevelText
			商户认证状态文字转换   getCertStatusText
			根据父级权限获取权限   getPowerMenu
			页面初始化 搜索栏添加，权限请求，表格数据请求，并渲染表格，分页等   initPage
			结算页面统一渲染方法  	 	balancePage
			订单列表页面的显示（包括保险公司和正常订单列表）   orderListPage
	*/
	var OPEN={
		limit:20,//分页每页最多数据条数配置
		/*
			echart折线图配置
				data： xAxisName x轴 名称
					   xAxisData x轴 数据
					   yAxisName Y轴 名称
					   yAxisMax  Y轴 最大值
					   yAxisData Y轴 数据
			return 返回 echart 配置对象
		*/
		echart : function(data){
			var option ={
				backgroundColor:"#fff",
				textStyle:{
					color:'#30323e'
				},
				xAxis: {
					type: 'category',
					name:data.xAxisName,
					boundaryGap: false,
					splitLine: {
						show: true,
						lineStyle:{
							color:'#f4f4f5'
						}
					},
					axisLine:{
						lineStyle:{
							color:'#f4f4f5'
						}
					},
					axisLabel:{
						textStyle:{
							color:'#30323e'
						}
					},
					data: data.xAxisData
				},
				grid:{
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
				},
				yAxis: {
					type: 'value',
					name:data.yAxisName,
					max:data.yAxisMax,
					axisTick:{show:false},
					axisLine:{
						lineStyle:{
							color:'#f4f4f5'
						}
					},
					axisLabel:{
						textStyle:{
							color:'#30323e'
						}
					},
				},
				series: [
					{
						type: 'line',
						 itemStyle: {
							normal: {
								color: "rgba(81,115,253,1)",
								lineStyle: {
									color: "rgba(81,115,253,1)"
								}
							}
						},
						areaStyle:{
							normal:{
								color:['rgba(81,115,253,0.2)']
							}
						},
						data: data.yAxisData
					}
				]
			}
			return option;
		},
		//渠道管理添加html字符串
		chan_add_html:'<form class="form-horizontal">'
				+	'<div>'
				+		'<h5>基本信息</h5>'
				+	'</div>'
				+	'<div class="form-group">'
				+		'<label for="name" class="col-sm-3 control-label">保险公司</label>'
				+		'<div class="col-sm-7">'
				+		'<input type="text" class="form-control" id="name"  name="name" placeholder="请输入保险公司名称">'
				+		'</div>'
				+	'</div>'
				+	'<div>'
				+		'<h5>财务账户</h5>'
				+	'</div>'
				+	'<div class="form-group">'
				+		'<label for="bank_type" class="col-sm-3 control-label">账号类型</label>'
				+		'<div class="col-sm-7">'
				+			'<select  name="bank_type" id="bank_type" class="form-control">'
				+				'<option value="1">银行卡</option>'
				+				'<option value="2">支付宝</option>'
				+			'</select>'
				+		'</div>'
				+	'</div>'
				+	'<div class="bank_box">'
				+	'<div class="form-group">'
				+		'<label for="b_bank_name" class="col-sm-3 control-label">开户银行</label>'
				+		'<div class="col-sm-7">'
				+			'<input type="text" isrequired="0" class="form-control" id="b_bank_name"  name="b_bank_name" placeholder="请输入开户银行">'
				+		'</div>'
				+	'</div>'
				+	'<div class="form-group">'
				+		'<label for="b_account_name" class="col-sm-3 control-label">开户人</label>'
				+		'<div class="col-sm-7">'
				+			'<input type="text" isrequired="0" class="form-control" id="b_account_name"  name="b_account_name" placeholder="请输入开户人姓名">'
				+		'</div>'
				+	'</div>'
				+	'<div class="form-group">'
				+		'<label for="b_card_number" class="col-sm-3 control-label">银行卡号</label>'
				+		'<div class="col-sm-7">'
				+			'<input type="text" isrequired="0" class="form-control" id="b_card_number"  name="b_card_number" placeholder="请输入银行卡号">'
				+		'</div>'
				+	'</div>'
				+	'</div>'
				+	'<div class="ali_box" hidden>'
				+	'<div class="form-group">'
				+		'<label for="ali_card_number" class="col-sm-3 control-label">支付宝账号</label>'
				+		'<div class="col-sm-7">'
				+			'<input type="text" isrequired="0" class="form-control" id="ali_card_number"  name="ali_card_number" placeholder="请输入支付宝账号">'
				+		'</div>'
				+	'</div>'
				+	'<div class="form-group">'
				+		'<label for="ali_account_name" class="col-sm-3 control-label">真实姓名</label>'
				+		'<div class="col-sm-7">'
				+			'<input type="text" isrequired="0" class="form-control" id="ali_account_name"  name="ali_account_name" placeholder="请输入真实姓名">'
				+		'</div>'
				+	'</div>'
				+	'</div>'
				+	'<div>'
				+		'<h5>开票信息</h5>'
				+	'</div>'
				+	'<div class="form-group">'
				+		'<label for="invoice_name" class="col-sm-3 control-label">公司名称</label>'
				+		'<div class="col-sm-7">'
				+			'<input type="text" class="form-control" isrequired="0" id="invoice_name"  name="invoice_name" placeholder="请输入发票抬头">'
				+		'</div>'
				+	'</div>'
				+	'<div class="form-group">'
				+		'<label for="invoice_number" class="col-sm-3 control-label">纳税人识别号</label>'
				+		'<div class="col-sm-7">'
				+			'<input type="text" isrequired="0" class="form-control" id="invoice_number"  name="invoice_number" placeholder="请输入统一社会信用代码">'
				+		'</div>'
				+	'</div>'
				+	'<div class="form-group">'
				+		'<label for="invoice_addr" class="col-sm-3 control-label">注册地址</label>'
				+		'<div class="col-sm-7">'
				+			'<input type="text" class="form-control" id="invoice_addr"  name="invoice_addr" placeholder="请输入注册地址">'
				+		'</div>'
				+	'</div>'
				+	'<div class="form-group">'
				+		'<label for="invoice_mobile" class="col-sm-3 control-label">联系电话</label>'
				+		'<div class="col-sm-7">'
				+			'<input type="text" isrequired="0" class="form-control" id="invoice_mobile"  name="invoice_mobile" placeholder="联系电话">'
				+		'</div>'
				+	'</div>'
				+	'<div class="form-group">'
				+		'<label for="invoice_subject" class="col-sm-3 control-label">开票科目</label>'
				+		'<div class="col-sm-7">'
				+			'<input type="text" isrequired="0" class="form-control" id="invoice_subject"  name="invoice_subject" placeholder="请输入开票科目">'
				+		'</div>'
				+	'</div>'
				+	'<div class="form-group">'
				+		'<label for="invoice_rece" class="col-sm-3 control-label">收件信息</label>'
				+		'<div class="col-sm-7">'
				+			'<textarea type="text" isrequired="0" class="form-control" id="invoice_rece"  name="invoice_rece" placeholder="请输入地址、邮编、收件人、电话"></textarea>'
				+		'</div>'
				+	'</div>'
				+	'</div>'
				+'</form>',
		//费率配置html字符串
		rate_html:	'<div class="form-group" ><label class="col-sm-4 title">保费去向</label><div class="radio col-sm-8 "><label style="width:auto"><input name="prem_to" type="radio" value="1" checked >经纪公司收保费</label><label style="width:auto"><input name="prem_to" type="radio" value="2">商户收保费</label> </div></div>'
					+'<div class="form-group" ><label class="col-sm-4 title">保费结算模式</label><div class="radio col-sm-8 "><label style="width:auto"><input name="xsf_prem_set_type" type="radio" value="1" checked>仅通过经纪公司结算</label><label style="width:auto"><input name="xsf_prem_set_type" type="radio" value="2" >可通过多方结算（经纪公司、平台、商户）</label> </div></div>'
					+'<div class="form-group"><label class="title">保险公司</label><label name="insurer_name" class="name">保险公司</label></div>'
					+'<div class="form-group xsf_tax_box" ><label class="col-sm-4 title">销售费用率</label><div class="radio col-sm-8 "><label><input name="xsf_tax_type" type="radio" value="1" checked>含税</label><label><input name="xsf_tax_type" type="radio" value="2">不含税</label> </div></div>'
					+'<div class="form-group xsf_box">'
					+		'<label class="col-sm-3 title"></label>'
					+		'<div class="radio col-sm-4">'
					+			'<label>'
					+				'<input type="radio" class="free_type" name="xsf_type" value="1"> 固定'
					+			'</label>'
					+			'<label>'
					+				'<input type="radio"  class="free_type" name="xsf_type" value="2" checked> 比例'
					+			'</label>'
					+		'</div>'
					+		'<label class="tip col-sm-2">固定金额/比例</label>'
					+		'<input type="text" name="xsf_val" class="form-control col-sm-2">'
					+		'<span class="">%</span>'	
					+	'</div>'
					+	'<div class="calc_tip xsf_tip"></div>'
					+'<div class="form-group jjf_xsf_tax_box" hidden><label class="col-sm-4 title">经纪费</label><div class="radio col-sm-8 "><label><input name="jjf_xsf_tax_type" type="radio" value="1" checked>含税</label><label><input name="jjf_xsf_tax_type" type="radio" value="2">不含税</label> </div></div>'
					+'<div class="form-group jjf_box">'
					+		'<label class="col-sm-3 title">经纪费</label>'
					+		'<div class="radio col-sm-4">'
					+			'<label>'
					+				'<input type="radio" class="free_type" name="jjf_type" value="1"> 固定'
					+			'</label>'
					+			'<label>'
					+				'<input type="radio" class="free_type"  name="jjf_type" value="2" checked> 比例'
					+			'</label>'
					+		'</div>'
					+		'<label class="tip col-sm-2">固定金额/比例</label>'
					+		'<input type="text" name="jjf_val" class="form-control col-sm-2">'
					+		'<span class="">%</span>'	
					+	'</div>'
					+	'<div class="calc_tip jjf_tip"></div>'
					+	'<div class="form-group fwf_insurer_box">'
					+		'<label class="col-sm-3 title">技术服务费</label>'
					+		'<div class="radio col-sm-4">'
					+			'<label>'
					+				'<input type="radio" class="free_type" name="fwf_insurer_type" value="1"> 固定'
					+			'</label>'
					+			'<label>'
					+				'<input type="radio" class="free_type" name="fwf_insurer_type" value="2" checked> 比例'
					+			'</label>'
					+		'</div>'
					+		'<label class="tip col-sm-2">固定金额/比例</label>'
					+		'<input type="text" disabled name="fwf_insurer_val" class="form-control col-sm-2 fwf">'
					+		'<span>%</span>'
					+	'</div>'
					+	'<div class="calc_tip fwf_insurer_tip">技术服务费比例由系统根据费用关系换算后自动填入</div>'
					+	'<div class="form-group tgf_insurer_box">'
					+		'<label class="col-sm-3 title">推广费</label>'
					+		'<div class="radio col-sm-4">'
					+			'<label>'
					+				'<input type="radio" class="free_type" name="tgf_insurer_type" value="1"> 固定'
					+			'</label>'
					+			'<label>'
					+				'<input type="radio" class="free_type" name="tgf_insurer_type" value="2" checked> 比例'
					+			'</label>'
					+		'</div>'
					+		'<label class="tip col-sm-2">固定金额/比例</label>'
					+		'<input type="text" name="tgf_insurer_val" class="form-control col-sm-2" id="tgf_val">'
					+		'<span>%</span>'
					+	'</div>'
					+	'<div></div>'
					+'<div class="form-group "><label class="title">经纪公司</label><label name="ins_name" class="name">经纪公司</label></div>'
					+	'<div class="form-group">'
					+		'<label class="col-sm-3 title">通道费</label>'
					+		'<div class="radio col-sm-4">'
					+			'<label>'
					+				'<input type="radio" class="free_type" name="tdf_type" value="1"> 固定'
					+			'</label>'
					+			'<label>'
					+				'<input type="radio" class="free_type" name="tdf_type" value="2" checked> 比例'
					+			'</label>'
					+		'</div>'
					+		'<label class="tip col-sm-2">固定金额/比例</label>'
					+		'<input type="text" name="tdf_val" class="form-control col-sm-2" id="tgf_val">'
					+		'<span>%</span>'
					+	'</div>'
					+	'<div class="calc_tip tdf_tip"></div>'
					+	'<div class="form-group">'
					+		'<label class="col-sm-3 title">技术服务费</label>'
					+		'<div class="radio col-sm-4">'
					+			'<label>'
					+				'<input type="radio" class="free_type" name="fwf_ins_type" value="1"> 固定'
					+			'</label>'
					+			'<label>'
					+				'<input type="radio" class="free_type" name="fwf_ins_type" value="2" checked> 比例'
					+			'</label>'
					+		'</div>'
					+		'<label class="tip col-sm-2">固定金额/比例</label>'
					+		'<input type="text" disabled name="fwf_ins_val" class="form-control col-sm-2 fwf">'
					+		'<span>%</span>'
					+	'</div>'
					+	'<div class="calc_tip">技术服务费比例由系统根据费用关系换算后自动填入</div>'
					+	'<div class="form-group">'
					+		'<label class="col-sm-3 title">推广费</label>'
					+		'<div class="radio col-sm-4">'
					+			'<label>'
					+				'<input type="radio" class="free_type" name="tgf_ins_type" value="1"> 固定'
					+			'</label>'
					+			'<label>'
					+				'<input type="radio" class="free_type" name="tgf_ins_type" value="2" checked> 比例'
					+			'</label>'
					+		'</div>'
					+		'<label class="tip col-sm-2">固定金额/比例</label>'
					+		'<input type="text" name="tgf_ins_val" class="form-control col-sm-2" id="tgf_val">'
					+		'<span>%</span>'
					+	'</div>'
					+	'<div></div>'
					+'<div class="form-group "><label class="title">平台运营</label><label class="name">杭州智驾科技有限公司</label></div>'
					+	'<div class="form-group">'
					+		'<label class="col-sm-3 title">推广费</label>'
					+		'<div class="radio col-sm-4">'
					+			'<label>'
					+				'<input type="radio" class="free_type" name="tgf_plat_type" value="1"> 固定'
					+			'</label>'
					+			'<label>'
					+				'<input type="radio" class="free_type" name="tgf_plat_type" value="2" checked> 比例'
					+			'</label>'
					+		'</div>'
					+		'<label class="tip col-sm-2">固定金额/比例</label>'
					+		'<input type="text" name="tgf_plat_val" class="form-control col-sm-2" id="tgf_val">'
					+		'<span>%</span>'
					+	'</div>'
					+	'<div></div>'
					+	'<div class="form-group">'
					+		'<label class="col-sm-3 title">市场拓展费</label>'
					+		'<div class="radio col-sm-4">'
					+			'<label>'
					+				'<input type="radio" class="free_type" name="qdf_type" value="1"> 固定'
					+			'</label>'
					+			'<label>'
					+				'<input type="radio" class="free_type" name="qdf_type" value="2" checked> 比例'
					+			'</label>'
					+		'</div>'
					+		'<label class="tip col-sm-2">固定金额/比例</label>'
					+		'<input type="text" name="qdf_val" class="form-control col-sm-2" id="tgf_val">'
					+		'<span>%</span>'
					+	'</div>'
					+	'<div></div>'
					+	'<div class="form-group">'
					+		'<label class="col-sm-3 title">平台收益</label>'
					+		'<div class="radio col-sm-4">'
					+			'<label>'
					+				'<input type="radio" class="free_type" name="plat_type" value="1"> 固定'
					+			'</label>'
					+			'<label>'
					+				'<input type="radio" class="free_type" name="plat_type" value="2" checked> 比例'
					+			'</label>'
					+		'</div>'
					+		'<label class="tip col-sm-2">固定金额/比例</label>'
					+		'<input disabled type="text" name="plat_val" class="form-control col-sm-2 fwf" id="">'
					+		'<span>%</span>'
					+	'</div>'
					+	'<div class="calc_tip">平台收益比例由系统根据费用关系换算后自动填入</div>',
		//结算统计html字符串
		stat_html:'<div class="stat_box">'
			+	'<div>'
			+		'<h4>昨日关键指标</h4>'
			+	'</div>'
			+	'<div class="text_center box_info">'
			+		'<label class="info_box">'
			+			'<label>'
			+				'<span>经纪费</span>'
			+				'<div name="jjf">20.00</div>'
			+			'</label>'
			+		'</label>'
			+		'<label class="info_box">'
			+			'<label>'
			+				'<span>技术服务费（保险公司）</span>'
			+				'<div name="fwf_insurer">20.00</div>'
			+			'</label>'
			+		'</label>'
			+		'<label class="info_box">'
			+			'<label>'
			+				'<span>技术服务费（经纪公司）</span>'
			+				'<div name="fwf_ins">20.00</div>'
			+			'</label>'
			+		'</label>'
			+		'<label class="info_box">'
			+			'<label>'
			+				'<span>推广费</span>'
			+				'<div name="tgf_plat">20.00</div>'
			+			'</label>'
			+		'</label>'
			+		'<label class="info_box">'
			+			'<label>'
			+				'<span>市场拓展费</span>'
			+				'<div name="qdf">20.00</div>'
			+			'</label>'
			+		'</label>'
			+		'<label class="info_box">'
			+			'<label>'
			+				'<span>订单量</span>'
			+				'<div name="policy_num">20.00</div>'
			+			'</label>'
			+		'</label>'
			+		'<label class="info_box">'
			+			'<label>'
			+				'<span>保费总额（元）</span>'
			+				'<div name="premium_amt">20.00</div>'
			+			'</label>'
			+		'</label>'
			+	'</div>'
			+	'<div>'
			+		'<h4>趋势</h4>'
			+	'</div>'
			+	'<div class="stat_lists_box text_center">'
			+		'<form>'
			+			'<div class="form-inline">'
			+				'<div class="form-group">'
			+					'<label for="exten">推广方式</label>'
			+					'<select name="exten" id="" class="form-control">'
			+						'<option value="">全部</option>'
			+						'<option value="1">二维码</option>'
			+						'<option value="2">链接</option>'
			+						'<option value="3">API接口</option>'
			+					'</select>'
			+				'</div>'
			+				'<div class="form-group">'
			+					'<input type="text" name="product_name" class="form-control" style="width:200px!important;" placeholder="产品名称">'
			+				'</div>'
			+			'</div>'
			+			'<div class="form-inline" style="margin-top:20px">'
			+				'<div class="form-group">'
			+					'<select name="year" id="" class="form-control">'
			+						'<option value="2017">2017年</option>'
			+					'</select>'
			+					'<select name="month" id="" class="form-control">'
			+						'<option value="">全部</option>'
			+						'<option value="1">1月</option>'
			+						'<option value="2">2月</option>'
			+						'<option value="3">3月</option>'
			+						'<option value="4">4月</option>'
			+						'<option value="5">5月</option>'
			+						'<option value="6">6月</option>'
			+						'<option value="7">7月</option>'
			+						'<option value="8">8月</option>'
			+						'<option value="9">9月</option>'
			+						'<option value="10">10月</option>'
			+						'<option value="11">11月</option>'
			+						'<option value="12">12月</option>'
			+					'</select>'
			+					'<select name="week" id="" class="form-control">'
			+						'<option value="">全部</option>'
			+					'</select>'
			+				'</div>'
			+				'<label name="query" class="btn btn-primary">查询</label>'
			+				'<label name="reset" class="btn btn-default">重置</label>'
			+			'</div>'
			+			'<div class="form-inline" style="margin-top:20px">'
			+				'<div class="form-group">'
			+					'<label name="seven_btn" class="btn btn-default">最近7天</label>'
			+					'<label name="thirty_btn" class="btn btn-default">最近30天</label>'
			+				'</div>'
			+			'</div>'
			+		'</form>'
			+		'<div class="box_info lists">'
			+			'<label class="info_box">'
			+				'<label>'
			+					'<div name="s_jjf">20.00</div>'
			+					'<span>经纪费</span>'
			+				'</label>'
			+			'</label>'
			+			'<label class="info_box">'
			+				'<label>'
			+					'<div name="s_fwf_insurer">20.00</div>'
			+					'<span>技术服务费</span>'
			+				'</label>'
			+			'</label>'
			+			'<label class="info_box">'
			+				'<label>'
			+					'<div name="s_fwf_ins">20.00</div>'
			+					'<span>技术服务费</span>'
			+				'</label>'
			+			'</label>'
			+			'<label class="info_box">'
			+				'<label>'
			+					'<div name="s_tgf_plat">20.00</div>'
			+					'<span>推广费</span>'
			+				'</label>'
			+			'</label>'
			+			'<label class="info_box">'
			+				'<label>'
			+					'<div name="s_qdf">20.00</div>'
			+					'<span>市场拓展费</span>'
			+				'</label>'
			+			'</label>'
			+			'<label class="info_box">'
			+				'<label>'
			+					'<div name="s_policy_num"></div>'
			+					'<span>订单量</span>'
			+				'</label>'
			+			'</label>'
			+			'<label class="info_box">'
			+				'<label>'
			+					'<div name="s_premium_amt"></div>'
			+					'<span>保费总额</span>'
			+				'</label>'
			+			'</label>'
			+		'</div>'
			+		'<div class="tab_box">'
			+			'<label dataname="profitData" class="active echart_tab">收益</label>'
			+			'<label dataname="policyData" class="echart_tab">	订单量（单）</label>'
			+			'<label dataname="premiumData" class="echart_tab">	保费总额（元）</label>'
			+		'</div>'
			+			'<div class="text_left color_7 tip_text">'
			+				'收益=经纪费-推广费-平台运营费'
			+			'</div>'
			+		'<div>'
			+			'<div id="echartBox" style="width: 100%;height:400px;"></div>'
			+		'</div>'
			+	'</div>'
			+'</div>',
		//订单统计信息
		getStatisInfo:function(params,successFun){
			var config={
				url:'Policy/stat_info',
				params:params,
				successFun:successFun
			}
			asys.post(config);
		},
		//订单分布统计
		getStatisLists:function(params,successFun){
			var config={
				url:'Policy/stat_lists',
				params:params,
				successFun:successFun
			}
			asys.post(config);
		},
		/*
			统计概览页面渲染，
				tabInfo（对象），tabInfo.tabDom 显示的tab的jquery Dom
				source：来源（0-全部 1-保险公司 2-经纪公司 3-平台运营 4-销售渠道）
		*/	
		setStatPage:function(tabInfo,source){
			tabInfo.tabDom.append(OPEN.stat_html);
			//收益数据换算公式文字提示
			if(source==1){
				tabInfo.tabDom.find(".tip_text").text("收益=保费总额-经纪费-技术服务费");
			}else if(source==2){
				tabInfo.tabDom.find(".tip_text").text("收益=经纪费-技术服务费");
			}else if(source==3){
				tabInfo.tabDom.find(".tip_text").text("收益=技术服务费（保险公司）+技术服务费（经纪公司）-推广费-市场拓展费");
			}else{
				tabInfo.tabDom.find(".tip_text").text("收益=市场拓展费");
			}
			statBox=tabInfo.tabDom.find(".stat_box");
			var toDayYear=new Date().getFullYear(),
				//收益统计数据构造
				profitData={
					xAxisName:'天',
					yAxisName:'收益（元）',
					xAxisData:[],
					yAxisData:[]
				},
				//订单统计数据构造
				policyData={
					xAxisName:'天',
					yAxisName:'订单（量）',
					xAxisData:[],
					yAxisData:[]
				},
				//保费统计数据构造
				premiumData={
					xAxisName:'天',
					yAxisName:'保费（元）',
					xAxisData:[],
					yAxisData:[]
				},
				myechart=echarts.init(statBox.find("#echartBox")[0]);//初始化echart
				
			//渲染年数据，从本年开始一直循环到2017年
			for(var i=toDayYear;i>=2017;i--){
				statBox.find("select[name=year]").html("");
				statBox.find("select[name=year]").append("<option value='"+i+"'>"+i+"年</option>")
			}
			//月数据或者年数据 change改变事件
			statBox.find("select[name=month],select[name=year]").change(function(){
				var month=statBox.find("select[name=month]").val(),
					year=statBox.find("select[name=year]").val();
				if(month!=""){
					var config={
						url:'Company/weeks',
						params:{
							month:year+"-"+month
						},
						successFun:function(data){
							statBox.find("select[name=week]").html("");
							statBox.find("select[name=week]").append("<option value=''>全部</option>");
							$.each(data.info,function(){
								statBox.find("select[name=week]").append("<option value='"+(this.start_date+"_"+this.end_date)+"'>"+this.week+"</option>");
							});
						}
					}
					asys.post(config);
				}else{
					statBox.find("select[name=week]").html("");
					statBox.find("select[name=week]").append("<option value=''>全部</option>");
				}
			});
			//收益统计 、保费统计、订单统计 统计类切换事件
			statBox.find("label.echart_tab").click(function(){
				statBox.find("label.echart_tab").removeClass("active");
				$(this).addClass("active");
				setOption();
			});
			//按照七天统计和按照30天统计按钮事件
			statBox.find("label[name='seven_btn'],label[name='thirty_btn']").click(function(){
				var date_type=4,
					data={source:source},
					product_name=statBox.find("input[name=product_name]").val(),
					exten=statBox.find("select[name=exten]").val();
				if($(this).attr("name")=='thirty_btn'){
					date_type=5;
				}
				data.product_name=product_name;
				data.exten=exten;
				data.date_type=date_type;
				profitData.xAxisName="天";
				policyData.xAxisName="天";
				premiumData.xAxisName="天";
				OPEN.getStatisLists(data,setStatLists);
				statBox.find("select[name=week]").html("");
				statBox.find("select[name=week]").append("<option value=''>全部</option>");
				statBox.find("select[name=month]").val("");
				statBox.find("select[name=year]").val(toDayYear);
			})
			//重置按钮
			statBox.find("label[name='reset']").click(function(){
				var t = $(this).closest("form")[0].reset();	
				statBox.find("label[name='seven_btn']").click();
				statBox.find("select[name=week]").html("");
				statBox.find("select[name=week]").append("<option value=''>全部</option>");
				statBox.find("select[name=month]").val("");
				statBox.find("select[name=year]").val(toDayYear);
			})
			//查询按钮
			statBox.find("label[name='query']").click(function(){
				var data={},
					product_name=statBox.find("input[name=product_name]").val(),
					exten=statBox.find("select[name=exten]").val(),
					year=statBox.find("select[name=year]").val(),
					month=statBox.find("select[name=month]").val(),
					week=statBox.find("select[name=week]").val();
				data.product_name=product_name;
				data.exten=exten;
				if(week!=""){
					data.date_type=3;
					var dateStr=week.split("_");
					data.start_date=dateStr[0];
					data.end_date=dateStr[1];
					profitData.xAxisName="天";
					policyData.xAxisName="天";
					premiumData.xAxisName="天";
				}else if(month!=""){
					data.date_type=2;
					var dateStr=week.split("_");
					data.start_date=year+"-"+month+"-"+1;
					profitData.xAxisName="周";
					policyData.xAxisName="周";
					premiumData.xAxisName="周";
				}else{
					data.date_type=1;
					data.start_date=year+"-"+1+"-"+1;
					profitData.xAxisName="月";
					policyData.xAxisName="月";
					premiumData.xAxisName="月";
				}
				data.source=source
				OPEN.getStatisLists(data,setStatLists);
			})
			OPEN.getStatisInfo({source:source},setStatInfo);
			OPEN.getStatisLists({source:source,date_type:4},setStatLists);
			//数据渲染
			
			function setStatInfo(data){
				var info=data.info;
				statBox.find("[name=jjf]").html(info.jjf);
				statBox.find("[name=fwf_insurer]").html(info.fwf_insurer);
				statBox.find("[name=fwf_ins]").html(info.fwf_ins);
				statBox.find("[name=tgf_plat]").html(info.tgf_plat);
				statBox.find("[name=qdf]").html(info.qdf);
				statBox.find("[name=policy_num]").html(info.policy_num);
				statBox.find("[name=premium_amt]").html(info.premium_amt);
			}
			function setStatLists(data){
				var info=data.info;
				statBox.find("[name=s_jjf]").html(info.jjf);
				statBox.find("[name=s_fwf_insurer]").html(info.fwf_insurer);
				statBox.find("[name=s_fwf_ins]").html(info.fwf_ins);
				statBox.find("[name=s_tgf_plat]").html(info.tgf_plat);
				statBox.find("[name=s_qdf]").html(info.qdf);
				statBox.find("[name=s_policy_num]").html(info.policy_num);
				statBox.find("[name=s_premium_amt]").html(info.premium_amt);
				profitData.xAxisData=[];
				profitData.yAxisData=[];
				policyData.xAxisData=[];
				policyData.yAxisData=[];
				premiumData.xAxisData=[];
				premiumData.yAxisData=[];
				if(info.profit.stat_max>=5){
					profitData.yAxisMax=info.profit.stat_max;
				}else{
					profitData.yAxisMax=5;
				}
				if(info.policy.stat_max>=5){
					policyData.yAxisMax=info.policy.stat_max;
				}else{
					policyData.yAxisMax=5;
				}
				if(info.premium.stat_max>=5){
					premiumData.yAxisMax=info.premium.stat_max;
				}else{
					premiumData.yAxisMax=5;
				}
				$.each(info.profit.stat_lists,function(){
					profitData.xAxisData.push(this.title);
					profitData.yAxisData.push(this.num);
				})
				$.each(info.policy.stat_lists,function(){
					policyData.xAxisData.push(this.title);
					policyData.yAxisData.push(this.num);
				})
				$.each(info.premium.stat_lists,function(){
					premiumData.xAxisData.push(this.title);
					premiumData.yAxisData.push(this.num);
				})
				setOption();
			}
			//echart 数据渲染
			function setOption(){
				var name=statBox.find("label.echart_tab.active").attr("dataname"),
					data=eval(name);
				myechart.setOption(OPEN.echart(data));
			}
			
			
		},
		/*
			表头和表格中对应数据的参数名等等配置
			header：表格头部，
				title :表格头文字
				isCheck: 是否有复选框列
			power： 权限
			powers： 第二个权限列
			dataParamName：表格头文字对应的单元格参数名,
			getValueText： 表格单元格中数据转换
			URL:请求数据的url
		*/
		//商户列表配置			
	    companyList:{
			header:{
				title:['ID','注册时间','登录邮箱','绑定手机','商户名称','公司地址','管理员','企业认证状态','商户类型','状态','操作'],
				isCheck:false
			},
			dataParamName:['id','create_time','email','mobile','name','addr','admin_name','cert_status','level','status'],
			power:[
					{
						"title":"查询",
						"fcode":"query"
					},
					{
						"title":"编辑",
						"fcode":"edit",
					},
					{
						"title":"禁用",
						"fcode":"disabled"
					},
					{
						"title":"解除禁用",
						"fcode":"enabled"
					},
					{
						"title":"设为VIP",
						"fcode":"becomeVIP"
					},
					{
						"title":"查看",
						"fcode":"show"
					}
			],
			//数据转换
			getValueText:function (key,value){
				if(key=='cert_status'){
					return OPEN.getCertStatusText(value);
				}else if(key=='level'){
					return OPEN.getLevelText(value);
				}else if(key=='status'){
					if(value==0){
						return '禁用';
					}else{
						return '正常'
					}
				}else{
					return value;
				}
				
			},
			name:"companyList",
			url:'Company/lists'
	    },
		//产品推广列表配置
		companyExpand:{
			header:{
				title:['商户名称','商户类型','联系电话','合作编号','提交时间','产品编号','产品名称','结算类型','推广费','操作'], 
				isCheck:false
			},
			dataParamName:['company.name','company.level','company.mobile','code','create_time',{"products":['code','name','settle_type','tgf_plat']}],
			power:[
					{
						"title":"查询",
						"fcode":"query"
					},
					{
						"title":"结算费率",
						"fcode":"rate"
					},
					{
						"title":"结算类型",
						"fcode":"balType"
					}
			],
			//数据转换
			getValueText:function (key,value){
				if(key=='company.level'){
					return OPEN.getLevelText(value);
				}else if(key=='tgf_plat'){
					if(value.type==1){
						return value.val+'元';
					}else{
						return value.val+'%';
					}
				}else if(key=='settle_type'){
					if(value==1){
						return '实时';
					}else if(value==2){
						return '月结';
					}else if(value==3){
						return '自定义'
					}else{
						return '未知'
					}
				}
				return value;
				
			},
			name:"companyExpand",
			url:'CompanyApply/lists'
		},
		//产品推广商户意向单列表配置
		companyWill:{
			header:{
				title:['商户名称','商户类型','联系电话','合作编号','提交时间','产品编号','产品名称','推广费','对接状态','跟进状态','操作'], 
				isCheck:false
			},
			dataParamName:['company.name','company.level','company.mobile','code','create_time',{"products":['code','name','tgf_plat','is_api']},'follow_status'],
			power:[
					{
						"title":"查询",
						"fcode":"query"
					},
					{
						"title":"跟进",
						"fcode":"follow"
					},
					{
						"title":"已解决",
						"fcode":"solve"
					},
					{
						"title":"关闭",
						"fcode":"close"
					},
					{
						"title":"查看",
						"fcode":"log"
					}
			],
			//数据转换
			getValueText:function (key,value){
				if(key=='company.level'){
					return OPEN.getLevelText(value);
				}else if(key=='tgf_plat'){
					if(value.type==1){
						return value.val+'元';
					}else{
						return value.val+'%';
					}
				}else if(key=='is_api'){
					if(value==1){
						return '已对接';
					}else if(value==0){
						return '未对接';
					}else{
						return '未知'
					}
				}else if(key=='follow_status'){
					if(value==1){
						return '未跟进';
					}else if(value==2){
						return '跟进中';
					}else if(value==3){
						return '已通过';
					}else if(value==4){
						return '已关闭';
					}else{
						return '未知'
					}
				}
				return value;
				
			},
			name:"companyWill",
			url:'CompanyApply/lists'
		},
		//产品定制列表配置
		productMade:{
			header:{
				title:['商户名称','商户类型','联系电话','合作编号','提交时间','行业场景','定制状态','产品编号','产品名称','结算类型','签约起期','签约止期','推广费','操作'], 
				isCheck:false
			},
			dataParamName:['company.name','company.level','company.mobile','code','create_time','scene_name','status',{"products":['code','name','settle_type','start_date','end_date','tgf_plat']}],
			power:[
				{
					"title":"查询",
					"fcode":"query"
				},
				{
					"title":"结算费率",
					"fcode":"rate"
				},
				{
					"title":"删除记录",
					"fcode":"delete"
				},
				{
					"title":"已签约",
					"fcode":"sign"
				},
				{
					"title":"已定制",
					"fcode":"custom"
				},
				{
					"title":"驳回",
					"fcode":"reject"
				},
				{
					"title":"结算类型",
					"fcode":"balType"
				}
			],
			powers:[{
				"title":"新增记录",
				"fcode":"add"
			}],
			//数据转换
			getValueText:function (key,value){
				if(key=='status'){
					if(value==1){
						return '待签约';
					}else if(value==2){
						return '已签约';
					}else if(value==3){
						return '驳回';
					}else if(value==4){
						return '已定制';
					}else{
						return '未知'
					}
				}else if(key=='tgf_plat'){
					if(value.type==1){
						return value.val+'元';
					}else{
						return value.val+'%';
					}
				}else if(key=='company.level'){
					return OPEN.getLevelText(value);
				}else if(key=='settle_type'){
					if(value==1){
						return '实时';
					}else if(value==2){
						return '月结';
					}else if(value==3){
						return '自定义'
					}else{
						return '未知'
					}
				}else{
					return value;
				}
				
			},
			name:"productMade",
			url:'CompanyApply/lists'
		},
		//产品类目配置
		productClass:{
			header:{
				title:['排序','类目名称','产品数量','状态','操作'],
			},
			dataParamName:['sort','name','pdt_num','status'],
			power:[
				{
					"title":"添加",
					"fcode":"add"
				},
				{
					"title":"删除",
					 "fcode":"delete"
				},
				{
					"title":"禁用",
					"fcode":"disabled"
				},
				{
					"title":"解除禁用",
					"fcode":"enabled"
				},
				{
					"title":"编辑",
					"fcode":"edit"
				}
			],
			//数据转换
			getValueText:function (key,value){
				if(key=='status'){
					if(value==1){
						return '正常';
					}else if(value==0){
						return '禁用';
					}else{
						return '未知'
					}
				}else{
					return value;
				}
				
			},
			name:"productClass",
			url:'RelatClass/lists'
		},
		//行业场景配置
		sceneClass:{
			header:{
				title:['排序','类目名称','产品数量','状态','操作'],
			},
			dataParamName:['sort','name','pdt_num','status'],
			power:[
				{
					"title":"添加",
					"fcode":"add"
				},
				{
					"title":"删除",
					 "fcode":"delete"
				},
				{
					"title":"禁用",
					"fcode":"disabled"
				},
				{
					"title":"解除禁用",
					"fcode":"enabled"
				},
				{
					"title":"编辑",
					"fcode":"edit"
				}
			],
			getValueText:function (key,value){
				if(key=='status'){
					if(value==1){
						return '正常';
					}else if(value==0){
						return '禁用';
					}else{
						return '未知'
					}
				}else{
					return value;
				}
			},
			name:"sceneClass",
			url:'RelatClass/lists'
		},
		//授权产品配置项
		authProduct:{
			header:{
				title:['授权时间','产品编号','产品名称','产品类目','合作类型','对接状态','状态','产品配置','操作','产品推荐'],
			},
			dataParamName:['grant_time','code','name','cls_name','type','is_api','status'],
			power:[
				{
					"title":"查询",
					"fcode":"query"
				},
				{
					"title":"删除",
					 "fcode":"delete"
				},
				{
					"title":"查看",
					"fcode":"show"
				},
				{
					"title":"上架",
					"fcode":"shelves"
				},
				{
					"title":"下架",
					"fcode":"unShelf"
				},
				{
					"title":"结算费率",
					"fcode":"rate"
				}
			],
			powers:[{
				"title":"推荐",
				"fcode":"setRecom"
			}],
			getValueText:function (key,value){
				if(key=='status'){
					if(value==1){
						return '已上架';
					}else if(value==0){
						return '未上架';
					}else{
						return '未知'
					}
				}else if(key=='is_grant'){
					if(value==1){
						return '已授权';
					}else if(value==0){
						return '未授权';
					}else if(value==-1){
						return '取消授权';
					}else{
						return '未知'
					}
				}else if(key=='type'){
					if(value==1){
						return '推广产品';
					}else if(value==2){
						return '定制产品';
					}else if(value==3){
						return '推广&定制';
					}else{
						return '未知'
					}
				}else if(key=='is_api'){
					if(value==1){
						return '已对接';
					}else if(value==0){
						return '未对接';
					}else{
						return '未知'
					}
				}else{
					return value;
				}
			},
			name:"authProduct",
			url:'Product/lists'
		},
		//产品库列表配置
		productLib:{
			header:{
				title:['同步时间','产品编号','产品名称','上架状态','授权状态','产品配置','操作'],
				isCheck:true,
			},
			dataParamName:['create_time','code','name','status','is_grant'],
			getValueText:function (key,value){
				if(key=='is_grant'){
					if(value==1){
						return '已授权';
					}else if(value==0){
						return '未授权';
					}else if(value==-1){
						return '取消授权';
					}else{
						return '未知'
					}
				}else if(key=='status'){
					if(value==1){
						return '已上架';
					}else if(value==0){
						return '未上架';
					}else{
						return '未知'
					}
				}else{
					return value;
				}
			},
			power:[
				{
					"title":"产品信息",
					"fcode":"editInfo"
				},
				{
					"title":"条款说明",
					"fcode":"editClause"
				},
				{
					"title":"保障方案",
					"fcode":"config"
				},
			],
			powers:[
				{
					"title":"查询",
					"fcode":"query"
				},
				{
					"title":"拉取",
					 "fcode":"pull"
				},
				{
					"title":"批量授权",
					"fcode":"authBat"
				},
				{
					"title":"授权",
					"fcode":"auth"
				},
				{
					"title":"取消授权",
					"fcode":"authCancel"
				}
			],
			name:"productLib",
			url:'Product/lists'
		},
		//订单列表配置
		orderLists:{
			header:{
				title:['订单编号','商户名称','推广方式','产品编号','产品名称','投保人','联系方式','下单时间','出单时间','保险起期','保费','订单状态','操作'],
				isCheck:true,
			},
			dataParamName:['order_no','company_name','exten','product.code','product.name','app_name','app_mobile','create_time','issue_time','bgn_tm','premium','status'],
			power:[
				{
					"title":"查询",
					"fcode":"query"
				},
				{
					"title":"导出excel",
					"fcode":"export"
				},
				{
					"title":"查看",
					"fcode":"show"
				}
			],
			getValueText:function (key,value){
				if(key=='exten'){
					if(value==1){
						return '二维码';
					}else if(value==2){
						return '链接';
					}else if(value==3){
						return 'API接口'
					}else{
						return '未知'
					}
				}else if(key=='under_status'){
					if(value==0){
						return '未承保';
					}else if(value==1){
						return '成功';
					}else if(value==2){
						return '失败'
					}else{
						return '未知'
					}
				}else if(key=='status'){
					if(value==1){
						return '核保中';
					}else if(value==2){
						return '核保失败';
					}else if(value==3){
						return '待支付'
					}else if(value==4){
						return '已支付'
					}else{
						return '未知'
					}
				}else{
					return value;
				}
			},
			name:"orderLists",
			url:'Policy/lists'
		},
		//保险公司订单列表配置
		insOrderLists:{
			header:{
				title:['订单编号','推广方式','产品编号','产品名称','投保人','下单时间','保费','订单状态','操作'],
				isCheck:true,
			},
			dataParamName:['order_no','exten','product.code','product.name','app_name','create_time','premium','status'],
			power:[
				{
					"title":"查询",
					"fcode":"query"
				},
				{
					"title":"导出excel",
					"fcode":"export"
				},
				{
					"title":"查看",
					"fcode":"show"
				}
			],
			getValueText:function (key,value){
				if(key=='exten'){
					if(value==1){
						return '二维码';
					}else if(value==2){
						return '链接';
					}else if(value==3){
						return 'API接口'
					}else{
						return '未知'
					}
				}else if(key=='under_status'){
					if(value==0){
						return '未承保';
					}else if(value==1){
						return '成功';
					}else if(value==2){
						return '失败'
					}else{
						return '未知'
					}
				}else if(key=='status'){
					if(value==1){
						return '核保中';
					}else if(value==2){
						return '核保失败';
					}else if(value==3){
						return '待支付'
					}else if(value==4){
						return '已支付'
					}else{
						return '未知'
					}
				}else{
					return value;
				}
			},
			name:"insOrderList",
			url:'Policy/lists'
		},
		//外链记录列表配置
		linkOrderLists:{
			header:{
				title:['商户名称','产品编号','产品名称','经纪公司','产品类型','浏览次数']
			},
			dataParamName:['company_name','product.code','product.name','ins_name','type','num'],
			power:[
				{
					"title":"查询",
					"fcode":"query"
				}
			],
			getValueText:function (key,value){
				if(key=='type'){
					if(value==1){
						return '平台对接';
					}else if(value==2){
						return '外链产品';
					}else{
						return '未知';
					}
				}else{
					return value;
				}
				
			},
			name:"linkOrderLists",
			url:'Policy/link_lists'
		},
		//角色管理列表配置
		roleAdmin:{
			header:{
				title:['ID','角色名称','角色类型','创建时间','状态','操作'],
			},
			dataParamName:['id','name','source','create_time','status'],
			power:[
				{
					"title":"查询",
					"fcode":"query"
				},
				{
					"title":"添加",
					 "fcode":"add"
				},
				{
					"title":"删除",
					 "fcode":"delete"
				},
				{
					"title":"禁用",
					"fcode":"disabled"
				},
				{
					"title":"解除禁用",
					"fcode":"enabled"
				},
				{
					"title":"编辑",
					"fcode":"edit"
				}
			],
			getValueText:function (key,value){
				if(key=='status'){
					if(value==-1){
						return '已删除';
					}else if(value==0){
						return '已禁用';
					}else if(value==1){
						return '有效';
					}else{
						return '未知'
					}
				}else if(key=='source'){
					if(value==1){
						return '保险公司';
					}else if(value==2){
						return '经纪公司';
					}else if(value==3){
						return '平台运营';
					}else if(value==4){
						return '销售渠道';
					}else{
						return '未知'
					}
				}else{
					return value;
				}
			},
			name:"roleAdmin",
			url:'Permissions/role_lists'
		},
		//账号管理列表配置
		accountLists:{
			header:{
				title:['ID','用户名','姓名','联系电话','角色类型','角色名称','创建人','创建时间','状态','操作'],
			},
			dataParamName:['id','account','name','mobile','source','role_name','acc_name','create_time','status'],
			power:[
				{
					"title":"查询",
					"fcode":"query"
				},
				{
					"title":"添加",
					 "fcode":"add"
				},
				{
					"title":"删除",
					 "fcode":"delete"
				},
				{
					"title":"禁用",
					"fcode":"disabled"
				},
				{
					"title":"解除禁用",
					"fcode":"enabled"
				},
				{
					"title":"编辑",
					"fcode":"edit"
				},
				{
					"title":"重置密码",
					"fcode":"reset"
				}
			],
			getValueText:function (key,value){
				if(key=='status'){
					if(value==-1){
						return '已删除';
					}else if(value==0){
						return '已禁用';
					}else if(value==1){
						return '正常';
					}else{
						return '未知'
					}
				}else if(key=='source'){
					if(value==1){
						return '保险公司';
					}else if(value==2){
						return '经纪公司';
					}else if(value==3){
						return '平台运营';
					}else if(value==4){
						return '销售渠道';
					}else{
						return '未知'
					}
				}else{
					return value;
				}
			},
			name:"accountLists",
			url:'Permissions/acc_lists'
		},
		//操作日志列表配置
		operLog:{
			header:{
				title:['ID','用户名','姓名','操作类容','操作IP地址','操作时间'],
			},
			dataParamName:['id','account'],
			power:[
				{
					"title":"查询",
					"fcode":"query"
				}
			],
			getValueText:function (key,value){
				return value;
			},
			name:"operLog",
			url:'Permissions/acc_lists'
		},
		//保险公司统计配置（特殊样式不需要表格只需要添加标签页）
		insStatis:{
		},
		//经纪公司统计配置（特殊样式不需要表格只需要添加标签页）
		brokersStatis:{},
		//运营平台统计配置（特殊样式不需要表格只需要添加标签页）
		platStatis:{},
		//渠道统计配置（特殊样式不需要表格只需要添加标签页）
		channelStatis:{},
		
		chanIns:{//渠道保险公司管理列表配置
			header:{
				title:['ID','添加时间','保险公司','状态','操作'],
			},
			dataParamName:['id','create_time','name','status'],
			power:[
				{
					"title":"添加",
					"fcode":"add"
				},
				{
					"title":"删除",
					 "fcode":"delete"
				},
				{
					"title":"禁用",
					"fcode":"disabled"
				},
				{
					"title":"解除禁用",
					"fcode":"enabled"
				},
				{
					"title":"编辑",
					"fcode":"edit"
				}
			],
			getValueText:function (key,value){
				if(key=='status'){
					if(value==0){
						return '禁用';
					}else if(value==1){
						return '正常';
					}else{
						return '未知'
					}
				}else{
					return value;
				}
			},
			name:"chanIns",
			url:'Insurer/lists'
		},
		chanBrokers:{//渠道经纪公司管理列表配置
			header:{
				title:['ID','添加时间','经纪公司','状态','操作'],
			},
			dataParamName:['id','create_time','name','status'],
			power:[
				{
					"title":"添加",
					"fcode":"add"
				},
				{
					"title":"删除",
					 "fcode":"delete"
				},
				{
					"title":"禁用",
					"fcode":"disabled"
				},
				{
					"title":"解除禁用",
					"fcode":"enabled"
				},
				{
					"title":"编辑",
					"fcode":"edit"
				}
			],
			getValueText:function (key,value){
				if(key=='status'){
					if(value==0){
						return '禁用';
					}else if(value==1){
						return '正常';
					}else{
						return '未知'
					}
				}else{
					return value;
				}
			},
			name:"chanBrokers",
			url:'Insurance/lists'
		},
		chanChannel:{//渠道销售渠道管理列表配置
			header:{
				title:['ID','添加时间','销售渠道','渠道类型','所属地区','状态','操作'],
			},
			dataParamName:['id','create_time','name','type',['province_name','area_name'],'status'],
			power:[
				{
					"title":"添加",
					"fcode":"add"
				},
				{
					"title":"删除",
					 "fcode":"delete"
				},
				{
					"title":"禁用",
					"fcode":"disabled"
				},
				{
					"title":"解除禁用",
					"fcode":"enabled"
				},
				{
					"title":"编辑",
					"fcode":"edit"
				}
			],
			getValueText:function (key,value){
				if(key instanceof Array){
					return value.province_name+value.area_name;
				}else if(key=='status'){
					if(value==0){
						return '禁用';
					}else if(value==1){
						return '正常';
					}else{
						return '未知'
					}
				}else if(key=='type'){
					if(value==0){
						return '无';
					}else if(value==1){
						return '分公司';
					}else if(value==2){
						return '合作伙伴';
					}else{
						return '未知'
					}
				}else{
					return value;
				}
			},
			name:"chanChannel",
			url:'Partner/lists'
		},
		chanVIP:{//渠道VIP商户管理列表配置
			header:{
				title:['ID','添加时间','商户名称','状态','操作'],
			},
			dataParamName:['id','create_time','name','status'],
			power:[
				{
					"title":"查询",
					"fcode":"query"
				},
				{
					"title":"禁用",
					"fcode":"disabled"
				},
				{
					"title":"解除禁用",
					"fcode":"enabled"
				},
				{
					"title":"VIP费率",
					"fcode":"becomeVIP"
				},
				{
					"title":"取消VIP",
					"fcode":"cancelVIP"
				}
			],
			getValueText:function (key,value){
				if(key=='status'){
					if(value==0){
						return '禁用';
					}else if(value==1){
						return '正常';
					}else{
						return '未知'
					}
				}else{
					return value;
				}
			},
			name:"chanVIP",
			url:'Company/lists'
		},
		//结算收入列表的总配置
		income:{
			dataParamName:['date','source_name','code','product_code','product_name','policy_num','premium_amt','status'],
			power:[
				{
					"title":"查询",
					"fcode":"query"
				},
				{
					"title":"导出excel",
					"fcode":"export"
				},
				{
					"title":"查看明细",
					"fcode":"detailed"
				},
				{
					"title":"确认对账",
					"fcode":"confirmRec"
				},
				{
					"title":"确认开票",
					"fcode":"Bill"
				},
				{
					"title":"确认收款",
					"fcode":"receivMoney"
				}
			],
			getValueText:function (key,value){
				if(key=='status'){
					if(value==1){
						return '待对账';
					}else if(value==2){
						return '待开发票';
					}else if(value==3){
						return '发票待确认'
					}else if(value==4){
						return '等待对方打款'
					}else if(value==5){
						return '待收款'
					}else if(value==6){
						return '已完成'
					}else{
						return '未知'
					}
				}else if(key=='settle_type'){
					if(value==1){
						return '实时';
					}else if(value==2){
						return '月结';
					}else if(value==3){
						return '自定义'
					}else{
						return '未知'
					}
				}else{
					return value;
				}
			},
			name:"income",
			url:'Bill/lists'
		},
		//结算支出列表的总配置
		expend:{
			dataParamName:['date','source_name','code','product_code','product_name','policy_num','amt','status'],
			power:[
				{
					"title":"查询",
					"fcode":"query"
				},
				{
					"title":"导出excel",
					"fcode":"export"
				},
				{
					"title":"查看明细",
					"fcode":"detailed"
				},
				{
					"title":"确认对账",
					"fcode":"confirmRec"
				},
				{
					"title":"发票信息",
					"fcode":"invoice"
				},
				{
					"title":"确认收票",
					"fcode":"confirmReceipt"
				},
				{
					"title":"确认打款",
					"fcode":"confirmMoney"
				}
			],
			getValueText:function (key,value){
				if(key=='status'){
					if(value==1){
						return '待对账';
					}else if(value==2){
						return '待收发票';
					}else if(value==3){
						return '确认发票'
					}else if(value==4){
						return '待打款'
					}else if(value==5){
						return '等待对方收款'
					}else if(value==6){
						return '已完成'
					}else{
						return '未知'
					}
				}else if(key=='settle_type'){
					if(value==1){
						return '实时';
					}else if(value==2){
						return '月结';
					}else if(value==3){
						return '自定义'
					}else{
						return '未知'
					}
				}else{
					return value;
				}
			},
			name:"expend",
			url:'Bill/lists'
		},
		/*
			收入支出列表 只有表头不想同故只需要配置表头
				其他参数在方法中使用 income(收入)，expend(支出)中的配置即可
			
		*/
		insInBrokers:{//保险公司经纪公司收入列表表头配置
			header:{
				title:['账单时间','经纪公司','账单编号','产品编号','产品名称','订单量','保费总额','结算类型','结算状态','操作'],
				isCheck:true
			}
		},
		insInCom:{//保险公司商户收入列表表头配置
			header:{
				title:['账单时间','商户','账单编号','产品编号','产品名称','订单量','保费总额','结算类型','结算状态','操作'],
				isCheck:true
			}
		},
		insExpBrokers:{//保险公司经纪公司支出列表表头配置
			header:{
				title:['账单时间','经纪公司','账单编号','产品编号','产品名称','订单量','经纪费','结算状态','操作'],
				isCheck:true
			}
		},
		insExpPlat:{//保险公司平台支出列表表头配置
			header:{
				title:['账单时间','平台运营','账单编号','产品编号','产品名称','订单量','技术服务费','结算状态','操作'],
				isCheck:true
			}
		},
		insExpCom:{//保险公司商户支出列表表头配置
			header:{
				title:['账单时间','商户名称','账单编号','产品编号','产品名称','订单量','推广费','结算状态','操作'],
				isCheck:true
			}
		},
		
		channelIn:{//渠道收入列表表头配置
			header:{
				title:['账单时间','商户名称','账单编号','产品编号','产品名称','订单量','市场拓展费','结算状态','操作'],
				isCheck:true
			}
		},
		brokersIn:{//经纪公司收入列表表头配置
			header:{
				title:['账单时间','保险公司','账单编号','产品编号','产品名称','订单量','经纪费','通道费','结算状态','操作'],
				isCheck:true
			}
		},
		platInIns:{//平台保险公司收入列表表头配置
			header:{
				title:['账单时间','保险公司','账单编号','账单时间','产品名称','订单量','技术服务费','结算状态','操作'],
				isCheck:true
			}
		},
		platInBrokers:{//平台经纪公司收入列表表头配置
			header:{
				title:['账单时间','经纪公司','账单编号','产品编号','产品名称','订单量','技术服务费','结算状态','操作'],
				isCheck:true
			}
		},
		
		brokersExpCom:{//经纪公司商户支出列表表头配置
			header:{
				title:['账单时间','商户名称','账单编号','产品编号','产品名称','订单量','推广费','结算状态','操作'],
				isCheck:true
			}
		},
		brokersExpPlat:{//经纪公司平台支出列表表头配置
			header:{
				title:['账单时间','平台运营','账单编号','产品编号','产品名称','订单量','技术服务费','结算状态','操作'],
				isCheck:true
			}
		},
		brokersExpIns:{//经纪公司保险公司支出列表表头配置
			header:{
				title:['账单时间','保险公司','账单编号','产品编号','产品名称','订单量','保费','结算状态','操作'],
				isCheck:true
			}
		},
		platExpCom:{//平台商户支出列表表头配置
			header:{
				title:['账单时间','商户名称','账单编号','产品编号','产品名称','订单量','推广费','结算状态','操作'],
				isCheck:true
			}
		},
		platExpChannel:{//平台渠道支出列表表头配置
			header:{
				title:['账单时间','销售渠道','账单编号','产品编号','产品名称','订单量','市场拓展费','结算状态','操作'],
				isCheck:true
			}
		},
		//账单明细总配置项
		detailed:{
			header:{
				title:['订单编号','推广方式','商户名称','产品名称','投保人','联系方式','出单时间','保险起期','保险止期','保费','保单号'],
				isCheck:true
			},
			dataParamName:['order_no','exten','company_name','product.name','app_name','app_mobile','issue_time','bgn_tm','end_tm','premium','policy_no'],
			power:[
				{
					"title":"查询",
					"fcode":"query"
				},
				{
					"title":"导出excel",
					"fcode":"export"
				},
				{
					"title":"计入下期账单",
					"fcode":"entNext"
				}
			],
			getValueText:function (key,value){
				if(key=='exten'){
					if(value==1){
						return '二维码';
					}else if(value==2){
						return '链接';
					}else if(value==3){
						return 'API接口'
					}else{
						return '未知'
					}
				}else if(key=='app_mobile'){
					return value.replace( /^(\d{3})\d{4}(\d{4})$/, "$1****$2")
				}else{
					return value;
				}
				
			},
			name:"showDetailed",
			url:'Bill/policy_lists'
		},
		/*
			查看账单明细模态框显示
				type	（1-保险公司（经纪公司）收入 2-保险公司(经纪公司)支出 3-保险公司(平台)支出 4-保险公司(商户)支出  5-经纪公司收入 6-经纪公司(商户)支出 
7-经纪公司(平台)支出  8-平台（保险公司）收入  9-平台（经纪公司）收入  10-平台(商户)支出 
11-平台(销售渠道)支出  12-销售渠道支出 13-经纪公司(保险公司)支出  14-保险公司（商户）收入）
				fcode 详细明细的 父级fcode
				trData 列数据
		*/
		showDetailed:function(type,fcode,trData){
			var html='<div class="detailed_box">'
					+	'<div class="search-checkstate">'
					+	'<div class="text_center">'
					+		'<h4 name="title">"'+trData.product_name+'"账单明细</h4>'
					+		"<label style='margin-left: 200px;margin-bottom: 30px;font-weight: 100;'>——账单时间："+trData.start_date+"-"+trData.end_date+"</label>"
					+	'</div>'
					+      '<div class="search_box" hidden>'
					+            '<form class="form-inline" style="margin-bottom:15px;">'
					+              '<div class="form-group">'
					+                '<select name="time_type"  class="form-control">'
					+						'<option value="1">出单时间</option>'
					+						'<option value="2">保险起期</option>'
					+						'<option value="3">下单时间</option>'
					+                '</select>'
					+                '<input type="text" class="form-control" id="create_start" name="create_start" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" placeholder="">-<input type="text" class="form-control" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" id="create_end" name="create_end" placeholder="">'
					+              '</div>'
					+              '<div id="company_box" class="form-group">'
					+                '<input type="text" class="form-control" name="order_val" 	placeholder="订单编号">'
					+              '</div>'
					+              '<div id="product_box" class="form-group">'
					+                '<input type="text" class="form-control" name="app_val" 	placeholder="投保人">'
					+              '</div>'
					+            '<label class="btn btn-primary query">查询</label>'
					+			   '<label class="btn btn-default">重置</label>'
					+            '</form>'
					+      '<div class="checkState">'
					+			'<label name="entNext" hidden><button style="float: none;" type="button" class="btn btn-primary">计入下期账单</button><span class="color_7">如因特殊原因不结算个别订单，点此按钮可将该订单计入下一账期</span></label>'
					+        '<button type="button" name="export" class="btn btn-primary"  hidden>导出excel</button>'
					+     '</div>'
					+      '</div>'
					+   '</div>'
					+	'<div class="de_table"></div>'
					+	'<div class="text_right" style="position: absolute;bottom: 31px;right: 44px;"><label name="amt_text">保费总额</label>：<label name="total_amt"></label>元</div>'
					+'</div>',
				config={
					html:html,
					isFull:true,
					isConfirm:false,
					isCancel:false
				}
				fcodes=[],amt_text='',
				detailed=OPEN.detailed,//获取配置
				modal=asys.showModalHtml(config);//显示模态框
				detailed.dataParamName=['order_no','product.code','product.name','app_name','create_time','issue_time','bgn_tm','premium','amt'];//默认单元格对应字段，
				//根据type 判断 表格头文字显示，字段，费用总额等提醒配置
				if(type==1||type==13 ||type==14){
					detailed.header.title=['订单编号','投保人','下单时间','出单时间','保险起期','保费','保单号']
					detailed.dataParamName=['order_no','app_name','create_time','issue_time','bgn_tm','premium','policy_no'];
					amt_text="保费总额";
				}else if(type==2){
					detailed.header.title=['订单编号','产品编号','产品名称','投保人','下单时间','出单时间','保险起期','保费','经纪费'];
					amt_text="经纪费总额";
				}else if(type==3){
					detailed.header.title=['订单编号','产品编号','产品名称','投保人','下单时间','出单时间','保险起期','保费','技术服务费'];
					amt_text="技术服务费总额";
				}else if(type==4){
					detailed.header.title=['订单编号','产品编号','产品名称','投保人','下单时间','出单时间','保险起期','保费','推广费'];
					amt_text="推广费总额";
				}else if(type==5){
					detailed.header.title=['订单编号','产品编号','产品名称','投保人','下单时间','出单时间','保险起期','保费','经纪费'];
					amt_text="经纪费总额";
				}else if(type==6){
					detailed.header.title=['订单编号','产品编号','产品名称','投保人','下单时间','出单时间','保险起期','保费','技术服务费'];
					amt_text="技术服务费总额";
				}else if(type==7){
					detailed.header.title=['订单编号','产品编号','产品名称','投保人','下单时间','出单时间','保险起期','保费','推广费'];
					amt_text="推广费总额";
				}else if(type==8){
					detailed.header.title=['订单编号','产品编号','产品名称','投保人','下单时间','出单时间','保险起期','保费','技术服务费'];
					amt_text="技术服务费总额";
				}else if(type==9){
					detailed.header.title=['订单编号','产品编号','产品名称','投保人','下单时间','出单时间','保险起期','保费','技术服务费'];
					amt_text="技术服务费总额";
				}else if(type==10){
					detailed.header.title=['订单编号','产品编号','产品名称','投保人','下单时间','出单时间','保险起期','保费','推广费'];
					amt_text="推广费总额";
				}else if(type==11){
					detailed.header.title=['订单编号','产品编号','产品名称','投保人','下单时间','出单时间','保险起期','保费','市场拓展费'];
					amt_text="市场拓展费总额";
				}else if(type==12){
					detailed.header.title=['订单编号','投保人','下单时间','出单时间','保险起期','保费','市场拓展费'];
					detailed.dataParamName=['order_no','app_name','create_time','issue_time','bgn_tm','premium','amt'];
					amt_text="市场拓展费总额";
				}	
				modal.find("label[name=amt_text]").text(amt_text);		
				//页面初始化，加入表格，并渲染表头
				asys.addTable(modal.find(".de_table"),detailed.header,false);
				var tableDom=modal.find("table[id=info]");
				//重置按钮事件绑定
				modal.find(".search_box .btn-default").click(function(){
					var t = $(this).closest(".form-inline")[0].reset();	
					getData(1);			
				});
				//背景修改
				modal.find(".modal-body").css("background",'#e9ecf3');
				//查询按钮绑定事件
				modal.find(".search_box .btn-primary.query").click(function(){
					var data = {};
					var t = $(this).closest(".form-inline").serializeArray();
					$.each(t, function() {
					  data[this.name] = this.value;
					});
					getData(1,data);
				});
				//获取权限
				OPEN.getPowerMenu(fcode,function(data){
					$.each(data.info,function(){
						var fcode=this.fcode.split("_")[2];
						fcodes.push(fcode);
						if(fcode=='query'){
							modal.find(".search_box").show();
						}else if(fcode=='export'){
							modal.find("button[name=export]").show();
						}else if(fcode=='entNext'){
							modal.find("label[name=entNext]").show();
						}
					})
					getData(1); 
				});
				//时间选择控件绑定
				var today=new Date();
				today.setMonth(today.getMonth()-1);
				asys.datePicker(modal.find("input[name='create_start']"),{
					endDate: new Date(),
					initialDate:today
				});
				asys.datePicker(modal.find("input[name='create_end']"),{
					endDate: new Date(),
					initialDate:new Date()
				});
				var bill_id=trData.id;
				//计入下期账单按钮点击事件
				modal.find("label[name='entNext'] button").click(function(){
					var lists=[];
						$.each(tableDom.find("input[name = btSelect]:checked"),function(){
							lists.push(this.value);
						});
						if(lists.length>0){
							asys.showAlert({title:'温馨提醒',msg:'确定将选中订单计入下期账单？',confirmFun:function(){
								setTimeout(function(){
									setNextBill(lists.toString());
								},200);
								
							}});
						}else{
							asys.showAlert({title:'温馨提醒',msg:'请选中需要计入下期的账单',isCancel:false});
						}
				})
				//导出excel 按钮事件
				modal.find("button[name='export']").click(function(){
						var lists=[];
						$.each(tableDom.find("input[name = btSelect]:checked"),function(){
							lists.push(this.value);
						});
						//如果没有选择数据则弹框让客户选择时间区间
						if(lists.length>0){
							asys.showAlert({title:'温馨提醒',msg:'确认导出所选订单？',confirmFun:function(){
								setTimeout(function(){
									getExpInfo({type:1,ids:lists.toString()});
								},200)
							}});
						}else{	
							var html='<form class="form-inline text_center">'
								+		'<div>温馨提醒：单次导出数据最多不超过一万条</div>'
								+		'<div class="form-group" style="margin: 10px 0;">'
								+		'</div>'
								+        '<div class="form-group">'
								+                '<select name="time_type"  class="form-control">'
								+						'<option value="1">出单时间</option>'
								+						'<option value="2">保险起期</option>'
								+						'<option value="3">下单时间</option>'
								+                '</select>'
								+          '<input type="text" class="form-control" name="time_start" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" placeholder="开始时间">-<input type="text" class="form-control" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" name="time_end" placeholder="截止时间">'
								+        '</div>'
								+			'</div>'
								+		'</div>'
								+	'</form>';
							config={
								title:'订单导出',
								html:html,
								confirmFun:function(obj){
									var t = $(obj).find(".form-inline").serializeArray(),isErr=false,data={};
									$.each(t, function() {
										 if(this.value){
											 data[this.name] = this.value; 
										 }else{
											isErr=true; 
											return; 
										 }
									});
									if(!data.time_start){//验证数据
										asys.showAlert({title:'温馨提醒',msg:'请选择导出开始时间',isCancel:false})
										return;
									}
									data.type=2;
									getExpInfo(data);						
									
								}
							}
							
							var modal=asys.showModalHtml(config,true);
							var date=new Date();
							//填入默认时间
							modal.find("input[name='time_end']").val(date.getFullYear()+"-"+(date.getMonth()+1)+'-'+date.getDate());
							//时间控件初始化
							asys.datePicker(modal.find("input[name='time_start']"),{
								endDate: new Date(),
								initialDate:new Date()
							});
							asys.datePicker(modal.find("input[name='time_end']"),{
								endDate: new Date(),
								initialDate:new Date()
							});
						}
						
						
					});
					//导出excel 的请求方法
					function getExpInfo(params){
						params.bill_id=bill_id;
						params.bill_type=type;
						var config={
							url:'Bill/policy_check_export',
							params:params,
							successFun:function(data){
								window.location.href=data.info.export_url; 
							}
						}
						asys.post(config);
					}
					//计入下期账单
					function setNextBill(ids){
						var config={
							url:'Bill/next_bill_do',
							params:{
								bill_id:bill_id,
								type:type,
								policy_ids:ids
							},
							successFun:function(data){
								getData(1);
							}
						}
						asys.post(config);
					}
				
				//请求数据方法
				function getData(page,params){
					if(params){
						params.limit=OPEN.limit;
						params.page=page;
					}else{
						params={
							limit:OPEN.limit,
							page:page
						}
					}
					params.bill_id=bill_id;
					params.type=type;
					//请求成功后运行方法
					function successFun(data){
						var tableContent=data.info.policy_lists;
						if(data.info.status==1 && fcodes.indexOf("entNext")){
							modal.find("label[name=entNext]").show();
						}else{
							modal.find("label[name=entNext]").hide();
						}
						modal.find("label[name=total_amt]").text(data.info.total_amt);
						//填表格中渲染数据
						asys.tableCont({tableDom:tableDom,//表格dom
										data:tableContent,//数据·
										setOpname:setOpname,//权限列显示方法
										paramConfig:detailed,//配置
										optionClick:optionClick,//点击事件的方法
										checkVlaue:'id'});//复选框绑定的value 对应的tableContent 所对应的属性名称
						modal.find(".table_box").show();//将表格显示
						//添加分页
						asys.pagination({dom:tableDom.find(".fixed_table_container"),page:page,count:data.url,limit:OPEN.limit,getDataFun:function(page){
							getData(page,params);
						}});
						tableDom.table_data=tableContent; //将数据绑定到div上将数据绑定到div上将数据绑定到div上
						function setOpname(power,data){//操作权限设置
								var html="";
								return html;
						}
						//操作单元格点击事件
						function optionClick(){
							
						}
							
					}
					//请求参数
					var config={
						url:OPEN.detailed.url,
						params:params,
						successFun:successFun
					}
					asys.post(config);
				}
		},
		/*
			发票信息录入
				type	（1-保险公司（经纪公司）收入 2-保险公司(经纪公司)支出 3-保险公司(平台)支出 4-保险公司(商户)支出  5-经纪公司收入 6-经纪公司(商户)支出 
7-经纪公司(平台)支出  8-平台（保险公司）收入  9-平台（经纪公司）收入  10-平台(商户)支出 
11-平台(销售渠道)支出  12-销售渠道支出 13-经纪公司(保险公司)支出  14-保险公司（商户）收入）
				bill_id ：操作列的账单ID
				getData ：获取数据的方法
		*/
		showInvo:function(type,bill_id,getData){
			var html="<div class='form-horizontal'>"
				+		'<div class="form-group">'
				+			'<label  class="col-sm-3 control-label">发票编号</label>'
				+			'<div class="col-sm-7">'
				+				'<input type="text" class="form-control" name="invo_number" placeholder="请输入发票编号">'
				+			'</div>'
				+		'</div>'
				+		'<div class="form-group">'
				+			'<label  class="col-sm-3 control-label">物流公司</label>'
				+			'<div class="col-sm-7">'
				+				'<select name="exp_id" class="form-control">'
				+				'</select>'
				+			'</div>'
				+		'</div>'
				+		'<div class="form-group">'
				+			'<label  class="col-sm-3 control-label">物流单号</label>'
				+			'<div class="col-sm-7">'
				+				'<input type="text" class="form-control" name="exp_number" placeholder="请输入物流单号">'
				+			'</div>'
				+		'</div>'
				+	"</div>",
			config={
				title:'确认开票',
				html:html,
				confirmFun:function(obj){//模态框中确认按钮点击事件
					//获取录入的信息 并验证数据准确性
					var invo_number=obj.find("input[name=invo_number]").val();
					var exp_id=obj.find("select[name=exp_id]").val();
					var exp_number=obj.find("input[name=exp_number]").val();
					if(!invo_number){
						asys.showAlert({title:'温馨提醒',msg:'请输入发票编号',isCancel:false})
						return;
					}
					if(!exp_number){
						asys.showAlert({title:'温馨提醒',msg:'请输入物流单号',isCancel:false})
						return;
					}
					//上传数据
					var config={
						url:'Bill/status_do',
						params:{
							bill_id:bill_id,
							type:type,
							oper_type:2,
							exp_number:exp_number,
							exp_id:exp_id,
							invo_number:invo_number,
							invo_type:1
						},
						successFun:function(data){
							getData()
							obj.modal("hide")								
						}
					}
					asys.post(config);
				}
			}
			var modal=asys.showModalHtml(config);
			//获取快递公司列表
			var post_config={
				url:'RelatClass/exp_lists',
				params:{},
				successFun:function(data){
					modal.find("select[name=exp_id]").html("");
					var html='';
					$.each(data.info,function(){
						html+="<option value='"+this.id+"'>"+this.name+"</option>"
					})
					modal.find("select[name=exp_id]").html(html);
				},
				statusErrorFun:function(){
					modal.modal('hide');
				},
				errorFun:function(){
					modal.modal('hide');
				}
			}
			asys.post(post_config);
		},
		/*
			确认对账或者确认打款
				type	（1-保险公司（经纪公司）收入 2-保险公司(经纪公司)支出 3-保险公司(平台)支出 4-保险公司(商户)支出  5-经纪公司收入 6-经纪公司(商户)支出 
7-经纪公司(平台)支出  8-平台（保险公司）收入  9-平台（经纪公司）收入  10-平台(商户)支出 
11-平台(销售渠道)支出  12-销售渠道支出 13-经纪公司(保险公司)支出  14-保险公司（商户）收入）
				oper_type:操作类型（
					收入操作类型：1-确认对账 3-确认收款
					支出操作类型：1-确认对账 3-确认打款 
				）
				trData: 操作列的数据
				getData：请求数据的方法
		*/
		showAccount:function(type,oper_type,trData,getData){
			var html="<div class='form-horizontal'>"
				+		'<div class="form-group">'
				+			'<label  class="col-sm-5 control-label">账单时间</label>'
				+			'<label  class="col-sm-5 control-label">'+trData.date+'</label>'
				+		'</div>'
				+		'<div class="form-group">'
				+			'<label  class="col-sm-5 control-label">账单编号</label>'
				+			'<label  name="code" class="col-sm-5 control-label"></label>'
				+		'</div>'
				+		'<div class="form-group">'
				+			'<label name="name_title" class="col-sm-5 control-label">经纪公司</label>'
				+			'<label  name="name" class="col-sm-5 control-label"></label>'
				+		'</div>'
				+		'<div class="form-group">'
				+			'<label  class="col-sm-5 control-label">产品名称</label>'
				+			'<label name="product_name" class="col-sm-5 control-label"></label>'
				+		'</div>'
				+		'<div class="form-group">'
				+			'<label name="amt_title"  class="col-sm-5 control-label">推广费</label>'
				+			'<label name="amt" class="col-sm-5 control-label"></label>'
				+		'</div>'
				+	"</div>",bill_id,amt_title,amt,code,name,name_title='',product_name;
			//获取数据
			bill_id=trData.id;
			amt=trData.amt;
			code=trData.code;
			name=trData.source_name;
			product_name=trData.product_name;
			var config={
					title:oper_type==1?'确认对账':'确认打款',
					html:html,
					confirmFun:function(obj){
						//请求数据
						var config={
							url:'Bill/status_do',
							params:{
								bill_id:bill_id,
								type:type,
								oper_type:oper_type
							},
							successFun:function(data){
								getData(1)
								obj.modal("hide")								
							}
						}
						asys.post(config);
					}
			}
			var modal=asys.showModalHtml(config);
			//根据type 显示字段
			var typeStr=''
			if(type==1){
				typeStr='保费总额';
				name_title="经纪公司";
				amt=trData.premium_amt;
			}else if(type==2){
				typeStr='经纪费';
				name_title="经纪公司";
			}else if(type==3){
				typeStr='技术服务费';
				name_title="平台名称";
			}else if(type==4){
				name_title="商户名称";
				typeStr="推广费";
			}else if(type==5){
				name_title="保险公司";
				typeStr="经纪费";
			}else if(type==6){
				name_title="商户名称";
				typeStr="推广费";
			}else if(type==7){
				name_title="平台名称";
				typeStr="技术服务费";
			}else if(type==8){
				name_title="保险公司";
				typeStr="技术服务费";
			}else if(type==9){
				name_title="经纪公司";
				typeStr="技术服务费";
			}else if(type==10){
				name_title="商户名称";
				typeStr="推广费";
			}else if(type==11){
				name_title="渠道名称";
				typeStr="市场拓展费";
			}else if(type==12){
				name_title="平台名称";
				typeStr="市场拓展费";
			}else if(type==13){
				name_title="保险公司";
				typeStr="保费";
			}else if(type==14){
				name_title="商户名称";
				typeStr="保费总额";
				amt=trData.premium_amt;
			}
			//数据的显示
			modal.find("label[name=amt]").text(amt+"元")
			modal.find("label[name=amt_title]").text(typeStr);
			modal.find("label[name=code]").text(code);
			modal.find("label[name=name]").text(name);
			modal.find("label[name=product_name]").text(product_name);
			modal.find("label[name=name_title]").text(name_title);
		},
		/*
			确认收票或者查看发票信息
				type	（1-保险公司（经纪公司）收入 2-保险公司(经纪公司)支出 3-保险公司(平台)支出 4-保险公司(商户)支出  5-经纪公司收入 6-经纪公司(商户)支出 
7-经纪公司(平台)支出  8-平台（保险公司）收入  9-平台（经纪公司）收入  10-平台(商户)支出 
11-平台(销售渠道)支出  12-销售渠道支出 13-经纪公司(保险公司)支出  14-保险公司（商户）收入）
				bill_id: 操作列账单Id
				isConfirm:  真为确认收票    假为 发票信息
				getData：请求数据的方法
		*/
		showInvoInfo:function(type,bill_id,isConfirm,getData){
			var html="<div class='form-horizontal'>"
				+		'<div class="form-group">'
				+			'<label  class="col-sm-5 control-label">发票编号</label>'
				+			'<label name="invo_number" class="col-sm-5 control-label"></label>'
				+		'</div>'
				+		'<div class="form-group">'
				+			'<label  class="col-sm-5 control-label">物流公司</label>'
				+			'<label name="exp_name" class="col-sm-5 control-label"></label>'
				+		'</div>'
				+		'<div class="form-group">'
				+			'<label  class="col-sm-5 control-label">物流单号</label>'
				+			'<label name="exp_number" class="col-sm-5 control-label">产品名称</label>'
				+		'</div>'
				+	"</div>",
			config={
					title:isConfirm?'确认收票':'发票信息',
					html:html,
					isConfirm:isConfirm,//是否需要确认按钮
					cancelText:isConfirm?'取消':'关闭',//取消按钮文字
					confirmFun:function(obj){//确认按钮点击事件
						var config={
							url:'Bill/status_do',
							params:{
								bill_id:bill_id,
								type:type,
								oper_type:2
							},
							successFun:function(data){
								getData()//刷新页面（不传信息则刷新）
								obj.modal("hide")								
							}
						}
						asys.post(config);
					}
			}
			var modal=asys.showModalHtml(config);
			//获取发票信息，并显示
			var post_config={
					url:'Bill/invo_info',
					params:{
						bill_id:bill_id,
						type:type,
					},
					successFun:function(data){
						var info=data.info;
						modal.find("label[name=invo_number]").text(info.invo_number?info.invo_number:'');
						modal.find("label[name=exp_name]").text(info.exp_name?info.exp_name:'')
						modal.find("label[name=exp_number]").text(info.exp_number?info.exp_number:'')
						
					},
					statusErrorFun:function(){
						modal.modal('hide');
					},
					errorFun:function(){
						modal.modal('hide');
					}
				}
			asys.post(post_config);
			
		},
		/*
			订单列表页面的显示（包括保险公司和正常订单列表）
				tabInfo ：dom信息对象
				paramConfig ： 表格的配置
		*/
		orderListPage:function (tabInfo,paramConfig){
			/*添加筛选栏*/
			var search_checkstate= '<div class="search-checkstate">'
					+    '<div class="search_box" hidden>'
					+    '<form class="form-inline" style="margin-bottom:15px;">'
					+      '<div class="form-group">'
					+        '<label for="status">订单状态</label>'
					+        '<select  name="status" id="status" class="form-control">'
					+			'<option value="">全部</option>'
					+          '<option value="1">核保中</option>'
					+          '<option value="2">核保失败</option>'
					+          '<option value="3">待支付</option>'
					+          '<option value="4">已支付</option>'
					+        '</select>'
					+      '</div>'
					+      '<div class="form-group">'
					+        '<label for="exten">推广方式</label>'
					+        '<select name="exten" id="exten" class="form-control">'
					+			'<option value="">全部</option>'
					+          '<option value="1">二维码</option>'
					+          '<option value="2">链接</option>'
					+          '<option value="3">API接口</option>'
					+        '</select>'
					+      '</div>'
					+        '<div class="form-group">'
					+          '<label for="create_start">下单时间</label>'
					+          '<input type="text" class="form-control start_date" name="create_start" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" placeholder="">-<input type="text" class="form-control end_date" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" name="create_end" placeholder="">'
					+        '</div>'
					+      '<div class="form-group">'
					+        '<input type="text" class="form-control" id=""  name="product_name" placeholder="产品名称">'
					+      '</div>'
					+      '<div class="form-group">'
					+        '<input type="text" class="form-control" id=""  name="company_name" placeholder="商户名称">'
					+      '</div>'
					+        '<label class="btn btn-primary">查询</label>'
					+			   '<label class="btn btn-default">重置</label>'
					+    '</form>'
					+    '</div>'
					+    '<div class="checkState">'
					+      '<button hidden type="button" name="export" class="btn btn-primary">导出excel</label>'
					+    '</div>'
					+ '</div>',
				pageConfig={
					tabInfo:tabInfo,//dom信息对象
					paramConfig:paramConfig,//表格配置
					search_checkstate:search_checkstate,//筛选栏html
					setSearchPower:setSearchPower,//权限请求成功后执行方法
					optionClick:optionClick,//可点击标签的点击事件（operation Css下的a标签点击事件）
					setOpname:setOpname,//权限列显示方法（有权限判断和根据数据判断是否显示等）
					tableShowAfter:tableShowAfter,//整个页面渲染完成后运行的方法
					checkVlaue:'id',//复选框绑定的value 值的对应的data属性名称
				},
				fcodes=[],
				getData=OPEN.initPage(pageConfig);
			//导出excel按钮点击事件
			tabInfo.tabDom.find("button[name='export']").click(function(){
				var lists=[];
				$.each(tabInfo.tableDom.find("input[name = btSelect]:checked"),function(){
					lists.push(this.value);
				})
				if(lists.length>0){
					getExpInfo({type:1,ids:lists.toString()});
				}else{
					var html='<form class="form-inline text_center">'
						+		'<div>温馨提醒：单次导出数据最多不超过一万条</div>'
						+		'<div class="form-group" style="margin: 10px 0;">'
						+			'<div class="radio">'
						+				'<label><input type="radio" name="time_type" value="1">下单时间</label>'
						+				'<label style="margin: 0 25px;"><input type="radio" name="time_type" value="2">出单时间</label>'
						+				'<label><input type="radio" name="time_type" value="3">保险起期</label>'
						+			'</div>'
						+		'</div>'
						+        '<div class="form-group">'
						+          '<input type="text" class="form-control" name="time_start" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" placeholder="开始时间">-<input type="text" class="form-control" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" name="time_end" placeholder="截止时间">'
						+        '</div>'
						+			'</div>'
						+		'</div>'
						+	'</form>';
					config={
						title:'订单导出',
						html:html,
						confirmFun:function(obj){//确认按钮点击事件
							var t = $(obj).find(".form-inline").serializeArray(),isErr=false,data={};
							$.each(t, function() {//组装数据
								 if(this.value){
									 data[this.name] = this.value; 
								 }else{
									isErr=true; 
									return; 
								 }
							});
							//数据验证
							if(!data.time_type){
								asys.showAlert({title:'温馨提醒',msg:'请选择导出时间类型',isCancel:false});
								return;
							}if(!data.time_start){
								asys.showAlert({title:'温馨提醒',msg:'请选择导出开始时间',isCancel:false})
								return;
							}
							data.type=2;
							//请求数据
							getExpInfo(data);						
							
						}
					}
					var modal=asys.showModalHtml(config);
					//时间控件初始化
					var date=new Date();
					modal.find("input[name='time_end']").val(date.getFullYear()+"-"+(date.getMonth()+1)+'-'+date.getDate());
					asys.datePicker(modal.find("input[name='time_start']"),{
						endDate: new Date(),
						initialDate:new Date()
					});
					asys.datePicker(modal.find("input[name='time_end']"),{
						endDate: new Date(),
						initialDate:new Date()
					});
				}
			});
			//权限请求成功后调用的方法，记录权限信息，并查看是否有表格之上的筛选栏或者按钮权限
			function setSearchPower(data){
				$.each(data.info,function(){
					var fcode=this.fcode.split("_")[1];//将权限名称拆分，取最后一个
					fcodes.push(fcode);//记录权限列表
					if(fcode=='query'){//是否有查询权限
						tabInfo.tabDom.find(".search_box").show();//显示筛选栏
					}else if(fcode=='export'){//是否有导出权限
						tabInfo.tabDom.find("button[name=export]").show();//显示导出按钮
					}
				})
				getData(1); 
			}
			//导出excel 请求,并下载excel
			function getExpInfo(params){
				var config={
					url:'Policy/check_export',
					params:params,
					successFun:function(data){
						window.location.href=data.info.export_url; 
					}
				}
				asys.post(config);
			}
			function tableShowAfter(){
				if(paramConfig.name=='insOrderList'){//保险公司查看订单列表没有单元格点击事件
					return;
				}
				//表格中部分单元格事件绑定
				tabInfo.tabDom.find("td[name='company_name'],td[name='order_no'],td[name='product.code'],td[name='product.name']").css("cursor"," pointer").click(function(){//添加样式，并绑定事件
					if(fcodes.indexOf("show")==-1){//没有权限
						return;
					}
					var  rowData=$(this).closest("tr")[0].trData,html,config;
					if($(this).attr('name')=='company_name'){//查看商户
						html='<div id="scrollee" style="position: absolute;right: 0;bottom: 0;left: 0;top: 0; overflow:hidden;"><iframe   name="urlIframe" width="100%" type="text/html" height="100%" scrolling=yes frameBorder="0" src="businessDetial.html?type=show&id='+rowData.com_id+'&v='+version+'"></iframe></div>';
					}else if($(this).attr('name')=='order_no'){//查看订单
						html='<div id="scrollee" style="position: absolute;right: 0;bottom: 0;left: 0;top: 0; overflow:hidden;"><iframe   name="urlIframe" width="100%" type="text/html" height="100%" scrolling=yes frameBorder="0" src="orderDetial.html?id='+rowData.id+'&v='+version+'"></iframe></div>';
					}else{//查看产品
						html='<div id="scrollee" style="position: absolute;right: 0;bottom: 0;left: 0;top: 0; overflow:hidden;"><iframe   name="urlIframe" width="100%" type="text/html" height="100%" scrolling=yes frameBorder="0" src="productInfo.html?type=show&id='+rowData.product_id+'&order=1&v='+version+'"></iframe></div>';
					}
					config={
							html:html,
							isFull:true,//全屏
							isCancel:false,//不要取消按钮
							isConfirm:false//不要确认按钮
						}
					asys.showModalHtml(config);
				});
			}
			//权限列显示方法（根据获取到的权限列表判断和根据数据判断是否显示）
			function setOpname(power,data){
				var html="";
				html+= '<td class="operation">'
				$.each(power,function(k,v){
					if(fcodes.indexOf(v.fcode)>-1){
						if(v.fcode=='show'){
							html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
						}
					}
				});
				html+='</td>';
				return html;
			}
			//操作单元格点击事件
			function optionClick(){
				var self=this,config,
					opname=$(self).attr("opname"),//获取操作名称
				   rowData=$(self).closest("tr")[0].trData;//获取本次操作所在行的数据
				  var html='<div id="scrollee" style="position: absolute;right: 0;bottom: 0;left: 0;top: 0; overflow:hidden;"><iframe   name="urlIframe" width="100%" type="text/html" height="100%" scrolling=yes frameBorder="0" src="orderDetial.html?id='+rowData.id+'&v='+version+(paramConfig.name=='insOrderList'?'&isIns=1':'')+'"></iframe></div>';//iframe  html字符串拼接
				if(opname=="show"){ //单击查看按钮
					config={
						html:html,
						isFull:true,//全屏
						isCancel:false,//不要取消按钮
						isConfirm:false//不要确认按钮
					}
					asys.showModalHtml(config);
				}
			}
		},
		/*
			结算类型配置
				如果类型为自定义时，点击确认时会根据数据 加填入的天数判断下期账单时间等等
				如果类型为其它类型时，点击确认时会根据数据 算出下期账单时间
				trData:操作的列数据
				getData：请求数据的方法
		*/
		balTypeHtml:function(trData,getData){
			var html='<form class="form-horizontal">'
				+	'<div class="color_7" style="padding-bottom:20px"><div><label style="color:#000">结算类型说明：</label></div><div>1.产品推广或定制的申请提交之后，默认结算类型为实时，第一次按默认结算类型出账</div><div>2.结算类型为实时和月结时，按自然月每月1号出账</div>'	
				+	'<div><label style="color:#000">举例：</label></div><div><label style="color:#000">前置条件：</label>提交时间为11月1日，默认结算类型为实时<div><label style="color:#000">操作：</label>11月20日修改结算类型为自定义，账单周期为10天</div>'	
				+	'<div><label style="color:#000">结果：</label></div>'
				+	'<div style="color:#5173FD">第一次出账（实时）：</div>'
				+	'<div>1）账单周期为：11月24日—11月30日；</div>'
				+	'<div>2）出账日为：12月1日</div>'
				+	'<div style="color:#5173FD">第二次出账（自定义）：</div>'
				+	'<div>1）账单周期为：12月1日—12月10日；</div>'
				+	'<div>2）出账日为12月11日</div></div></div>'
				+	'<div class="form-group">'
				+		'<label for="type1" class="col-sm-3 control-label">'
				+				'<input type="radio" name="settle_type" id="type1" value="1" checked> 实时'
				+		'</label>'
				+		'<label for="type2" class="col-sm-3 control-label">'
				+				'<input type="radio" name="settle_type"  id="type2"  value="2"> 月结'
				+		'</label>'
				+		'<label for="type3" class="col-sm-3 control-label">'
				+				'<input type="radio" name="settle_type"  id="type3" value="3"> 自定义账期'
				+		'</label>'
				+	'</div>'
				+	'<div class="form-group cycle_box" hidden>'
				+		'<label for="settle_cycle" class="col-sm-3 control-label">账单周期</label>'
				+		'<div class="col-sm-7">'
				+			'<input type="text" class="form-control" id="settle_cycle"  name="settle_cycle" value="30" placeholder="请输入账单周期">'
				+		'</div>'
				+		'<label class="col-sm-2 control-label" style="text-align: left;">天</label>'
				+	'</div>'
				+'</form>',//结算类型的html
				product_id,//产品的ID
				settleInfo,//获取到的配置信息
				config={
					title:'结算类型',
					html:html,
					confirmFun:function(obj){
						var t = $(obj).find(".form-horizontal").serializeArray(),isErr=false,data={};
						$.each(t, function() {//组装数据
							data[this.name] = this.value; 
						});
						//验证数据，并且根据选择类型 组装确认弹框中的html字符串
						if(data.settle_type==3 && data.settle_cycle==''){
							asys.showAlert({title:'温馨提醒',msg:'请输入账单周期',isCancel:false})
							return;
						}else if(data.settle_type!=3){
							data.settle_cycle=''
							settle_html="<div class='color_7'>(生效后出账日期为每月1号)</div>"
						}else if(data.settle_type==3){
							var settle_date=new Date(settleInfo.settle_date),
								settle_date_end=new Date(settleInfo.settle_date);
							settle_date_end.setDate(settle_date_end.getDate()+parseInt(data.settle_cycle)-1);
							
							settle_html="<div class='color_7'><div>(生效后第一次账单周期为："+(settle_date.getMonth()+1)+'月'+settle_date.getDate()+'日'+'-'+(settle_date_end.getMonth()+1)+'月'+settle_date_end.getDate()+'日'+")</div><div>(生效后第一次出账时间为："+(settle_date_end.getMonth()+1)+'月'+(new Date(settle_date_end.setDate(settle_date_end.getDate()+1)).getDate())+'日'+")</div></div>"
						}
						//数据组装
						data.apply_id=trData.id;
						data.com_id=trData.com_id;
						data.product_id=product_id;
						config={
							title:'温馨提醒',
							msg:"<label>变更后的结算类型，将在下个账期生效</label>"+settle_html+"<label>是否修改结算类型</label>",
							confirmFun:function(){
								var config={
									url:'CompanyApply/settle_do',
									params:data,
									successFun:function(){
										getData();
										obj.modal('hide');
									}
								}
								setTimeout(function(){
									asys.post(config);
								},200)
								
							}
						}
						asys.showAlert(config)
						
					}
				};
			//获取产品ID，表格渲染时的机制问题，需要加入判断
			if(trData.isFirst){
				product_id=trData.products[0].id;
			}else{
				product_id=trData.layerData.id;
			}
			
			var modal=asys.showModalHtml(config);
			//html中按钮的事件绑定
			modal.find("input[name=settle_type]").click(function(){
				if(this.value==3){
					modal.find(".cycle_box").show();
				}else{
					modal.find(".cycle_box").hide();
				}
			});
			//输入天数的数值是否正确
			modal.find("input[name=cycle]").on("input",function(){
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
			modal.find("input[name=cycle]").change(function(){
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
				if(value.indexOf(".")){
					$(this).val(parseFloat(value).toFixed(0));	
				}			
			});
			//获取之前配置参数，并勾选信息，输入框中填入信息
			var config={
				url:'CompanyApply/settle_info',
				params:{
					apply_id:trData.id,
					com_id:trData.com_id,
					product_id:product_id,
				},
				successFun:function(data){
					settleInfo=data.info;
					var settle=data.info.settle;
					if(settle.type){
						modal.find("input[name=settle_type][value="+settle.type+"]").click();
					}
					if(settle.cycle){
						modal.find("input[name=settle_cycle]").val(settle.cycle);
					}
				},
				statusErrorFun:function(){
					modal.modal('hide');
				},
				errorFun:function(){
					modal.modal('hide');
				}
			}
			asys.post(config);	
		},
		/*
			费率结算
				trData:操作的列数据
				getData：请求数据的方法（刷新）
		*/
		rateAlocHtml:function(trData,getData){
			var product_id,
				html='<form class="form-horizontal rate_aloc">'+OPEN.rate_html+'</form>'
				config={
					title:'结算费率',
					html:html,
					confirmFun:function(obj){//确认配置按钮点击后运行方法
						var t = $(obj).find(".form-horizontal").serializeArray(),isErr=false,data={};
						$.each(t, function() {//组装数据并判断是否有空数据
							 if(parseFloat(this.value)>=0){
								 data[this.name] = this.value; 
							 }else{
								isErr=true; 
								return; 
							 }
						});
						//特殊情况下数值获取（被禁用时上面方法可能获取不到）
						data.fwf_insurer_val=obj.find("input[name=fwf_insurer_val]").val();
						data.fwf_ins_val=obj.find("input[name=fwf_ins_val]").val();
						data.plat_val=obj.find("input[name=plat_val]").val();
						
						if(data.xsf_prem_set_type==1){//结算模式是仅通过经纪公司结算，数值是否有空判断
							data.xsf_tax_type=data.jjf_xsf_tax_type;
							if(data.jjf_val && data.tdf_val && data.fwf_ins_val && data.tgf_ins_val && data.tgf_plat_val && data.qdf_val && data.plat_val){
								
							}else{
								asys.showAlert({title:'温馨提醒',msg:'请完善配置信息',isCancel:false})
								return;
							}
						}else if(isErr){//数值是否有空判断
							asys.showAlert({title:'温馨提醒',msg:'请完善配置信息',isCancel:false})
							return;
						}
						delete data.jjf_xsf_tax_type;
						/*比例自动计算的个个费用 数值如果有误则代表配置有问题，弹框提醒*/
						if(parseFloat(data.plat_val)<0 || data.plat_val==''){
							asys.showAlert({title:'温馨提醒',msg:'平台结算配置有误',isCancel:false})
							return;
						}
						if(parseFloat(data.fwf_ins_val)<0 || data.fwf_ins_val==''){
							asys.showAlert({title:'温馨提醒',msg:'经纪公司结算配置有误',isCancel:false})
							return;
						}
						if(data.xsf_prem_set_type==2 &&(parseFloat(data.fwf_insurer_val)<0  || data.fwf_insurer_val=='')){
							asys.showAlert({title:'温馨提醒',msg:'保险公司结算配置有误',isCancel:false})
							return;
						}
						//请求数据的添加
						data.apply_id=trData.id;
						data.com_id=trData.com_id;
						data.product_id=product_id;
						config={
							title:'温馨提醒',
							msg:"您确认修改该产品费率？",
							confirmFun:function(){
								var config={
									url:'CompanyApply/rate_do',
									params:data,
									successFun:function(){
										getData();
										obj.modal('hide');
									}
								}
								setTimeout(function(){
									asys.post(config);
								},200)
								
							}
						}
						asys.showAlert(config)
						
					}
				};
			//获取产品ID，表格渲染时的机制问题，需要加入该判断
			if(trData.isFirst){
				product_id=trData.products[0].id;
			}else{
				product_id=trData.layerData.id;
			}
			
			var modal=asys.showModalHtml(config);
			//html数据联动以及输入数据判断等等方法
			rateInput(modal);
			//获取费率配置，并渲染到html中
			getpdtInfo(modal,trData.id,trData.com_id,product_id);
		},
		/*
			订单导出
				如果有勾选则导出勾选的类容
				如果没有勾选则弹出时间选择区间
				type:导出方式（1-选中账单导出 2-根据时间导出；可为空,默认为1 ）
				ids：如果勾选的id
		*/
		export_xls:function(type,ids){
				if(ids.length>0){
					asys.showAlert({title:'温馨提醒',msg:'确认导出所选订单？',confirmFun:function(){
						setTimeout(function(){
							getExpInfo({type:1,ids:ids.toString(),bill_type:type});
						},200);
					}});
				}else{						
					var html='<form class="form-inline text_center">'
						+		'<div>温馨提醒：单次导出数据最多不超过一万条</div>'
						+		'<div class="form-group" style="margin: 10px 0;">'
						+		'</div>'
						+        '<div class="form-group">'
						+                '<select name="time_type"  class="form-control">'
						+						'<option value="1">出单时间</option>'
						+						'<option value="2">保险起期</option>'
						+						'<option value="3">下单时间</option>'
						+                '</select>'
						+          '<input type="text" class="form-control" name="time_start" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" placeholder="开始时间">-<input type="text" class="form-control" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" name="time_end" placeholder="截止时间">'
						+        '</div>'
						+			'</div>'
						+		'</div>'
						+	'</form>';
					config={
						title:'订单导出',
						html:html,
						confirmFun:function(obj){
							var t = $(obj).find(".form-inline").serializeArray(),isErr=false,data={};
							$.each(t, function() {
								 if(this.value){
									 data[this.name] = this.value; 
								 }else{
									isErr=true; 
									return; 
								 }
							});
							if(!data.time_start){
								asys.showAlert({title:'温馨提醒',msg:'请选择导出开始时间',isCancel:false})
								return;
							}
							data.type=2;
							data.time_type=2;
							data.bill_type=type;
							getExpInfo(data);						
							
						}
					}
					var modal=asys.showModalHtml(config);
					var date=new Date();
					modal.find("input[name='time_end']").val(date.getFullYear()+"-"+(date.getMonth()+1)+'-'+date.getDate());
					asys.datePicker(modal.find("input[name='time_start']"),{
						endDate: new Date(),
						initialDate:new Date()
					});
					asys.datePicker(modal.find("input[name='time_end']"),{
						endDate: new Date(),
						initialDate:new Date()
					});
				}
			//导出请求方法
			function getExpInfo(params){
				var config={
					url:'Bill/check_export',
					params:params,
					successFun:function(data){
						window.location.href=data.info.export_url; 
					}
				}
				asys.post(config);
			}
		},
	
		//商户等级文字转换
		getLevelText:function(level){
			if(level==1){
				return '普通商户';
			}else{
				return 'VIP商户'
			}
		},
		//商户认证状态文字转换
		getCertStatusText:function(status){
			if(status==1){
				return '待认证';
			}else if(status==2){
				return '资料填写中'
			}else if(status==3){
				return '待审核'
			}else if(status==4){
				return '审核通过'
			}else if(status==5){
				return '已驳回'
			}else if(status==6){
				return '重新认证'
			}
		},
		/*
			根据父级权限获取权限
				fcode：父的fcode
				successFun: 获取成功后运行的方法
		*/
		getPowerMenu:function(fcode,successFun){
			var config={
				url:'Permissions/right_menu',
				params:{
					fcode:fcode
				},
				successFun:successFun
			}
			asys.post(config);
		},
	/*
		页面搜索栏添加，权限请求，表格数据请求，并渲染表格，分页等
		pageConfig:
			tabInfo:tab页面的信息：包括tab的dom，表格dom
			paramConfig：表格的配置项,
			search_checkstate：搜索栏的html
			setOpname：操作单元格按钮的显示
			optionClick：操作单元格按钮的点击方法。
			trDblClick：双击tr行时运行的方法，
			setSearchPower: 搜索区域内权限设置方法
			checkVlaue:是否有复选框列
			postData：除了搜索条件，limt，page以外的其他post字段
			tableShowAfter:表格数据渲染完成后运行的方法
		return 返回 getData:请求数据的方法
	*/
	initPage:function(pageConfig){
		//请求数据
		var getData=(function(){
			var params={};
			params.limit=OPEN.limit;// 获取配置中每页最大数据个数
			params.page=1;
			params=$.extend(params,pageConfig.postData);//合并参数
			function getData(params){
				//请求成功后运行方法
				function successFun(data){
					var tableContent=data.info;
					//填表格中渲染数据
					asys.tableCont({
						tableDom:pageConfig.tabInfo.tableDom,//表格dom
						data:tableContent,//请求到的·表格数据
						paramConfig:pageConfig.paramConfig,//表格配置项
						optionClick:pageConfig.optionClick,//点击中按钮的点击事件
						setOpname:pageConfig.setOpname,//操作列按钮渲染
						trDblClick:pageConfig.trDblClick,//双击tr行时运行的方法，
						checkVlaue:pageConfig.checkVlaue,//复选框绑定的value 中 tableContent对应的属性名称
					});
					//添加分页
					asys.pagination({dom:pageConfig.tabInfo.tabDom.find(".fixed_table_container"),page:params.page,count:data.url,limit:OPEN.limit,
					getDataFun:function(page){//该方法为分页栏按钮点击事件请求方法
						params.page=page
						getData(params);//请求数据
					}});
					pageConfig.tabInfo.tabDom[0].table_data=tableContent; //数据绑定	
					//页面渲染完成后是否有方法需要运行
					if(pageConfig.tableShowAfter){
						pageConfig.tableShowAfter();
					}
				}
				//配置请求参数
				var config={
					url:pageConfig.paramConfig.url,
					params:params,
					successFun:successFun
				}
				asys.post(config);//请求数据
			}
			//抛出去数据请求的方法
			function refresh(p,param){
				var data=params;
				if(param){
					var data=param;
					data=$.extend(data,pageConfig.postData);
					data.limit=OPEN.limit;
				}
				if(p){
					data.page=p
				}
				getData(data);
			}
			return refresh;
		}());
		pageConfig.tabInfo.tableDom[0].getDataFun=getData;
		//添加搜索栏
		asys.addSearch(pageConfig.tabInfo.tabDom,pageConfig.search_checkstate,getData);
		//时间选择控件初始化
		var today=new Date(),
			end_date=pageConfig.tabInfo.tabDom.find("input.end_date"),
			start_date=pageConfig.tabInfo.tabDom.find("input.start_date");
		today.setMonth(today.getMonth()-1);
		if(start_date.length){//判断是否有开始时间输入框，有则初始化时间控件
			asys.datePicker(pageConfig.tabInfo.tabDom.find("input.start_date"),{
				endDate: new Date(),
				initialDate:today
			});
		}
		if(end_date.length){//判断是否有结束时间输入框，有则初始化时间控件
			asys.datePicker(pageConfig.tabInfo.tabDom.find("input.end_date"),{
				endDate: new Date(),
				initialDate:new Date()
			});
		}
		//获取改页面中fcode，用于请求操作权限（按钮权限）
		var fcode=$("a[href='#"+pageConfig.tabInfo.tabDom.attr("id")+"']").data("fcode");
		OPEN.getPowerMenu(fcode,pageConfig.setSearchPower);
		return getData;
	},
	/*
		结算页面统一渲染方法
			tabInfo:tab页面的信息：包括tab的dom，表格dom
			paramConfig：表格的配置项,
			searchHtml：搜索栏的html
			type	（1-保险公司（经纪公司）收入 2-保险公司(经纪公司)支出 3-保险公司(平台)支出 4-保险公司(商户)支出  5-经纪公司收入 6-经纪公司(商户)支出 
	7-经纪公司(平台)支出  8-平台（保险公司）收入  9-平台（经纪公司）收入  10-平台(商户)支出 
	11-平台(销售渠道)支出  12-销售渠道支出 13-经纪公司(保险公司)支出  14-保险公司（商户）收入）
			detailed_fcode：详情页面权限fcode,
			balance_type: 收入或者支出， in：收入 exp：支出
		
	*/
	balancePage:function(tabInfo,searchHtml,paramConfig,type,detailed_fcode,balance_type){
		var pageConfig={
				tabInfo:tabInfo,//dom信息对象
				paramConfig:paramConfig,//表格的配置
				search_checkstate:searchHtml,//筛选栏html
				setSearchPower:setSearchPower,//权限请求成功后执行方法
				optionClick:optionClick,//可点击标签的点击事件（operation Css下的a标签点击事件）
				setOpname:setOpname,//权限列显示方法（有权限判断和根据数据判断是否显示等）
				postData:{type:type},//除了搜索条件，limt，page以外的其他post字段
				checkVlaue:'id'//复选框绑定的value 对应获取到的数据的参数名称
			},
			fcodes=[],
			getData=OPEN.initPage(pageConfig);//初始化页面
		//权限请求成功后执行方法
		function setSearchPower(data){
			$.each(data.info,function(){
				var fcode=this.fcode.split("_")[1];
				fcodes.push(fcode);
				if(fcode=='query'){
					tabInfo.tabDom.find(".search_box").show();
				}else if(fcode=='export'){
					tabInfo.tabDom.find("button[name='export']").show();
				}
			});
			getData(1); 
		}
		//导出按钮
		tabInfo.tabDom.find("button[name='export']").click(function(){
			var ids=[];
			//获取被勾选的复选框
			$.each(tabInfo.tableDom.find("input[name = btSelect]:checked"),function(){
				var data=$(this).closest("tr")[0].trData;
				ids.push(data.id);
			});
		   OPEN.export_xls(type,ids);
		});
		/*
			操作权限设置
				根据数据来判断是否显示
		*/
		function setOpname(power,data,isPowers,trData){
			var status;
			//获取该条数据中状态值
			if(trData){
				if(trData.id){
					status=trData.status;
				}else if(trData.bill_lists){
					status=trData.bill_lists[0].status;
				}else if(trData.company){
					status=trData.company[0].bill_lists[0].status;
				}
			}else{
				if(data.id){
					status=data.status;
				}else if(data.bill_lists){
					status=data.bill_lists[0].status;
				}else if(data.company){
					status=data.company[0].bill_lists[0].status;
				}
			}
			var html="";
			html+= '<td class="operation">'
			if(balance_type=='in'){//收入的操作按钮渲染
				$.each(power,function(k,v){
					if(fcodes.indexOf(v.fcode)>-1){
						if(v.fcode=='detailed'){
							html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
						}else if(v.fcode=='confirmRec' && status==1){
							html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
						}else if(v.fcode=='confirmRec'){
							html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
						}else if(v.fcode=='Bill' && status==2){
							html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
						}else if(v.fcode=='Bill'){
							html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
						}else if(v.fcode=='receivMoney' && status==5){
							html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
						}else if(v.fcode=='receivMoney'){
							html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
						}
					}
				});
			}else if(balance_type=='exp'){//支出的操作按钮渲染
				$.each(power,function(k,v){
					if(fcodes.indexOf(v.fcode)>-1){
						if(v.fcode=='detailed'){
							html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
						}else if(v.fcode=='confirmRec' && status==1){
							html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
						}else if(v.fcode=='confirmRec'){
							html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
						}else if(v.fcode=='invoice' && status==3){
							html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
						}else if(v.fcode=='invoice'){
							html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
						}else if(v.fcode=='confirmReceipt' && status==3){
							html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
						}else if(v.fcode=='confirmReceipt'){
							html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
						}else if(v.fcode=='confirmMoney' && status==4){
							html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
						}else if(v.fcode=='confirmMoney'){
							html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
						}
					}
				});
			}
			html+='</td>';
			return html;
		}
		//操作单元格点击事件
		function optionClick(){
			var self=this,config,
				opname=$(self).attr("opname"),
				rowData=$(self).closest("tr")[0].trData;
			if(balance_type=='in'){//收入的操作按钮点击事件
				if(opname=='detailed'){
					OPEN.showDetailed(type,detailed_fcode,rowData);
				}else if(opname=='confirmRec'){
					OPEN.showAccount(type,1,rowData,getData);
				}else if(opname=="Bill"){
					OPEN.showInvo(type,rowData.id,getData)
				}else if(opname=="receivMoney"){
					OPEN.showAccount(type,3,rowData,getData)
				}
			}else if(balance_type=='exp'){//支出的操作按钮点击事件
				if(opname=='detailed'){
					OPEN.showDetailed(type,detailed_fcode,rowData);
				}else if(opname=='confirmRec'){
					OPEN.showAccount(type,1,rowData,getData);
				}else if(opname=='invoice'){
					OPEN.showInvoInfo(type,rowData.id,false,getData);
				}else if(opname=='confirmReceipt'){
					OPEN.showInvoInfo(type,rowData.id,true,getData);
				}else if(opname=='confirmMoney'){
					OPEN.showAccount(type,3,rowData,getData);
				}
			}
		}
	}
}
	/*
		获取左侧菜单类容从而渲染左侧菜单样式
		url:请求数据的url
	*/
	function getChsild(data){
		asys.post({
			url:'Permissions/left_menu',
			params:{
				fcode:data
			},
			successFun:function(data){
				if(data.status){
					$(".nav_left").html("")//清空之前渲染数据 
					setIcon(data.info);//渲染右侧菜单
					getPend();
				}    
			}
		});
		//获取气泡信息
		function getPend(){
			asys.post({
				url:'Company/pend_num',
				params:{},
				successFun:function(data){
					if(data.status){
						//商户列表气泡
						if(data.info.com_cert_num>0){
							$("[data-fcode=companyList] .badge").css("display","inline-block").text("+"+data.info.com_cert_num);
						}else{
							$("[data-fcode=companyList] .badge").hide()
						}
						//商户意向单
						if(data.info.apply_follow_num>0){
							$("[data-fcode=companyWill] .badge").css("display","inline-block").text("+"+data.info.apply_follow_num);
						}else{
							$("[data-fcode=companyWill] .badge").hide()
						}
						//产品定制
						if(data.info.apply_sign_num>0){
							$("[data-fcode=productMade] .badge").css("display","inline-block").text("+"+data.info.apply_sign_num);
						}else{
							$("[data-fcode=productMade] .badge").hide()
						}
					}    
				}
			});
		}
		
		
		//左侧菜单绑定事件
		function leftNavBind(){
			var nav_left=$(".nav_left");
			//解绑之前绑定的方法
			nav_left.find(".select").unbind();
			//下拉选择框 点击事件绑定，判断是否打开，如果打开了则隐藏选择项，如果没有打开则显示选择项
			nav_left.find(".select").click(function(){
				if(!this.isCheck){
					$(this).addClass("selectOpen");
					$(this).parent().find(".option").show();
					this.isCheck=true;
				}else{
					this.isCheck=false;
					$(this).removeClass("selectOpen");
					$(this).parent().find(".option").hide();
				}
				
			});
			//解绑之前绑定的方法
			nav_left.find(".select_box .option li").unbind();
			//下拉选择项 点击事件绑定
			nav_left.find(".select_box .option li").click(function(){
				$(".nav_left .select_box li.on").removeClass("on");
				$(this).addClass("on");
				nav_left.find(".selectInfo").html("");
				var html=setNav(this.tree);
				nav_left.find(".selectInfo").html(html);
				nav_left.find(".select").html($(this).text());
				leftNavBind();
				nav_left.find(".select").click();
			});
			//点击根据条件判断是否展开还是收起,需要将该条延迟到最后执行否则会出问题
			setTimeout(function(){
				nav_left.find(".dropDown").click(function(){
					if(!this.isCheck){
						$(this).addClass("selectOpen");
						$(this).parent().find(".option").show();
						this.isCheck=true;
					}else{
						this.isCheck=false;
						$(this).removeClass("selectOpen");
						$(this).parent().find(".option").hide();
					}
				});
			},0);
			//解绑之前绑定的方法
			nav_left.find("[data-funname]").unbind();
			//有funname 方法的点击事件绑定
			nav_left.find("[data-funname]").click(function(){
				var funname=$(this).data("funname"),
					title=$(this).data("title"),
					fcode=$(this).data("fcode");
				if(funname){
					asys.setTabActve(fcode,funname,title);
				}
			});
		}
		/*
			渲染第一层（默认第一级一定是图标），将fcode title funname数据渲染到html中，如果focode是：statemManage做特殊处理，其他情况根据type做处理,
			因为 statemManage的特殊是下拉选择项故需要渲染下拉中的选择项；
			渲染完成后 需要给statemManage  选项绑定数据留待选择后重新渲染下一级的类容
				data: 权限数据；
		
		*/
		function setIcon(data){
			$.each(data,function(){
				var html='<div class="leftNavBox"><div class="title" data-fcode="'+this.fcode+'" data-funname="'+(this.funname?this.funname:'')+'" data-title="'+this.title+'" style="'+(this.funname?'cursor: pointer;':'')+'"><img src="./images/'+this.fcode+'.png">'+this.title+' <span class="badge" hidden></span></div>';
				if(this.tree && this.fcode=='statemManage'){
					html+=setSelect(this.tree);//渲染下拉选择项
				}else{
					html+=setNav(this.tree);//渲染下级菜单
				}
				html+='</div>'
				$(".nav_left").append(html);
				var tree=this.tree;
				if(this.tree && this.fcode=='statemManage'){
					$.each($(".nav_left .select_box li"),function(i){
						this.tree=tree[i].tree;
					});
					$(".nav_left .select_box li:first").addClass("on");//默认选择样式添加
				}
			});
			leftNavBind();//给右侧导航绑定事件
		}
		/*
			渲染下拉选择数据，
				data: 权限数据；
			return返回 html标签字符串；
		*/
		function setSelect(data){
			var html='<div class="select_box">'
					+	'<div class="select">'+data[0].title+'</div>'
					+	'<div class="option">';
			$.each(data,function(){
					html+='<li>'+this.title+'</li>';
			});
			html+='</div></div><div class="selectInfo">';
			html+=setNav(data[0].tree);
			html+='</div>'
			return html;
		}
		/*
			渲染除了第一条和下拉条类型以外的所有节点
			根据type渲染不同展示效果的html
			将fcode title funname数据渲染到html中
			
			
				data: 权限数据；
			return返回 html标签字符串；
		*/
		function setNav(data){
			var html='';
			$.each(data,function(){
				if(this.type=='dropDown'){
					html+='<div class="dropDown_box">'
						+	'<div class="dropDown" data-fcode="'+this.fcode+'" data-title="'+this.title+'"  data-funname="'+(this.funname?this.funname:'')+'">'
						+		this.title
						+	'</div>'
						+	'<div class="option">'
						+		setNav(this.tree)
						+	'</div>'
						+'</div>';
				}else if(this.type=='option'){
					html+='<li data-fcode="'+this.fcode+'" data-title="'+this.title+'"  data-funname="'+(this.funname?this.funname:'')+'">'+this.title+' <span class="badge" hidden></span></li>'
				}else{
					html+='<div class="default" data-fcode="'+this.fcode+'" data-title="'+this.title+'"  data-funname="'+(this.funname?this.funname:'')+'">'+this.title+' <span class="badge" hidden></span></div>';
				}
			});
			return html;
		}
		
	
	}
	
	/*
		每个左侧标签的点击调用函数（函数名在权限里面进行了配置）
			tabInfo
				tabInfo.tabDom：tab标签页面dom
				tabInfo.tableDom ：标签页面中表格的dom，如果是数组代表俩个个表格
	*/

	/*
		点击商户列表的调用方法
	*/
    function companyList(tabInfo){
			/*添加筛选栏*/
		var search_checkstate= '<div class="search-checkstate">'
						+    '<div class="search_box" hidden>'
						+          '<form class="form-inline">'
						+        '<div class="form-group">'
						+          '<label for="cert_status">企业认证状态</label>'
						+           '<select name="cert_status" id="" class="form-control">'
						+             '<option value="">全部</option>'
						+             '<option value="1">待认证</option>'
						+             '<option value="2">资料填写中</option>'
						+             '<option value="3">待审核</option>'
						+             '<option value="4">审核通过</option>'
						+             '<option value="5">已驳回</option>'
						+           '</select>'
						+        '</div>'
						+            '<div class="form-group">'
						+              '<label for="sign_time">注册时间</label>'
						+              '<input type="text" class="form-control start_date" name="create_start" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" id="sign_time_start" placeholder="" readonly>-<input type="text" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd"  name="create_end"  class="form-control end_date" id="sign_time_end" placeholder="" readonly>'
						+            '</div>'
						+           '<div class="form-group">'
						+              '<input type="text" name="keyword" class="form-control" id="businessName" style="width:175px!important;" placeholder=" 登录邮箱、商户名称">'
						+            '</div>'
						+            '<label class="btn btn-primary">查询</label>'
						+			   '<label class="btn btn-default">重置</label>'
						+          '</form>'
						+    '</div>'
						+ '</div>',
						pageConfig={
							tabInfo:tabInfo,//dom信息对象
							paramConfig:OPEN.companyList,//表格的配置
							search_checkstate:search_checkstate,//筛选栏html
							setSearchPower:setSearchPower,//权限请求成功后调用的方法
							optionClick:optionClick,//可点击标签的点击事件（operation Css下的a标签点击事件）
							setOpname:setOpname,//权限列显示方法（有权限判断和根据数据判断是否显示等）
							trDblClick:trDblClick//表格行的双击事件
						},
						fcodes=[],
						getData=OPEN.initPage(pageConfig);//初始化页面
		
		//获取按钮权限，并判断是否有查询权限如果有则显示筛选栏，然后请求数据，渲染表格
		function setSearchPower(data){
			$.each(data.info,function(){
				var fcode=this.fcode.split("_")[1];
				fcodes.push(fcode);
				if(fcode=='query'){
					tabInfo.tabDom.find(".search_box").show();
				}
			})
			getData(1); 
		}
		//操作权限配置方法根据配置参数中权限和获取到的权限匹配再根据数据隐藏或者显示按钮
		function setOpname(power,data){
			var html="";
			html+= '<td class="operation">'
			$.each(power,function(k,v){
				if(fcodes.indexOf(v.fcode)>-1){
					var hideHtml;
					if(v.fcode=='edit'){
						hideHtml='';
					}else if(v.fcode=='disabled' && data.status==1){
						hideHtml='';
					}else if(v.fcode=='disabled'){
						hideHtml='hidden';
					}else if(v.fcode=='enabled'  && data.status==0){
						hideHtml=''
					}else if(v.fcode=='enabled'){
						hideHtml='hidden';
					}else if(v.fcode=='becomeVIP' && data.cert_status==4 &&data.status==1 && data.level==1){
						hideHtml='';
					}else if(v.fcode=='becomeVIP'){
						hideHtml='hidden';
					}
					if(hideHtml!=undefined){
						html+= '<div><a opname="'+v.fcode+'" '+hideHtml+'>'+v.title+'</a></div>'
					}
				}
			});
			html+='</td>';
			//改变操作列的 列宽
			tabInfo.tableDom.find("th:last").css("width",'90px');
			tabInfo.tableDom.find("th:last div").css("width",'90px');
			return html;
		}
		//tr双击事件（打开商户详情，使用iframe打开）
		function trDblClick(){
			if(fcodes.indexOf("show")==-1){//判断有没有权限
				return;
			}
			var  rowData=$(this)[0].trData,
				config,
				html='<div id="scrollee" style="position: absolute;right: 0;bottom: 0;left: 0;top: 0; overflow:hidden;"><iframe name="urlIframe" width="100%" type="text/html" height="100%" scrolling=yes frameBorder="0" src="businessDetial.html?type=show&id='+rowData.id+'&v='+version+'"></iframe></div>';//拼接html
			config={
				html:html,
				isFull:true,//满屏
				isCancel:false,//不要取消按钮
				isConfirm:false//不要确认按钮
			}
			asys.showModalHtml(config);
		}
		//操作单元格点击事件
		function optionClick(){
			var self=this,config,
				opname=$(self).attr("opname"),
			   rowData=$(self).closest("tr")[0].trData;
			if(opname=="edit"){ //单击编辑时
			  var html='<div id="scrollee" style="position: absolute;right: 0;bottom: 0;left: 0;top: 0; overflow:hidden;"><iframe   name="urlIframe" width="100%" type="text/html" height="100%" scrolling=yes frameBorder="0"  src="businessDetial.html?type=edit&id='+rowData.id+'&v='+version+'"></iframe></div>';//拼接html
				config={
					html:html,
					isFull:true,//满屏
					isCancel:false,//不要取消按钮
					isConfirm:false,//不要取消按钮
					hideFun:function(){//关闭后运行的方法
						getData();
					}
				}
			}else if(opname=="disabled"){ // 单击禁用时
				config={
						title:'温馨提醒',
						html:"您确认禁用该公司吗？",
						confirmFun:function(obj){
							var config={
								url:'Company/status_do',
								params:{
									id:rowData.id,
									type:1,
								},
								successFun:function(){
									//禁用成功后显示改变，
									$($(self).closest("tr").find("td")[9]).html("禁用");
									$(self).hide();
									$(self).parent().parent().find("a[opname='enabled']").show();
									$(self).parent().parent().find("a[opname='becomeVIP']").hide();
									obj.modal('hide');
								}
							}
							asys.post(config);
						}
					}
			}else if(opname=="enabled"){//解除禁用
				config={
					title:'温馨提醒',
					html:"您确认解除该公司的禁用吗？",
					confirmFun:function(obj){
						var config={
							url:'Company/status_do',
							params:{
								id:rowData.id,
								type:2,
							},
							successFun:function(){
								//解除禁用成功后显示改变
								$($(self).closest("tr").find("td")[9]).html("正常");
								$(self).hide();
								$(self).parent().parent().find("a[opname='disabled']").show();
								if(rowData.cert_status==4 &&rowData.status==1 && rowData.level==1){
									$(self).parent().parent().find("a[opname='becomeVIP']").show();
								}
								obj.modal('hide');
							}
						}
						asys.post(config);
					}
				}
			}else if(opname='becomeVIP'){//设置vip
				config={
					title:'VIP商户可配置专享费率',
					html:"确认将该商户设为VIP商户？",
					confirmFun:function(obj){
						var config={
							url:'Company/status_do',
							params:{
								id:rowData.id,
								type:3,
							},
							successFun:function(){
								//设置成功后显示类容改变
								$($(self).closest("tr").find("td")[8]).html("VIP商户");
								$(self).remove();
								obj.modal('hide');
							}
						}
						asys.post(config);
					}
				}
				
			}
			if(config){
				asys.showModalHtml(config);
			}
		}
    }
    /*点击产品推广的调用方法*/
    function  companyExpand(tabInfo){
		/*添加筛选栏*/
		var search_checkstate= '<div class="search-checkstate">'
					   +    '<div class="search_box" hidden>'
					   +        '<form class="form-inline">'
					   +            '<div class="form-group">'
					   +              '<label for="sub_time">提交时间</label>'
					   +              '<input type="text" class="form-control start_date" name="start_date" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" placeholder="">-<input type="text" class="form-control end_date" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" name="end_date" placeholder="">'
					   +            '</div>'
					   +           '<div class="form-group">'
					   +              '<input type="text" class="form-control" id="product_val" name="product_val"  style="width:145px!important;" placeholder="产品编号、产品名称">'
					   +            '</div>'
					   +           '<div class="form-group">'
					   +              '<input type="text" class="form-control" name="company_val"  placeholder="商户名称">'
					   +            '</div>'
					   +            '<label class="btn btn-primary">查询</label>'
					   +			'<label class="btn btn-default">重置</label>'
					   +        '</form>'
					   +    '</div>'
					   + '</div>',
			pageConfig={
				tabInfo:tabInfo,//dom信息对象
				paramConfig:OPEN.companyExpand,//表格的配置
				search_checkstate:search_checkstate,//筛选栏html
				setSearchPower:setSearchPower,//权限请求成功后执行方法
				optionClick:optionClick,//可点击标签的点击事件（operation Css下的a标签点击事件）
				setOpname:setOpname,//权限列显示方法（有权限判断和根据数据判断是否显示等）
				postData:{type:1,apply_type:1}//请求数据时需要的参数（以后每次都会带）
			},
			fcodes=[],
			getData=OPEN.initPage(pageConfig);//初始化页面
		//权限请求成功后执行方法 判断是否有查询权限来 筛选栏
		function setSearchPower(data){
			$.each(data.info,function(){
				var fcode=this.fcode.split("_")[1];
				fcodes.push(fcode);
				if(fcode=='query'){
					tabInfo.tabDom.find(".search_box").show();
				}
			})
			getData(1); 
		}
		//操作列按钮渲染
		function setOpname(power,data){
			var html="";
			html+= '<td class="operation">'
			$.each(power,function(k,v){
				if(fcodes.indexOf(v.fcode)>-1){
					if(v.fcode!='query'){
						html+= '<div><a opname="'+v.fcode+'">'+v.title+'</a></div>'
					}
				}
			});
			html+='</td>';
			return html;
		}
		//操作单元格点击事件
		function optionClick(){
			var self=this,config,
				opname=$(self).attr("opname"),//获取操作方法
				//获取数据
			    rowData=$(self).closest("tr")[0].trData;
			    rowData.isFirst=$(self).closest("tr")[0].isFirst;	
				rowData.layerData=$(self).closest("tr")[0].layerData;
			if(opname=="balType"){//结算类型配置
				OPEN.balTypeHtml(rowData,getData);
			}else{//费率结算配置
				if(rowData.company.level==1){
					config={
						title:'温馨提醒',
						html:"如需配置专享费率，请前往商户列表将该商户设为VIP商户",
						isCancel:false
					}
					asys.showModalHtml(config);
				}else{
					OPEN.rateAlocHtml(rowData,getData);
				}	
			}
		}
	}
    /*点击产品推广的调用方法*/
    function  companyWill(tabInfo){
		/*添加筛选栏*/
		var search_checkstate= '<div class="search-checkstate">'
					   +    '<div class="search_box" hidden>'
					   +        '<form class="form-inline">'
					   +              '<div class="form-group">'
					   +                '<label for="follow_status">跟进状态</label>'
					   +                '<select name="follow_status" id="follow_status" class="form-control">'
					   +					'<option value="">全部</option>'
					   +					'<option value="1">未跟进</option>'
					   +					'<option value="2">跟进中</option>'
					   +					'<option value="3">已通过</option>'
					   +					'<option value="4">已关闭</option>'
					   +                '</select>'
					   +              '</div>'
					   +            '<div class="form-group">'
					   +              '<label for="sub_time">提交时间</label>'
					   +              '<input type="text" class="form-control start_date" name="start_date" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" placeholder="">-<input type="text" class="form-control end_date" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" name="end_date" placeholder="">'
					   +            '</div>'
					   +           '<div class="form-group">'
					   +              '<input type="text" class="form-control" id="product_val" name="product_val"  style="width:145px!important;" placeholder="产品编号、产品名称">'
					   +            '</div>'
					   +           '<div class="form-group">'
					   +              '<input type="text" class="form-control" name="company_val" placeholder="商户名称">'
					   +            '</div>'
					   +            '<label class="btn btn-primary">查询</label>'
					   +			'<label class="btn btn-default">重置</label>'
					   +        '</form>'
					   +    '</div>'
					   + '</div>',
			pageConfig={
				tabInfo:tabInfo,//dom信息对象
				paramConfig:OPEN.companyWill,//表格的配置
				search_checkstate:search_checkstate,//筛选栏html
				setSearchPower:setSearchPower,//权限请求成功后执行方法
				optionClick:optionClick,//可点击标签的点击事件（operation Css下的a标签点击事件）
				setOpname:setOpname,//权限列显示方法（有权限判断和根据数据判断是否显示等）
				postData:{type:1,apply_type:2}//请求数据时需要的参数（以后每次都会带）
			},
			fcodes=[],
			getData=OPEN.initPage(pageConfig);//初始化页面
		//权限请求成功后执行方法 判断是否有查询权限来 筛选栏
		function setSearchPower(data){
			$.each(data.info,function(){
				var fcode=this.fcode.split("_")[1];
				fcodes.push(fcode);
				if(fcode=='query'){
					tabInfo.tabDom.find(".search_box").show();
				}
			})
			getData(1); 
		}
		//操作列按钮渲染
		function setOpname(power,data,isPowers,trData){
			var html="";
			if(trData){
				is_api=trData.is_api;
			}else{
				is_api=data.products[0].is_api;
			}
			html+= '<td class="operation">'
			$.each(power,function(k,v){
				if(fcodes.indexOf(v.fcode)>-1){
					var hideHtml;
					if(v.fcode=='follow' && (data.follow_status==1||data.follow_status==2)){//跟进状态在 未跟进和跟进中时显示
						hideHtml='';
					}else if(v.fcode=='follow'){
						hideHtml='hidden';
					}else if(v.fcode=='log' && data.follow_status!=1){//查看根据日志 只要不是跟进状态都显示
						hideHtml='';
					}else if(v.fcode=='log'){
						hideHtml='hidden';
					}else if(v.fcode=='solve' && data.follow_status==2 && is_api==1){//已解决 跟进中并且产品已对接可显示
						hideHtml='';
					}else if(v.fcode=='solve'){
						hideHtml='hidden';
					}else if(v.fcode=='close' && data.follow_status==2 && is_api==0){//已解决 跟进中并且产品未对接可显示
						hideHtml='';
					}else if(v.fcode=='close'){
						hideHtml='hidden';
					}
					if(hideHtml!=undefined){
						html+= '<div><a opname="'+v.fcode+'" '+hideHtml+'>'+v.title+'</a></div>'
					}
				}
			});
			html+='</td>';
			return html;
		}
		//操作单元格点击事件
		function optionClick(){
			var self=this,config,
				opname=$(self).attr("opname"),//获取操作方法
				//获取数据
			    rowData=$(self).closest("tr")[0].trData;
			    rowData.isFirst=$(self).closest("tr")[0].isFirst;	
				rowData.layerData=$(self).closest("tr")[0].layerData;
			if(opname=="follow"){//跟进
				var html='<form class="form-horizontal"><div class="form-group">'
						+			'<label for="risk_name" class="col-sm-2 control-label">记录内容</label>'
						+			'<div class="col-sm-10">'
						+				'<textarea type="text" class="form-control" id="desc"  name="desc" placeholder="请简要描述跟进过程" rows=5 ></textarea>'
						+			'</div>'
						+		'</div></form>';
				config={
					title:"添加跟进记录",
					html:html,
					confirmFun:function(obj){//模态框中确认按钮点击事件
						var desc=obj.find("textarea[name=desc]").val();
						if(!desc){
							asys.showAlert({title:'温馨提醒',msg:'请输入记录内容',isCancel:false})
							return;
						}
						var config={
							url:'CompanyApply/follow_update_do',
							params:{
								apply_id:rowData.id,
								desc:desc,
							},
							successFun:function(){
								obj.modal('hide');
								getData();
							}
						}
						asys.post(config);
					}
				}
			}else if(opname=="log"){//查看跟进记录
				var html='<div class="form-horizontal"><div class="form-group">'
						+			'<label for="risk_name" class="col-sm-2 control-label">记录内容</label>'
						+			'<div class="col-sm-10">'
						+				''
						+			'</div>'
						+		'</div>';
				
				var config={
					url:'CompanyApply/follow_lists',
					params:{
						apply_id:rowData.id
					},
					successFun:function(data){
						var lists=data.info,html="<div class='follow_lists'>";
						//记录拼接
						$.each(lists,function(){
							html+='<div class="form-horizontal"><div class="form-group">'
								+			'<label class="col-sm-2">记录时间</label>'
								+			'<div class="col-sm-10">'
								+				this.create_time
								+			'</div>'
								+		'</div>'
								+		'<div class="form-group">'
								+			'<label class="col-sm-2">记录内容</label>'
								+			'<div class="col-sm-10">'
								+				this.desc
								+			'</div>'
								+		'</div>'
								+		'<div class="form-group">'
								+			'<label class="col-sm-2">跟进人员</label>'
								+			'<div class="col-sm-10">'
								+				this.acc_name
								+			'</div>'
								+		'</div>'
								+	'</div>'
						})
						html+="</div>"
						f_config={
							title:"跟进记录",
							html:html,
							isConfirm:false,//需要确认按钮
							cancelText:"关闭"//更改取消按钮文字显示
						}
						asys.showModalHtml(f_config)
					}
				}
				asys.post(config);
				return;
			}else if(opname=="solve"){//已解决
				config={
					title:'温馨提醒',
					html:"您确认已解决了该条记录了吗？",
					confirmFun:function(obj){
						var config={
							url:'CompanyApply/status_do',
							params:{
								apply_id:rowData.id,
								type:5,
							},
							successFun:function(){
								obj.modal('hide');
								getData();
							}
						}
						asys.post(config);
					}
				}
			}else if(opname=="close"){//关闭
				config={
					title:'温馨提醒',
					html:"您确认需要关闭该条记录吗？",
					confirmFun:function(obj){
						var config={
							url:'CompanyApply/status_do',
							params:{
								apply_id:rowData.id,
								type:6,
							},
							successFun:function(){
								obj.modal('hide');
								getData();
							}
						}
						asys.post(config);
					}
				}
			}
			if(config){
				asys.showModalHtml(config);
			}
		}
	}
   /*点击产品定制的调用方法*/
    function productMade(tabInfo){
        /*添加筛选栏*/
		var search_checkstate= '<div class="search-checkstate">'
                            +    '<div class="search_box" hidden>'
                            +      '<form class="form-inline">'
                            +        '<div class="form-group">'
                            +          '<label for="status">定制状态</label>'
                            +           '<select name="status" id="" class="form-control">'
                            +             '<option value="">全部</option>'
                            +             '<option value="1">待签约</option>'
                            +             '<option value="2">已签约</option>'
                            +             '<option value="3">驳回</option>'
                            +             '<option value="4">已定制</option>'
                            +           '</select>'
                            +        '</div>'
                            +        '<div class="form-group">'
                            +          '<label for="sub_time">提交时间</label>'
                            +          '<input type="text" class="form-control start_date" name="start_date" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" placeholder="">-<input type="text" class="form-control end_date" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" name="end_date" placeholder="">'
                            +        '</div>'
                            +        '<div class="form-group">'
                            +          '<input type="text" class="form-control" style="width:145px!important;" id="product_val" name="product_val" placeholder="产品编号、产品名称">'
                            +        '</div>'
							+           '<div class="form-group">'
							+              '<input type="text" class="form-control" name="company_name"  placeholder="商户名称">'
							+            '</div>'
							+            '<label class="btn btn-primary">查询</label>'
							+			   '<label class="btn btn-default">重置</label>'
                            +      '</form>'
                            +    '</div>'
                            + '</div>',
			pageConfig={
				tabInfo:tabInfo,//dom信息对象
				paramConfig:OPEN.productMade,//表格的配置
				search_checkstate:search_checkstate,//筛选栏html
				optionClick:optionClick,//可点击标签的点击事件（operation Css下的a标签点击事件）
				setOpname:setOpname,//权限列显示方法（有权限判断和根据数据判断是否显示等）
				setSearchPower:setSearchPower,//权限请求成功后执行方法
				tableShowAfter:tableShowAfter,//整个页面渲染完成后运行的方法
				postData:{type:2}//请求数据时需要的参数（以后每次都会带）
			},
			fcodes=[],
			getData=OPEN.initPage(pageConfig);//初始化页面
		//权限请求成功后执行方法 判断是否有查询权限来 筛选栏，然后请求数据，渲染页面	
		function setSearchPower(data){
			$.each(data.info,function(){
				var fcode=this.fcode.split("_")[1];//将权限名称拆分，取最后一个
				fcodes.push(fcode);//记录权限列表
				if(fcode=='query'){//判断是否有查询权限
					tabInfo.tabDom.find(".search_box").show();//显示筛选栏
				}
			})
			getData(1); 
		}
		function tableShowAfter(){
			tabInfo.tableDom.find("th:last").attr("colspan",2);//合并单元格
			
		}
		function setOpname(power,data,isPowers){//操作权限设置
			var html="";
			html+= '<td class="operation" '+(isPowers?'tdlayer="1"':'')+'>'
			$.each(power,function(k,v){
				if(fcodes.indexOf(v.fcode)>-1){
					switch(v.fcode){
						case 'rate':
							if(data.status==4){
								html+= '<div><a opname="'+v.fcode+'">'+v.title+'</a></div>'
							}else{
								html+= '<div><a opname="'+v.fcode+'" hidden>'+v.title+'</a></div>'
							}
							break;
						case 'delete':
							if(data.status==3){
								html+= '<div><a opname="'+v.fcode+'">'+v.title+'</a></div>'
							}else{
								html+= '<div><a opname="'+v.fcode+'" hidden>'+v.title+'</a></div>'
							}
							break;
						case 'add':
							if(data.status==4){
								html+= '<div><a opname="'+v.fcode+'">'+v.title+'</a></div>'
							}else{
								html+= '<div><a opname="'+v.fcode+'" hidden>'+v.title+'</a></div>'
							}
							break;
						case 'sign':
							if(data.status==1){
								html+= '<div><a opname="'+v.fcode+'">'+v.title+'</a></div>'
							}else{
								html+= '<div><a opname="'+v.fcode+'" hidden>'+v.title+'</a></div>'
							}
							break;
						case 'custom':
							if(data.status==2){
								html+= '<div><a opname="'+v.fcode+'">'+v.title+'</a></div>'
							}else{
								html+= '<div><a opname="'+v.fcode+'" hidden>'+v.title+'</a></div>'
							}
							break;
						case 'reject':
							if(data.status==1){
								html+= '<div><a opname="'+v.fcode+'">'+v.title+'</a></div>'
							}else{
								html+= '<div><a opname="'+v.fcode+'" hidden>'+v.title+'</a></div>'
							}
							break;
						case 'balType':
							if(data.status==4){
								html+= '<div><a opname="'+v.fcode+'">'+v.title+'</a></div>'
							}else{
								html+= '<div><a opname="'+v.fcode+'" hidden>'+v.title+'</a></div>'
							}
							break;
					}
				}
			});
			html+='</td>';
			//设置操作列宽（不能在tableShowAfter 中是因为第三方插件问题）
			tabInfo.tableDom.find("th:last").css("width",'145px');
			tabInfo.tableDom.find("th:last div").css("width",'145px');
			return html;
		}
		//操作单元格点击事件
		function optionClick(){
			var self=this,
				config,
				//获取操作名称
				opname=$(self).attr("opname"),
				//获取本次操作所在行的数据
				rowData=$(self).closest("tr")[0].trData;
			rowData.isFirst=$(self).closest("tr")[0].isFirst;	
			rowData.layerData=$(self).closest("tr")[0].layerData;	
			if(opname=="delete"){//删除记录
				config={
					title:'温馨提醒',
					html:"您确认删除该条记录吗？",
					confirmFun:function(obj){
						var config={
							url:'CompanyApply/status_do',
							params:{
								apply_id:rowData.id,
								type:1,
							},
							successFun:function(){
								obj.modal('hide');
								$(self).closest("tr").remove();
							}
						}
						asys.post(config);
					}
				}
			}else if(opname=="balType"){//结算费率
				OPEN.balTypeHtml(rowData,getData);
				return;
			}else if(opname=="rate"){//结算费率
				if(rowData.company.level==1){
					config={
						title:'温馨提醒',
						html:"如需配置专享费率，请前往商户列表将该商户设为VIP商户",
						isCancel:false
					}
					asys.showModalHtml(config);
				}else{
					OPEN.rateAlocHtml(rowData,getData);
				}
				return;
			}else if(opname=='sign'){//签约
				config={
					title:'温馨提醒',
					html:"您确认该商家已签约了吗？",
					confirmFun:function(obj){
						var config={
							url:'CompanyApply/status_do',
							params:{
								apply_id:rowData.id,
								type:2,
							},
							successFun:function(){
								obj.modal('hide');
								getData();
							}
						}
						asys.post(config);
					}
				}
			}else if(opname=='custom' || opname=='add'){//新增记录和定制操作
				var html='<form class="form-horizontal">'
						+		'<div class="form-group">'
						+			'<label for="product_id" class="col-sm-2 control-label">产品名称</label>'
						+			'<div class="col-sm-10">'
						+				'<input type="hidden" name="product_id" class="js-data-example-ajax form-control">'
						+			'</div>'
						+		'</div>'
						+		'<div class="form-group">'
						+			'<label for="start_date" class="col-sm-2 control-label">签约起期</label>'
						+			'<div class="col-sm-10">'
						+				'<input type="text" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" name="start_date" class="form-control" id="start_date" placeholder="">'
						+			'</div>'
						+		'</div>'
						+		'<div class="form-group">'
						+			'<label for="end_date"  class="col-sm-2 control-label">签约止期</label>'
						+			'<div class="col-sm-10">'
						+				'<input type="text" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" name="end_date" class="form-control" id="end_date"  placeholder="">	'
						+			'<div class="col-sm-10">'
						+		'</div>'
						+	'</form>',
					config={
						title:'产品信息',
						html:html,
						confirmFun:function(obj){//确认按钮点击时间
							var t = $(obj).find(".form-horizontal").serializeArray(),isErr=false,data={};
							$.each(t, function() {//组装数据并判断是否有空数据
								 if(this.value){
									 data[this.name] = this.value; 
								 }else{
									isErr=true; 
									return; 
								 }
							});
							if(isErr){// 如果有空数据报错
								asys.showAlert({title:'温馨提醒',msg:'请完善配置信息',isCancel:false})
							}else{//保存数据
								data.apply_id=rowData.id;
								var config={
									url:'CompanyApply/pdt_adds',
									params:data,
									successFun:function(){
										obj.modal('hide');//关闭模态框
										getData();//刷新tab页面的表格数据
									}
								}
								asys.post(config);
							}
						}
					}
				var modal=asys.showModalHtml(config);
				//select2 jquery+ bootstrap插件初始化
				asys.select2Init(modal.find(".js-data-example-ajax"),'Product/lists',function(data){
					//获取到的数据重构
					var itemList = [];
					var arr = data.info
					for(var item=0;item<arr.length;item++){
						itemList.push({id: arr[item].id, text: arr[item].code+" "+arr[item].name})
					}
					return {
						results: itemList
					}; 
				});
				//时间控件初始化
				var startDate=new Date();
				startDate.setMonth(startDate.getMonth()-9);
				asys.datePicker(modal.find("input[name='start_date']"),{
					initialDate:new Date(),
				});
				asys.datePicker(modal.find("input[name='end_date']"),{
					startDate: new Date(),
					initialDate:new Date()
				});
				return;
			}else if(opname=='reject'){//驳回定制请求
				config={
					title:'温馨提醒',
					html:"您确认驳回该商家的定制请求吗？",
					confirmFun:function(obj){
						var config={
							url:'CompanyApply/status_do',
							params:{
								apply_id:rowData.id,
								type:3,
							},
							successFun:function(){
								obj.modal('hide');
								getData();
							}
						}
						asys.post(config);
					}
				}
			}
			if(config){
				asys.showModalHtml(config);
			}
		}	
	}
   /*点击订单列表的调用方法*/
    function orderList(tabInfo){
		OPEN.orderListPage(tabInfo,OPEN.orderLists);//订单页面
    }	
	/*点击订单列表的调用方法（保险公司查看）*/
    function insOrderList(tabInfo){
		OPEN.orderListPage(tabInfo,OPEN.insOrderLists);//订单页面
		
    }	
	/*点击外链记录的调用方法*/
    function linkOrderList(tabInfo){
		/*添加筛选栏*/
			var search_checkstate= '<div class="search-checkstate">'
					+    '<div class="search_box" hidden>'
					+    '<form class="form-inline" style="margin-bottom:15px;">'
					+		'<div class="form-group">'
					+          '<label for="type">产品类型</label>'
					+           '<select name="type" id="" class="form-control">'
					+             '<option value="">全部</option>'
					+             '<option value="1">平台对接</option>'
					+             '<option value="2">外链产品</option>'
					+           '</select>'
					+        '</div>'
					+      '<div class="form-group">'
					+        '<input type="text" class="form-control" id=""  name="product_val" placeholder="产品名称">'
					+      '</div>'
					+      '<div class="form-group">'
					+        '<input type="text" class="form-control" id=""  name="company_val" placeholder="商户名称">'
					+      '</div>'
					+        '<label class="btn btn-primary">查询</label>'
					+			   '<label class="btn btn-default">重置</label>'
					+    '</form>'
					+    '</div>'
					+ '</div>',
				pageConfig={
					tabInfo:tabInfo,//dom信息对象
					paramConfig:OPEN.linkOrderLists,//表格配置
					search_checkstate:search_checkstate,//筛选栏html
					setSearchPower:setSearchPower,//权限请求成功后执行方法
					optionClick:optionClick//可点击标签的点击事件（operation Css下的a标签点击事件）
				},
				fcodes=[],
				getData=OPEN.initPage(pageConfig);
			//权限请求成功后调用的方法，记录权限信息，并查看是否有表格之上的筛选栏或者按钮权限
			function setSearchPower(data){
				$.each(data.info,function(){
					var fcode=this.fcode.split("_")[1];//将权限名称拆分，取最后一个
					fcodes.push(fcode);//记录权限列表
					if(fcode=='query'){//是否有查询权限
						tabInfo.tabDom.find(".search_box").show();//显示筛选栏
					}
				})
				getData(1); 
			}
			//操作单元格点击事件
			function optionClick(){
				
			}
		
    }
   /*点击产品类目的调用方法*/
    function productClass(tabInfo){
      	/*添加筛选栏*/
		 var search_checkstate= '<div class="search-checkstate">'
                +    '<div class="checkState" hidden>'
                +      '<button type="button" name="add" class="btn btn-primary">添加类目</button>'
                +    '</div>'
                + '</div>',
			pageConfig={
				tabInfo:tabInfo,//dom信息对象
				paramConfig:OPEN.productClass,//表格的配置
				search_checkstate:search_checkstate,//筛选栏html
				setSearchPower:setSearchPower,//权限请求成功后执行方法
				optionClick:optionClick,//可点击标签的点击事件（operation Css下的a标签点击事件）
				setOpname:setOpname,//权限列显示方法（有权限判断和根据数据判断是否显示等）
				postData:{source:1}//请求数据时需要的参数（以后每次都会带）
			},
			fcodes=[],
			getData=OPEN.initPage(pageConfig);//初始化页面(表格，筛选栏等渲染)
		//权限请求成功后执行方法 判断是否有添加权限来显示筛选栏，然后请求数据，渲染页面	
		function setSearchPower(data){
			$.each(data.info,function(){
				var fcode=this.fcode.split("_")[1];//将权限名称拆分，取最后一个
				fcodes.push(fcode);//记录权限列表
				if(fcode=='add'){//判断是否有添加权限
					tabInfo.tabDom.find(".checkState").show();//显示筛选栏
				}
			})
			getData(1);
		}
		//筛选栏添加按钮点击事件
		tabInfo.tabDom.find("button[name=add]").click(function(){
			showProduct();
		});
		/*
			产品栏目添加和编辑方法
				rowData : 本次操作所在列的数据，如果没有则代表添加
		*/
		function showProduct(rowData){
			var html='<form class="form-horizontal">'
					+		'<div class="form-group">'
					+			'<label for="name" class="col-sm-3 control-label">类目名称：</label>'
					+			'<div class="col-sm-7">'
					+				'<input type="text" name="name" class="form-control" id="" placeholder="">'
					+			'</div>'
					+		'</div>'
					+		'<div class="form-group">'
					+			'<label for="sort" class="col-sm-3 control-label">排序：</label>'
					+			'<div class="col-sm-7">'
					+				'<input type="text" name="sort" class="form-control" id="" placeholder="">'
					+			'</div>'
					+		'</div>'
					+	'</form>',
				config={
					title:'产品类目',
					html:html,
					confirmFun:function(obj){//模态框中确认按钮点击事件
						var t = $(obj).find(".form-horizontal").serializeArray(),isErr=false,data={};
						$.each(t, function() {//数据组装，并判断是否有空数据
							 if(this.value){
								 data[this.name] = this.value; 
							 }else{
								isErr=true; 
								return; 
							 }
						});
						if(isErr){//有空数据
							asys.showAlert({title:'温馨提醒',msg:'您有信息未输入',isCancel:false})
						}else if(data.name.length>5){//名称数据有误
							asys.showAlert({title:'温馨提醒',msg:'类目名称不能超过5个字符',isCancel:false})
						}else{
							//保存数据
							data.source=1;
							data.id=rowData?rowData.id:'';
							var config={
								url:rowData?'RelatClass/edit_do':'RelatClass/adds_do',//添加和编辑方法不相同
								params:data,
								successFun:function(){
									obj.modal('hide');
									getData(1);//重新渲染
								}
							}
							asys.post(config);								
						}
					}
				}
			var modal=asys.showModalHtml(config);
			//判断是否编辑，编辑时输入框中填入数据
			if(rowData){
				modal.find("input[name=name]").val(rowData.name?rowData.name:'');
				modal.find("input[name=sort]").val(rowData.sort?rowData.sort:'');
			}
		}
		//操作权限设置
		function setOpname(power,data,isPowers){
			var html="";
			html+= '<td class="operation" '+(isPowers?'tdlayer="1"':'')+'>'
			$.each(power,function(k,v){
				if(fcodes.indexOf(v.fcode)>-1){
					switch(v.fcode){
						case 'delete':
							html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
							break;
						case 'disabled':
							if(data.status==1){
								html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
							}else{
								html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
							}
							break;
						case 'enabled':
							if(data.status==0){
								html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
							}else{
								html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
							}
							break;
						case 'edit':
							html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
							break;
					}
				}
			});
			html+='</td>';
			return html;
		}
		//操作单元格点击事件
		function optionClick(){
			var self=this,config,
				opname=$(self).attr("opname"),//获取操作名称
				//本次操作所在列的数据
			   rowData=$(self).closest("tr")[0].trData;
			if(opname=="delete"){//删除记录
				config={
					title:'温馨提醒',
					html:"您确认删除该条记录吗？",
					confirmFun:function(obj){
						var config={
							url:'RelatClass/status_do',
							params:{
								id:rowData.id,
								type:-1,
							},
							successFun:function(){
								obj.modal('hide');
								$(self).closest("tr").remove();//本行删除即可无需刷新表格
							}
						}
						asys.post(config);	
							
					}
				}
			}else if(opname=="edit"){//编辑
				showProduct(rowData);
				return;
			}else if(opname=="disabled"){ // 单击禁用时
				config={
					title:'温馨提醒',
					html:"您确认禁用该类目吗？",
					confirmFun:function(obj){
						var config={
							url:'RelatClass/status_do',
							params:{
								id:rowData.id,
								type:1,
							},
							successFun:function(){
								//禁用成功后显示改变，
								$($(self).closest("tr").find("td")[3]).html("禁用");
								$(self).hide();
								$(self).parent().find("a[opname='enabled']").show();
								obj.modal('hide');	
							}
						}
						asys.post(config);									
					}
				}
			}else if(opname=="enabled"){
				config={
					title:'温馨提醒',
					html:"您确认解除该类目的禁用吗？",
					confirmFun:function(obj){
						var config={
							url:'RelatClass/status_do',
							params:{
								id:rowData.id,
								type:2,
							},
							successFun:function(){
								//解除禁用成功后显示改变，
								$($(self).closest("tr").find("td")[3]).html("正常");
								$(self).hide();
								$(self).parent().find("a[opname='disabled']").show();
								obj.modal('hide');	
							}
						}
						asys.post(config);
					}
				}
			}
			if(config){
				asys.showModalHtml(config);
			}
		}	
    }
	/*点击行业的调用方法*/
	function sceneClass(tabInfo){
		/*添加筛选栏*/
		 var search_checkstate= '<div class="search-checkstate" hidden></div>',
			pageConfig={
				tabInfo:tabInfo,//dom信息对象
				paramConfig:OPEN.sceneClass,//表格的配置
				search_checkstate:search_checkstate,//筛选栏html
				setSearchPower:setSearchPower,//权限请求成功后执行方法
				optionClick:optionClick,//可点击标签的点击事件（operation Css下的a标签点击事件）
				setOpname:setOpname,//权限列显示方法（有权限判断和根据数据判断是否显示等）
				postData:{source:2}//请求数据时需要的参数（以后每次都会带）
			},
			fcodes=[],
			getData=OPEN.initPage(pageConfig);
		//权限请求成功后调用的方法，记录权限信息，并查看是否有表格之上的筛选栏或者按钮权限，然后请求数据渲染表格
		function setSearchPower(data){
			$.each(data.info,function(){
				var fcode=this.fcode.split("_")[1];//将权限名称拆分，取最后一个
				fcodes.push(fcode);//记录权限列表
			})
			getData(1);
		}
		function setOpname(power,data){//操作权限设置
			var html="";
			html+= '<td class="operation">'
			$.each(power,function(k,v){
				if(fcodes.indexOf(v.fcode)>-1){
					if(v.fcode=='delete'){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}else if(v.fcode=='disabled' && data.status==1){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}else if(v.fcode=='disabled'){
						html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
					}else if(v.fcode=='enabled'  && data.status==0){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}else if(v.fcode=='enabled'){
						html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
					}
				}
			});
			html+='</td>';
			return html;
		}
		//操作单元格点击事件
		function optionClick(){
			var self=this,config,
				opname=$(self).attr("opname"),//获取操作名称
				//本次操作所在列的数据
			   rowData=$(self).closest("tr")[0].trData;
			if(opname=="delete"){//删除记录
				config={
					title:'温馨提醒',
					html:"您确认删除该条记录吗？",
					confirmFun:function(obj){
						var config={
							url:'RelatClass/status_do',
							params:{
								id:rowData.id,
								type:-1,
							},
							successFun:function(){
								obj.modal('hide');//隐藏弹框
								$(self).closest("tr").remove();//删除本行html即可
							}
						}
						asys.post(config);
					}
				}
			}else if(opname=="disabled"){ // 单击禁用时
				config={
						title:'温馨提醒',
						html:"您确认禁用吗？",
						confirmFun:function(obj){
							var config={
								url:'RelatClass/status_do',
								params:{
									id:rowData.id,
									type:1,
								},
								successFun:function(){
									//禁用成功后显示改变，
									$($(self).closest("tr").find("td")[3]).html("禁用");
									$(self).hide();
									$(self).parent().find("a[opname='enabled']").show();
									obj.modal('hide');	
								}
							}
							asys.post(config);									
						}
					}
			}else if(opname=="enabled"){
				config={
					title:'温馨提醒',
					html:"您确认解除禁用吗？",
					confirmFun:function(obj){
						var config={
							url:'RelatClass/status_do',
							params:{
								id:rowData.id,
								type:2,
							},
							successFun:function(){
								//解除禁用成功后显示改
								$($(self).closest("tr").find("td")[3]).html("有效");
								$(self).hide();
								$(self).parent().find("a[opname='disabled']").show();
								obj.modal('hide');	
							}
						}
						asys.post(config);
					}
				}
			}
			if(config){
				asys.showModalHtml(config);
			}
		}
	}
   /*点击授权产品的调用方法*/
    function authProduct(tabInfo){
		/*筛选栏html*/
		var search_checkstate=  '<div class="search-checkstate">'
			   +      '<div class="search_box" hidden>'
			   +            '<form class="form-inline" style="margin-bottom:15px;">'
			   +              '<div class="form-group">'
			   +                '<label for="type">合作类型</label>'
			   +                '<select  name="type" id="type" class="form-control">'
			   +                  '<option value="">全部</option>'
			   +                  '<option value="1">产品推广</option>'
			   +                  '<option value="2">产品定制</option>'
			   +                  '<option value="3">推广&定制</option>'
			   +                '</select>'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<label for="grant_start">授权时间</label>'
			   +                '<input type="text" class="form-control start_date" id="grant_start" name="grant_start" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" placeholder="">-<input type="text" class="form-control end_date" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" id="grant_end" name="grant_end" placeholder="">'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<input name="search_val" type="text" style="width:150px !important;" class="form-control" id="" placeholder="产品编号、产品名称">'
			   +              '</div>'
			   +        '<label class="btn btn-primary">查询</label>'
			   +			   '<label class="btn btn-default">重置</label>'
			   +            '</form>'
			   +      '</div>'
			   +   '</div>',
				pageConfig={
					tabInfo:tabInfo,//dom信息对象
					paramConfig:OPEN.authProduct,//表格的配置
					search_checkstate:search_checkstate,//筛选栏html
					setSearchPower:setSearchPower,//权限请求成功后执行方法
					optionClick:optionClick,//可点击标签的点击事件（operation Css下的a标签点击事件）
					trDblClick:trDblClick,//双击tr行时运行的方法，
					setOpname:setOpname,//权限列显示方法（有权限判断和根据数据判断是否显示等）
					postData:{grant_status:1}//请求数据时需要的参数（以后每次都会带）
				},
				fcodes=[],
				getData=OPEN.initPage(pageConfig);
			//权限请求成功后调用的方法，记录权限信息，并查看是否有表格之上的筛选栏或者按钮权限，然后请求数据渲染表格
			function setSearchPower(data){
				$.each(data.info,function(){
					var fcode=this.fcode.split("_")[1];//将权限名称拆分，取最后一个
					fcodes.push(fcode);//记录权限列表
					if(fcode=='query'){//判断是否有查询权限
						tabInfo.tabDom.find(".search_box").show();//显示筛选栏
					}
				})
				getData(1);
			}
			function setOpname(power,data){//操作权限设置
				var html="";
				if(power.length>1){//结算配置权限特殊化
					html+= '<td class="operation">'
					if(fcodes.indexOf('rate')>-1){
						if(data.status==1){
							html+= '<a opname="rate">结算配置 <span class="glyphicon glyphicon-ok  '+(data.module_info[1].status==2?'':'hidden')+'""></span></a>'
						}else{
							html+= '<a opname="rate">结算配置 <span  class="glyphicon glyphicon-ok '+(data.module_info[1].status==2?'':'hidden')+'"></span></a>'
						}
					}
					html+='</td>'
				}
				
				html+= '<td class="operation">'
				$.each(power,function(k,v){
					if(fcodes.indexOf(v.fcode)>-1){
						if(v.fcode=='unShelf' && data.status==1){
							html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
						}else if(v.fcode=='unShelf'){
							html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
						}else if(v.fcode=='shelves' && data.status==0){
							html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
						}else if(v.fcode=='shelves'){
							html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
						}else if(v.fcode=='setRecom' && data.status==1){
							html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
						}else if(v.fcode=='setRecom'){
							html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
						}else if(v.fcode=='show'){
							html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
						}
					}
				});
				html+='</td>';
				return html;
			}
			//tr双击事件
			function trDblClick(){
				if(fcodes.indexOf("show")==-1){//没有权限
					return;
				}
				var  rowData=$(this)[0].trData,
					config,
					html='<div id="scrollee" style="position: absolute;right: 0;bottom: 0;left: 0;top: 0; overflow:hidden;"><iframe name="urlIframe" width="100%" type="text/html" height="100%" scrolling=yes frameBorder="0" src="productInfo.html?type=show&id='+rowData.id+'&v='+version+'"></iframe></div>';
				config={
					html:html,
					isFull:true,//全屏
					isCancel:false,//不要取消按钮
					isConfirm:false//不要确认按钮
				}
				asys.showModalHtml(config);
			}
			//操作单元格点击事件
			function optionClick(){
				var self=this,config,modal,
					opname=$(self).attr("opname"),
				   rowData=$(self).closest("tr")[0].trData;
				if(opname=="show"){//查看产品详情
					html='<div id="scrollee" style="position: absolute;right: 0;bottom: 0;left: 0;top: 0; overflow:hidden;"><iframe name="urlIframe" width="100%" type="text/html" height="100%" scrolling=yes frameBorder="0" src="productInfo.html?type=show&id='+rowData.id+'&v='+version+'"></iframe></div>';
					config={
						html:html,
						isFull:true,//全屏
						isCancel:false,//不要取消按钮
						isConfirm:false,//不要确认按钮
						hideFun:function(){//模态框关闭后执行事件
							getData();
						}
					}
				}else if(opname=="rate"){//产品费率配置
					html='<div id="scrollee" style="position: absolute;right: 0;bottom: 0;left: 0;top: 0; overflow:hidden;"><iframe name="urlIframe" width="100%" type="text/html" height="100%" scrolling=yes frameBorder="0" src="productRate.html?type='+(rowData.status==1?'show':'edit')+'&id='+rowData.id+'&v='+version+'"></iframe></div>';
						config={
							html:html,
							isFull:true,//全屏
							isCancel:false,//不要取消按钮
							isConfirm:false,//不要确认按钮
							hideFun:function(){//模态框关闭后执行事件
								getData();
							}
						}
				}else if(opname=="shelves"){ // 上架
					if(rowData.module_info[1].status!=2){//判断结算费率是否配置完成
						asys.showAlert({title:'温馨提醒',msg:"费率配置完成后才可进行上架",isCancel:false});
						return;
					}
					config={
						title:'温馨提醒',
						html:"您确认上架产品吗？",
						confirmFun:function(obj){
							var config={
								url:'Product/status_do',
								params:{
									id:rowData.id,
									type:1,
								},
								successFun:function(){
									//上架成功后显示改变
									$($(self).closest("tr").find("td")[6]).html("已上架");
									$(self).hide();
									$(self).parent().find("a[opname='unShelf']").show();
									$(self).parent().parent().find("a[opname='setRecom']").show();
									obj.modal('hide');	
									$(self).closest("tr")[0].trData.status=1//上架
								}
							}
							asys.post(config);										
						}
					}
				}else if(opname=="unShelf"){//下架
					config={
						title:'温馨提醒',
						html:"您确认下架改产品吗？",
						confirmFun:function(obj){
							var config={
								url:'Product/status_do',
								params:{
									id:rowData.id,
									type:2,
								},
								successFun:function(){
									//下架成功后显示改变
									$($(self).closest("tr").find("td")[6]).html("未上架");
									$(self).hide();
									$(self).parent().find("a[opname='shelves']").show();
									$(self).parent().find("a[opname='shelves']").text("重新上架");
									$(self).parent().parent().find("a[opname='setRecom']").hide();
									obj.modal('hide');
									$(self).closest("tr")[0].trData.status=0//上架
								}
							}
							asys.post(config);	
						}
					}
				}else if(opname=="setRecom"){//推荐
					var html='<form class="form-horizontal">'
							+	'<div class="form-group">'
							+		'<label for="cert_status" class="col-sm-3 control-label">首页：</label>'
							+		'<div class="col-sm-7">'
							+		'<label class="checkbox-inline">'
							+				'<input type="checkbox" name="is_recomd_index" value="1" '+(rowData.is_recomd_index==1?'checked':'')+'>首页'
							+			'</label>'
							+		'</div>'
							+	'</div>'
							+	'<div class="form-group">'
							+		'<label for="cert_status" class="col-sm-3 control-label">行业场景：</label>'
							+		'<div  class="col-sm-7 relatClass">'
							+		'</div>'
							+	'</div>'
							+	'<div class="form-group">'
							+		'<label for="cert_status"  class="col-sm-3 control-label">商户平台：</label>'
							+		'<div class="col-sm-7">'
							+			'<label class="checkbox-inline">'
							+				'<input type="checkbox" name="is_recomd_profit" value="1" '+(rowData.is_recomd_profit==1?'checked':'')+'>我的收益'
							+			'</label>'
							+		'</div>'
							+	'</div>'
							+'</form>'
					config={
						title:'温馨提醒',
						html:html,
						confirmFun:function(obj){//模态框中确认按钮点击事件
							var t = $(obj).find(".form-horizontal").serializeArray(),isErr=false,data={};
							$.each(t, function() {//组装数据
								if(!data[this.name]){
									data[this.name]=[];
								}
								data[this.name].push(this.value); 
							});
							//保存数据
							var config={
								url:'Product/recomd_do',
								params:{
									product_id:rowData.id,
									is_recomd_index:data.is_recomd_index?data.is_recomd_index:0,
									is_recomd_profit:data.is_recomd_profit?data.is_recomd_profit:0,
									recomd_scene_ids:data.recomd_scene_ids?data.recomd_scene_ids.toString():''
								},
								successFun:function(){
									getData();
									obj.modal('hide');
								}
								
							}
							asys.post(config);
						}
					}
					
				}
				if(config){
					modal=asys.showModalHtml(config);
				}
				if(opname=="setRecom"){
					//请求分类列表，并渲染
					var config={
						url:'RelatClass/lists',
						params:{
							source:2,
							limit:1000,
						},
						successFun:function(data){
							modal.find(".relatClass").html("");
							var html="";
							$.each(data.info,function(){
								html+='<label class="checkbox-inline">'
							+				'<input name="recomd_scene_ids" type="checkbox"  value="'+this.id+'">'+this.name
							+			'</label>'
							});
							modal.find(".relatClass").html(html);
							$.each(rowData.recomd_scene,function(){
								modal.find(".relatClass").find("input[value="+this.scene_id+"]").prop('checked',true);
							})
						}
					}
					asys.post(config);
				}
			}
		}
	  
	  /*点击产品库的调用方法*/
	function productLib(tabInfo){
		/*筛选栏html*/
		var search_checkstate=  '<div class="search-checkstate">'
			   +      '<div class="search_box" hidden>'
			   +            '<form class="form-inline" style="margin-bottom:15px;">'
			   +              '<div class="form-group">'
			   +                '<label for="grant_status">授权状态</label>'
			   +                '<select  name="grant_status" id="grant_status" class="form-control">'
			   +                  '<option value="">全部</option>'
			   +                  '<option value="-1">未授权</option>'
			   +                  '<option value="1">已授权</option>'
			   +                '</select>'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<label for="create_start">同步时间</label>'
			   +                '<input type="text" class="form-control start_date" name="create_start" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" placeholder="">-<input type="text" class="form-control end_date" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" name="create_end" placeholder="">'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<input name="search_val" type="text" style="width:150px !important;" class="form-control" id="" placeholder="产品编号、产品名称">'
			   +              '</div>'
			   +        '<label class="btn btn-primary">查询</label>'
			   +			   '<label class="btn btn-default">重置</label>'
			   +            '</form>'
			   +      '</div>'
			   +      '<div class="checkState">'
			   +        '<button type="button" hidden name="pull" class="btn btn-primary">拉取</button>'
			   + 		'<button type="button" hidden  name="authBat" class="btn btn-primary">批量授权</button>'
			   +     '</div>'
			   +   '</div>',
			   pageConfig={
					tabInfo:tabInfo,//dom信息对象 包括tab的dom，表格dom
					paramConfig:OPEN.productLib,//表格的配置
					search_checkstate:search_checkstate,//筛选栏html
					setSearchPower:setSearchPower,//权限请求成功后执行方法
					tableShowAfter:tableShowAfter,//整个页面渲染完成后运行的方法
					optionClick:optionClick,//可点击标签的点击事件（operation Css下的a标签点击事件）
					setOpname:setOpname,//权限列显示方法（有权限判断和根据数据判断是否显示等）
					checkVlaue:'id'//复选框绑定的value 对应data数据中的属性名
				},
				fcodes=[],
				getData=OPEN.initPage(pageConfig);
		//权限请求成功后调用的方法，记录权限信息，并查看是否有表格之上的筛选栏或者按钮权限，然后请求数据渲染表格
		function setSearchPower(data){
			$.each(data.info,function(){
				var fcode=this.fcode.split("_")[1];//将权限名称拆分，取最后一个
				fcodes.push(fcode);//记录权限列表
				if(fcode=='query'){//是否有查询权限
					tabInfo.tabDom.find(".search_box").show();
				}else if(fcode=='pull'){//拉取
					tabInfo.tabDom.find("button[name='pull']").show();
				}else if(fcode=='authBat'){//批量授权
					tabInfo.tabDom.find("button[name='authBat']").show();
				}
			});
			getData(1); 
		}
		//拉取产品
		tabInfo.tabDom.find("button[name='pull']").click(function(){
		   var config={
				url:'Product/pull_do',
				successFun:function(){
					asys.showAlert({title:'温馨提醒',msg:"拉取成功",isCancel:false})
					getData(1);
				}
			}
			asys.post(config);	
			
		});
		//批量授权
		tabInfo.tabDom.find("button[name='authBat']").click(function(){
			var product_ids=[]; 
			//获取选择的数据
			$.each(tabInfo.tabDom.find("input[name=btSelect]:checkbox"),function(){
				if(this.checked){
					product_ids.push(this.value);
				}
			})
			//如果没有选择项 不做任何操作
			if(product_ids.length==0){
				return;
			}
			config={
				title:'温馨提醒',
				html:"确定授权所选产品？",
				confirmFun:function(obj){
					obj.modal('hide');
					var config={
						url:'Product/grant_do',
						params:{
							product_ids:product_ids.toString(),
							type:1
						},
						successFun:function(){
							asys.alerts({html:"授权成功!"});
							getData(1);
						}
					}
					asys.post(config);										
				}
			}
			asys.showModalHtml(config)
		});
		function tableShowAfter(){
			
			//将已经授权成功的 复选框隐藏
			$.each(tabInfo.tabDom.find("tbody tr"),function(){
				var trData=this.trData;
				if(trData.is_grant==1){
					$(this).find("[name=btSelect]").hide();
				}
			})
			
		}
		function setOpname(power,data){//操作权限设置
			var html="";
				html+= '<td class="operation">'
				$.each(power,function(k,v){
					if(fcodes.indexOf(v.fcode)>-1){
						if(v.fcode=='auth' && data.is_grant==0){
							html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
						}else if(v.fcode=='auth'){
							html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
						}else if(v.fcode=='authCancel' && data.is_grant==1){
							html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
						}else if(v.fcode=='authCancel'){
							html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
						}else if(v.fcode=='editInfo'){
							html+= '<a opname="'+v.fcode+'">'+v.title+'<span class="glyphicon glyphicon-ok  '+(data.module_info[0].status==2?'':'hidden')+'""></span></a>'
						}else if(v.fcode=='editClause'){
							html+= '<a opname="'+v.fcode+'">'+v.title+'<span class="glyphicon glyphicon-ok  '+(data.module_info[2].status==2?'':'hidden')+'""></span></a>'
						}else if(v.fcode=='config'){
							html+= '<div><a opname="'+v.fcode+'">'+v.title+'</span></a></div>'
						}
					}
				});
				html+='</td>';
				//更改操作列的 列宽
				tabInfo.tableDom.find("th:last").css("width",'100px');
				tabInfo.tableDom.find("th:last div").css("width",'100px');
				return html;
		}
		//操作单元格点击事件
		function optionClick(){
			var self=this,config,modal,
					opname=$(self).attr("opname"),
				   rowData=$(self).closest("tr")[0].trData;
				if(opname=="auth"){//授权
					if(rowData.module_info[0].status!=2 ||rowData.module_info[2].status!=2 ){
						asys.showAlert({title:'温馨提醒',msg:"产品配置完成后才可进行授权",isCancel:false});
						return;
					}else{
						config={
							title:'温馨提醒',
							html:"确定授权？授权后如有产品信息变更须先取消授权",
							confirmFun:function(obj){
								obj.modal('hide');
								var config={
									url:'Product/grant_do',
									params:{
										product_ids:rowData.id,
										type:1
									},
									successFun:function(){
										asys.alerts({html:"授权成功!"});
										getData();
									}
								}
								asys.post(config);
							}
						}
					}
				}else if(opname=="authCancel"){//取消授权
					
					config={
						title:'温馨提醒',
						html:"您确认取消授权本款产品吗？",
						confirmFun:function(obj){
							obj.modal('hide');
							var config={
								url:'Product/grant_do',
								params:{
									product_ids:rowData.id,
									type:-1
								},
								successFun:function(){
									asys.alerts({html:"取消授权成功!"});
									getData();
								}
							}
							asys.post(config);
						}
					}
				}else if(opname=="editInfo"){//产品信息
					html='<div id="scrollee" style="position: absolute;right: 0;bottom: 0;left: 0;top: 0; overflow:hidden;"><iframe name="urlIframe" width="100%" type="text/html" height="100%" scrolling=yes frameBorder="0" src="productDetial.html?type='+(rowData.is_grant==1?"show":"edit")+'&id='+rowData.id+'&v='+version+'"></iframe></div>';
					config={
						html:html,
						isFull:true,//铺满tab标签页
						isCancel:false,//不要取消按钮
						isConfirm:false,//不要确认按钮
						hideFun:function(){//模态框关闭后执行事件
							getData();
						}
					}
				}else if(opname=="editClause"){//方案条款
					html='<div id="scrollee" style="position: absolute;right: 0;bottom: 0;left: 0;top: 0; overflow:hidden;"><iframe name="urlIframe" width="100%" type="text/html" height="100%" scrolling=yes frameBorder="0" src="productClause.html?type='+(rowData.is_grant==1?"show":"edit")+'&id='+rowData.id+'&v='+version+'"></iframe></div>';
					config={
						html:html,
						isFull:true,//铺满tab标签页
						isCancel:false,//不要取消按钮
						isConfirm:false,//不要确认按钮
						hideFun:function(){//模态框关闭后执行事件
							getData();
						}
					}
				}else if(opname=="config"){//方案条款
					html='<div id="scrollee" style="position: absolute;right: 0;bottom: 0;left: 0;top: 0; overflow:hidden;"><iframe name="urlIframe" width="100%" type="text/html" height="100%" scrolling=yes frameBorder="0" src="productConfig.html?type='+(rowData.is_grant==1?"show":"edit")+'&id='+rowData.id+'&v='+version+'"></iframe></div>';
					config={
						html:html,
						isFull:true,//铺满tab标签页
						isCancel:false,//不要取消按钮
						isConfirm:false,//不要确认按钮
						hideFun:function(){//模态框关闭后执行事件
							getData();
						}
					}
				}
				if(config){
					modal=asys.showModalHtml(config);
				}
		}
      }
	/*点击保险公司经纪公司收入调用方法*/
	function insInBrokers(tabInfo){
		  /*添加筛选栏*/
		 var search_checkstate=  '<div class="search-checkstate">'
			   +      '<div class="search_box" hidden>'
			   +            '<form class="form-inline" style="margin-bottom:15px;">'
			   +              '<div class="form-group">'
			   +                '<label for="status">结算状态</label>'
			   +                '<select name="status" id="" class="form-control">'
			   +					'<option value="">全部</option>'
			   +					'<option value="1">待对账</option>'
			   +					'<option value="2">待开发票</option>'
			   +					'<option value="3">发票待确认</option>'
			   +					'<option value="4">等待对方打款</option>'
			   +					'<option value="5">待收款</option>'
			   +					'<option value="6">已完成</option>'
			   +                '</select>'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<label for="ins_id">经纪公司</label>'
			   +                '<select name="ins_id" id="" class="form-control">'
			   +                '</select>'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<label for="">账单时间</label>'
			   +                '<input type="text" class="form-control start_date" name="create_start" data-date-format="yyyy-mm" data-link-format="yyyy-mm" placeholder="">-<input type="text" class="form-control end_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm"  name="create_end" placeholder="">'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<input type="text" class="form-control" name="product_name" style="width:160px !important;" placeholder="产品编号、产品名称">'
			   +              '</div>'
			   +        '<label class="btn btn-primary">查询</label>'
			   +			   '<label class="btn btn-default">重置</label>'
			   +            '</form>'
			   +      '</div>'
			   +      '<div class="checkState">'
			   +        '<button type="button" name="export" class="btn btn-primary" hidden>导出excel</button>'
			   +     '</div>'
			   +   '</div>',
			   //收入配置特殊化
				income={
					dataParamName:['date','source_name','code','product_code','product_name','policy_num','premium_amt','settle_type','status'],
					power:OPEN.income.power,
					getValueText:OPEN.income.getValueText,
					name:"income",
					url:'Bill/lists'
				};
		//修改标签栏上显示文字
		$("a[href='#"+tabInfo.tabDom.attr("id")+"']").html("保险公司经纪公司收入<span class='glyphicon glyphicon-remove-sign tabs_top_close'></span>");
		$("a[href='#"+tabInfo.tabDom.attr("id")+"']").attr("title",'保险公司经纪公司收入');
		//渲染
		OPEN.balancePage(tabInfo,search_checkstate,income,1,'insInBrokers_detailed','in');   
		//获取经纪公司列表，并渲染
		var insLists_c={
				url:'Insurance/lists',
				params:{
					limit:1000
				},
				successFun:function(data){
					var dom=tabInfo.tabDom.find("select[name='ins_id']");
					 dom.html('<option value="">全部</option>');
					 $.each(data.info,function(key,val){
						 dom.append('<option value="'+val.id+'">'+val.name+'</option>');
					 });
				}
			}
		asys.post(insLists_c);
	}
	/*点击保险公司商户收入调用方法*/
	function insInCom(tabInfo){
		  /*添加筛选栏*/
		 var search_checkstate=  '<div class="search-checkstate">'
			   +      '<div class="search_box" hidden>'
			   +            '<form class="form-inline" style="margin-bottom:15px;">'
			   +              '<div class="form-group">'
			   +                '<label for="status">结算状态</label>'
			   +                '<select name="status" id="" class="form-control">'
			   +					'<option value="">全部</option>'
			   +					'<option value="1">待对账</option>'
			   +					'<option value="2">待开发票</option>'
			   +					'<option value="3">发票待确认</option>'
			   +					'<option value="4">等待对方打款</option>'
			   +					'<option value="5">待收款</option>'
			   +					'<option value="6">已完成</option>'
			   +                '</select>'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<label for="">账单时间</label>'
			   +                '<input type="text" class="form-control" name="create_start start_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm" placeholder="">-<input type="text" class="form-control end_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm"  name="create_end" placeholder="">'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<input type="text" class="form-control" name="company_name" placeholder="商户名称">'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<input type="text" class="form-control" name="product_name" style="width:160px !important;" placeholder="产品编号、产品名称">'
			   +              '</div>'
			   +        '<label class="btn btn-primary">查询</label>'
			   +			   '<label class="btn btn-default">重置</label>'
			   +            '</form>'
			   +      '</div>'
			   +      '<div class="checkState">'
			   +        '<button type="button" name="export" class="btn btn-primary" hidden>导出excel</button>'
			   +     '</div>'
			   +   '</div>',
			   //收入配置特殊化
				income={
					dataParamName:['date','source_name','code','product_code','product_name','policy_num','premium_amt','settle_type','status'],
					power:OPEN.income.power,
					getValueText:OPEN.income.getValueText,
					name:"income",
					url:'Bill/lists'
				};
		//修改标签栏上显示文字
		$("a[href='#"+tabInfo.tabDom.attr("id")+"']").html("保险公司商户收入<span class='glyphicon glyphicon-remove-sign tabs_top_close'></span>");
		$("a[href='#"+tabInfo.tabDom.attr("id")+"']").attr("title",'保险公司商户收入');
		//渲染
		OPEN.balancePage(tabInfo,search_checkstate,income,14,'insInCom_detailed','in');   
	}
	/*点击保险公司经纪公司支出调用方法*/
	function insExpBrokers(tabInfo){
		/*添加筛选栏*/
		var search_checkstate=  '<div class="search-checkstate">'
		   +      '<div class="search_box" hidden>'
		   +            '<form class="form-inline" style="margin-bottom:15px;">'
		   +              '<div class="form-group">'
		   +                '<label for="">结算状态</label>'
		   +                '<select name="status" id="" class="form-control">'
		   +					'<option value="">全部</option>'
		   +					'<option value="1">待对账</option>'
		   +					'<option value="2">待收发票</option>'
		   +					'<option value="3">确认发票</option>'
		   +					'<option value="4">待打款</option>'
		   +					'<option value="5">等待对方收款</option>'
		   +					'<option value="6">已完成</option>'
		   +                '</select>'
		   +              '</div>'
		   +              '<div class="form-group">'
		   +                '<label for="ins_id">经纪公司</label>'
		   +                '<select name="ins_id" id="" class="form-control">'
		   +                '</select>'
		   +              '</div>'
		   +              '<div class="form-group">'
		   +                '<label for="">账单时间</label>'
		   +                '<input type="text" class="form-control" name="create_start start_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm" placeholder="">-<input type="text" class="form-control end_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm"  name="create_end" placeholder="">'
		   +              '</div>'
		   +              '<div class="form-group">'
		   +                '<input type="text" class="form-control" name="product_name"  style="width:160px !important;" placeholder="产品编号、产品名称">'
		   +              '</div>'
		   +        '<label class="btn btn-primary">查询</label>'
		   +			   '<label class="btn btn-default">重置</label>'
		   +            '</form>'
		   +      '</div>'
		   +      '<div class="checkState">'
		   +        '<button type="button" name="export" class="btn btn-primary" hidden>导出excel</button>'
		   +     '</div>'
		   +   '</div>';
		  //修改标签栏上显示文字 
		 $("a[href='#"+tabInfo.tabDom.attr("id")+"']").html("保险公司经纪公司支出<span class='glyphicon glyphicon-remove-sign tabs_top_close'></span>");
		 $("a[href='#"+tabInfo.tabDom.attr("id")+"']").attr("title",'保险公司经纪公司支出');
		 //渲染
		 OPEN.balancePage(tabInfo,search_checkstate,OPEN.expend,2,'insExpBrokers_detailed','exp');
		//获取保险公司列表
		var insLists_c={
				url:'Insurance/lists',
				params:{
					limit:1000
				},
				successFun:function(data){
					var dom=tabInfo.tabDom.find("select[name='ins_id']");
					 dom.html('<option value="">全部</option>');
					 $.each(data.info,function(key,val){
						 dom.append('<option value="'+val.id+'">'+val.name+'</option>');
					 });
				}
			}
		asys.post(insLists_c);
	} 
	/*点击保险公司平台支出调用方法*/
	function insExpPlat(tabInfo){
		/*添加筛选栏*/
		var search_checkstate=  '<div class="search-checkstate">'
		   +      '<div class="search_box" hidden>'
		   +            '<form class="form-inline" style="margin-bottom:15px;">'
		   +              '<div class="form-group">'
		   +                '<label for="">结算状态</label>'
		   +                '<select name="status" id="" class="form-control">'
		   +					'<option value="">全部</option>'
		   +					'<option value="1">待对账</option>'
		   +					'<option value="2">待收发票</option>'
		   +					'<option value="3">确认发票</option>'
		   +					'<option value="4">待打款</option>'
		   +					'<option value="5">等待对方收款</option>'
		   +					'<option value="6">已完成</option>'
		   +                '</select>'
		   +              '</div>'
		   +              '<div class="form-group">'
		   +                '<label for="">账单时间</label>'
		   +                '<input type="text" class="form-control" name="create_start start_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm" placeholder="">-<input type="text" class="form-control end_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm"  name="create_end" placeholder="">'
		   +              '</div>'
		   +              '<div class="form-group">'
		   +                '<input type="text" class="form-control" name="product_name"  style="width:160px !important;" placeholder="产品编号、产品名称">'
		   +              '</div>'
		   +        '<label class="btn btn-primary">查询</label>'
		   +			   '<label class="btn btn-default">重置</label>'
		   +            '</form>'
		   +      '</div>'
		   +      '<div class="checkState">'
		   +        '<button type="button" name="export" class="btn btn-primary" hidden>导出excel</button>'
		   +     '</div>'
		   +   '</div>';
		//修改标签栏上显示文字
		$("a[href='#"+tabInfo.tabDom.attr("id")+"']").html("保险公司平台支出<span class='glyphicon glyphicon-remove-sign tabs_top_close'></span>");
		$("a[href='#"+tabInfo.tabDom.attr("id")+"']").attr("title",'保险公司平台支出');
		//渲染
		OPEN.balancePage(tabInfo,search_checkstate,OPEN.expend,3,'insExpPlat_detailed','exp');
	}
	/*点击保险公司商户支出调用方法*/
	function insExpCom(tabInfo){
		/*添加筛选栏*/
		var search_checkstate=  '<div class="search-checkstate">'
		   +      '<div class="search_box" hidden>'
		   +            '<form class="form-inline" style="margin-bottom:15px;">'
		   +              '<div class="form-group">'
		   +                '<label for="">结算状态</label>'
		   +                '<select name="status" id="" class="form-control">'
		   +					'<option value="">全部</option>'
		   +					'<option value="1">待对账</option>'
		   +					'<option value="2">待收发票</option>'
		   +					'<option value="3">确认发票</option>'
		   +					'<option value="4">待打款</option>'
		   +					'<option value="5">等待对方收款</option>'
		   +					'<option value="6">已完成</option>'
		   +                '</select>'
		   +              '</div>'
		   +              '<div class="form-group">'
		   +                '<label for="">账单时间</label>'
		   +                '<input type="text" class="form-control" name="create_start start_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm" placeholder="">-<input type="text" class="form-control end_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm"  name="create_end" placeholder="">'
		   +              '</div>'
		   +              '<div class="form-group">'
		   +                '<input type="text" class="form-control" name="company_name" placeholder="商户名称">'
		   +              '</div>'
		   +              '<div class="form-group">'
		   +                '<input type="text" class="form-control" name="product_name"  style="width:160px !important;" placeholder="产品编号、产品名称">'
		   +              '</div>'
		   +        '<label class="btn btn-primary">查询</label>'
		   +			   '<label class="btn btn-default">重置</label>'
		   +            '</form>'
		   +      '</div>'
		   +      '<div class="checkState">'
		   +        '<button type="button" name="export" class="btn btn-primary" hidden>导出excel</button>'
		   +     '</div>'
		   +   '</div>';
		//修改标签栏上显示文字
		$("a[href='#"+tabInfo.tabDom.attr("id")+"']").html("保险公司商户支出<span class='glyphicon glyphicon-remove-sign tabs_top_close'></span>");
		$("a[href='#"+tabInfo.tabDom.attr("id")+"']").attr("title",'保险公司商户支出');
		//渲染
		OPEN.balancePage(tabInfo,search_checkstate,OPEN.expend,4,'insExpCom_detailed','exp');
	} 
		//保险公司统计概览
		function insStatis(tabInfo){
			//修改标签栏上显示文字
			$("a[href='#"+tabInfo.tabDom.attr("id")+"']").html("保险公司统计<span class='glyphicon glyphicon-remove-sign tabs_top_close'></span>");
			$("a[href='#"+tabInfo.tabDom.attr("id")+"']").attr("title",'保险公司统计');
			//渲染
			OPEN.setStatPage(tabInfo,1)
			//显示修改（隐藏或者更改文字）
			statBox=tabInfo.tabDom.find(".stat_box");
			statBox.find("[name=fwf_ins],[name=s_fwf_ins],[name=tgf_plat],[name=s_tgf_plat],[name=qdf],[name=s_qdf]").parent().parent().hide();
			statBox.find("[name=s_fwf_insurer]").parent().find("span").text("技术服务费");
			statBox.find("[name=fwf_insurer]").parent().find("span").text("技术服务费");
		}
	  
	   /*点击经纪公司收入调用方法*/
	  function brokersIn(tabInfo){
		  /*添加筛选栏*/
		 var search_checkstate=  '<div class="search-checkstate">'
			   +      '<div class="search_box" hidden>'
			   +            '<form class="form-inline" style="margin-bottom:15px;">'
			   +              '<div class="form-group">'
			   +                '<label for="status">结算状态</label>'
			   +                '<select name="status" id="" class="form-control">'
			   +					'<option value="">全部</option>'
			   +					'<option value="1">待对账</option>'
			   +					'<option value="2">待开发票</option>'
			   +					'<option value="3">发票待确认</option>'
			   +					'<option value="4">等待对方打款</option>'
			   +					'<option value="5">待收款</option>'
			   +					'<option value="6">已完成</option>'
			   +                '</select>'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<label for="">账单时间</label>'
			   +                '<input type="text" class="form-control" name="create_start start_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm" placeholder="">-<input type="text" class="form-control end_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm"  name="create_end" placeholder="">'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<input type="text" class="form-control" name="product_name"  style="width:160px !important;" placeholder="产品编号、产品名称">'
			   +              '</div>'
			   +        '<label class="btn btn-primary">查询</label>'
			   +			   '<label class="btn btn-default">重置</label>'
			   +            '</form>'
			   +      '</div>'
			   +      '<div class="checkState">'
			   +        '<button type="button" name="export" class="btn btn-primary" hidden>导出excel</button>'
			   +     '</div>'
			   +   '</div>',
			   //收入配置特殊化
			   income={
					dataParamName:['date','source_name','code','product_code','product_name','policy_num','amt','tdf_amt','status'],
					power:OPEN.income.power,
					getValueText:OPEN.income.getValueText,
					name:"income",
					url:'Bill/lists'
				};
		//修改标签栏上显示文字
		$("a[href='#"+tabInfo.tabDom.attr("id")+"']").html("经纪公司收入<span class='glyphicon glyphicon-remove-sign tabs_top_close'></span>");
		$("a[href='#"+tabInfo.tabDom.attr("id")+"']").attr("title",'经纪公司收入');
		//渲染
		OPEN.balancePage(tabInfo,search_checkstate,income,5,'brokersIn_detailed','in');
				
	  }
	  
	    /*点击经纪公司商户支出调用方法*/
	  function brokersExpCom(tabInfo){
		  /*添加筛选栏*/
		 var search_checkstate=  '<div class="search-checkstate">'
			   +      '<div class="search_box" hidden>'
			   +            '<form class="form-inline" style="margin-bottom:15px;">'
			   +              '<div class="form-group">'
		       +                '<label for="">结算状态</label>'
		       +                '<select name="status" id="" class="form-control">'
		       +					'<option value="">全部</option>'
		       +					'<option value="1">待对账</option>'
		       +					'<option value="2">待收发票</option>'
		       +					'<option value="3">确认发票</option>'
		       +					'<option value="4">待打款</option>'
			   +					'<option value="5">等待对方收款</option>'
			   +					'<option value="6">已完成</option>'
			   +                '</select>'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<label for="">账单时间</label>'
			   +                '<input type="text" class="form-control" name="create_start start_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm" placeholder="">-<input type="text" class="form-control end_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm"  name="create_end" placeholder="">'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<input type="text" class="form-control" name="company_name" placeholder="商户名称">'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<input type="text" class="form-control" name="product_name"  style="width:160px !important;" placeholder="产品编号、产品名称">'
			   +              '</div>'
			   +        '<label class="btn btn-primary">查询</label>'
			   +			   '<label class="btn btn-default">重置</label>'
			   +            '</form>'
			   +      '</div>'
			   +      '<div class="checkState">'
			   +        '<button type="button" name="export" class="btn btn-primary" hidden>导出excel</button>'
			   +     '</div>'
			   +   '</div>';
			 //修改标签栏上显示文字
			$("a[href='#"+tabInfo.tabDom.attr("id")+"']").html("经纪公司商户支出<span class='glyphicon glyphicon-remove-sign tabs_top_close'></span>");
			$("a[href='#"+tabInfo.tabDom.attr("id")+"']").attr("title",'经纪公司商户支出');
			//渲染
			OPEN.balancePage(tabInfo,search_checkstate,OPEN.expend,6,'brokersExpCom_detailed','exp');  
	  }
	/*点击经纪公司平台支出调用方法*/
	function brokersExpPlat(tabInfo){
		  /*添加筛选栏*/
		var search_checkstate=  '<div class="search-checkstate">'
			   +      '<div class="search_box" hidden>'
			   +            '<form class="form-inline" style="margin-bottom:15px;">'
			   +              '<div class="form-group">'
		       +                '<label for="">结算状态</label>'
		       +                '<select name="status" id="" class="form-control">'
		       +					'<option value="">全部</option>'
		       +					'<option value="1">待对账</option>'
		       +					'<option value="2">待收发票</option>'
		       +					'<option value="3">确认发票</option>'
		       +					'<option value="4">待打款</option>'
			   +					'<option value="5">等待对方收款</option>'
			   +					'<option value="6">已完成</option>'
			   +                '</select>'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<label for="">账单时间</label>'
			   +                '<input type="text" class="form-control" name="create_start start_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm" placeholder="">-<input type="text" class="form-control end_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm"  name="create_end" placeholder="">'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<input type="text" class="form-control" name="product_name" placeholder="产品名称">'
			   +              '</div>'
			   +        '<label class="btn btn-primary">查询</label>'
			   +			   '<label class="btn btn-default">重置</label>'
			   +            '</form>'
			   +      '</div>'
			   +      '<div class="checkState">'
			   +        '<button type="button" name="export" class="btn btn-primary" hidden>导出excel</button>'
			   +     '</div>'
			   +   '</div>';
		//修改标签栏上显示文字
		$("a[href='#"+tabInfo.tabDom.attr("id")+"']").html("经纪公司平台支出<span class='glyphicon glyphicon-remove-sign tabs_top_close'></span>");
		$("a[href='#"+tabInfo.tabDom.attr("id")+"']").attr("title",'经纪公司平台支出');
		//渲染
		OPEN.balancePage(tabInfo,search_checkstate,OPEN.expend,7,'brokersExpPlat_detailed','exp');   
	}	
	/*点击经纪公司保险公司支出调用方法*/
	function brokersExpIns(tabInfo){
		/*添加筛选栏*/
		var search_checkstate=  '<div class="search-checkstate">'
			   +      '<div class="search_box" hidden>'
			   +            '<form class="form-inline" style="margin-bottom:15px;">'
			   +              '<div class="form-group">'
		       +                '<label for="">结算状态</label>'
		       +                '<select name="status" id="" class="form-control">'
		       +					'<option value="">全部</option>'
		       +					'<option value="1">待对账</option>'
		       +					'<option value="2">待收发票</option>'
		       +					'<option value="3">确认发票</option>'
		       +					'<option value="4">待打款</option>'
			   +					'<option value="5">等待对方收款</option>'
			   +					'<option value="6">已完成</option>'
			   +                '</select>'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<label for="insurer_id">保险公司</label>'
			   +                '<select name="insurer_id" id="insurer_id" class="form-control">'
			   +                '</select>'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<label for="">账单时间</label>'
			   +                '<input type="text" class="form-control" name="create_start start_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm" placeholder="">-<input type="text" class="form-control end_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm"  name="create_end" placeholder="">'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<input type="text" class="form-control" name="product_name" placeholder="产品名称">'
			   +              '</div>'
			   +        '<label class="btn btn-primary">查询</label>'
			   +			   '<label class="btn btn-default">重置</label>'
			   +            '</form>'
			   +      '</div>'
			   +      '<div class="checkState">'
			   +        '<button type="button" name="export" class="btn btn-primary" hidden>导出excel</button>'
			   +     '</div>'
			   +   '</div>';
		//修改标签栏上显示文字	
		$("a[href='#"+tabInfo.tabDom.attr("id")+"']").html("经纪公司保险公司支出<span class='glyphicon glyphicon-remove-sign tabs_top_close'></span>");
		$("a[href='#"+tabInfo.tabDom.attr("id")+"']").attr("title",'经纪公司保险公司支出');
		//渲染
		OPEN.balancePage(tabInfo,search_checkstate,OPEN.expend,13,'brokersExpIns_detailed','exp');   
		//获取保险公司列表
		var insLists_c={
			url:'Insurer/lists',
			params:{
				limit:1000
			},
			successFun:function(data){
				var dom=tabInfo.tabDom.find("select[name='insurer_id']");
				 dom.html('<option value="">全部</option>');
				 $.each(data.info,function(key,val){
					 dom.append('<option value="'+val.id+'">'+val.name+'</option>');
				 });
			}
		}
		asys.post(insLists_c);
	}
		//保险经纪统计概览
	function brokersStatis(tabInfo){
		//修改标签栏上显示文字
		$("a[href='#"+tabInfo.tabDom.attr("id")+"']").html("经纪公司统计<span class='glyphicon glyphicon-remove-sign tabs_top_close'></span>");
		 $("a[href='#"+tabInfo.tabDom.attr("id")+"']").attr("title",'经纪公司统计');
		//渲染
		OPEN.setStatPage(tabInfo,2)
		//显示修改（隐藏或者更改文字）
		statBox=tabInfo.tabDom.find(".stat_box");
		statBox.find("[name=s_fwf_insurer],[name=fwf_insurer],[name=qdf],[name=s_qdf],[name=s_tgf_plat],[name=tgf_plat]").parent().parent().hide();
		statBox.find("[name=s_fwf_ins]").parent().find("span").text("技术服务费");
		statBox.find("[name=fwf_ins]").parent().find("span").text("技术服务费");
	}
	  
	  
	   /*点击平台经纪公司收入调用方法*/
	  function platInBrokers(tabInfo){
		  /*添加筛选栏*/
		 var search_checkstate=  '<div class="search-checkstate">'
			   +      '<div class="search_box" hidden>'
			   +            '<form class="form-inline" style="margin-bottom:15px;">'
			   +              '<div class="form-group">'
			   +                '<label for="status">结算状态</label>'
			   +                '<select name="status" id="" class="form-control">'
			   +					'<option value="">全部</option>'
			   +					'<option value="1">待对账</option>'
			   +					'<option value="2">待开发票</option>'
			   +					'<option value="3">发票待确认</option>'
			   +					'<option value="4">等待对方打款</option>'
			   +					'<option value="5">待收款</option>'
			   +					'<option value="6">已完成</option>'
			   +                '</select>'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<label for="ins_id">经纪公司</label>'
			   +                '<select name="ins_id" id="" class="form-control">'
			   +                '</select>'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<label for="">账单时间</label>'
			   +                '<input type="text" class="form-control" name="create_star start_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm" placeholder="">-<input type="text" class="form-control end_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm"  name="create_end" placeholder="">'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<input type="text" class="form-control" name="company_name" placeholder="商户名称">'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<input type="text" class="form-control" name="product_name"  style="width:160px !important;" placeholder="产品编号、产品名称">'
			   +              '</div>'
			   +        '<label class="btn btn-primary">查询</label>'
			   +			   '<label class="btn btn-default">重置</label>'
			   +            '</form>'
			   +      '</div>'
			   +      '<div class="checkState">'
			   +        '<button type="button" name="export" class="btn btn-primary" hidden>导出excel</button>'
			   +     '</div>'
			   +   '</div>';
			//修改标签栏上显示文字
			$("a[href='#"+tabInfo.tabDom.attr("id")+"']").html("平台经纪公司收入<span class='glyphicon glyphicon-remove-sign tabs_top_close'></span>");
			 $("a[href='#"+tabInfo.tabDom.attr("id")+"']").attr("title",'平台经纪公司收入');
			//渲染
			 OPEN.balancePage(tabInfo,search_checkstate,OPEN.income,9,'platInBrokers_detailed','in');
			//获取经纪公司列表，并渲染
			var insLists_c={
					url:'Insurance/lists',
					params:{
						limit:1000
					},
					successFun:function(data){
						var dom=tabInfo.tabDom.find("select[name='ins_id']");
						 dom.html('<option value="">全部</option>');
						 $.each(data.info,function(key,val){
							 dom.append('<option value="'+val.id+'">'+val.name+'</option>');
						 });
					}
				}
			asys.post(insLists_c);
			
	  }
	  
	    /*点击平台保险公司收入调用方法*/
	function platInIns(tabInfo){
		  /*添加筛选栏*/
		 var search_checkstate=  '<div class="search-checkstate">'
			   +      '<div class="search_box" hidden>'
			   +            '<form class="form-inline" style="margin-bottom:15px;">'
			   +              '<div class="form-group">'
			   +                '<label for="status">结算状态</label>'
			   +                '<select name="status" id="" class="form-control">'
			   +					'<option value="">全部</option>'
			   +					'<option value="1">待对账</option>'
			   +					'<option value="2">待开发票</option>'
			   +					'<option value="3">发票待确认</option>'
			   +					'<option value="4">等待对方打款</option>'
			   +					'<option value="5">待收款</option>'
			   +					'<option value="6">已完成</option>'
			   +                '</select>'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<label for="">账单时间</label>'
			   +                '<input type="text" class="form-control" name="create_start start_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm" placeholder="">-<input type="text" class="form-control end_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm"  name="create_end" placeholder="">'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<input type="text" class="form-control" name="product_name"  style="width:160px !important;" placeholder="产品编号、产品名称">'
			   +              '</div>'
			   +        '<label class="btn btn-primary">查询</label>'
			   +			   '<label class="btn btn-default">重置</label>'
			   +            '</form>'
			   +      '</div>'
			   +      '<div class="checkState">'
			   +        '<button type="button" name="export" class="btn btn-primary" hidden>导出excel</button>'
			   +     '</div>'
			   +   '</div>';
		//修改标签栏上显示文字	  
	   $("a[href='#"+tabInfo.tabDom.attr("id")+"']").html("平台保险公司收入<span class='glyphicon glyphicon-remove-sign tabs_top_close'></span>");
	   $("a[href='#"+tabInfo.tabDom.attr("id")+"']").attr("title",'平台保险公司收入');
	   //渲染
	  OPEN.balancePage(tabInfo,search_checkstate,OPEN.income,8,'platInIns_detailed','in');
	}
		/*点击平台渠道支出调用方法*/
	  function platExpChannel(tabInfo){
		  /*添加筛选栏*/
		 var search_checkstate=  '<div class="search-checkstate">'
			   +      '<div class="search_box" hidden>'
			   +            '<form class="form-inline" style="margin-bottom:15px;">'
			   +              '<div class="form-group">'
		       +                '<label for="">结算状态</label>'
		       +                '<select name="status" id="" class="form-control">'
		       +					'<option value="">全部</option>'
		       +					'<option value="1">待对账</option>'
		       +					'<option value="2">待收发票</option>'
		       +					'<option value="3">确认发票</option>'
		       +					'<option value="4">待打款</option>'
			   +					'<option value="5">等待对方收款</option>'
			   +					'<option value="6">已完成</option>'
			   +                '</select>'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<label for="partner_id">渠道公司</label>'
			   +                '<select name="partner_id" id="" class="form-control">'
			   +                '</select>'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<label for="">账单时间</label>'
			   +                '<input type="text" class="form-control" name="create_start start_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm" placeholder="">-<input type="text" class="form-control end_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm"  name="create_end" placeholder="">'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<input type="text" class="form-control" name="product_name"  style="width:160px !important;" placeholder="产品编号、产品名称">'
			   +              '</div>'
			   +        '<label class="btn btn-primary">查询</label>'
			   +			   '<label class="btn btn-default">重置</label>'
			   +            '</form>'
			   +      '</div>'
			   +      '<div class="checkState">'
			   +        '<button type="button" name="export" class="btn btn-primary" hidden>导出excel</button>'
			   +     '</div>'
			   +   '</div>';
		//修改标签栏上显示文字
		$("a[href='#"+tabInfo.tabDom.attr("id")+"']").html("平台渠道支出<span class='glyphicon glyphicon-remove-sign tabs_top_close'></span>");
		$("a[href='#"+tabInfo.tabDom.attr("id")+"']").attr("title",'平台渠道支出');
		//渲染
		OPEN.balancePage(tabInfo,search_checkstate,OPEN.expend,11,'platExpChannel_detailed','exp');   
		//获取渠道列表，并渲染
		var c={
				url:'Partner/lists',
				params:{
					limit:1000
				},
				successFun:function(data){
					var dom=tabInfo.tabDom.find("select[name='ins_id']");
					 dom.html('<option value="">全部</option>');
					 $.each(data.info,function(key,val){
						 dom.append('<option value="'+val.id+'">'+val.name+'</option>');
					 });
				}
			}
		asys.post(c);
	}
		/*点击平台商户支出调用方法*/
	  function platExpCom(tabInfo){
		  /*添加筛选栏*/
		 var search_checkstate=  '<div class="search-checkstate">'
			   +      '<div class="search_box" hidden>'
			   +            '<form class="form-inline" style="margin-bottom:15px;">'
			   +              '<div class="form-group">'
		       +                '<label for="">结算状态</label>'
		       +                '<select name="status" id="" class="form-control">'
		       +					'<option value="">全部</option>'
		       +					'<option value="1">待对账</option>'
		       +					'<option value="2">待收发票</option>'
		       +					'<option value="3">确认发票</option>'
		       +					'<option value="4">待打款</option>'
			   +					'<option value="5">等待对方收款</option>'
			   +					'<option value="6">已完成</option>'
			   +                '</select>'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<label for="">账单时间</label>'
			   +                '<input type="text" class="form-control" name="create_start start_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm" placeholder="">-<input type="text" class="form-control end_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm"  name="create_end" placeholder="">'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<input type="text" class="form-control" name="company_name" placeholder="商户名称">'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<input type="text" class="form-control" name="product_name"  style="width:160px !important;" placeholder="产品编号、产品名称">'
			   +              '</div>'
			   +        '<label class="btn btn-primary">查询</label>'
			   +			   '<label class="btn btn-default">重置</label>'
			   +            '</form>'
			   +      '</div>'
			   +      '<div class="checkState">'
			   +        '<button type="button" name="export" class="btn btn-primary" hidden>导出excel</button>'
			   +     '</div>'
			   +   '</div>';
			//修改标签栏上显示文字
			$("a[href='#"+tabInfo.tabDom.attr("id")+"']").html("平台商户支出<span class='glyphicon glyphicon-remove-sign tabs_top_close'></span>");
			$("a[href='#"+tabInfo.tabDom.attr("id")+"']").attr("title",'平台商户支出');
			//渲染
			OPEN.balancePage(tabInfo,search_checkstate,OPEN.expend,10,'platExpCom_detailed','exp');   
		}
		//平台运营统计概览
		function platStatis(tabInfo){
			//修改标签栏上显示文字
			$("a[href='#"+tabInfo.tabDom.attr("id")+"']").html("平台统计<span class='glyphicon glyphicon-remove-sign tabs_top_close'></span>");
			$("a[href='#"+tabInfo.tabDom.attr("id")+"']").attr("title",'平台统计');
			//渲染
			OPEN.setStatPage(tabInfo,3)
			//显示修改（隐藏或者更改显示文字）
			statBox=tabInfo.tabDom.find(".stat_box");
			statBox.find("[name=jjf],[name=s_jjf]").parent().parent().hide();
			statBox.find("[name=s_fwf_ins]").parent().find("span").text("技术服务费(经纪公司)");
			statBox.find("[name=s_fwf_insurer]").parent().find("span").text("技术服务费(保险公司)");
		}
	  //销售渠道收入
	function channelIn(tabInfo){
			/*添加筛选栏*/
			var search_checkstate=  '<div class="search-checkstate">'
			   +      '<div class="search_box" hidden>'
			   +            '<form class="form-inline" style="margin-bottom:15px;">'
			   +              '<div class="form-group">'
			   +                '<label for="status">结算状态</label>'
			   +                '<select name="status" id="" class="form-control">'
			   +					'<option value="">全部</option>'
			   +					'<option value="1">待对账</option>'
			   +					'<option value="2">待开发票</option>'
			   +					'<option value="3">发票待确认</option>'
			   +					'<option value="4">等待对方打款</option>'
			   +					'<option value="5">待收款</option>'
			   +					'<option value="6">已完成</option>'
			   +                '</select>'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<label for="">账单时间</label>'
			   +                '<input type="text" class="form-control" name="create_start start_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm" placeholder="">-<input type="text" class="form-control end_date" data-date-format="yyyy-mm" data-link-format="yyyy-mm"  name="create_end" placeholder="">'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<input type="text" class="form-control" name="company_name" placeholder="请输入商户名称">'
			   +              '</div>'
			   +              '<div class="form-group">'
			   +                '<input type="text" class="form-control" name="product_name" placeholder="请输入产品名称">'
			   +              '</div>'
			   +        '<label class="btn btn-primary">查询</label>'
			   +			   '<label class="btn btn-default">重置</label>'
			   +            '</form>'
			   +      '</div>'
			   +      '<div class="checkState">'
			   +        '<button type="button" name="export" class="btn btn-primary" hidden>导出excel</button>'
			   +     '</div>'
			   +   '</div>';
			//修改标签栏上显示文字
			$("a[href='#"+tabInfo.tabDom.attr("id")+"']").html("渠道收入<span class='glyphicon glyphicon-remove-sign tabs_top_close'></span>");
			$("a[href='#"+tabInfo.tabDom.attr("id")+"']").attr("title",'渠道收入');
			//渲染
			OPEN.balancePage(tabInfo,search_checkstate,OPEN.income,12,'channelIn_detailed','in');
		  
	}
	//销售渠道统计概览
	function channelStatis(tabInfo){
		//修改标签栏上显示文字
		$("a[href='#"+tabInfo.tabDom.attr("id")+"']").html("渠道统计<span class='glyphicon glyphicon-remove-sign tabs_top_close'></span>");
		$("a[href='#"+tabInfo.tabDom.attr("id")+"']").attr("title",'渠道统计');
		//渲染
		OPEN.setStatPage(tabInfo,4)
		//显示修改（隐藏不需要的模块）
		statBox=tabInfo.tabDom.find(".stat_box");
		statBox.find("[name=s_tgf_plat],[name=tgf_plat],[name=jjf],[name=s_fwf_ins],[name=fwf_ins],[name=s_jjf],[name=s_fwf_insurer],[name=fwf_insurer]").parent().parent().hide();
			
	}
	  
	  //保险公司管理点击事件运行方法
	  function chanIns(tabInfo){
		    /*添加筛选栏*/
			var search_checkstate= '<div class="search-checkstate">'
                +    '<div class="checkState">'
                +      '<button type="button" name="add" class="btn btn-primary" hidden>添加</button>'
                +    '</div>'
                + '</div>',
			   pageConfig={
					tabInfo:tabInfo,//dom信息对象
					paramConfig:OPEN.chanIns,//表格的配置
					search_checkstate:search_checkstate,//筛选栏html
					setSearchPower:setSearchPower,//权限请求成功后执行方法
					optionClick:optionClick,//可点击标签的点击事件（operation Css下的a标签点击事件）
					setOpname:setOpname//权限列显示方法（有权限判断和根据数据判断是否显示等）
				},
				fcodes=[],
				getData=OPEN.initPage(pageConfig);//初始化页面

			//权限请求成功后调用的方法，记录权限信息，并查看是否有表格之上的筛选栏或者按钮权限，然后请求数据渲染表格
			function setSearchPower(data){
				$.each(data.info,function(){
					var fcode=this.fcode.split("_")[1];//将权限名称拆分，取最后一个
					fcodes.push(fcode);//记录权限列表
					if(fcode=='add'){//判断是否有添加权限
						tabInfo.tabDom.find("button[name='add']").show();
					}
					
				});
				getData(1); 
			}
			
		//添加按钮绑定事件
		tabInfo.tabDom.find("button[name='add']").click(function(){
			showInsBox();
		});
		/*
			添加保险公司和编辑保险公司
				id: 保险公司id  id为空时代表添加保险公司
		*/
		function showInsBox(id){
			var config={
				title:id?'修改保险公司':'添加保险公司',
				html:OPEN.chan_add_html,
				confirmFun:function(obj){//模态框中确认按钮点击事件
					var t = obj.find(".form-horizontal").serializeArray(),
						error=false,
						bank_type=modal.find("select[name=bank_type]").val(),data={};
					$.each(t, function(){//组装数据
						if(this.value){
							data[this.name] = this.value;	
						}
						
					});
					//验证数据
					if(!data.name){
						asys.showAlert({title:'温馨提醒',msg:'请输入保险公司名称',isCancel:false});
						return;
					}
					if(bank_type==1 && data.b_bank_name){//银行卡并且输入了银行卡名称则需要验证卡号和姓名
						
						if(!data.b_account_name){
							asys.showAlert({title:'温馨提醒',msg:'请输入开户人姓名',isCancel:false});
							return;
						}
						if(!util.bankCardValidation(data.b_card_number)){
							asys.showAlert({title:'温馨提醒',msg:'请输正确的银行卡号',isCancel:false});
							return;
						}
						data.bank_name=data.b_bank_name;
						data.account_name=data.b_account_name;
						data.card_number=data.b_card_number;
					}else if(data.ali_card_number){//支付宝并且支付宝账号名称 则需要验证真实姓名
						if(!data.ali_account_name){
							asys.showAlert({title:'温馨提醒',msg:'请输入真实姓名',isCancel:false});
							return;
						}
						
						data.account_name=data.ali_account_name;
						data.card_number=data.ali_card_number;
					}
					if(data.invoice_mobile && !util.mobileValidation(data.invoice_mobile)){
						asys.showAlert({title:'温馨提醒',msg:'请输入正确的联系电话',isCancel:false});
						return;
					}
					//保存数据
					var config={
						url:'Insurer/update_do',
						params:{
							id:id?id:'',
							name:data.name,
							account_name:data.account_name,
							card_number:data.card_number,
							bank_name:data.bank_name?data.bank_name:'',
							bank_type:data.bank_type,
							invoice_name:data.invoice_name,
							invoice_number:data.invoice_number,
							invoice_addr:data.invoice_addr,
							invoice_mobile:data.invoice_mobile,
							invoice_subject:data.invoice_subject,
							invoice_rece:data.invoice_rece
						},
						successFun:function(){
							obj.modal('hide');
							getData(1);
						}
					}
					asys.post(config);
				}
			}
			var modal=asys.showModalHtml(config);
			//银行卡类型更改
			modal.find("select[name=bank_type]").change(function(){
				if(this.value==1){//银行卡
					modal.find(".bank_box").show();
					modal.find(".ali_box").hide();
				}else{//支付宝
					modal.find(".bank_box").hide();
					modal.find(".ali_box").show();
				}
			})
			if(id){
				getInsInfo();
			}
			//获取保险公司详细信息，并渲染数据
			function getInsInfo(){
				var config={
					url:'Insurer/info',
					params:{
						id:id
					},
					successFun:function(data){
						var info=data.info;
						modal.find("input[name=name]").val(info.name?info.name:'');
						if(info.invoice_info){
							var invoice_info=info.invoice_info;
							modal.find("textarea[name=invoice_rece]").val(invoice_info.rece?invoice_info.rece:'');
							modal.find("input[name=invoice_subject]").val(invoice_info.subject?invoice_info.subject:'');
							modal.find("input[name=invoice_mobile]").val(invoice_info.mobile?invoice_info.mobile:'');
							modal.find("input[name=invoice_addr]").val(invoice_info.addr?invoice_info.addr:'');
							modal.find("input[name=invoice_number]").val(invoice_info.number?invoice_info.number:'');
							modal.find("input[name=invoice_name]").val(invoice_info.name?invoice_info.name:'');
						}
						if(info.bank_card_info){
							var bank_card_info=info.bank_card_info
							modal.find("select[name=bank_type]").val(bank_card_info.type?bank_card_info.type:'1');
							if(bank_card_info.type==2){
								modal.find(".bank_box").hide();
								modal.find(".ali_box").show();
								modal.find("input[name=ali_card_number]").val(bank_card_info.card_number?bank_card_info.card_number:'');
								modal.find("input[name=ali_account_name]").val(bank_card_info.account_name?bank_card_info.account_name:'');
							}else {
								modal.find(".bank_box").show();
								modal.find(".ali_box").hide();
								modal.find("input[name=b_bank_name]").val(bank_card_info.bank_name?bank_card_info.bank_name:'');
								modal.find("input[name=b_card_number]").val(bank_card_info.card_number?bank_card_info.card_number:'');
								modal.find("input[name=b_account_name]").val(bank_card_info.account_name?bank_card_info.account_name:'');
							}
						}
					}
				}
				asys.post(config);
			}
		}
		//权限请求成功后调用的方法，记录权限信息，并查看是否有表格之上的筛选栏或者按钮权限，然后请求数据渲染表格
		function setOpname(power,data){
			var html="";
			html+= '<td class="operation">'
			$.each(power,function(k,v){
				if(fcodes.indexOf(v.fcode)>-1){
					if(v.fcode=='delete' && data.status==0){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}if(v.fcode=='delete'){
						html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
					}else if(v.fcode=='disabled' && data.status==1){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}else if(v.fcode=='disabled'){
						html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
					}else if(v.fcode=='enabled' && data.status==0){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}else if(v.fcode=='enabled'){
						html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
					}else if(v.fcode=='edit'){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}
				}
			});
			html+='</td>';
			return html;
		}
					
		//操作单元格点击事件
		function optionClick(){
			var self=this,config,
				opname=$(self).attr("opname"),//获取操作名称
				//本次操作所在列的数据
				rowData=$(self).closest("tr")[0].trData;
			if(opname=='delete'){//删除
				config={
					title:'温馨提醒',
					html:"您确认删除该条记录吗？",
					confirmFun:function(obj){
						var config={
							url:'Insurer/status_do',
							params:{
								id:rowData.id,
								type:-1,
							},
							successFun:function(){
								obj.modal('hide');
								$(self).closest("tr").remove();
							}
						}
						asys.post(config);
					}
				}
			}else if(opname=="disabled"){ // 单击禁用时
				config={
					title:'温馨提醒',
					html:"您确认禁用吗？",
					confirmFun:function(obj){
						var config={
							url:'Insurer/status_do',
							params:{
								id:rowData.id,
								type:1,
							},
							successFun:function(){
								//禁用成功后显示改变
								$($(self).closest("tr").find("td")[3]).html("禁用");
								$(self).hide();
								$(self).parent().find("a[opname='enabled']").show();
								$(self).parent().find("a[opname='delete']").show();
								obj.modal('hide');
							}
						}
						asys.post(config);
					}
				}
			}else if(opname=="enabled"){//解除禁用
				config={
					title:'温馨提醒',
					html:"您确认解除禁用吗？",
					confirmFun:function(obj){
						var config={
							url:'Insurer/status_do',
							params:{
								id:rowData.id,
								type:2,
							},
							successFun:function(){
								//解除禁用成功后显示改
								$($(self).closest("tr").find("td")[3]).html("正常");
								$(self).hide();
								$(self).parent().find("a[opname='disabled']").show();
								$(self).parent().find("a[opname='delete']").hide();
								obj.modal('hide');
							}
						}
						asys.post(config);
					}
				}
			}else if(opname='edit'){
				showInsBox(rowData.id);
			}
			if(config){
				asys.showModalHtml(config);
			}
		}
	  }
	  //经纪公司管理
	  function chanBrokers(tabInfo){
		    /*添加筛选栏*/
		var search_checkstate= '<div class="search-checkstate">'
                +    '<div class="checkState">'
                +      '<button type="button" name="add" class="btn btn-primary" hidden>添加</button>'
                +    '</div>'
                + '</div>',
			pageConfig={
				tabInfo:tabInfo,//dom信息对象
				paramConfig:OPEN.chanBrokers,//表格的配置
				search_checkstate:search_checkstate,//筛选栏html
				setSearchPower:setSearchPower,//权限请求成功后执行方法
				optionClick:optionClick,//可点击标签的点击事件（operation Css下的a标签点击事件）
				setOpname:setOpname//权限列显示方法（有权限判断和根据数据判断是否显示等）
			},
			fcodes=[],
			getData=OPEN.initPage(pageConfig);
		//权限请求成功后调用的方法，记录权限信息，并查看是否有表格之上的筛选栏或者按钮权限，然后请求数据渲染表格
		function setSearchPower(data){
			$.each(data.info,function(){
				var fcode=this.fcode.split("_")[1];//将权限名称拆分，取最后一个
				fcodes.push(fcode);//记录权限列表
				if(fcode=='add'){//判断是否有添加权限
					tabInfo.tabDom.find("button[name='add']").show();
				}
				
			});
			getData(1); 
		}
		//添加按钮绑定事件
		tabInfo.tabDom.find("button[name='add']").click(function(){
			showBrokersBox();
		});
		/*
			添加经纪公司或者编辑经纪公司方法
				id: 经纪公司ID 如果为空代表添加经纪公司
		*/
		function showBrokersBox(id){
			var config={
				title:id?'修改经纪公司':'添加经纪公司',
				html:OPEN.chan_add_html,
				confirmFun:function(obj){//模态框中确认按钮点击事件
					var t = obj.find(".form-horizontal").serializeArray(),
						error=false,
						bank_type=modal.find("select[name=bank_type]").val(),data={};
					$.each(t, function(){//组装数据
						if(this.value){
							data[this.name] = this.value;	
						}
						
					});
					//验证数据
					if(!data.name){
						asys.showAlert({title:'温馨提醒',msg:'请输入经纪公司名称',isCancel:false});
						return;
					}
					if(bank_type==1 && data.b_bank_name){//银行卡并且输入了银行卡名称则需要验证卡号和姓名
						
						if(!data.b_account_name){
							asys.showAlert({title:'温馨提醒',msg:'请输入开户人姓名',isCancel:false});
							return;
						}
						if(!util.bankCardValidation(data.b_card_number)){
							asys.showAlert({title:'温馨提醒',msg:'请输正确的银行卡号',isCancel:false});
							return;
						}
						data.bank_name=data.b_bank_name;
						data.account_name=data.b_account_name;
						data.card_number=data.b_card_number;
					}else if(data.ali_card_number){//支付宝并且支付宝账号名称 则需要验证真实姓名
						if(!data.ali_account_name){
							asys.showAlert({title:'温馨提醒',msg:'请输入真实姓名',isCancel:false});
							return;
						}
						
						data.account_name=data.ali_account_name;
						data.card_number=data.ali_card_number;
					}
					if(data.invoice_mobile && !util.mobileValidation(data.invoice_mobile)){
						asys.showAlert({title:'温馨提醒',msg:'请输入正确的手机号',isCancel:false});
						return;
					}
					//保存数据
					var config={
						url:'Insurance/update_do',
						params:{
							id:id?id:'',
							name:data.name,
							account_name:data.account_name,
							card_number:data.card_number,
							bank_name:data.bank_name?data.bank_name:'',
							bank_type:data.bank_type,
							invoice_name:data.invoice_name,
							invoice_number:data.invoice_number,
							invoice_addr:data.invoice_addr,
							invoice_mobile:data.invoice_mobile,
							invoice_subject:data.invoice_subject,
							invoice_rece:data.invoice_rece
						},
						successFun:function(){
							obj.modal('hide');
							getData(1);
						}
					}
					asys.post(config);
						
					
				}
			}
			var modal=asys.showModalHtml(config);
			//提示更改
			modal.find("label[for=name]").html("经纪公司");
			modal.find("input[name=name]").attr('placeholder',"请输入经纪公司名称");
			modal.find("select[name=bank_type]").change(function(){
				if(this.value==1){//银行卡
					modal.find(".bank_box").show();
					modal.find(".ali_box").hide();
				}else{//支付宝
					modal.find(".bank_box").hide();
					modal.find(".ali_box").show();
				}
			})
			if(id){
				getInsInfo();
			}
			//获取经纪公司信息（编辑）
			function getInsInfo(){
				var config={
					url:'Insurance/info',
					params:{
						id:id
					},
					successFun:function(data){
						var info=data.info;
						modal.find("input[name=name]").val(info.name?info.name:'');
						if(info.invoice_info){
							var invoice_info=info.invoice_info;
							modal.find("textarea[name=invoice_rece]").val(invoice_info.rece?invoice_info.rece:'');
							modal.find("input[name=invoice_subject]").val(invoice_info.subject?invoice_info.subject:'');
							modal.find("input[name=invoice_mobile]").val(invoice_info.mobile?invoice_info.mobile:'');
							modal.find("input[name=invoice_addr]").val(invoice_info.addr?invoice_info.addr:'');
							modal.find("input[name=invoice_number]").val(invoice_info.number?invoice_info.number:'');
							modal.find("input[name=invoice_name]").val(invoice_info.name?invoice_info.name:'');
						}
						if(info.bank_card_info){
							var bank_card_info=info.bank_card_info
							modal.find("select[name=bank_type]").val(bank_card_info.type?bank_card_info.type:'1');
							if(bank_card_info.type==2){
								modal.find(".bank_box").hide();
								modal.find(".ali_box").show();
								modal.find("input[name=ali_card_number]").val(bank_card_info.card_number?bank_card_info.card_number:'');
								modal.find("input[name=ali_account_name]").val(bank_card_info.account_name?bank_card_info.account_name:'');
							}else {
								modal.find(".bank_box").show();
								modal.find(".ali_box").hide();
								modal.find("input[name=b_bank_name]").val(bank_card_info.bank_name?bank_card_info.bank_name:'');
								modal.find("input[name=b_card_number]").val(bank_card_info.card_number?bank_card_info.card_number:'');
								modal.find("input[name=b_account_name]").val(bank_card_info.account_name?bank_card_info.account_name:'');
							}
						}
					}
				}
				asys.post(config);
			}
		}
		//权限请求成功后调用的方法，记录权限信息，并查看是否有表格之上的筛选栏或者按钮权限，然后请求数据渲染表格
		function setOpname(power,data){
			var html="";
			html+= '<td class="operation">'
			$.each(power,function(k,v){
				if(fcodes.indexOf(v.fcode)>-1){
					if(v.fcode=='delete' && data.status==0){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}if(v.fcode=='delete'){
						html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
					}else if(v.fcode=='disabled' && data.status==1){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}else if(v.fcode=='disabled'){
						html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
					}else if(v.fcode=='enabled' && data.status==0){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}else if(v.fcode=='enabled'){
						html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
					}else if(v.fcode=='edit'){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}
				}
			});
			html+='</td>';
			return html;
		}
					
		//操作单元格点击事件
		function optionClick(){
			var self=this,config,
				opname=$(self).attr("opname"),//获取操作名称
				//本次操作所在列的数据
				rowData=$(self).closest("tr")[0].trData;
			if(opname=='delete'){
				config={
					title:'温馨提醒',
					html:"您确认删除该条记录吗？",
					confirmFun:function(obj){
						var config={
							url:'Insurance/status_do',
							params:{
								id:rowData.id,
								type:-1,
							},
							successFun:function(){
								obj.modal('hide');
								$(self).closest("tr").remove();
							}
						}
						asys.post(config);
					}
				}
			}else if(opname=="disabled"){ // 单击禁用时
				config={
					title:'温馨提醒',
					html:"您确认禁用吗？",
					confirmFun:function(obj){
						var config={
							url:'Insurance/status_do',
							params:{
								id:rowData.id,
								type:1,
							},
							successFun:function(){
								//禁用成功后显示改变
								$($(self).closest("tr").find("td")[3]).html("禁用");
								$(self).hide();
								$(self).parent().find("a[opname='enabled']").show();
								$(self).parent().find("a[opname='delete']").show();
								obj.modal('hide');
							}
						}
						asys.post(config);
					}
				}
			}else if(opname=="enabled"){//解除禁用
				config={
					title:'温馨提醒',
					html:"您确认解除禁用吗？",
					confirmFun:function(obj){
						var config={
							url:'Insurance/status_do',
							params:{
								id:rowData.id,
								type:2,
							},
							successFun:function(){
								//解除禁用成功后显示改
								$($(self).closest("tr").find("td")[3]).html("正常");
								$(self).hide();
								$(self).parent().find("a[opname='disabled']").show();
								$(self).parent().find("a[opname='delete']").hide();
								obj.modal('hide');
							}
						}
						asys.post(config);
					}
				}
			}else if(opname='edit'){//编辑
				showBrokersBox(rowData.id);
			}
			if(config){
				asys.showModalHtml(config);
			}
		}	
	}
	//销售渠道管理
	function chanChannel(tabInfo){
		/*添加筛选栏*/
		var search_checkstate= '<div class="search-checkstate">'
                +    '<div class="checkState">'
                +      '<button type="button" name="add" class="btn btn-primary" hidden>添加</button>'
                +    '</div>'
                + '</div>',
			pageConfig={
				tabInfo:tabInfo,//dom信息对象
				paramConfig:OPEN.chanChannel,//表格的配置
				search_checkstate:search_checkstate,//筛选栏html
				setSearchPower:setSearchPower,//权限请求成功后执行方法
				optionClick:optionClick,//可点击标签的点击事件（operation Css下的a标签点击事件）
				setOpname:setOpname,//权限列显示方法（有权限判断和根据数据判断是否显示等）
			},
			fcodes=[],
			getData=OPEN.initPage(pageConfig);
		//权限请求成功后调用的方法，记录权限信息，并查看是否有表格之上的筛选栏或者按钮权限，然后请求数据渲染表格
		function setSearchPower(data){
			$.each(data.info,function(){
				var fcode=this.fcode.split("_")[1];//将权限名称拆分，取最后一个
				fcodes.push(fcode);//记录权限列表
				if(fcode=='add'){//判断是否有添加权限
					tabInfo.tabDom.find("button[name='add']").show();
				}
				
			});
			getData(1); 
		}
		//添加按钮绑定事件
		tabInfo.tabDom.find("button[name='add']").click(function(){
			showChannelBox();
		});
		/*
			添加销售渠道和编辑销售渠道方法
				id：渠道id 如果为空代表添加销售渠道
		*/	
		function showChannelBox(id){
			var html='<form class="form-horizontal">'
			+	'<div>'
			+		'<h5>基本信息</h5>'
			+	'</div>'
			+	'<div class="form-group">'
			+		'<label for="name" class="col-sm-3 control-label">销售渠道</label>'
			+		'<div class="col-sm-7">'
			+		'<input type="text" class="form-control" id="name"  name="name" placeholder="请输入销售渠道名称">'
			+		'</div>'
			+	'</div>'
			+	'<div class="form-group">'
			+		'<label for="type" class="col-sm-3 control-label">渠道类型</label>'
			+		'<div class="col-sm-7">'
			+			'<select  name="type" class="form-control">'
			+				'<option value="0">无</option>'
			+				'<option value="1">分公司</option>'
			+				'<option value="2">合作伙伴</option>'
			+			'</select>'
			+		'</div>'
			+	'</div>'
			+	'<div class="form-group">'
			+		'<label for="bank_type" class="col-sm-3 control-label">所属地区</label>'
			+		'<div class="col-sm-3">'
			+			'<select  name="province_id" class="form-control">'
			+			'</select>'
			+		'</div>'
			+		'<div class="col-sm-3">'
			+			'<select  name="area_id" class="form-control">'
			+			'</select>'
			+		'</div>'
			+	'</div>'
			+	'<div>'
			+		'<h5>财务账户</h5>'
			+	'</div>'
			+	'<div class="form-group">'
			+		'<label for="bank_type" class="col-sm-3 control-label">角色类型</label>'
			+		'<div class="col-sm-7">'
			+			'<select  name="bank_type" id="bank_type" class="form-control">'
			+				'<option value="1">银行卡</option>'
			+				'<option value="2">支付宝</option>'
			+			'</select>'
			+		'</div>'
			+	'</div>'
			+	'<div class="bank_box">'
			+	'<div class="form-group">'
			+		'<label for="b_bank_name" class="col-sm-3 control-label">开户银行</label>'
			+		'<div class="col-sm-7">'
			+			'<input type="text" isrequired="0" class="form-control" id="b_bank_name"  name="b_bank_name" placeholder="请输入开户银行">'
			+		'</div>'
			+	'</div>'
			+	'<div class="form-group">'
			+		'<label for="b_account_name" class="col-sm-3 control-label">开户人</label>'
			+		'<div class="col-sm-7">'
			+			'<input type="text" isrequired="0" class="form-control" id="b_account_name"  name="b_account_name" placeholder="请输入开户人姓名">'
			+		'</div>'
			+	'</div>'
			+	'<div class="form-group">'
			+		'<label for="b_card_number" class="col-sm-3 control-label">银行卡号</label>'
			+		'<div class="col-sm-7">'
			+			'<input type="text" isrequired="0" class="form-control" id="b_card_number"  name="b_card_number" placeholder="请输入银行卡号">'
			+		'</div>'
			+	'</div>'
			+	'</div>'
			+	'<div class="ali_box" hidden>'
			+	'<div class="form-group">'
			+		'<label for="ali_card_number" class="col-sm-3 control-label">支付宝账号</label>'
			+		'<div class="col-sm-7">'
			+			'<input type="text" isrequired="0" class="form-control" id="ali_card_number"  name="ali_card_number" placeholder="请输入支付宝账号">'
			+		'</div>'
			+	'</div>'
			+	'<div class="form-group">'
			+		'<label for="ali_account_name" class="col-sm-3 control-label">真实姓名</label>'
			+		'<div class="col-sm-7">'
			+			'<input type="text" isrequired="0" class="form-control" id="ali_account_name"  name="ali_account_name" placeholder="请输入真实姓名">'
			+		'</div>'
			+	'</div>'
			+	'</div>'
			+'</form>',province_id,area_id,
			config={
				title:id?'修改销售渠道':'添加销售渠道',
				html:html,
				confirmFun:function(obj){//模态框中确认按钮点击事件
					var t = obj.find(".form-horizontal").serializeArray(),
						error=false,
						bank_type=modal.find("select[name=bank_type]").val(),data={};
					$.each(t, function(){//数据组装
						if(this.value){
							data[this.name] = this.value;	
						}else if($("input[name="+this.name+"]").attr("isrequired")!='0'){
							error=true;
						}
					});
					//数据的验证
					if(error){
						asys.showAlert({title:'温馨提醒',msg:'您有信息未填写完成',isCancel:false});
						return;
					}
					if(bank_type==1){//银行卡
						if(!data.b_bank_name){
							asys.showAlert({title:'温馨提醒',msg:'请输入开户行名称',isCancel:false});
							return;
						}
						if(!data.b_account_name){
							asys.showAlert({title:'温馨提醒',msg:'请输入开户人姓名',isCancel:false});
							return;
						}
						if(!util.bankCardValidation(data.b_card_number)){
							asys.showAlert({title:'温馨提醒',msg:'请输正确的银行卡号',isCancel:false});
							return;
						}
						data.bank_name=data.b_bank_name;
						data.account_name=data.b_account_name;
						data.card_number=data.b_card_number;
					}else{//支付宝
						if(!data.ali_account_name){
							asys.showAlert({title:'温馨提醒',msg:'请输入真实姓名',isCancel:false});
							return;
						}
						if(!data.ali_card_number){
							asys.showAlert({title:'温馨提醒',msg:'请输入支付宝账号',isCancel:false});
							return;
						}
						data.account_name=data.ali_account_name;
						data.card_number=data.ali_card_number;
					}
					//保存数据
					var config={
						url:'Partner/update_do',
						params:{
							id:id?id:'',
							name:data.name,
							account_name:data.account_name,
							card_number:data.card_number,
							bank_name:data.bank_name?data.bank_name:'',
							bank_type:data.bank_type,
							province_id:data.province_id,
							invoice_number:data.invoice_number,
							area_id:data.area_id,
							type:data.type
						},
						successFun:function(){
							obj.modal('hide');
							getData(1);
						}
					}
					asys.post(config);
						
					
				}
			}
			var modal=asys.showModalHtml(config);
			//银行卡类型更改
			modal.find("select[name=bank_type]").change(function(){
				if(this.value==1){//银行卡
					modal.find(".bank_box").show();
					modal.find(".ali_box").hide();
				}else{//支付宝
					modal.find(".bank_box").hide();
					modal.find(".ali_box").show();
				}
			});
			//省变化
			modal.find("select[name=province_id]").change(function(){
				getArea(this.value);
			});
			//获取省数据
			function getProvince(){
				var config={
					url:'Province/lists',
					successFun:function(data){
						var html=""
						$.each(data.info,function(){
							html+="<option value='"+this.id+"'>"+this.name+"</option>";
						});
						modal.find("select[name=province_id]").append(html);
						if(province_id){//如果有配置过 则默认选择（在）
							modal.find("select[name=province_id]").val(province_id);
							getArea(province_id);
						}else{//没有配置过则默认第一个
							getArea(data.info[0].id);
						}
					}
				}
				asys.post(config);
			}
			//获取区列表
			function getArea(id){
				var config={
					url:'Province/area_lists',
					params:{
						province_id:id
					},
					successFun:function(data){
						var html=""
						$.each(data.info,function(){
							html+="<option value='"+this.id+"' "+(this.id==area_id?'selected="selected"':'')+">"+this.name+"</option>";
						});
						modal.find("select[name=area_id]").html(html);
					}
				}
				asys.post(config);
			}
			if(id){
				getInsInfo();
			}else{
				getProvince();
			}
			//获取渠道的详细信息
			function getInsInfo(){
				var config={
					url:'Partner/info',
					params:{
						id:id
					},
					successFun:function(data){
						var info=data.info;
						modal.find("input[name=name]").val(info.name?info.name:'');
						modal.find("select[name=type]").val(info.type?info.type:'0');
						if(data.province_id){
							modal.find("select[name=province_id]").val(info.province_id);
						}
						if(data.area_id){
							modal.find("select[name=area_id]").val(info.area_id);
						}
						province_id=info.province_id;
						area_id=info.area_id;
						getProvince();
						if(info.bank_card_info){
							var bank_card_info=info.bank_card_info
							modal.find("select[name=bank_type]").val(bank_card_info.type?bank_card_info.type:'1');
							if(bank_card_info.type==2){
								modal.find(".bank_box").hide();
								modal.find(".ali_box").show();
								modal.find("input[name=ali_card_number]").val(bank_card_info.card_number?bank_card_info.card_number:'');
								modal.find("input[name=ali_account_name]").val(bank_card_info.account_name?bank_card_info.account_name:'');
							}else {
								modal.find(".bank_box").show();
								modal.find(".ali_box").hide();
								modal.find("input[name=b_bank_name]").val(bank_card_info.bank_name?bank_card_info.bank_name:'');
								modal.find("input[name=b_card_number]").val(bank_card_info.card_number?bank_card_info.card_number:'');
								modal.find("input[name=b_account_name]").val(bank_card_info.account_name?bank_card_info.account_name:'');
							}
						}
					}
				}
				asys.post(config);
			}
		}
		//权限请求成功后调用的方法，记录权限信息，并查看是否有表格之上的筛选栏或者按钮权限，然后请求数据渲染表格
		function setOpname(power,data){
			var html="";
			html+= '<td class="operation">'
			$.each(power,function(k,v){
				if(fcodes.indexOf(v.fcode)>-1){
					if(v.fcode=='delete' && data.status==0){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}if(v.fcode=='delete'){
						html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
					}else if(v.fcode=='disabled' && data.status==1){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}else if(v.fcode=='disabled'){
						html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
					}else if(v.fcode=='enabled' && data.status==0){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}else if(v.fcode=='enabled'){
						html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
					}else if(v.fcode=='edit'){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}
				}
			});
			html+='</td>';
			return html;
		}		
		//操作单元格点击事件
		function optionClick(){
			var self=this,config,
				opname=$(self).attr("opname"),
				rowData=$(self).closest("tr")[0].trData;
			if(opname=='delete'){//删除
				config={
					title:'温馨提醒',
					html:"您确认删除该条记录吗？",
					confirmFun:function(obj){
						var config={
							url:'Partner/status_do',
							params:{
								id:rowData.id,
								type:-1,
							},
							successFun:function(){
								obj.modal('hide');
								$(self).closest("tr").remove();
							}
						}
						asys.post(config);
					}
				}
			}else if(opname=="disabled"){ // 单击禁用时
				config={
					title:'温馨提醒',
					html:"您确认禁用吗？",
					confirmFun:function(obj){
						var config={
							url:'Partner/status_do',
							params:{
								id:rowData.id,
								type:1,
							},
							successFun:function(){
								//禁用成功后显示改变
								$($(self).closest("tr").find("td")[3]).html("禁用");
								$(self).hide();
								$(self).parent().find("a[opname='enabled']").show();
								$(self).parent().find("a[opname='delete']").show();
								obj.modal('hide');
							}
						}
						asys.post(config);
					}
				}
			}else if(opname=="enabled"){//解除禁用
				config={
					title:'温馨提醒',
					html:"您确认解除禁用吗？",
					confirmFun:function(obj){
						var config={
							url:'Partner/status_do',
							params:{
								id:rowData.id,
								type:2,
							},
							successFun:function(){
								//解除禁用成功后显示改
								$($(self).closest("tr").find("td")[3]).html("正常");
								$(self).hide();
								$(self).parent().find("a[opname='disabled']").show();
								$(self).parent().find("a[opname='delete']").hide();
								obj.modal('hide');
							}
						}
						asys.post(config);
					}
				}
			}else if(opname='edit'){//修改
				showChannelBox(rowData.id);
			}
			if(config){
				asys.showModalHtml(config);
			}
		}
	}
	/*VIP商户点击后运行的事件*/
	function chanVIP(tabInfo){
		     /*添加筛选栏*/
		var search_checkstate='<div class="search-checkstate">'
				+      '<div class="search_box" hidden>'
				+            '<form class="form-inline" style="margin-bottom:15px;">'
				+        '<div class="form-group">'
				+          '<input type="text" class="form-control"style="width:230px!important;" name="keyword" placeholder="商户名称">'
				+        '</div>'
				+            '<label class="btn btn-primary">查询</label>'
				+			   '<label class="btn btn-default">重置</label>'
				+            '</form>'
				+      '</div>'
				+   '</div>',
			pageConfig={
				tabInfo:tabInfo,//dom信息对象
				paramConfig:OPEN.chanVIP,//表格的配置
				search_checkstate:search_checkstate,//筛选栏html
				setSearchPower:setSearchPower,//权限请求成功后执行方法
				optionClick:optionClick,//可点击标签的点击事件（operation Css下的a标签点击事件）
				setOpname:setOpname,//权限列显示方法（有权限判断和根据数据判断是否显示等）
				postData:{level:2}//请求数据时需要的参数（以后每次都会带）
			},
			fcodes=[],
			getData=OPEN.initPage(pageConfig);
		function setSearchPower(data){
			$.each(data.info,function(){
				var fcode=this.fcode.split("_")[1];//将权限名称拆分，取最后一个
				fcodes.push(fcode);//记录权限列表
				if(fcode=='query'){//判断是否有查询权限
					tabInfo.tabDom.find(".search_box").show();
				}
			});
			getData(1); 
		}
		//权限请求成功后调用的方法，记录权限信息，并查看是否有表格之上的筛选栏或者按钮权限，然后请求数据渲染表格
		function setOpname(power,data){
			var html="";
			html+= '<td class="operation">'
			$.each(power,function(k,v){
				if(fcodes.indexOf(v.fcode)>-1){
					if(v.fcode=='disabled' && data.status==1){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}else if(v.fcode=='disabled'){
						html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
					}else if(v.fcode=='enabled'  && data.status==0){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}else if(v.fcode=='enabled'){
						html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
					}else if(v.fcode=='becomeVIP'){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}else if(v.fcode=="cancelVIP"){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}
				}
			});
			html+='</td>';
			return html;
		}
					
		//操作单元格点击事件
		function optionClick(){
			var self=this,config,
				opname=$(self).attr("opname"),//获取操作名称
				//本次操作所在列的数据
				rowData=$(self).closest("tr")[0].trData;
			if(opname=="disabled"){ // 单击禁用时
				config={
						title:'温馨提醒',
						html:"您确认禁用吗？",
						confirmFun:function(obj){
							var config={
								url:'Company/status_do',
								params:{
									id:rowData.id,
									type:1,
								},
								successFun:function(){
									//禁用成功后显示改变
									$($(self).closest("tr").find("td")[3]).html("禁用");
									$(self).hide();
									$(self).parent().find("a[opname='enabled']").show();
									obj.modal('hide');
								}
							}
							asys.post(config);
						}
					}
			}else if(opname=="enabled"){//解除禁用
				config={
					title:'温馨提醒',
					html:"您确认解除禁用吗？",
					confirmFun:function(obj){
						var config={
							url:'Company/status_do',
							params:{
								id:rowData.id,
								type:2,
							},
							successFun:function(){
								//解除禁用成功后显示改
								$($(self).closest("tr").find("td")[3]).html("正常");
								$(self).hide();
								$(self).parent().find("a[opname='disabled']").show();
								obj.modal('hide');
							}
						}
						asys.post(config);
					}
				}
			}else if(opname=="cancelVIP"){//取消vip
				//获取商户签约商品列表
				var config={
					url:'CompanyApply/pdt_lists',
					params:{
						com_id:rowData.id
					},
					successFun:function(data){
						//获取成功后拼接html字符串
						var html='<form class="form-horizontal">'
						+	'<div>'
						+		'<h5>结算配置</h5>'
						+	'</div>';
						$.each(data.info,function(){
							html+='<div class="form-group">'
							+		'<label class="col-sm-4 control-label">产品名称</label>'
							+		'<label class="col-sm-4 control-label">'+this.product_name+'</label>'
							+		'<div class="col-sm-4">'
							+			'<label apply_id="'+this.apply_id+'"  product_id="'+this.product_id+'" com_id="'+this.com_id+'" class="btn btn-primary edit_stat">修改费率</label>'//将产品和配置的信息拼接到html中
							+		'</div>'
							+	"</div>"
						});	
						html+='</form>';
						var config={
							title:'取消VIP资质后，无法修改商户费率，如费率有变动，请修改完成后再取消VIP',
							html:html,
							confirmFun:function(obj){//模态框中确认按钮点击事件
								var config={
									url:'Company/status_do',
									params:{
										id:rowData.id,
										type:4,
									},
									successFun:function(){
										getData(1);
										obj.modal("hide")
									}
								}
								asys.post(config);
								return;
							}
						}
						//显示模态框
						var modal=asys.showModalHtml(config);
						//修改费率按钮点击事件
						modal.find(".edit_stat").click(function(){
							//获取该按钮的 参数
							var product_id=$(this).attr("product_id"),
								com_id=$(this).attr("com_id"),
								apply_id=$(this).attr("apply_id");
							//渲染新的模态框
							tabInfo.tabDom.append(asys.modalHtml('stat'));
							var modalList=tabInfo.tabDom.find("#stat");
							// 修改模态框中的title
							modalList.find(".modal-title").text("配置结算费率");
							//将费率配置html拼接
							var html='<form class="form-horizontal rate_aloc">'+OPEN.rate_html+'</form>'
							modalList.find(".pop-box").html(html);
							//确认按钮方法
							modalList.find(".btn-primary").unbind();
							modalList.find(".btn-primary").click(function(){
								var t = modalList.find(".form-horizontal").serializeArray(),isErr=false,data={};
									$.each(t, function() {//组装数据
										 if(parseFloat(this.value)>=0){
											 data[this.name] = this.value; 
										 }else{
											isErr=true; 
											return; 
										 }
									});
									data.fwf_insurer_val=modalList.find("input[name=fwf_insurer_val]").val();
									data.fwf_ins_val=modalList.find("input[name=fwf_ins_val]").val();
									data.plat_val=modalList.find("input[name=plat_val]").val();
									//判断数据的有效性
									if(data.xsf_prem_set_type==1){
										data.xsf_tax_type=data.jjf_xsf_tax_type;
										if(data.jjf_val && data.tdf_val && data.fwf_ins_val && data.tgf_ins_val && data.tgf_plat_val && data.qdf_val && data.plat_val){
											
										}else{
											asys.showAlert({title:'温馨提醒',msg:'请完善配置信息',isCancel:false})
											return;
										}
									}else if(isErr){
										asys.showAlert({title:'温馨提醒',msg:'请完善配置信息',isCancel:false})
										return;
									}
									delete data.jjf_xsf_tax_type;
									
									if(parseFloat(data.plat_val)<0 || data.plat_val==''){
										asys.showAlert({title:'温馨提醒',msg:'平台结算配置有误',isCancel:false})
										return;
									}
									if(parseFloat(data.fwf_ins_val)<0 || data.fwf_ins_val==''){
										asys.showAlert({title:'温馨提醒',msg:'经纪公司结算配置有误',isCancel:false})
										return;
									}
									if(data.xsf_prem_set_type==2 &&(parseFloat(data.fwf_insurer_val)<0  || data.fwf_insurer_val=='')){
										asys.showAlert({title:'温馨提醒',msg:'保险公司结算配置有误',isCancel:false})
										return;
									}
									data.apply_id=apply_id;
									data.com_id=com_id;
									data.product_id=product_id;
									config={
										title:'温馨提醒',
										msg:"您确认修改该产品费率？",
										confirmFun:function(){
											var config={
												url:'CompanyApply/rate_do',
												params:data,
												successFun:function(){
													modalList.remove();
												}
											}
											asys.post(config);
										}
									}
									asys.showAlert(config)
									
							}); 
							//取消按钮方法
							modalList.find(".btn-default").unbind();
							modalList.find(".btn-default").click(function(){
								modalList.remove();
							});
							//事件的绑定
							rateInput(modalList);
							//获取之前配置信息
							getpdtInfo(modalList,apply_id,com_id,product_id);
							modalList.modal("show");
						});
					}
				}
				asys.post(config);
				return;
			}else if(opname=="becomeVIP"){//vip费率
					var html='<div class="form-horizontal">'
						+		'<div>'
						+			'<h5>基本信息</h5>'
						+		'</div>'
						+	'<div class="form-group">'
						+		'<label class="col-sm-4 control-label">商户名称</label>'
						+		'<div class="col-sm-8"><label  style="margin-left:30px" class=" control-label">'+rowData.name+'</label></div>'
						+		'</div>'
						+		'<div>'
						+			'<h5>结算配置</h5>'
						+		'</div>'
						+	  '</div>'
						+		'<form class="form-horizontal rate_aloc">'
						+	'<div class="form-group">'
						+		'<label for="product_id" class="col-sm-4 title">产品名称</label>'
						+			'<div class="col-sm-8"><select style="width:auto;margin-left:30px"   name="product_id"  class="form-control">'
						+			'</select></div>'
						+	'</div>';
								
					html+=OPEN.rate_html;
					html+='</form>';
					var config={
						title:'配置VIP费率',
						html:html,
						confirmFun:function(obj){
							var t = obj.find("form").serializeArray(),isErr=false,data={};
							$.each(t, function() {//组装数据
								 if(parseFloat(this.value)>=0){
									 data[this.name] = this.value; 
								 }else{
									isErr=true; 
									return; 
								 }
							});
							data.fwf_insurer_val=obj.find("input[name=fwf_insurer_val]").val();
							data.fwf_ins_val=obj.find("input[name=fwf_ins_val]").val();
							data.plat_val=obj.find("input[name=plat_val]").val();
							//判断数据的有效性
							if(data.xsf_prem_set_type==1){
								data.xsf_tax_type=data.jjf_xsf_tax_type;
								if(data.jjf_val && data.tdf_val && data.fwf_ins_val && data.tgf_ins_val && data.tgf_plat_val && data.qdf_val && data.plat_val){
									
								}else{
									asys.showAlert({title:'温馨提醒',msg:'请完善配置信息',isCancel:false})
									return;
								}
							}else if(isErr){
								asys.showAlert({title:'温馨提醒',msg:'请完善配置信息',isCancel:false})
								return;
							}
							delete data.jjf_xsf_tax_type;
							
							if(parseFloat(data.plat_val)<0 || data.plat_val==''){
								asys.showAlert({title:'温馨提醒',msg:'平台结算配置有误',isCancel:false})
								return;
							}
							if(parseFloat(data.fwf_ins_val)<0 || data.fwf_ins_val==''){
								asys.showAlert({title:'温馨提醒',msg:'经纪公司结算配置有误',isCancel:false})
								return;
							}
							if(data.xsf_prem_set_type==2 &&(parseFloat(data.fwf_insurer_val)<0  || data.fwf_insurer_val=='')){
								asys.showAlert({title:'温馨提醒',msg:'保险公司结算配置有误',isCancel:false})
								return;
							}
							//保存数据
							data.apply_id=apply_id;
							data.com_id=com_id;
							data.product_id=product_id;
							config={
								title:'温馨提醒',
								msg:"您确认修改该产品费率？",
								confirmFun:function(){
									var config={
										url:'CompanyApply/rate_do',
										params:data,
										successFun:function(){
											getData(1);
											modal.modal('hide');
										}
									}
									setTimeout(function(){asys.post(config)},200)
									
								}
							}
							asys.showAlert(config)
							
						}
					},product_id,com_id,apply_id;
					var modal=asys.showModalHtml(config);
				
					rateInput(modal);//事件绑定
					//商品列表改变事件
					modal.find("select[name=product_id]").change(function(){
							var value=this.value.split("_");
							apply_id=value[0];
							com_id=value[1];
							product_id=value[2];
							getpdtInfo(modal,apply_id,com_id,product_id);
					});
					//获取商户签约商品列表，并渲染数据
					var configs={
						url:'CompanyApply/pdt_lists',
						params:{
							com_id:rowData.id
						},
						successFun:function(data){
							if(data.info.length){
								modal.find("select[name=product_id]").html("");
								var html="";
								$.each(data.info,function(){
									html+="<option value='"+this.apply_id+"_"+this.com_id+"_"+this.product_id+"'>"+this.product_name+"</option>"//产品信息等..拼接到html
								});
								modal.find("select[name=product_id]").html(html);
								apply_id=data.info[0].apply_id;
								com_id=data.info[0].com_id;
								product_id=data.info[0].product_id;
								//默认显示第一条商品的vip配置
								getpdtInfo(modal,apply_id,com_id,product_id);
							}else{
								modal.modal("hide");
								asys.showAlert({title:'温馨提醒',msg:'该商户暂无产品',isCancel:false})
							}
						}
					}
					asys.post(configs);
				return;
			}
			if(config){
				asys.showModalHtml(config);
			}
		}
	}
	/*角色管理点击运行方法*/  
	function roleAdmin(tabInfo){
		/*添加筛选栏*/
		var search_checkstate= '<div class="search-checkstate">'
				+    '<div class="search_box" hidden>'
				+          '<form class="form-inline">'
				+        '<div class="form-group">'
				+          '<label for="source">角色类型</label>'
				+           '<select name="source" id="" class="form-control">'
				+             '<option value="0">全部</option>'
				+             '<option value="1">保险公司</option>'
				+             '<option value="2">经纪公司</option>'
				+             '<option value="3">平台运营</option>'
				+             '<option value="4">销售渠道</option>'
				+           '</select>'
				+        '</div>'
				+           '<div class="form-group">'
				+              '<input type="text" name="search_val" class="form-control" id="businessName" style="width:150px!important;" placeholder="角色名称">'
				+            '</div>'
				+            '<label class="btn btn-primary">查询</label>'
				+			   '<label class="btn btn-default">重置</label>'
				+          '</form>'
				+    '</div>'
				+    '<div class="checkState">'
				+      '<button type="button" hidden name="add" class="btn btn-primary">添加</button>'
				+    '</div>'
				+ '</div>',
			pageConfig={
				tabInfo:tabInfo,//dom信息对象
				paramConfig:OPEN.roleAdmin,//表格的配置
				search_checkstate:search_checkstate,//筛选栏html
				setSearchPower:setSearchPower,//权限请求成功后执行方法
				optionClick:optionClick,//可点击标签的点击事件（operation Css下的a标签点击事件）
				setOpname:setOpname//权限列显示方法（有权限判断和根据数据判断是否显示等）
			},
			fcodes=[],
			getData=OPEN.initPage(pageConfig);
		//权限请求成功后调用的方法，记录权限信息，并查看是否有表格之上的筛选栏或者按钮权限，然后请求数据渲染表格
		function setSearchPower(data){
			$.each(data.info,function(){
				var fcode=this.fcode.split("_")[1];//将权限名称拆分，取最后一个
				fcodes.push(fcode);//记录权限列表
				if(fcode=='query'){//判断是否有查询权限
					tabInfo.tabDom.find(".search_box").show();
				}else if(fcode=='add'){//判断是否有添加权限
					tabInfo.tabDom.find("button[name='add']").show();
				}
				
			});
			getData(1); 
		}
		   
		//添加按钮绑定事件
		tabInfo.tabDom.find("button[name='add']").click(function(){
			showPowerBox();
		});
		/*
			角色模态框（添加或者编辑）
				role_id：角色id 如果没有则代表添加
		
		*/
		function showPowerBox(role_id){
			var html='<form class="form-horizontal form-power">'
				+	'<div>'
				+		'<h5>基本信息</h5>'
				+	'</div>'
				+	'<div class="form-group">'
				+		'<label for="name" class="col-sm-2 control-label">角色名称</label>'
				+	'<div class="col-sm-10">'
				+		'<input type="text" class="form-control" id="name"  name="name" placeholder="请输入角色名">'
				+	'</div>'
				+	'</div>'
				+	'<div class="form-group">'
				+		'<label for="source" class="col-sm-2 control-label">角色类型</label>'
				+	'<div class="col-sm-10">'
				+		'<select  name="source" id="source" class="form-control">'
				+			'<option value="1">保险公司</option>'
				+			'<option value="2">经纪公司</option>'
				+			'<option value="3">平台运营</option>'
				+			'<option value="4">销售渠道</option>'
				+		'</select>'
				+	'</div>'
				+	'</div>'
				+	'<div class="form-group">'
				+		'<label for="desc" class="col-sm-2 control-label">角色描述</label>'
				+	'<div class="col-sm-10">'
				+		'<textarea class="form-control" name="desc"></textarea>'
				+	'</div>'
				+	'</div>'
				+	'<div>'
				+		'<h5>角色权限</h5>'
				+	'</div>'
				+	'<div class="powerBox">'
				+	'</div>'
				+'</form>',
			config={
				title:role_id?'修改角色':'添加角色',
				html:html,
				confirmFun:function(obj){//模态框中确认按钮点击事件
					//获取录入信息，并判断数据有效性
					var checkedDom=$("input[name=power][layer=1]:checked");
						power=powerTree(checkedDom,1),
						desc=obj.find("textarea[name=desc]").val(),
						source=obj.find("select[name=source]").val(),
						name=obj.find("input[name=name]").val();
					/*
						获取权限树勾选数据
							checkedDom ：本层的所有勾选的dom；
							layer ：代表第几层
						返回所有勾选的权限fcode
					*/
					function powerTree(checkedDom,layer){
						var tree=[];
						$.each(checkedDom,function(){
							var fcode=this.value,
								ul=$(this).closest("li").next("ul");
								tree.push({fcode:fcode});
							if(ul.length){
								tree[(tree.length-1)][ul.find('input[name=power][layer='+(layer+1)+']:checked').attr("treeType")]=powerTree(ul.find("input[name='power'][layer="+(layer+1)+"]:checked"),layer+1);
							}
						})
						return tree;
					}
					if(!name){
						asys.showAlert({title:'温馨提醒',msg:'请输入角色名称',isCancel:false})
					}else if(name.length>29){
						asys.showAlert({title:'温馨提醒',msg:'角色名称不能超过29个字符',isCancel:false})
					}else if(!desc){
						asys.showAlert({title:'温馨提醒',msg:'请输入角色描述',isCancel:false})
					}else if(desc.length>50){
						asys.showAlert({title:'温馨提醒',msg:'角色描述不能超过50',isCancel:false})
					}else if(power.length==0){
						asys.showAlert({title:'温馨提醒',msg:'请选择权限',isCancel:false})
					}else{
						//保存数据
						var config={
							url:'Permissions/role_update_do',
							params:{
								id:role_id?role_id:'',
								name:name,
								desc:desc,
								source:source,
								perm:JSON.stringify(power)
							},
							successFun:function(){
								obj.modal('hide');
								getData(1);
							}
						}
						asys.post(config);
						
					}
				}
			}
			var modal=asys.showModalHtml(config);
			//获取权限数据
			var config={
				url:'Permissions/all_menu',
				params:{},
				successFun:getPowerTree
			}
			asys.post(config);
			//渲染权限数据
			function getPowerTree(data){
				var navdatas=data.info;  
				var navstr="";  
				navstr += '<div class="st_tree powerTree" ><ul>';
				navstr +=asys.treeHtml(navdatas,true,1);
				navstr += '</ul></div>';
				modal.find(".powerBox").html(navstr);
				asys.leftnav();
				modal.find(".powerBox").find(".powerTree input[name='power']").click(function(event){
					event.stopPropagation(); 
					var li=$(this).closest("li");
					if(this.checked){
						setParentCheck(li);
						li.next("ul").find("input[name='power']").prop("checked", true);
					}else{
						li.next("ul").find("input[name='power']").prop("checked", false);
					}
					function setParentCheck(obj){
						var dom=obj.closest("ul").prev('li')
						if(dom.length!=0){
							setParentCheck(dom);
							dom.find("input[name='power']").prop("checked", true);
						}
					}
					
				});
				//如果是编辑，获取角色数据
				if(role_id){
					getRoleInfo();
				}
			}
			//获取角色数据，并渲染数据
			function getRoleInfo(){
				var config={
					url:'Permissions/role_info',
					params:{
						id:role_id
					},
					successFun:function(data){
						var info=data.info,powerBox=modal.find(".powerBox");
						modal.find("textarea[name=desc]").val(info.desc?info.desc:'');
						modal.find("select[name=source]").val(info.source?info.source:'');
						modal.find("input[name=name]").val(info.name?info.name:'');
						checkedRolePower(info.permission);
						//并勾选数据
						function checkedRolePower(permission){
							$.each(permission,function(){
								powerBox.find("input[value='"+this.fcode+"']").prop("checked",true);
								if(this.tree){
									checkedRolePower(this.tree);
								}else if(this.power){
									checkedRolePower(this.power);
								}
							})
						}
					}
				}
				asys.post(config);
			}
		}
		//权限请求成功后调用的方法，记录权限信息，并查看是否有表格之上的筛选栏或者按钮权限，然后请求数据渲染表格
		function setOpname(power,data){
			var html="";
			html+= '<td class="operation">'
			$.each(power,function(k,v){
				if(fcodes.indexOf(v.fcode)>-1){
					if(v.fcode=='delete' && data.is_acc==0 && data.status==0){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}if(v.fcode=='delete' && data.is_acc==0){
						html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
					}else if(v.fcode=='disabled' && data.status==1){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}else if(v.fcode=='disabled'){
						html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
					}else if(v.fcode=='enabled' && data.status==0){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}else if(v.fcode=='enabled'){
						html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
					}else if(v.fcode=='edit'){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}
				}
			});
			html+='</td>';
			return html;
		}
					
		//操作单元格点击事件
		function optionClick(){
			var self=this,config,
				opname=$(self).attr("opname"),//获取操作名称
				//本次操作所在列的数据
				rowData=$(self).closest("tr")[0].trData;
			if(opname=='delete'){//删除记录
				config={
					title:'温馨提醒',
					html:"您确认删除该条记录吗？",
					confirmFun:function(obj){
						var config={
							url:'Permissions/role_status_do',
							params:{
								id:rowData.id,
								type:-1,
							},
							successFun:function(){
								obj.modal('hide');
								$(self).closest("tr").remove();
							}
						}
						asys.post(config);
					}
				}
			}else if(opname=="disabled"){ // 单击禁用时
				config={
					title:'温馨提醒',
					html:"您确认禁用吗？",
					confirmFun:function(obj){
						var config={
							url:'Permissions/role_status_do',
							params:{
								id:rowData.id,
								type:1,
							},
							successFun:function(){
								$($(self).closest("tr").find("td")[4]).html("禁用");
								$(self).hide();
								$(self).parent().find("a[opname='enabled']").show();
								$(self).parent().find("a[opname='delete']").show();
								obj.modal('hide');
							}
						}
						asys.post(config);
					}
				}
			}else if(opname=="enabled"){//解除禁用
				config={
					title:'温馨提醒',
					html:"您确认解除禁用吗？",
					confirmFun:function(obj){
						var config={
							url:'Permissions/role_status_do',
							params:{
								id:rowData.id,
								type:2,
							},
							successFun:function(){
								$($(self).closest("tr").find("td")[4]).html("正常");
								$(self).hide();
								$(self).parent().find("a[opname='disabled']").show();
								$(self).parent().find("a[opname='delete']").hide();
								obj.modal('hide');
							}
						}
						asys.post(config);
					}
				}
			}else if(opname='edit'){
				showPowerBox(rowData.id);
			}
			if(config){
				asys.showModalHtml(config);
			}
		}
	}
	/*账号列表点击后运行的方法*/
	function accountLists(tabInfo){
		/*添加筛选栏*/
		var accSource=sysData.acc_info.targetid,
			search_checkstate= '<div class="search-checkstate">'
						+    '<div class="search_box">'
						+          '<form class="form-inline">';
		if(accSource==0){
			search_checkstate+='<div class="form-group">'
				+			'<label for="source">角色类型</label>'
				+           '<select name="source" id="" class="form-control">'
				+             '<option value="0">全部</option>'
				+             '<option value="1">保险公司</option>'
				+             '<option value="2">经纪公司</option>'
				+             '<option value="3">平台运营</option>'
				+             '<option value="4">销售渠道</option>'
				+           '</select>'
				+        '</div>';
		}
		search_checkstate+= '<div class="form-group">'
			+              '<input type="text" name="search_val" class="form-control" id="businessName" style="width:150px!important;" placeholder="姓名，联系电话">'
			+            '</div>'
			+            '<label class="btn btn-primary">查询</label>'
			+			   '<label class="btn btn-default">重置</label>'
			+          '</form>'
			+    '</div>'
			+    '<div class="checkState">'
			+      '<button type="button" hidden name="add" class="btn btn-primary">添加</button>'
			+    '</div>'
			+ '</div>';
		pageConfig={
			tabInfo:tabInfo,//dom信息对象
			paramConfig:OPEN.accountLists,//表格的配置
			search_checkstate:search_checkstate,//筛选栏html
			setSearchPower:setSearchPower,//权限请求成功后执行方法
			optionClick:optionClick,//可点击标签的点击事件（operation Css下的a标签点击事件）
			setOpname:setOpname//权限列显示方法（有权限判断和根据数据判断是否显示等）
		},
		fcodes=[],
		getData=OPEN.initPage(pageConfig);//初始化
		//权限请求成功后调用的方法，记录权限信息，并查看是否有表格之上的筛选栏或者按钮权限，然后请求数据渲染表格
		function setSearchPower(data){
			$.each(data.info,function(){
				var fcode=this.fcode.split("_")[1];//将权限名称拆分，取最后一个
				fcodes.push(fcode);//记录权限列表
				if(fcode=='query'){//判断是否有查询权限
					tabInfo.tabDom.find(".search_box").show();
				}else if(fcode=='add'){//判断是否有添加权限
					tabInfo.tabDom.find("button[name='add']").show();
				}
				
			});
			getData(1); 
		}
		//添加按钮绑定事件
		tabInfo.tabDom.find("button[name='add']").click(function(){
			showAccBox();
		});
			
		//添加账号或者编辑账号模态框显示	
		function showAccBox(acc_id){
			if(sysData.acc_info.type==0){//获取登陆账号的类型，如果是管理员需要更改
				accSource=0
			}	
			var html='<form class="form-horizontal form-power">'
				+	'<div>'
				+		'<h5>基本信息</h5>'
				+	'</div>'
				+	'<div class="form-group">'
				+		'<label for="account" class="col-sm-2 control-label">用户名</label>'
				+      	'<div class="col-sm-10">'
				+			'<input type="text" class="form-control" id="account"  name="account" placeholder="请输入用户名">'
				+		'</div>'
				+	'</div>'
				+	'<div class="form-group">'
				+		'<label for="name" class="col-sm-2 control-label">姓名</label>'
				+      	'<div class="col-sm-10">'
				+			'<input type="text" class="form-control" id="name"  name="name" placeholder="请输入姓名">'
				+      	'</div>'
				+	'</div>'
				+	'<div class="form-group">'
				+		'<label for="mobile" class="col-sm-2 control-label">联系电话</label>'
				+      	'<div class="col-sm-10">'	
				+		'<input type="text" class="form-control" id="mobile"  name="mobile" placeholder="请输入联系电话">'
				+      	'</div>'
				+	'</div>'
				+	'<div class="form-group">'
				+		'<label for="source" class="col-sm-2 control-label">角色类型</label>'
				+      	'<div class="col-sm-10">'
				+		'<select name="source" id="source" class="form-control">',acc_info;
			if(accSource==0){
				html+='<option value="1">保险公司</option>'
				+			'<option value="2">经纪公司</option>'
				+			'<option value="3">平台运营</option>'
				+			'<option value="4">销售渠道</option>'
			}else if(accSource==1){
				html+='<option value="1">保险公司</option>'
			}else if(accSource==2){
				html+='<option value="2">经纪公司</option>'
			}else if(accSource==3){
				html+='<option value="3">平台运营</option>'
			}else if(accSource==4){
				html+='<option value="4">销售渠道</option>'
			}
			html+='</select>'
				+	'</div>'
				+	'</div>'
				+	'<div class="form-group targetbox">'
				+		'<label for="targetid" class="col-sm-2 control-label">联系电话</label>'
				+      	'<div class="col-sm-10">'
				+		'<select name="targetid" id="targetid" class="form-control">'
				+     	'</select>'
				+	'</div>'
				+	'</div>'
				+	'<div class="form-group">'
				+		'<label for="desc" class="col-sm-2 control-label">角色名称</label>'
				+		'<table  class="col-sm-10 radio" name="role_lists"></table>'
				+	'</div>'
				+	'<div class="form-group">'
				+		'<label class="col-sm-12 control-label">账号初始密码为：123456</label>'
				+	'</div>'
				+'</form>';
				
			var config={
				title:acc_id?'修改账号':'添加账号',
				html:html,
				confirmFun:function(obj){//模态框中确认按钮点击事件
					//获取模态框中录入数据 并验证数据有效性
					var account=obj.find("input[name=account]").val(),
						source=obj.find("select[name=source]").val(),
						mobile=obj.find("input[name=mobile]").val(),
						targetid=obj.find("select[name=targetid]").val(),
						name=obj.find("input[name=name]").val(),
						role_id=obj.find("input[name=role_id]:checked").val();
					if(!account){
						asys.showAlert({title:'温馨提醒',msg:'请输入用户名',isCancel:false})
					}else if(account.length>29){
						asys.showAlert({title:'温馨提醒',msg:'用户名称不能超过29个字符',isCancel:false})
					}else if(mobile && !(/^1[3|4|5|7|8][0-9]\d{8}$/.test(mobile))){
						asys.showAlert({title:'温馨提醒',msg:'请输入正确电话',isCancel:false})
					}else if(!name){
						asys.showAlert({title:'温馨提醒',msg:'请输入姓名',isCancel:false})
					}else if(!role_id){
						asys.showAlert({title:'温馨提醒',msg:'请选择角色',isCancel:false})
					}else{
						//保存数据
						var config={
							url:'Permissions/acc_update_do',
							params:{
								id:acc_id?acc_id:'',
								name:name,
								account:account,
								mobile:mobile,
								role_id:role_id,
								targetid:targetid,
								source:source
							},
							successFun:function(){
								obj.modal('hide');
								getData(1);
							}
						}
						asys.post(config);
						
					}
				}
			}
			var modal=asys.showModalHtml(config);
			//判断有无账号id 
			if(acc_id){
				getAccInfo()//获取账号信息
			}else{
				//根据登陆账号获取默认的列表（保险公司，经纪公司。。）并渲染
				if(accSource==0 || accSource==1){
					getTarget("Insurer/lists");
					getRole(1);
				}else if(accSource==2){
					getTarget("Insurance/lists")
					getRole(2);
				}else if(accSource==3){
					modal.find(".targetbox").hide();
					modal.find('select[name=targetid]').html("");
					getRole(3);
				}else if(accSource==4){
					getTarget("Partner/lists")
					getRole(4);
				}
			}
			//角色类型 更改
			modal.find("select[name=source]").change(function(){
				if(this.value==1){
					getTarget("Insurer/lists");
					getRole(1);
				}else if(this.value==2){
					getTarget("Insurance/lists");
					getRole(2);
				}else if(this.value==3){
					modal.find(".targetbox").hide();
					modal.find('select[name=targetid]').html("");
					getRole(3);
				}else if(this.value==4){
					getTarget("Partner/lists");
					getRole(4);
				}
			});
			//各个类型下的 公司名称
			function getTarget(url){
				modal.find(".targetbox").show();
				if(url=='Insurer/lists'){
					modal.find("label[for=targetid]").text("保险公司");
				}else if(url=='Insurance/lists'){
					modal.find("label[for=targetid]").text("经纪公司");
				}else if(url=='Partner/lists'){
					modal.find("label[for=targetid]").text("渠道");
				}
				var config={
					url:url,
					params:{
						limit:1000
					},
					successFun:function(data){
						modal.find('select[name=targetid]').html("")
						$.each(data.info,function(){
							modal.find("select[name=targetid]").append('<option value="'+this.id+'">'+this.name+'</option>');
						});
						if(acc_info&&acc_info.targetid){
							modal.find("select[name=targetid]").val(acc_info.targetid);
						}
					}
				}
				asys.post(config);
			}
			//获取角色列表
			function getRole(source){
				modal.find("table[name=role_lists]").html("");
				var config={
					url:'Permissions/role_lists',
					params:{
						limit:1000,
						source:source
					},
					successFun:function(data){
						$.each(data.info,function(){
							var html='<label>'
									+				'<input type="radio"  name="role_id" value="'+this.id+'">'+this.name
									+			'</label>';
							modal.find("table[name=role_lists]").append(html);
						});
						if(acc_info&&acc_info.role_id){
							modal.find("input[name=role_id][value="+acc_info.role_id+"]").click();
						}
					}
				}
				asys.post(config);
			}
			//获取账号详细信息，并渲染
			function getAccInfo(){
				var config={
					url:'Permissions/acc_info',
					params:{
						id:acc_id
					},
					successFun:function(data){
						acc_info=data.info;
						modal.find("input[name=account]").val(acc_info.account?acc_info.account:'');
						modal.find("input[name=mobile]").val(acc_info.mobile?acc_info.mobile:'');
						modal.find("input[name=name]").val(acc_info.name?acc_info.name:'');
						if(acc_info.source){
							modal.find("select[name=source]").val(acc_info.source);
						}
						
						if(acc_info.source==1){
							getTarget("Insurer/lists");
							getRole(1);
						}else if(acc_info.source==2){
							getTarget("Insurance/lists");
							getRole(2);
						}else if(acc_info.source==3){
							modal.find(".targetbox").hide();
							modal.find('select[name=targetid]').html("");
							getRole(3);
						}else if(acc_info.source==4){
							getTarget("Partner/lists");
							getRole(4);
						}
					}
				}
				asys.post(config);
			}
		}
		//权限请求成功后调用的方法，记录权限信息，并查看是否有表格之上的筛选栏或者按钮权限，然后请求数据渲染表格
		function setOpname(power,data){
			var html="";
			html+= '<td class="operation">'
			$.each(power,function(k,v){
				if(fcodes.indexOf(v.fcode)>-1){
					if(v.fcode=='delete' && data.status==0){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}if(v.fcode=='delete'){
						html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
					}else if(v.fcode=='disabled' && data.status==1){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}else if(v.fcode=='disabled'){
						html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
					}else if(v.fcode=='enabled' && data.status==0){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}else if(v.fcode=='enabled'){
						html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
					}else if(v.fcode=='edit'){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}else if(v.fcode=='reset' && data.status==1){
						html+= '<a opname="'+v.fcode+'">'+v.title+'</a>'
					}else if(v.fcode=='reset'){
						html+= '<a opname="'+v.fcode+'" hidden>'+v.title+'</a>'
					}
				}
			});
			html+='</td>';
			//更改操作列的列宽
			tabInfo.tableDom.find("th:last").css("width",'163px');
			tabInfo.tableDom.find("th:last div").css("width",'163px');
			return html;
		}
					
		//操作单元格点击事件
		function optionClick(){
			var self=this,config,
				opname=$(self).attr("opname"),//获取操作方法
				//本次操作所在列的数据
				rowData=$(self).closest("tr")[0].trData;
			if(opname=='delete'){//删除
				config={
					title:'温馨提醒',
					html:"您确认删除该条记录吗？",
					confirmFun:function(obj){
						var config={
							url:'Permissions/acc_status_do',
							params:{
								id:rowData.id,
								type:-1,
							},
							successFun:function(){
								obj.modal('hide');
								$(self).closest("tr").remove();
							}
						}
						asys.post(config);
					}
				}
			}else if(opname=="disabled"){ // 单击禁用时
				config={
					title:'温馨提醒',
					html:"您确认禁用吗？",
					confirmFun:function(obj){
						var config={
							url:'Permissions/acc_status_do',
							params:{
								id:rowData.id,
								type:1,
							},
							successFun:function(){
								//禁用成功后显示改变
								$($(self).closest("tr").find("td")[8]).html("禁用");
								$(self).hide();
								$(self).parent().find("a[opname='enabled']").show();
								$(self).parent().find("a[opname='delete']").show();
								$(self).parent().find("a[opname='reset']").hide();
								obj.modal('hide');
							}
						}
						asys.post(config);
					}
				}
			}else if(opname=="enabled"){//解除禁用
				config={
					title:'温馨提醒',
					html:"您确认解除禁用吗？",
					confirmFun:function(obj){
						var config={
							url:'Permissions/acc_status_do',
							params:{
								id:rowData.id,
								type:2,
							},
							successFun:function(){
								//解除禁用成功后显示改
								$($(self).closest("tr").find("td")[8]).html("正常");
								$(self).hide();
								$(self).parent().find("a[opname='disabled']").show();
								$(self).parent().find("a[opname='delete']").hide();
								$(self).parent().find("a[opname='reset']").show();
								obj.modal('hide');
							}
						}
						asys.post(config);
					}
				}
			}else if(opname=="edit"){//编辑
				showAccBox(rowData.id);
			}else if(opname=="reset"){//重置密码
				config={
					title:'温馨提醒',
					html:"您确认重置该账户密码吗？",
					confirmFun:function(obj){
						var config={
							url:'Permissions/acc_status_do',
							params:{
								id:rowData.id,
								type:3,
							},
							successFun:function(){
								obj.modal("hide");
								asys.showAlert({title:'重置成功',msg:"重置后密码为：123456",isCancel:false});
							}
						}
						asys.post(config);
					}
				}
			}
			if(config){
				asys.showModalHtml(config);
			}
		}
	}
	
	/*点击操作日志的调用方法（保险公司查看）*/
    function operLog(tabInfo){
		/*添加筛选栏*/
		var search_checkstate= '<div class="search-checkstate">'
				+    '<div class="search_box" hidden>'
				+    '<form class="form-inline" style="margin-bottom:15px;">'
				+        '<div class="form-group">'
				+          '<label for="create_start">操作时间</label>'
				+          '<input type="text" class="form-control start_date" name="create_start" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" placeholder="">-<input type="text" class="form-control end_date" data-date-format="yyyy-mm-dd" data-link-format="yyyy-mm-dd" name="create_end" placeholder="">'
				+        '</div>'
				+      '<div class="form-group">'
				+        '<input type="text" class="form-control" id=""  name="company_name" placeholder="id、用户名">'
				+      '</div>'
				+        '<label class="btn btn-primary">查询</label>'
				+			   '<label class="btn btn-default">重置</label>'
				+    '</form>'
				+    '</div>'
				+ '</div>',
			pageConfig={
				tabInfo:tabInfo,//dom信息对象
				paramConfig:OPEN.operLog,//表格配置
				search_checkstate:search_checkstate,//筛选栏html
				setSearchPower:setSearchPower,//权限请求成功后执行方法
				optionClick:optionClick,//可点击标签的点击事件（operation Css下的a标签点击事件）
				checkVlaue:'id',//复选框绑定的value 值的对应的data属性名称
			},
			fcodes=[],
			getData=OPEN.initPage(pageConfig);
		//权限请求成功后调用的方法，记录权限信息，并查看是否有表格之上的筛选栏或者按钮权限
		function setSearchPower(data){
			$.each(data.info,function(){
				var fcode=this.fcode.split("_")[1];//将权限名称拆分，取最后一个
				fcodes.push(fcode);//记录权限列表
				if(fcode=='query'){//是否有查询权限
					tabInfo.tabDom.find(".search_box").show();//显示筛选栏
				}
			})
			getData(1); 
		}
		//操作单元格点击事件
		function optionClick(){}
    }
	
	function generalFile(){
		       /*添加筛选栏*/
		var search_checkstate=  '<div class="search-checkstate">'
			+      '<div class="search_box">'
			+            '<form class="form-inline" style="margin-bottom:15px;">'
			+        '<div class="form-group">'
			+          '<input type="text" class="form-control"style="width:200px!important;" id="search_val" name="search_val" placeholder="文档编号、文档名称">'
			+        '</div>'
			+            '<label class="btn btn-primary">查询</label>'
			+			   '<label class="btn btn-default">重置</label>'
			+            '</form>'
			+      '</div>'
			+      '<div class="checkState">'
			+        '<button type="button" name="add" class="btn btn-primary">添加</button>'
			+     '</div>'
			+   '</div>',fcodes=[];
		pageConfig={
			tabInfo:tabInfo,
			paramConfig:OPEN.libFileDownload,
			search_checkstate:search_checkstate,
			setSearchPower:setSearchPower,
			optionClick:optionClick,
			setOpname:setOpname
		},
		fcodes=[],
		getData=OPEN.initPage(pageConfig);//初始化页面		
	}
	  
	function productFile(){
		pageConfig={
			tabInfo:tabInfo,
			paramConfig:OPEN.libFileDownload,
			search_checkstate:search_checkstate,
			setSearchPower:setSearchPower,
			optionClick:optionClick,
			setOpname:setOpname
		},
		fcodes=[],
		getData=OPEN.initPage(pageConfig);//初始化页面  
	}
	  
	function libFileProduct(){
		var search_checkstate=  '<div class="search-checkstate">'
			+      '<div class="search_box">'
			+            '<form class="form-inline" style="margin-bottom:15px;">'
			+        '<div class="form-group">'
			+          '<input type="text" class="form-control"style="width:200px!important;" id="search_val" name="search_val" placeholder="  产品编号、产品名称、文档名称">'
			+        '</div>'
			+            '<label class="btn btn-primary">查询</label>'
			+			   '<label class="btn btn-default">重置</label>'
			+            '</form>'
			+      '</div>'
			+   '</div>',fcodes=[];
		pageConfig={
			tabInfo:tabInfo,
			paramConfig:OPEN.libFileDownload,
			search_checkstate:search_checkstate,
			setSearchPower:setSearchPower,
			optionClick:optionClick,
			setOpname:setOpname
		},
		fcodes=[],
		getData=OPEN.initPage(pageConfig);//初始化页面 
	}
	  
	  
	function libFileCurrent(){
		   var search_checkstate=  '<div class="search-checkstate">'
			    +      '<div class="search_box">'
			    +            '<form class="form-inline" style="margin-bottom:15px;">'
			    +        '<div class="form-group">'
			    +          '<input type="text" class="form-control"style="width:200px!important;" id="search_val" name="search_val" placeholder=" 文档名称">'
			    +        '</div>'
				+            '<label class="btn btn-primary">查询</label>'
				+			   '<label class="btn btn-default">重置</label>'
			    +            '</form>'
			    +      '</div>'
			    +   '</div>',fcodes=[];
		pageConfig={
			tabInfo:tabInfo,
			paramConfig:OPEN.libFileDownload,
			search_checkstate:search_checkstate,
			setSearchPower:setSearchPower,
			optionClick:optionClick,
			setOpname:setOpname
		},
		fcodes=[],
		getData=OPEN.initPage(pageConfig);//初始化页面 
	}
	  
	function libFileDownload(){
		var search_checkstate=  '<div class="search-checkstate">'
			+      '<div class="search_box">'
			+            '<form class="form-inline" style="margin-bottom:15px;">'
			+        '<div class="form-group">'
			+          '<input type="text" class="form-control"style="width:200px!important;" id="search_val" name="search_val" placeholder=" 文档名称">'
			+        '</div>'
			+            '<label class="btn btn-primary">查询</label>'
			+			   '<label class="btn btn-default">重置</label>'
			+            '</form>'
			+      '</div>'
			+   '</div>',fcodes=[];
		pageConfig={
			tabInfo:tabInfo,
			paramConfig:OPEN.libFileDownload,
			search_checkstate:search_checkstate,
			setSearchPower:setSearchPower,
			optionClick:optionClick,
			setOpname:setOpname
		},
		fcodes=[],
		getData=OPEN.initPage(pageConfig);//初始化页面
		 
	}
	/*
		结算配置输入信息后的联动，以及输入数据的判断
			modal:模态框的jqDom
	*/
	function rateInput(modal){
		modal.find("input[type=text]").val("");
		modal.find("input[type=text]").attr("disabled",'true');
		modal.find("input[name=xsf_val]").removeAttr("disabled");
		//结算模式是可通过多方结算（经纪公司、平台、商户） 含税和不含税选择
		modal.find("input[name=xsf_tax_type]").click(function(){
			modal.find("input[name=xsf_val]").change();
		});
		//结算模式是仅通过经纪公司结算  含税和不含税选择
		modal.find("input[name=jjf_xsf_tax_type]").click(function(){
			modal.find("input[name=jjf_val]").change();
		});
		//费用输入框 内容变化监听，数字有效性判断
		modal.find("input[type=text]").on("input",function(){
			var value=util.trimSpace(this.value);
			if(isNaN(value)){
				$(this).val(0);
				return;
			}
			if(value<0){
				$(this).val(0);
				return;
			}				
		});
		modal.find("input[type=text]").change(function(){
			var value=util.trimSpace(this.value);
			if(value==''){
				allCalc();
				return;
			}
			if(isNaN(value)){
				$(this).val(0);
				return;
			}
			if(value<0){
				$(this).val(0);
				return;
			}
			
			if(value.indexOf(".")>-1){
				$(this).val(parseFloat(value).toFixed(4));	
			}	
			allCalc(this);			
		});
		//销售费用率 右边文字提醒加计算（根据含税不含税）结算模式是可通过多方结算（经纪公司、平台、商户）才会显示
		modal.find("input[name=xsf_val]").change(function(){
			var xsf_tax_type=modal.find("input[name=xsf_tax_type]:checked").val(),
				tip="价税分离比例：",
				xsf_val=this.value,
				free_tip=modal.find(".xsf_tip");
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
		//费用类型，1 固定  2 比例
		modal.find(".free_type").click(function(){
			var value=this.value,
				name=this.name,
				unitDom=$(this).closest(".form-group").find("span"),
				tipDom=$(this).closest(".form-group").find(".free_tip");
			
			if(value==1){
				unitDom.html("元");
			}else{
				unitDom.html("%");
			}
			allCalc();
		});
		//保费去向选择
		modal.find("input[name=xsf_prem_set_type]").change(function(){
			var xsf_prem_set_type=modal.find("input[name=xsf_prem_set_type]:checked").val();
			if(xsf_prem_set_type==1){
				modal.find(".xsf_tax_box").hide();
				modal.find(".xsf_box").hide();
				modal.find(".tgf_insurer_box").hide();
				modal.find(".fwf_insurer_box").hide();
				modal.find(".jjf_xsf_tax_box").show();
				modal.find(".jjf_box .title").text("");
			}else{
				modal.find(".xsf_tax_box").show();
				modal.find(".xsf_box").show();
				modal.find(".tgf_insurer_box").show();
				modal.find(".fwf_insurer_box").show();
				modal.find(".jjf_xsf_tax_box").hide();
				modal.find(".jjf_box .title").text("经纪费");
			}
			modal.find("input[type=text]").val("");
			modal.find("input[name=xsf_val]").change();
			modal.find("input[name=jjf_val]").change();
			allCalc();
		});
		// 经纪费 右边文字提醒加计算（根据含税不含税） 结算模式是仅通过经纪公司结算才会显示
		modal.find("input[name=jjf_val]").change(function(){
			var xsf_tax_type=modal.find("input[name=jjf_xsf_tax_type]:checked").val(),
				tip="价税分离比例：",
				xsf_val=this.value,
				xsf_prem_set_type=modal.find("input[name=xsf_prem_set_type]:checked").val(),
				free_tip=modal.find(".jjf_tip");;
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
			var xsf_type=modal.find("input[name=xsf_type]:checked").val(),
				jjf_type=modal.find("input[name=jjf_type]:checked").val(),
				fwf_insurer_type=modal.find("input[name=fwf_insurer_type]:checked").val(),
				tgf_insurer_type=modal.find("input[name=tgf_insurer_type]:checked").val(),
				tdf_type=modal.find("input[name=tdf_type]:checked").val(),
				fwf_ins_type=modal.find("input[name=fwf_ins_type]:checked").val(),
				tgf_ins_type=modal.find("input[name=tgf_ins_type]:checked").val(),
				tgf_plat_type=modal.find("input[name=tgf_plat_type]:checked").val(),
				plat_type=modal.find("input[name=plat_type]:checked").val(),
				xsf_val=parseFloat(modal.find("input[name=xsf_val]").val()),
				jjf_val=parseFloat(modal.find("input[name=jjf_val]").val()),
				xsf_prem_set_type=modal.find("input[name=xsf_prem_set_type]:checked").val(),
				qdf_type=modal.find("input[name=qdf_type]:checked").val();
			if(xsf_prem_set_type==2 && xsf_type=='2' && jjf_type=='2' && fwf_insurer_type=='2' && tgf_insurer_type=='2' && tdf_type=='2' && fwf_ins_type=='2' && tgf_ins_type=='2' && tgf_plat_type=='2' && qdf_type=='2' && plat_type=='2'){
				inputDisabled(obj);
				modal.find(".jjf_tip").hide();
				modal.find(".xsf_tip").show();
				modal.find(".fwf_insurer_tip").show();
				
			}else if(xsf_prem_set_type==1 && jjf_type=='2' && tdf_type=='2' && fwf_ins_type=='2' && tgf_ins_type=='2' && tgf_plat_type=='2' && qdf_type=='2' && plat_type=='2'){
				inputDisabled(obj)
				modal.find(".jjf_tip").show();
				modal.find(".xsf_tip").hide();
				modal.find(".fwf_insurer_tip").hide();
			}else{
				modal.find("input[type=text]").removeAttr("disabled");
				modal.find(".calc_tip").hide()
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
			var xsf_type=modal.find("input[name=xsf_type]:checked").val(),
				jjf_type=modal.find("input[name=jjf_type]:checked").val(),
				fwf_insurer_type=modal.find("input[name=fwf_insurer_type]:checked").val(),
				tgf_insurer_type=modal.find("input[name=tgf_insurer_type]:checked").val(),
				tdf_type=modal.find("input[name=tdf_type]:checked").val(),
				fwf_ins_type=modal.find("input[name=fwf_ins_type]:checked").val(),
				tgf_ins_type=modal.find("input[name=tgf_ins_type]:checked").val(),
				tgf_plat_type=modal.find("input[name=tgf_plat_type]:checked").val(),
				plat_type=modal.find("input[name=plat_type]:checked").val(),
				xsf_val=parseFloat(modal.find("input[name=xsf_val]").val()),
				jjf_val=parseFloat(modal.find("input[name=jjf_val]").val()),
				xsf_prem_set_type=modal.find("input[name=xsf_prem_set_type]:checked").val(),
				qdf_type=modal.find("input[name=qdf_type]:checked").val();
			if(obj && parseFloat(obj.value)>100){
				$(obj).val("");
			}
			if(xsf_prem_set_type==2 && !(xsf_val>0)){
				modal.find("input[type=text]").val("");
				modal.find("input[type=text]").attr("disabled",'true');
				modal.find("input[name=xsf_val]").removeAttr("disabled");
			}else if(xsf_prem_set_type==1 &&  !(jjf_val>0)){
				modal.find("input[type=text]").val("");
				modal.find("input[type=text]").attr("disabled",'true');
				modal.find("input[name=jjf_val]").removeAttr("disabled");
			}else if(xsf_prem_set_type==2){
				modal.find("input[type=text]").removeAttr("disabled");
				modal.find(".fwf").attr("disabled",'true');
				modal.find(".calc_tip").show();
				setInsurerFWFValue();
				setInsFWDValue();
			}else if(xsf_prem_set_type==1){
				modal.find("input[type=text]").removeAttr("disabled");
				modal.find(".fwf").attr("disabled",'true');
				modal.find(".calc_tip").show();
				setInsFWDValue();
			}
			if(!modal.find("input[name=jjf_val]").val()||(parseFloat(modal.find("input[name=jjf_val]").val()))<0){
				modal.find("input[name=tdf_val]").val("");
				modal.find("input[name=tgf_ins_val]").val("");
				modal.find("input[name=tdf_val]").attr("disabled",'true');
				modal.find("input[name=tgf_ins_val]").attr("disabled",'true');
			}
			var fwf_ins_val=modal.find("input[name=fwf_ins_val]").val(),
				jjf_val=$("input[name=jjf_val]").val(),
				fwf_insurer_val=modal.find("input[name=fwf_insurer_val]").val();
			if(xsf_prem_set_type==1 &&(!jjf_val || parseFloat(jjf_val)<0 || !fwf_ins_val ||parseFloat(fwf_ins_val)<0)){
				modal.find("input[name=tgf_plat_val]").val("");
				modal.find("input[name=qdf_val]").val("");
				modal.find("input[name=tgf_plat_val]").attr("disabled",'true');
				modal.find("input[name=qdf_val]").attr("disabled",'true');
			}else if((xsf_prem_set_type==2 && (!fwf_ins_val || !fwf_insurer_val || parseFloat(fwf_ins_val)<0 || parseFloat(fwf_insurer_val)<0))){
				modal.find("input[name=tgf_plat_val]").val("");
				modal.find("input[name=qdf_val]").val("");
				modal.find("input[name=tgf_plat_val]").attr("disabled",'true');
				modal.find("input[name=qdf_val]").attr("disabled",'true');
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
			var tgf_plat_val=parseFloat(modal.find("input[name=tgf_plat_val]").val()),
				qdf_val=parseFloat(modal.find("input[name=qdf_val]").val()),
				fwf_insurer_val=parseFloat(modal.find("input[name=fwf_insurer_val]").val()),
				fwf_ins_val=parseFloat(modal.find("input[name=fwf_ins_val]").val()),
				xsf_prem_set_type=modal.find("input[name=xsf_prem_set_type]:checked").val(),
				plat=modal.find("input[name=plat_val]");
			if(xsf_prem_set_type==1 && plat.attr('disabled') && qdf_val>=0 && tgf_plat_val>=0 && fwf_ins_val>=0){
				var rer=(fwf_ins_val-qdf_val-tgf_plat_val).toFixed(4)
				if(rer<0){
					asys.showAlert({title:'温馨提醒',msg:"费用关系有误",isCancel:false})
					plat.val("");
				}else{
					plat.val(rer);
				}
			}else if(xsf_prem_set_type==2 && plat.attr('disabled') && qdf_val>=0 && tgf_plat_val>=0 && fwf_insurer_val>=0 && fwf_ins_val>=0){
				var rer=(fwf_insurer_val+fwf_ins_val-qdf_val-tgf_plat_val).toFixed(4)
				if(rer<0){
					asys.showAlert({title:'温馨提醒',msg:"费用关系有误",isCancel:false})
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
				jjf_val=parseFloat(modal.find("input[name=jjf_val]").val()),
				fwf_insurer=modal.find("input[name=fwf_insurer_val]"),
				jjf_xsf_tax_type=modal.find("input[name=jjf_xsf_tax_type]:checked").val(),
				xsf_prem_set_type=modal.find("input[name=xsf_prem_set_type]:checked").val(),
				tdf_val=parseFloat(modal.find("input[name=tdf_val]").val()),
				free_tip=modal.find(".tdf_tip");
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
			var tdf_val=parseFloat(modal.find("input[name=tdf_val]").val()),
				jjf_val=parseFloat(modal.find("input[name=jjf_val]").val()),
				tgf_ins_val=parseFloat(modal.find("input[name=tgf_ins_val]").val()),
				jjf_xsf_tax_type=modal.find("input[name=jjf_xsf_tax_type]:checked").val(),
				xsf_prem_set_type=modal.find("input[name=xsf_prem_set_type]:checked").val(),
				fwf_ins=modal.find("input[name=fwf_ins_val]"),
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
						asys.showAlert({title:'温馨提醒',msg:"费用关系有误",isCancel:false})
						fwf_ins.val("");
					}else{
						fwf_ins.val(rer);
					}
				}else{
					var rer=(jjf_val-(jjf_val*tdf_val/100)-tgf_ins_val).toFixed(4)
					if(rer<0){
						asys.showAlert({title:'温馨提醒',msg:"费用关系有误",isCancel:false})
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
			var xsf_val=parseFloat(modal.find("input[name=xsf_val]").val()),
				jjf_val=parseFloat(modal.find("input[name=jjf_val]").val()),
				xsf_tax_type=modal.find("input[name=xsf_tax_type]:checked").val(),
				tgf_insurer_val=parseFloat(modal.find("input[name=tgf_insurer_val]").val()),
				fwf_insurer=modal.find("input[name=fwf_insurer_val]"),
				value;
			if(fwf_insurer.attr('disabled') && xsf_val>=0 && jjf_val>=0 && tgf_insurer_val>=0){
				if(xsf_tax_type==2){
					value=xsf_val-jjf_val-tgf_insurer_val;
				}else{
					value=value=parseFloat((xsf_val/1.06).toFixed(4))-jjf_val-tgf_insurer_val;
				}
				if(value<0){
					asys.showAlert({title:'温馨提醒',msg:"费用关系有误",isCancel:false})
					fwf_insurer.val("");
				}else{
					fwf_insurer.val(value.toFixed(4));
				}
			}else if(fwf_insurer.attr('disabled')){
				fwf_insurer.val("");
			}
				
		}
		modal.find("input[name=xsf_prem_set_type]").change();
	}
	/*
		获取结算配置并将数据录入到html中，如果报错获取网络超时将关闭模态框
			modal :模态框的jqDom
			apply_id :apply_id
			com_id :com_id
			product_id :product_id
	*/
	function getpdtInfo(modal,apply_id,com_id,product_id){
		var config={
			url:'CompanyApply/pdt_info',
			params:{
				apply_id:apply_id,
				com_id:com_id,
				product_id:product_id,
			},
			successFun:function(data){
				var info=data.info;
				if(info.xsf && info.xsf.prem_set_type){
					modal.find("input[name=xsf_prem_set_type][value='"+info.xsf.prem_set_type+"']").click();
				}
				if(info.prem_to){
					modal.find("input[name=prem_to][value='"+info.prem_to+"']").click();
				}
				if(info.xsf.tax_type){
					if(info.xsf.prem_set_type==2){
						modal.find("input[name=xsf_tax_type][value="+info.xsf.tax_type+"]").click();
					}else{
						modal.find("input[name=jjf_xsf_tax_type][value='"+info.xsf.tax_type+"']").click();
					}
				}
				modal.find("input[name=xsf_val]").val(info.xsf.val>=0?info.xsf.val:'');
				modal.find("input[name=jjf_val]").val(info.jjf.val>=0?info.jjf.val:'');
				modal.find("input[name=qdf_val]").val(info.qdf.val>=0?info.qdf.val:'');
				modal.find("input[name=tdf_val]").val(info.tdf.val>=0?info.tdf.val:'');
				modal.find("input[name=tgf_plat_val]").val(info.tgf_plat.val>=0?info.tgf_plat.val:'');
				modal.find("input[name=tgf_insurer_val]").val(info.tgf_insurer.val>=0?info.tgf_insurer.val:'');
				modal.find("input[name=tgf_ins_val]").val(info.tgf_ins.val>=0?info.tgf_ins.val:'');
				modal.find("input[name=fwf_ins_val]").val(info.fwf_ins.val>=0?info.fwf_ins.val:'');
				modal.find("input[name=fwf_insurer_val]").val(info.fwf_insurer.val>=0?info.fwf_insurer.val:'');
				modal.find("input[name=fwf_insurer_val]").val(info.fwf_insurer.val>=0?info.fwf_insurer.val:'');
				modal.find("input[name=plat_val]").val(info.plat.val>=0?info.plat.val:'');
				if(info.xsf.prem_set_type==2 && info.xsf.type){
					modal.find("input[name=xsf_type][value="+info.xsf.type+"]").click();
				}
				if(info.jjf.type){
					modal.find("input[name=jjf_type][value="+info.jjf.type+"]").click();
				}
				
				if(info.xsf.prem_set_type==2 && info.fwf_insurer.type){
					modal.find("input[name=fwf_insurer_type][value="+info.fwf_insurer.type+"]").click();
				}
				if(info.fwf_ins.type){
					modal.find("input[name=fwf_ins_type][value="+info.fwf_ins.type+"]").click();
				}
				if(info.xsf.prem_set_type==2 && info.tgf_insurer.type){
					modal.find("input[name=tgf_insurer_type][value="+info.tgf_insurer.type+"]").click();
				}
				if(info.tgf_ins.type){
					modal.find("input[name=tgf_ins_type][value="+info.tgf_ins.type+"]").click();
				}
				if(info.tgf_plat.type){
					modal.find("input[name=tgf_plat_type][value="+info.tgf_plat.type+"]").click();
				}
				if(info.tdf.type){
					modal.find("input[name=tdf_type][value="+info.tdf.type+"]").click();
				}
				if(info.qdf.type){
					modal.find("input[name=qdf_type][value="+info.qdf.type+"]").click();
				}
				if(info.plat.type){
					modal.find("input[name=plat_type][value="+info.plat.type+"]").click();
				}
				if(info.xsf.prem_set_type==2){
					modal.find("input[name=xsf_val]").change()
				}else{
					modal.find("input[name=jjf_val]").change()
				}
				
				modal.find("label[name=insurer_name]").text(info.insurer_name?info.insurer_name:'--');
				modal.find("label[name=ins_name]").text(info.ins_name?info.ins_name:'--');
				
			},
			statusErrorFun:function(){
				modal.modal('hide');
			},
			errorFun:function(){
				modal.modal('hide');
			}
		}
		asys.post(config);
	}
	//修改登陆账号的密码
	function resetPwd(){
		var html='<form class="form-horizontal">'
				+		'<div class="form-group">'
				+			'<label for="old_password" class="col-sm-3 control-label">原始密码：</label>'
				+			'<div class="col-sm-7">'
				+				'<input type="password" name="old_password" class="form-control" id="" placeholder="请输入原始密码">'
				+			'</div>'
				+		'</div>'
				+		'<div class="form-group">'
				+			'<label for="password" class="col-sm-3 control-label">新密码：</label>'
				+			'<div class="col-sm-7">'
				+				'<input type="password" name="password" class="form-control" id="" placeholder="请输入新密码">'
				+			'</div>'
				+		'</div>'
				+		'<div class="form-group">'
				+			'<label for="again" class="col-sm-3 control-label">再次输入：</label>'
				+			'<div class="col-sm-7">'
				+				'<input type="password" name="again" class="form-control" id="" placeholder="请再次输入新密码">'
				+			'</div>'
				+		'</div>'
				+	'</form>';
		var modalList=$("body").find("#resetPwd");
		modalList.remove();//将原有的模态框上
		$("body").append(asys.modalHtml('resetPwd'));//创建模态框
		var modalList=$("body").find("#resetPwd");
		modalList.find(".modal-title").text("修改密码");//修改模态框title
		modalList.find(".pop-box").html(html);
		//确认按钮方法
		modalList.find(".btn-primary").click(function(){//确认按钮点击事件
			//获取输入信息并验证
			var again=modalList.find("input[name=again]").val(),
				password=modalList.find("input[name=password]").val(),
				old_password=modalList.find("input[name=old_password]").val();
			if(!old_password){
				asys.showAlert({title:'温馨提醒',msg:'请输入账号密码',isCancel:false})
				return;
			}
			if(!password){
				asys.showAlert({title:'温馨提醒',msg:'请输入新密码',isCancel:false})
				return;
			}
			if(password.length<5 || password.length>18){
				asys.showAlert({title:'温馨提醒',msg:'密码长度为6-18位',isCancel:false})
				return;
			}
			if(password!=again){
				asys.showAlert({title:'温馨提醒',msg:'两次输入的密码不一致',isCancel:false})
				return;
			}
			//上传数据
			var config={
				url:'SystemAccount/chg_password',
				params:{
					type:2,
					old_password:old_password,
					password:password
				},
				successFun:function(data){
					asys.showAlert({title:'温馨提醒',msg:'修改成功',isCancel:false});
					modalList.remove();
				}
			}
			asys.post(config);
		}); 					//取消按钮方法
		modalList.find(".btn-default").unbind();
		modalList.find(".btn-default").click(function(){
			modalList.remove();
		});
		modalList.modal("show");//显示模态框
	}
	/*
		获取方法
			name:方法名称
			data：参数的（对象）
	*/
	function goFun(name,data){
		return eval(name+"(data)");
	}
	/*
		获取参数值
			name：参数名
	*/
	function getParam(name){
		return eval(name);
	}
	/*
		抛出俩个方法
	*/
	return {
		getParam:getParam,
		goFun:goFun
	}
}())
			
	  