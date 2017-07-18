/**
 * Created by droidliu on 2015/5/28.
 */
angular.module('starter.directives', ['ionic'])
     .directive("vLineBlue",function(){
        return {
            restrict: 'E',
            template: '<span style="border:1px solid #8DCB64;margin: 6px;line-height: 0.2"></span>', replace: true
        };
    });
