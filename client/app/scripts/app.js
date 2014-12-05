/*!
* Simon Schuster <simon.schuster@hs-furtwangen.de>
* glftv-video-processor-web v0.9.0 (https://github.com/deshi-basara/glftv-video-processor-web)
*/

'use strict';

// angular.module is a global place for creating, registering and retrieving Angular modules.
// 'app' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'.
angular
  .module('app', [
  'ui.router',
  'ui.bootstrap',
  'LocalStorageModule',
  'ngAnimate',
  'angular-svg-round-progress',
  'ngTable',
  'angularFileUpload',
  'oitozero.ngSweetAlert',
  'formly',
  'truncate'
])

.constant('config', {
  'name': 'development',
  'apiUrl': 'http://localhost:1337'
})

.config(function($stateProvider, $urlRouterProvider) {

  // This starter uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: 'scripts/routes/login/login.index.tpl.html',
      controller: 'LoginCtrl',
      controllerAs: 'ctrl'
    })

    .state('register', {
      url: '/register',
      templateUrl: 'scripts/routes/register/register.index.tpl.html',
      controller: 'RegisterCtrl',
      controllerAs: 'ctrl'
    })

    .state('dash', {
      url: '',
      abstract: true,
      templateUrl: 'scripts/routes/dash/dash.index.tpl.html',
      controller: 'DashCtrl',
      controllerAs: 'ctrl'
    })

    .state('dash.job', {
      url: '/job',
      controller: 'JobCtrl',
      controllerAs: 'ctrl',
      templateUrl: 'scripts/routes/job/job.index.tpl.html'
    })

    .state('dash.queue', {
      url: '/queue',
      controller: 'QueueCtrl',
      controllerAs: 'ctrl',
      templateUrl: 'scripts/routes/queue/queue.index.tpl.html'
    })

    .state('dash.profiles', {
      url: '/profile',
      controller: 'ProfilesCtrl',
      controllerAs: 'ctrl',
      templateUrl: 'scripts/routes/profiles/profiles.index.tpl.html'
    })

    .state('dash.settings', {
      url: '/settings',
      controller: 'SettingsCtrl',
      controllerAs: 'ctrl',
      templateUrl: 'scripts/routes/settings/settings.index.tpl.html'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('settings');

})

.run(function($state, AuthService, SocketService) {

  SocketService.connectSocket();

  // check if the user has a active session
  AuthService.hasSession().then(function(success) {}, function(error) {
    // no valid session running, redirect to the login
    //$state.go('login');
  });

})