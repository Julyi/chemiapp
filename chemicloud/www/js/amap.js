
angular.module('appmap', ['ionic'])

.directive("gdMap", function ($rootScope,Position) {
        return {
            restrict: "E",
            replace: true,
            template: "<div id='gdMap'></div>",
            scope: {
                center: "=",        // Center point on the map (e.g. <code>{ latitude: 10, longitude: 10 }</code>).
                markers: "=",       // Array of map markers (e.g. <code>[{ lat: 10, lon: 10, name: "hello" }]</code>).
                width: "@",         // Map width in pixels.
                height: "@",        // Map height in pixels.
                zoom: "@",          // Zoom level (one is totally zoomed out, 25 is very much zoomed in).
                zoomControl: "@",   // Whether to show a zoom control on the map.
                scaleControl: "@",   // Whether to show scale control on the map.
                address:"@",
                x:"@",
                y:"@"
            },
            link: function (scope, element, attrs) {
                Position.all().then(function(res){
                    var data = res.data;
                    var polygons = [];
                    var map = new AMap.Map('gdMap',{
            			resizeEnable: true,
            			zoom: 7,
            			center: [118.841079,37.809608]
                    });
                    map.setMapStyle('amap://styles/fresh'); //地图风格

                    //引入UI组件
                    AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {
                        //添加一个缩放控件
                        map.addControl(new BasicControl.Zoom({
                            position: 'lt'
                        }));
                        //图层切换控件
                        map.addControl(new BasicControl.LayerSwitcher({
                            position: 'rt'
                        }));
                    });
                    addDistrict('山东省');
                    var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, 0)}); //信息窗口，设置偏移量

                    var icon = new AMap.Icon({
                                size: new AMap.Size(20, 32),  //图标大小
                                image: "img/mark_r.png"
                            });

                    icon.setImageSize(new AMap.Size(19,31));
                    var cityinfo =citys;


                    var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
                　　var PI = 3.1415926535897932384626;
                　　var a = 6378245.0;
                　　var ee = 0.00669342162296594323;
                    //proceed data
                    var cityMap = data.obj;
                    for (var i=0; i< citys.length;i++) {

                      cityname = citys[i].name;
                      citycode = citys[i].citycode;
                      cityid = cityMap[cityname]===undefined? 0:cityMap[cityname].split('-')[1];
                      cityParknum = cityMap[cityname]===undefined? 0:cityMap[cityname].split('-')[0];
                      cityEntnum = '209';
                      var cityProjnum = '247';
                      var marker = new AMap.Marker({
                          position: citys[i].center.split(','),
                          map: map,
                          //offset: new AMap.Pixel(-12.5,-12.5),
                          icon: icon
                      });
                      content =  '<div class="gd-info-title">'+cityname+'化工园区</div><div class="gd-info-content">'+
                                          '<img src="/img/'+citycode+'.jpg">'+
                                          '市化工园区数量: '+
                                          cityParknum+'<br/>市化工企业数量: '+cityEntnum+'<br/>市在建工程数量: '+cityProjnum+
                                          '<a href="#/cityPark/'+cityid+'/park">点击查看详情</a>';
                      if (i==0) {//山东省
                        content =  '<div class="gd-info-title">'+cityname+'化工园区</div><div class="gd-info-content">'+
                                            '<img src="/img/'+citycode+'.jpg">'+
                                            '省化工园区数量: '+
                                            cityParknum+'<br/>省化工企业数量: '+cityEntnum+'<br/>省在建工程数量: '+cityProjnum+
                                            '<a href="/cityPark/40289cb75d07356c015d074db738000d/park">点击查看详情</a>';
                      }
                      marker.content = content;
                      marker.on('click',markerClick);
                      marker.title = cityname;

                    }

                    //     marker.content = data.obj.get.+'-'+data.obj[i][1]+'-'+data.obj[i][2];
                    //     marker.on('click', markerClick);
                    //     // marker.emit('click', {target: marker});
                    // }

                    //点击点触发
                    function markerClick(e) {
                        infoWindow.setContent(e.target.content);
                        infoWindow.open(map, e.target.getPosition());
                        addDistrict(e.target.title);
                        map.setZoomAndCenter(8, e.target.getPosition());
                        if (e.target.title =='山东省') {
                          map.setZoomAndCenter(7, e.target.getPosition());
                        }
                    }

                    //WGS84转GCJ-02
                    function wgs84togcj02(lng, lat) {
                        if (out_of_china(lng, lat)) {
                        return [lng, lat];
                        }
                        else {
                            var dlat = transformlat(lng - 105.0, lat - 35.0);
                            var dlng = transformlng(lng - 105.0, lat - 35.0);
                            var radlat = lat / 180.0 * PI;
                            var magic = Math.sin(radlat);
                            magic = 1 - ee * magic * magic;
                            var sqrtmagic = Math.sqrt(magic);
                            dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
                            dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
                            var mglat = lat + dlat;
                            var mglng = lng + dlng;
                            return [mglng.toFixed(4),mglat.toFixed(4)];
                        }
                    }

                    function transformlat(lng, lat) {
                        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
                        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
                        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
                        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
                        return ret
                    }
                    function transformlng(lng, lat) {
                        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
                        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
                        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
                        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
                        return ret
                    }

                    function out_of_china(lng, lat) {
                        return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
                    }

                    function addDistrict(distName) {
                      //加载district插件
                      AMap.service('AMap.DistrictSearch',function(){
                        var opts = {
                          subdistrict:1, //是否返回下一级district
                          extensions: 'all', //返回边界
                          level: 'city'
                        };
                        //实例化district
                        district = new AMap.DistrictSearch(opts);
                        district.setLevel('district');
                        //查询district
                        district.search(distName,function(status,result) {
                          var bounds = result.districtList[0].boundaries;

                          for (var i = 0, l = polygons.length; i < l; i++) {
                            polygons[i].setMap(null);
                          }
                          if (bounds) {
                            for (var i=0, l = bounds.length; i<l;i++) {
                              //generate polygons
                              var polygon = new AMap.Polygon({
                                map: map,
                                strokeWeight:1,
                                path: bounds[i],
                                fillOpacity: 0.3,
                                fillColor: '#CCF3FF',
                                strokeColor: '#CC66CC'
                              });
                              polygons.push(polygon);//recorder for clean
                              //map.setFitView();//地图自适应

                            }
                          }
                        });
                      });
                    }

             	});

            }
        };
    });
