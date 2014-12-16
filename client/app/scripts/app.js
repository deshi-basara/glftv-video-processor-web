/*!
* Simon Schuster <simon.schuster@hs-furtwangen.de>
* glftv-video-processor-web v0.9.5 (https://github.com/deshi-basara/glftv-video-processor-web)
*/

'use strict';

/**
 * angular.module is a global place for creating, registering and retrieving Angular modules.
 * 'app' is the name of this angular module example (also set in a <body> attribute in index.html)
 * the 2nd parameter is an array of 'requires'.
 */
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

.config(function($httpProvider, $stateProvider, $urlRouterProvider, localStorageServiceProvider, config) {

  /**
   * 1) Sets all route settings
   */
  function setRoutes() {

    /**
     * This starter uses AngularUI Router which uses the concept of states.
     * https://github.com/angular-ui/ui-router
     */
    $stateProvider

      // public routes
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

      // private routes
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
        templateUrl: 'scripts/routes/job/job.index.tpl.html',
        resolve: {
          auth: function($http) {
            return $http.get(config.apiUrl + '/user/auth');
          }
        }
      })

      .state('dash.queue', {
        url: '/queue',
        controller: 'QueueCtrl',
        controllerAs: 'ctrl',
        templateUrl: 'scripts/routes/queue/queue.index.tpl.html',
        resolve: {
          auth: function($http) {
            return $http.get(config.apiUrl + '/user/auth');
          }
        }
      })

      .state('dash.profiles', {
        url: '/profile',
        controller: 'ProfilesCtrl',
        controllerAs: 'ctrl',
        templateUrl: 'scripts/routes/profiles/profiles.index.tpl.html',
        resolve: {
          auth: function($http) {
            return $http.get(config.apiUrl + '/user/auth');
          }
        }
      })

      .state('dash.settings', {
        url: '/settings',
        controller: 'SettingsCtrl',
        controllerAs: 'ctrl',
        templateUrl: 'scripts/routes/settings/settings.index.tpl.html',
        resolve: {
          auth: function($http) {
            return $http.get(config.apiUrl + '/user/auth');
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('warteschlange');
  }

  /**
   * 2) Sets all storage settings
   */
  function setStorage() {
    // set the default prefix for the localStorage
    localStorageServiceProvider.setPrefix('glf-video');
  }

  /**
   * 3) Sets all needed interceptors
   */
  function setInteceptors() {

    /**
     * Response Interceptor construct, that is added to the angular $httpProvider.
     * When a $http-request is answered the interceptor checks if the $http-response is an
     * 401:'unauthorized'-error and shows the login page if true.
     *
     * https://docs.angularjs.org/api/ng/service/$http (search: Interceptors)
     */
    $httpProvider.interceptors.push(function($q, $location) {
      return {
        // response error callback
        'responseError': function(response) {
          if(response.status === 401) {
            // error response is an 'unauthorized'-error, show login page
            $location.path('/login');
          }

          // reject the promise and pass the error response
          return $q.reject(response);
        }
      };
    });
  }

  // set
  setInteceptors();
  setRoutes();
  setStorage();

})

.run(function($injector, $state, AuthService, SocketService) {

  /**
   * 1) Sets the $http-header
   */
  function setHeader() {
    // append the authorization token on every $http request
    $injector.get('$http').defaults.transformRequest = function(data, headersGetter) {

      // does an authToken & userId exist, if true save it in the header
      var authToken = AuthService.getToken();
      var userId = AuthService.getUserId();
      if(authToken && userId) {
        headersGetter()['Authorization'] = authToken;
        headersGetter()['User'] = userId;
      }
      if(data) {
        return angular.toJson(data);
      }

    }
  }

  /**
   * 2) Sets all needed connections
   */
  function setConnections() {
    // connect to the socket
    SocketService.connectSocket();
  }

  // set
  setHeader();
  setConnections();

});