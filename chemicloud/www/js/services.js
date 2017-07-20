angular.module('starter.services', [])

//login
 .factory('Login',function(HttpConstant,ajax){
   return {
     'LOGIN':function (paramsObj) {
       return ajax.get(ip+HttpConstant.LOGIN,paramsObj,undefined,true);
     }
   }
 })
 .factory('Park',function(HttpConstant,ajax){
   return {
     'getParkList':function (paramsObj) {
       return ajax.get(ip+HttpConstant.PARK_LIST,paramsObj,true);
     },
     'getParkinfo':function (paramsObj) {
       return '"key":"value"';
     }
   };
 })
 .factory('Home',function(HttpConstant,ajax){
   return {
     'HomeData':function (paramsObj) {
       return ajax.get(ip+HttpConstant.HOME_DATA,undefined,true);
     }
   };
 })

 //地图
.factory('Position',function(ajax){
  return {
    all:function(){
      return ajax.get("http://192.168.28.251:8080/ChemCloud/departController.do?getDepartNum",undefined,undefined,true);
    },
    style:function(){
        //地图风格
      var  mapStyle ={
          features: ["road", "building","water","land"],//隐藏地图上的poi
          style : "light"  //设置地图风格为高端黑
      };
      return mapStyle;
    },
    navi:function(){
      //缩放工具微件样式
      var navigationControl = new BMap.NavigationControl({
          // 靠左上角位置
          anchor: BMAP_ANCHOR_TOP_LEFT,
          // LARGE类型
          type: BMAP_NAVIGATION_CONTROL_LARGE,
          // 启用显示定位
          enableGeolocation: true
        });
        return navigationControl;
    },
    icon : function(path,width,height){
      var icon = new BMap.Icon(path,new BMap.Size(width,height),{imageSize:new BMap.Size(width,height) });
      return icon;
    }

  };
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
