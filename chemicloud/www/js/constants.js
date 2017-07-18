/**
 * 常量配置
 */
 ip = "http://192.168.28.251:8080/ChemCloud/";
 //本地测试环境
 //ip = "http://192.168.28.251:8080/psa/";
angular.module('starter.constants', [])
  /**--网络请求常量--*/
  .constant('HttpConstant', {
    "HOME_DATA":"enterpriseController.do?getCityNum",
    "LOGIN":"loginController.do?applogin",
    "PARK_LIST":"departController.do?depList",
    "ZhaqYqaqztpj":"rest/LuxiSafetyService/graph",//智慧安全-园区安全整体评价
    "BanKuaiList":"rest/QueryConService/groupentercode",//获取版块列表
    "EnterList":"rest/QueryConService/departname",//根据版块信息获取企业列表
    "DeviceList":"rest/QueryConService/entername",//根据版块信息、企业信息获取设备列表
    "AccidentList":"rest/QueryConService/accident",//获取事故种类
    "ZhaqYqaqztpjList":"rest/LuxiSafetyService/detail",//智慧安全-园区安全整体评价列表
    "ZhaqYqbjtj":"rest/LuxiWarningService/graph",//智慧安全-园区报警统计
    "ZhaqYqbjtjList":"rest/LuxiWarningService/detail",//智慧安全-园区报警统计列表
    "ZhaqYqbjtjTodayList":"rest/LuxiWarningService/today",//智慧安全-园区今日报警列表
    "ZhaqYqyjzhts":"rest/LuxiZhstService/graph",//智慧安全-园区预警综合态势
    "ZhaqYqyjzhtsList":"rest/LuxiZhstService/detail",//智慧安全-园区预警综合态势列表
    "ZhaqGbkqyfhzt":"rest/LuxiZzfhService/graph",//智慧安全-各板块企业负荷状态
    "ZhaqGbkqyfhztList":"rest/LuxiZzfhService/detail",//智慧安全-各板块企业负荷状态列表
    'ZhaqGbkwxyjcyjtj':'rest/LuxiAlarmStatisticsService/graph',//智慧安全-各版块危险源检测预警统计  列表同综合态势的
    'ZhaqWxyjcyj':'rest/LuxiWxyService/detail',//智慧安全-危险源监测预警LuxiWxyService/detail?pageSize=5&pageIndex=3
    'ZhaqAqsgal':'rest/LuxiAqsgalService/list', //安全事故案例
    'ZhaqAqsgalxq': 'rest/LuxiAqsgalService/detail', //安全事故案例详情
    "ZhhbYqhjztpj":"rest/LuxiHjztpjService/graph",//智慧环保-园区环境综合评价
    "PollutionList":"rest/QueryConService/pollution",//污染物列表
    "ZhhbYqhjztpjList":"rest/LuxiHjztpjService/detail",//智慧环保-园区环境整体评价列表
    "AQIPointList":"rest/QueryConService/aqiPoint",//aqi点位列表
    "ZhhbKqzltjaqi":"rest/LuxiAqiService/graph",//智慧环保-空气质量统计aqi
    "ZhhbKqzltjaqiList":"rest/LuxiAqiService/detail",//智慧环保-空气质量统计AQI列表
    "ZhhbYqyjzhts":"rest/LuxiYqyjzhtsService/graph",//智慧环保-园区预警综合态势
    "ZhhbQport":"rest/QueryConService/emission",//智慧环保-园区预警综合态势-气排口
    "ZhhbYqyjzhtsList":"rest/LuxiYqyjzhtsService/detail",//智慧环保-园区预警综合态势列表
    "ZhhbYqkqzlrbaqi":"rest/LuxiYqkqzlrbService/graph",//智慧环保-园区空气质量日报AQI
    "ZhhbGbkwspflph":"rest/LuxiFspfphService/graph",//智慧环保-各板块污水排放量排行
    "ZhhbGbkwspflphPort":"rest/QueryConService/polutionpoint",//智慧环保-各板块污水排放量排行 排放口
    "ZhhbGbkwspflphList":"rest/LuxiFspfphService/detail",//智慧环保-各板块污水排放量排行 列表
    "ZhhbKqrbPoint":"rest/QueryConService/point",//园区空气质量日报站点
    "ZhhbYqkqzlrbaqiList":"rest/LuxiYqkqzlrbService/detail",//智慧环保-园区空气质量日报AQI列表
    "ZhnyYqnhztpj":"rest/LuxiYqnhztpjService/graph",//智慧能源-园区能耗整体评价
    "ZhnyYqnhztpjList":"rest/LuxiYqnhztpjService/detail",//智慧能源-园区能耗整体评价列表
    "ZhnyGbknhph":"rest/LuxiWasterankingService/graph",//智慧能源-各版块能耗排行
    "ZhnyGbknhphList":"rest/LuxiWasterankingService/detail",//智慧能源-各版块能耗排行列表
    "ZhnyMainProducts":"rest/QueryConService/mainProduct",//主要产品列表
    "ZhnyGbkzycpdwnh":"rest/LuxiWastageService/graph",//智慧能源-各版块主要产品单位能耗
    "ZhnyGbkzycpdwnhList":"rest/LuxiWastageService/detail",//智慧能源-各版块主要产品单位能耗列表
    "ZhnyYqslxh":"rest/LuxiWaterdepService/graph",//智慧能源-园区水量消耗
    "SLXHW":"rest/QueryConService/depletname",//园区水量消耗物列表
    "ZhnyYqslxhList":"rest/LuxiWaterdepService/detail",//智慧能源-园区水量消耗
    "ZhnyGbkdwnhdb":"data/zhny-gbkdwnhdb.json",//智慧能源-各版块单位能耗对比
    "ZhnyGbkdwnhdbList":"data/zhny-gbkdwnhdb-list.json",//智慧能源-各版块单位能耗对比
    /**app 以及附件下载相关*/
    'CHECK_VER': ip+'version.txt',//应用版本检测
    'GET_NEW_APP_BASE_URL': ip+'app/',//新版版本存放文件夹
    //'ipaUrl': 'https://thsapp.com/iOS/shandong/lx/lxyq.plist',//ipa下载地址
	  'ipaUrl': 'https://thsapp.com/iOS/sd/lx/zhyq/zhyq.plist',//ipa下载地址
    'CURR_VER': '2.5',

  })
  .constant('config', {
    'ERROR': 'error',
    'USER': '',//用户名 zhangweidong dujunfeng
    'PWD':'',//密码
    'IN_ROLECODE':'',
    'PAGE_COUNT': 10,//分页时候每页的记录数
    'PAGE_COUNT2': 20,//分页时候每页的记录数
    'REFRESH': 0,//下拉刷新
    'LOAD_MORE': 1,//加载更多
    'DATA_INIT': 2,//初始化数据,
    "REFRESH_DATA":"refresh_data",
    "COLORS":{color1:['rgba(105, 179, 200, 1)','rgba(141,185, 254, 1)','rgba(246, 189, 143, 1)','rgba(146, 229, 222, 1)','rgba(140,220,147, 1)','rgba(107, 62, 147, 1)','rgba(142, 62, 147, 1)','rgba(201, 134, 34, 1)', 'rgba(189, 162, 154, 1)','rgba(110,112,116, 1)'],color01:['rgba(105, 179, 200, 0.1)','rgba(141,185, 254, 0.1)','rgba(246, 189, 143, 0.1)','rgba(146, 229, 222, 0.1)','rgba(140,220,147, 0.1)','rgba(107, 62, 147, 0.1)','rgba(142, 62, 147, 0.1)','rgba(201, 134, 34, 0.1)', 'rgba(189, 162, 154, 0.1)','rgba(110,112,116, 0.1)']},
    "POPOVER_1":[{"text":"按周浏览","id":"0"},{"text":"按月浏览","id":"1"},{"text":"按年浏览","id":"2"}],
    "POPOVER_2":[{"text":"按月浏览","id":"1"},{"text":"按年浏览","id":"2"}]
  });
