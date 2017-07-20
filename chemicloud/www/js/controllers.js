angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})
.controller('ParkCtrl', function($scope,Park) {
  //请求某个城市的园区信息列表
  var params = {};//
  Park.getParkList(params).then(function(resp){
    $scope.parklist = resp.data.obj;
  });
})

.controller('cityParkCtrl', function($scope,Park,$state,$ionicHistory) {
  //请求某个城市的园区信息列表

  $scope.departcode = $state.params.departcode;
  $scope.qtype = $state.params.qtype;

  var params = {
    'id': $scope.departcode,
    'qtype': $scope.qtype
  };

  Park.getParkList(params).then(function(resp){
    $scope.datalist = resp.data;
  });
})

.controller('parkinfoCtrl', function($scope,Park,$state,$ionicHistory) {
  //请求某个城市的园区信息列表

  $scope.departcode = $state.params.departcode;
  $scope.qtype = $state.params.qtype;

  var params = {
    'id': $scope.departcode,
    'qtype': $scope.qtype
  };

  Park.getParkinfo(params).then(function(resp){
    $scope.datalist = resp.data;
  });
})


.controller('LoginCtrl',function($scope,localStorage,utilFun,thsToast,Login,$state,config,$timeout,$window,$cordovaDevice) {
  ionic.DomUtil.ready(function () {
    $timeout(function () {
      var bottom = document.getElementById('loginForm').getBoundingClientRect().bottom;
      $scope.spacerHeight = ($window.window.innerHeight - bottom -44) + 'px';
    }, 500);
  });
  var loginInfo =  localStorage.getObject('loginInfo','{"userName":"","userPass":"","remUser":true,"remPass":"true","host":""}');
  if(utilFun.isNullObj(loginInfo)) {
    $scope.loginInfo = {userName:'',userPass:'',remUser:true,remPass:true,host:ip};
  } else {
    $scope.loginInfo = {userName: loginInfo.userName,userPass: loginInfo.userPass,
        remUser: loginInfo.remUser,remPass: loginInfo.remPass, host: ip
    };
  }
  $scope.onPassCheck = function () {
    if ($scope.loginInfo.remPass) {
      $scope.loginInfo.remUser = true;
    }
  };

  /** 登录功能 */
    $scope.login = function () {
      if ($scope.loginInfo.userName === "") {
        thsToast.show("用户名不能为空","center");
        return;
      }
      if ($scope.loginInfo.userPass === "") {
        thsToast.show("密码不能为空","center");
        return;
      }
      LoginSelfSys();
    };

    function LoginSelfSys() {
      var params = {
        'userName': $scope.loginInfo.userName,
        'password': $scope.loginInfo.userPass
      };
      Login.LOGIN(params).then(function(response) {
        console.log(response);
        //test, uncomment next make response always true
        // response = {"data":{"ifsuccess":1}};
        if (angular.isObject(response)) {
          var data = response.data;
          if (data.msg == "success") {
            loginInfo.remUser = $scope.loginInfo.remUser;
            loginInfo.remPass = $scope.loginInfo.remPass;
            config.USER = $scope.loginInfo.userName;
            config.PWD = $scope.loginInfo.userPass;
            if ($scope.loginInfo.remUser) {
              loginInfo.userName = $scope.loginInfo.userName;
            } else {
              loginInfo.userName = '';
            }
            if ($scope.loginInfo.remPass) {
              loginInfo.userPass = $scope.loginInfo.userPass;
            } else {
              loginInfo.userPass = '';
            }
            // save userInfo
            localStorage.setObject('loginInfo',loginInfo);

            $state.go('tab.home');
          } else if (data.ifsuccess === 0) {
            $scope.loginInfo.userPass = '';
            thsToast.show("用户名或者密码错误", "center");
          } else if (data.ifsuccess === 2) {
            $scope.loginInfo.userPass = '';
            thsToast.show("登录失败请重试", "center");
          }
        } else {
          thsToast.show("网络异常，无法连接服务器...","center");
        }
      });
    }
})

//首页
.controller('HomeCtrl',function($scope,Home) {
  var paramsObj={};
  // get data for which home page needed
  Home.HomeData(paramsObj).then(function(res){
    var datas = res.data.obj;
    // set echartsmap data
    var chart = echarts.init(document.getElementById('echartShandong'));
    $.get('/js/echarts/shandong.json', function (shandongJson) {
        echarts.registerMap('shandong', shandongJson);
        //var datas = $scope.homeDate.shandongfenbu;
        chart.setOption({
          title : {
            //text : '山东省各地市化工企业数量分布',
            textAlign : 'left'
          },
            tooltip: {
                trigger: 'item',
                showDelay: 0,
                transitionDuration: 0.2,
                formatter: function (params) {
                    var value = (params.value + '').split('.');
                    value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
                    return  params.name + '化工企业共计: ' + value + '家';
                }
            },
            visualMap: {
                right : 0,
                left:960,
                min: 0,
                max: 100,
                splitNumber: 5,
                color: ['#d94e5d','#eac736','#50a3ba'],
                textStyle: {
                  color: '#fff'
                }
            },
            series: [{
              z : 1 ,
                type: 'map',
                map: 'shandong',
                left:0,
                right:'10%',
                top :30,
                itemStyle:{
                    normal:{label:{show:true}},
                    emphasis:{label:{show:true}}
              },
                data: datas}
            ]
        });
    });
  });
})
.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

//高德地图
.controller('MapCtrl', function($scope,$window) {

})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
