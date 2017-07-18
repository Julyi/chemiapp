/**
 * Created by chixin on 2015/5/29
 */
angular.module("thsServices", ["ionic"])
  .factory("ajax", function ($q, $ionicLoading, $http, $ionicPopup, $window, $location) {
    return {
      get: function (url, params, loadingTemplate, showLoading) {
        //var val = $window.sessionStorage.getItem(url + $location.path());
        var defer = $q.defer();
        //if (!val) {
        if (showLoading) {
          $ionicLoading.show({template: loadingTemplate ? loadingTemplate : '<span class="icon load-spin font-size-3"></span>'});
        }
        $http({
          method: "GET",
          url: url,
          params: params,
          cache: false,
          timeout: 20000,
          headers: {'Content-Type': 'application/json;charset=UTF-8','Cache-Control':'no-cache'}
        }).then(function (result) {
          if (showLoading) {
            $ionicLoading.hide();
          }
          defer.resolve(result);
          //return result;
        }, function (error) {
          //error = Object {data: null, status: 0, config: Object, statusText: ""}
          console.log(error);
          //if(error.status <= 0) {
          //  //window.location = "noresponse.html";
          //  console.log("拦截。。。");
          //  return;
          //}
          if (showLoading) {
            $ionicLoading.hide();
          }
          defer.resolve('error');
          //defer.reject(error);
        });
        //} else {
        //    defer.resolve(val);
        //}
        return defer.promise;
      },
      post: function (url, params, loadingTemplate, showLoading) {
        var defer = $q.defer();
        if (showLoading) {
          $ionicLoading.show({template: loadingTemplate ? loadingTemplate : '<span class="icon load-spin font-size-3"></span>'});
        }
        $http({
          method: "POST",
          url: url,
          data: params,
          cache: false,
          timeout: 10000,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          transformRequest: function (data) {
            /**
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */
            var param = function(obj) {
              var query = '';
              var name, value, fullSubName, subName, subValue, innerObj, i;

              for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                  for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                  }
                } else if (value instanceof Object) {
                  for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                  }
                } else if (value !== undefined && value !== null) {
                  query += encodeURIComponent(name) + '='+ encodeURIComponent(value) + '&';
                }
              }

              return query.length ? query.substr(0, query.length - 1) : query;
            };

            return angular.isObject(data) && String(data) !== '[object File]'? param(data)
              : data;
          }
        }).then(function (result) {
          if (showLoading) {
            $ionicLoading.hide();
          }
          defer.resolve(result);
        }, function (error) {
          if (showLoading) {
            $ionicLoading.hide();
          }
          defer.reject(error);
        });
        return defer.promise;
      },
      soap: function (url, targetNamespace, methodName, paramsObj, loadingTemplate, showLoading) {
        var defer = $q.defer();
        if (showLoading) {
          $ionicLoading.show({template: loadingTemplate ? loadingTemplate : '<span class="icon load-spin font-size-3"></span>'});
        }
        var entry =
          "<?xml version='1.0' encoding='utf-8'?>" +
          "<soap:Envelope xmlns:soap='http://schemas.xmlsoap.org/soap/envelope/' xmlns:api='" + targetNamespace + "'>" +
          "<soap:Body>" +
          "<api:" + methodName + ">";
        var propertyValue = '';
        var i = 0;
        if (paramsObj !== null) {
          for (var name in paramsObj) {
            var value = paramsObj[name];
            propertyValue += "<" + name + ">" + value + "</" + name + ">";
            i++;

          }
        }
        i = 0;
        entry += propertyValue;
        var last = "</api:" + methodName + ">" +
          "</soap:Body>" +
          "</soap:Envelope>";
        entry += last;
        $http.post(url, entry,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; application/soap+xml; charset=utf-8'
            }
          })
          .success(function (data, status, headers, config) {
            //console.log(data);
            var tagName = methodName + "Response";
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(data, "text/xml");
            var tag = xmlDoc.getElementsByTagNameNS(targetNamespace, tagName);
            var value = tag[0].childNodes[0].textContent;
            if (showLoading) {
              $ionicLoading.hide();
            }
            //console.log(value);
            defer.resolve(value);
          })
          .error(function (data, status, headers, config) {
            if (showLoading) {
              $ionicLoading.hide();
            }
            defer.resolve("error");
          });
        return defer.promise;
      }
    };
  }).factory("utilFun", function () {
  Date.prototype.format = function (format) {
    var o = {
      "M+": this.getMonth() + 1, //month
      "d+": this.getDate(), //day
      "h+": this.getHours(), //hour
      "m+": this.getMinutes(), //minute
      "s+": this.getSeconds(), //second
      "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
      "S": this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
  };
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  return {
    /***
     * 将给定的时间格式化
     * @param time  给定的时间
     * @param format  格式   例如：yyyy-MM-dd hh：mm：ss qq S
     * @returns {Date}
     */
    timeFormat: function (time, format) {
      if (time.isUndefined || time === '') {
        return new Date().format(format);
      }
      return new Date(time).format(format);
    },
    /**生成32位UUID
     * Generate a pseudo-GUID by concatenating random hexadecimal.
     * @returns {string}  返回 UUID
     */
    'getGUID': function () {
      return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },
    /***
     * 获取0--max随机数
     * @param max
     * @returns {number}
     */
    'getRandom': function (max) {
      return Math.ceil(Math.random() * (max || 1));
    },
    /***
     *
     * @param obj
     * @returns {boolean}
     */
    'isNullObj': function (obj) {
      if (obj === undefined) {
        return true;
      }
      for (var o in obj) {
        return false;
      }
      return true;
    },
    /**
     * 解析xml字符串
     * @param xmlStr  xml字符串
     * @param tag     元素标签名称
     * @returns {Array}  对象数组
     */
    'xmlToArr': function (xmlStr, tag) {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(xmlStr, "text/xml");
      var ele = xmlDoc.getElementsByTagName(tag);
      var objList = [];
      for (var i = 0; i < ele.length; i++) {
        var info = {};
        var childNodes = ele[i].childNodes;
        for (var j = 0; j < childNodes.length; j++) {
          var node = childNodes[j];
          if (node.nodeType == 1) {
            var mtag = node.tagName;
            var firstChild = ele[i].getElementsByTagName(mtag)[0].firstChild;
            var tagValue = '';
            if (firstChild !== null) {
              tagValue = firstChild.textContent;
            }
            info[mtag] = tagValue;
          }
        }
        objList.push(info);
      }
      return objList;
    },
    /**
     * x保留num小数位
     * @param x
     * @param num
     * @returns {number}
     */
    'xround': function (x, num) {
      return Math.round(x * Math.pow(10, num)) / Math.pow(10, num);
    },
    /**
     * 日期按天计算操作
     * @param date  开始日期
     * @param d     日期增量(天)可以是正值也可以是负值
     * @returns {Date} 计算后的日期
     */
    'calendarDateCal': function (date, d) {
      var v = date.valueOf();
      var next = v + d * 24 * 60 * 60 * 1000;
      return new Date(next);
    },
    /**
     * 日期按月计算
     * @param date 开始日期
     * @param d    日期增量(月)可以是正值也可以是负值
     * @returns {*} 计算后的日期
     */
    'calendarMonthCal': function (date, d) {
      date.setMonth(date.getMonth() + d);
      return date;
    },
    /**
     * 获取两个数组比较
     * @param arr1
     * @param arr2
     * @param arr1Callback  自定义arr1与arr2比较规则
     * @param arr2Callback  自定义arr2与arr1比较规则
     * @returns {{diff1: 存在arr1不同于arr2的元素集合, diff2: 存在arr2不同于arr3的元素集合, same: arr1与于arr2中相同的元素集合}}
     */
    'compareArr': function (arr1, arr2, arr1Callback, arr2Callback) {
      function hasElement(arr, ele, callBack) {
        // 内存循环
        var hasItem1 = false;
        for (var i2 = 0; i2 < arr.length; i2++) {
          //
          var item2 = arr[i2] || "";
          if (!item2) {
            continue;
          }
          if (callBack) {
            hasItem1 = callBack(ele, item2);
            if (hasItem1) {
              break;
            }
          } else {
            if (ele == item2) {
              hasItem1 = true;
              break;
            }
          }
        }
        return hasItem1;
      }

      function inAnotB(a, b, callBack) { // 在A中，不在B中
        var res = [];
        for (var i1 = 0; i1 < a.length; i1++) {
          var item1 = a[i1] || "";
          if (!item1) {
            continue;
          }
          var hasItem1 = hasElement(b, item1, callBack);
          if (!hasItem1) {
            res.push(item1);
          }
        }
        return res;
      }

      function inAandB(a, b, callBack) { // 在A中，在B中
        var res = [];
        for (var i1 = 0; i1 < a.length; i1++) {
          var item1 = a[i1] || "";
          if (!item1) {
            continue;
          }
          var hasItem1 = hasElement(b, item1, callBack);
          if (hasItem1) {
            res.push(item1);
          }
        }
        return res;
      }

      var arr = {
        'diff1': inAnotB(arr1, arr2, arr1Callback),
        'diff2': inAnotB(arr2, arr1, arr2Callback),
        'same': inAandB(arr1, arr2, arr1Callback)

      };
      return arr;
    }
  };
}).factory('localStorage', function ($window) {
  return {
    set: function (key, value) {
      $window.localStorage[key] = value;
    },
    get: function (key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function (key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function (key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    getArray: function (key) {
      return JSON.parse($window.localStorage[key] || '[]');
    },
    clearAll: function () {
      $window.localStorage.clear();

    }
  };
}).factory('sessionStorage', function ($window) {
    return {
      set: function (key, value) {
        $window.sessionStorage[key] = value;
      },
      get: function (key, defaultValue) {
        return $window.sessionStorage[key] || defaultValue;
      },
      setObject: function (key, value) {
        $window.sessionStorage[key] = JSON.stringify(value);
      },
      getObject: function (key) {
        return JSON.parse($window.sessionStorage[key] || '{}');
      },
      'clearAll': function () {
        $window.sessionStorage.clear();

      }
    };
  })
  .factory('fileOpenUtils', function ($ionicLoading, thsLoading) {
    return {
      /**
       * 判断文件是否存在
       * @param filename
       * @param filePath
       * @returns {*}
       */
      'isExist': function (filename, filePath) {
        var dir;
        if (filePath) {
          dir = filePath;
        } else {
          var ios = cordova.file.cacheDirectory;
          var ext = cordova.file.externalCacheDirectory;
          dir = (ext) ? ext : ios;
        }
        return $cordovaFile.checkFile(dir, filename);
      },
      'openFile': function (url, callback) {
        try {
          thsLoading.show();
          cordova.plugins.fileOpener2.open(url, function success() {
            console.log('Success');
            thsLoading.hide();
          }, function error(code) {
            if (code === 1) {
              console.log('No file handler found');
            } else {
              console.log('Undefined error');
            }
            if (callback) {
              callback(code);
            }
            thsLoading.hide();
          });
        } catch (e) {
          thsLoading.hide();
          console.log(e.toString());
        }
      },
      downFile: function (url, path) {
        return $cordovaFileTransfer.download(url, path);
      }
    };
  })
  .factory("thsToast", function ($cordovaToast) {
    return {
      /**
       * 警告框
       * @param txt
       */
      'show': function (txt, position) {
        try {
          return $cordovaToast
            .show(txt, 'short', (position || 'center'));
        } catch (e) {
          console.log(e.toString());
        }
      }
    };
  })
  .factory('thsPopup', function ($ionicPopup) {
    return {
      /**
       * 警告框
       * @param txt
       */
      'showAlertDialog': function (txt) {
        $ionicPopup.alert({
          title: '警告',
          okText: '确定',
          okType: 'button-popup',
          template: txt
        });
      },
      'showConfirmDialog': function (titleText, context) {
        var opt = {
          title: titleText,
          template: context,
          cancelText: '取消',
          cancelType: 'button-popup',
          okText: '确定',
          okType: 'button-popup'
        };
        if (titleText) {
          opt.title = titleText;
        }
        if (context) {
          opt.template = context;
        }
        return $ionicPopup.confirm(opt);
      }
    };
  })
  .factory('backButtonClick', function ($ionicPlatform, $timeout, thsToast) {
    return {
      /**
       * 根据自定义条件退出app
       * @param customExitCallBack
       */
      'exitAppByCustom': function (customExitCallBack) {
        var taptimes = 0;
        $ionicPlatform.registerBackButtonAction(function (event) {
          var isExit = customExitCallBack();
          if (isExit) {
            event.preventDefault();
            taptimes++;
            if (taptimes < 2) {
              thsToast.show('再按一次退出软件').then(function (success) {
                // success
                $timeout(function () {
                  taptimes = 0;
                }, 2000);
              }, function (error) {
                // error
                taptimes = 0;
              });
            } else {
              taptimes = 0;
              ionic.Platform.exitApp();
            }
          }
        }, 100);

      },
      /**
       * 双击退出
       */
      'doubleToExit': function () {
        var taptimes = 0;
        $ionicPlatform.registerBackButtonAction(function (event) {
          event.preventDefault();
          taptimes++;
          if (taptimes < 2) {
            thsToast.show('再按一次退出软件').then(function (success) {
              // success
              $timeout(function () {
                taptimes = 0;
              }, 3000);
            }, function (error) {
              // error
              taptimes = 0;
            });
          } else {
            taptimes = 0;
            ionic.Platform.exitApp();
          }
        }, 100);
      },
      /**
       * Android 物理返回键设置监听事件
       */
      'setOnBackButtonListener': function (onBackKeyPressListener) {
        $ionicPlatform.registerBackButtonAction(function (event) {
          if (onBackKeyPressListener) {
            event.preventDefault();
            onBackKeyPressListener();
          }
        }, 100);
      }
    };
  })
  .factory('appUpdate', function ($http, thsPopup, fileUtils, thsToast) {
    //依赖插件：
    //        cordova plugin add nl.x-services.plugins.toast
    //        cordova plugin add cordova-plugin-pdialog
    //        cordova plugin add cordova-open
    //        cordova plugin add cordova-plugin-file-transfer
    return {
      'checkVersion': function (url, loaclVersion, appBaseUrl) {
        $http.get(url, {cache: false, headers: {'Cache-Control': 'no-cache'}})
          .success(function (response) {
            /* {
             "apkName": "tj-menhu.apk",
             "ipaName": "",
             "ver_android": 1.0,
             "ver_ios": 1.0
             }*/
            var verInfo = response;
            console.log(verInfo);
            var platform = ionic.Platform.platform().toLocaleLowerCase();
            switch (platform) {
              case 'android':
                if (parseFloat(verInfo.ver_android) > parseFloat(loaclVersion)) {
                  thsPopup.showConfirmDialog('更新提示', '发现新版本,是否更新?').then(function (res) {
                    if (res) {
                      //下载更新
                      var pDialog;
                      try {
                        pDialog = cordova.plugin.pDialog;
                        pDialog.init({progressStyle: 'HORIZONTAL', title: '下载更新', message: '正在下载安装包，请稍候...'});
                        // pDialog.setCancelable(false);
                        var dir = cordova.file.externalRootDirectory;
                        //var uri = encodeURI(url);
                        var fileName = verInfo.apkName;
                        var filePath = dir + fileName;
                        var apkDownUrl = appBaseUrl + fileName;
                        fileUtils.downFile(apkDownUrl, filePath)
                          .then(function (result) {
                            //var filePath = result.nativeURL;
                            pDialog.dismiss();
                            fileUtils.openFile(filePath,
                              function () {
                                thsToast.show('解析包错误...');
                              }, true);
                          }, function (err) {
                            thsToast.show('下载失败,请重试...');
                            // console.log(err);
                            pDialog.dismiss();
                          }, function (progress) {
                            // pDialog.setMax(parseInt(progress.total/1024/1024));
                            // pDialog.setProgress(parseInt(progress.loaded / 1024/1024));
                            pDialog.setProgress(parseInt((progress.loaded / progress.total) * 100));
                          });
                      } catch (e) {
                        console.log(e);
                        thsToast.show('下载失败,请重试...');
                        if (pDialog)
                          pDialog.dismiss();
                      }
                    }
                  });

                }
                break;
              case 'ios':
                // if (parseFloat(verInfo.ver_ios) > parseFloat(loaclVersion)) {
                //    thsPopup.showConfirmDialog('更新提示','发现新版本,是否更新?').then(function (res) {
                //        if(res)
                //        window.open('itms-services://?action=download-manifest&url=https://thsapp.com/iOS/nm/nmMobileoa.plist');
                //    });
                // }
                break;
            }
          });
      }
    };
  })
  .factory('thsLoading', function ($ionicLoading) {
    return {
      'show': function (loadingTemplate) {
        $ionicLoading.show({template: loadingTemplate ? loadingTemplate : '<span class="icon load-spin font-size-3"></span>'});

      },
      'hide': function () {
        $ionicLoading.hide();
      }
    };
  })
  .factory('appUtils', function (fileOpenUtils, localStorage, $cordovaFileTransfer, $cordovaFileOpener2) {
    /**
     * Install: cordova plugin add com.lampa.startapp
     * Install: cordova plugin add cordova-plugin-file-opener2
     * Install: cordova plugin add cordova-plugin-file-transfer
     * android注意权限"android.permission.WRITE_EXTERNAL_STORAGE"
     */
    return {
      /**
       * 检测应用是否安装
       * @param packName android 包名  ios URI
       * @param callBack  回调  true--安装  false--未安装
       */
      'checkInstall': function (packName, callback) {
        try {
          navigator.startApp.check(packName, function (message) { /* success */
              console.log(message); // => OK
              if (callback) {
                callback(true);
              }
            },
            function (error) { /* error */
              console.log(error);
              if (callback) {
                callback(false);
              }
            });

        } catch (e) {
          console.log(e);
          if (callback) {
            callback(false);
          }
        }
      },
      /**
       * 启动其他应用
       * @param packName   包名
       * @param pargams    传递参数[{'key1':'value1'},{'key2':'value2'}...]
       * @param launch     android 中需要直接启动的activity   包名+activity类名
       * @param successCallback   打开成功回调
       * @param errorCallback     打开失败回调
       */
      'startApp': function (packName, pargams, launch, successCallback, errorCallback) {
        var platform = ionic.Platform.platform().toLocaleLowerCase();
        switch (platform) {
          case 'android':
            //var args = [[packName, launch], pargams];
            var args;
            if (pargams && launch) {
              args = [[packName, launch], pargams];
            } else {
              if (pargams === undefined && launch !== undefined) {
                args = [[packName, launch]];
              } else if (pargams !== undefined && launch === undefined) {
                args = [packName, pargams];
              } else {
                args = packName;
              }
            }
            try {
              navigator.startApp.start(args, function (message) {  /* success */
                console.log('android应用打开成功 message-->>' + message); // => OK
                if (successCallback) {
                  successCallback(message);
                }
              }, function (error) { /* error */
                console.log('android应用打开失败 error-->>' + error);
                if (errorCallback) {
                  errorCallback(error);
                }
              });
            } catch (e) {
              console.log(e);
            }
            break;
          case 'ios':
            try {
              navigator.startApp.start((url + pargams), function (message) { /* success */
                  console.log('ios应用打开成功 message-->>' + message); // => OK
                  if (successCallback) {
                    successCallback(message);
                  }
                },
                function (error) { /* error */
                  console.log('ios应用打开失败-->>' + error);
                  if (errorCallback) {
                    errorCallback(error);
                  }
                });
            } catch (e) {
              console.log(e);
            }
            break;
        }
      },
      /**
       * 下载
       * @param url
       * @param callback
       * android注意权限"android.permission.WRITE_EXTERNAL_STORAGE"
       */
      'downLoad': function (url) {
        var ios = cordova.file.cacheDirectory;
        var ext = cordova.file.externalCacheDirectory;
        var dir = (ext) ? ext : ios;
        var name = url.substring(url.lastIndexOf('/') + 1);
        var targetPath = dir + name;
        var trustHosts = true;
        var options = {};
        return $cordovaFileTransfer.download(url, targetPath, options, trustHosts);
      },
      /**
       * 安装apk
       * @param filePath
       */
      'install': function (filePath) {
        return $cordovaFileOpener2.open(filePath, 'application/vnd.android.package-archive');
      },
      /**
       * 卸载应用
       * @param packName  包名
       * @returns {*}
       */
      'unInstall': function (packName) {
        return $cordovaFileOpener2.uninstall(packName);
      },
      /**
       * 更新版本号
       * @param key      包名
       * @param value    版本号
       */
      'updateVersion': function (key, value) {
        var map = localStorage.getObject('versions');
        map[key] = value;
        localStorage.setObject('versions', map);
      },
      /**
       * 获取版本号
       * @param key    包名
       * @returns {*}  版本号
       */
      'getVersion': function (key) {
        var map = localStorage.getObject('versions');
        return map[key];
      },
      /**
       * 删除版本号
       * @param key    包名
       * @returns {*}  版本号
       */
      'deleteVersion': function (key) {
        var map = localStorage.getObject('versions');
        delete map[key];
        localStorage.setObject('versions', map);
      },
      /**获取app市场数据*/
      getLastMarketAppInfo: function () {
        var infoString = localStorage.get('marketAppInfo');
        if (infoString) {
          return JSON.parse(infoString);
        }
        return [];
      },
      /**
       * 保存应用市场数据
       * @param info
       */
      setMarketAppInfo: function (info) {
        localStorage.set('marketAppInfo', info);
      }
    };
  })
  .factory('fileUtils', function ($cordovaFile, thsLoading, $cordovaFileTransfer) {
    return {
      /**
       * 判断文件是否存在
       * @param filename
       * @param filePath
       * @returns {*}
       */
      'isExist': function (filename, filePath) {
        var dir;
        if (filePath) {
          dir = filePath;
        } else {
          var ios = cordova.file.cacheDirectory;
          var ext = cordova.file.externalCacheDirectory;
          dir = (ext) ? ext : ios;
        }
        return $cordovaFile.checkFile(dir, filename);
      },
      'openFile': function (url, errCallback, isNotLoading) {
        try {
          if (isNotLoading)
            thsLoading.show();
          cordova.plugins.disusered.open(url, function success() {
            console.log('Success');
            thsLoading.hide();
          }, function error(code) {
            if (code === 1) {
              console.log('No file handler found');
            } else {
              console.log('Undefined error');
            }
            if (errCallback) {
              errCallback(code);
            }
            thsLoading.hide();
          });
        } catch (e) {
          thsLoading.hide();
          console.log(e.toString());
        }
      },
      downFile: function (url, path) {
        return $cordovaFileTransfer.download(url, path);
      }
    };
  })
  .factory('attHelpUtils', function ($q, fileUtils, thsLoading) {
    return {//cordova plugin add cordova-open
      /**
       * 附件打开
       * @param url        文件地址
       * @param fileName   文件名称
       * @param dir        文件存放的文件夹
       * @returns {*}
       */
      'downLoadAndOpen': function (url, fileName, dir) {
        var defer = $q.defer();
        try {
          if (!dir) {
            var ios = cordova.file.cacheDirectory;
            var ext = cordova.file.externalCacheDirectory;
            dir = (ext) ? ext : ios;
          }
          var filePath = dir + fileName;
          fileUtils.isExist(fileName, dir)
            .then(function (success) {
              //文件已下载直接打开
              fileUtils.openFile(filePath,
                function (code) {
                  defer.resolve(code);
                }, true);
            }, function (err) {
              thsLoading.show();
              fileUtils.downFile(url, filePath)
                .then(function (result) {
                  //下载成功
                  thsLoading.hide();
                  fileUtils.openFile(filePath,
                    function (code) {
                      defer.resolve(code);
                    }, false);
                }, function (err) {
                  //下载失败
                  thsLoading.hide();
                  defer.resolve(3);
                });
            });
        } catch (e) {
          //发生异常 下载失败
          console.log(e);
          thsLoading.hide();
          defer.resolve(1);
        }
        return defer.promise;
      },
      /**
       * 附件下载
       * @param url        文件地址
       * @param fileName   文件名称
       * @param dir        文件存放的文件夹
       * @returns {*}
       */
      'onlyDownLoad': function (url, fileName, dir) {
        var defer = $q.defer();
        try {
          if (!dir) {
            var ios = cordova.file.cacheDirectory;
            var ext = cordova.file.externalCacheDirectory;
            dir = (ext) ? ext : ios;
          }
          var filePath = dir + fileName;
          fileUtils.isExist(fileName, dir)
            .then(function (success) {
              defer.resolve(filePath);
            }, function (err) {
              thsLoading.show();
              fileUtils.downFile(url, filePath)
                .then(function (result) {
                  //下载成功
                  defer.resolve(filePath);
                  thsLoading.hide();
                }, function (err) {
                  //下载失败
                  thsLoading.hide();
                  defer.resolve(undefined);
                });
            });
        } catch (e) {
          //发生异常 下载失败
          console.log(e);
          thsLoading.hide();
          defer.resolve(undefined);
        }
        return defer.promise;
      }
    };
  }).factory("media", function ($q) {
 var my_media;
  return {
    createNewMedia: function (filePath,successCallBack,errCallback,stateCallback) {
      if(my_media){
        my_media.stop();
        my_media.release();
        my_media=null;
      }
      my_media = new Media(filePath,successCallBack,errCallback,stateCallback);
      return my_media;
    },
    play:function () {
      my_media.play();
    }
  };
  }).factory("mediaUtils", function (media,$q) {
 var my_media;
  return {
    newMedia: function (filePath) {
      var defer=$q.defer();
      media.createNewMedia(filePath,function () {
          console.log("playAudio():Audio Success");
          defer.resolve("ok");
        },
        // error callback
        function (err) {
          console.log("playAudio():Audio Error: " + err);
          defer.reject(err);
        },function(s){
          console.log(s);
          defer.notify(s);
        });
      return defer.promise;
    },
    play:function () {
      media.play();
    }
  };
}).factory('ionicHistory', function($ionicHistory){
  return{//返回到指定state
    'returnToState':function(stateName){
    var historyId = $ionicHistory.currentHistoryId();
    var history = $ionicHistory.viewHistory().histories[historyId];
    for (var i = history.stack.length - 1; i >= 0; i--){
      if (history.stack[i].stateName == stateName){
        $ionicHistory.backView(history.stack[i]);
        $ionicHistory.goBack();
      }
    }
    },
    //返回几个View
    'goBackMany':function(depth){
       // get the right history stack based on the current view
    var historyId = $ionicHistory.currentHistoryId();
    var history = $ionicHistory.viewHistory().histories[historyId];
    // set the view 'depth' back in the stack as the back view
    var targetViewIndex = history.stack.length - 1 - depth;
    $ionicHistory.backView(history.stack[targetViewIndex]);
    // navigate to it
    $ionicHistory.goBack();
    }
  };
  /*return function(stateName){

  }*/
});
