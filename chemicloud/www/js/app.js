// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','starter.constants','starter.directives','thsServices','ngCordova','appmap'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  // login
     .state('login',{
       url: '/login',
       templateUrl: 'templates/login.html',
       controller: 'LoginCtrl'
     })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.amap', {
    url: '/amap',
    cache:false,
    views: {
      'tab-amap': {
          templateUrl: 'templates/tab-amap.html',
          controller: 'MapCtrl'
      }
    }
  })

  .state('tab.park', {
    url: '/park',
    views: {
      'tab-park': {
        templateUrl: 'templates/tab-park.html',
        controller: 'ParkCtrl'
      }
    }
  })

  .state('tab.subjects', {
      url: '/subjects',
      views: {
        'tab-subjects': {
          templateUrl: 'templates/tab-subjects.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.home', {
        url: '/home',
        views: {
          'tab-home': {
            templateUrl: 'templates/tab-home.html',
            controller: 'HomeCtrl'
          }
        }
      })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })
    .state('tab.account', {
      url: '/account',
      views: {
        'tab-account': {
          templateUrl: 'templates/tab-account.html',
          controller: 'AccountCtrl'
        }
      }
    })
    .state('parkinfo', {
      url: '/parkinfo/:departcode/:qtype',// parkcode use pk in t_s_depart ,qtype can be intro、detail
      templateUrl: 'templates/parkinfo.html',
      controller: 'cityParkCtrl'
    })
    .state('cityPark', {
      url: '/cityPark/:departcode/:qtype',// citycode use pk in t_s_depart ,qtype can be park、Enteprise、Project
      templateUrl: 'templates/citypark.html',
      controller: 'cityParkCtrl'
    })
  ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

  // change android nav to bottom
  $ionicConfigProvider.tabs.style('standard');
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.platform.android.navBar.alignTitle('center');

});
