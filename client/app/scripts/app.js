'use strict';

// angular.module is a global place for creating, registering and retrieving Angular modules.
// 'app' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'.
angular
  .module('app', [
  'ui.router',
  'LocalStorageModule',
  'ngAnimate',
  'ngTable',
  'angularFileUpload',
  'oitozero.ngSweetAlert',
  'formly'
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

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('queue');

})

.run(function($state, AuthService) {

  // check if the user has a active session
  AuthService.hasSession()
    .then(function(success) {
      console.log(success);
    }, function(error) {
      alert(error);
    });


  var hasAuth = false;

  if(hasAuth) {
    console.log('rediec');
    $state.go('login');
  }
})