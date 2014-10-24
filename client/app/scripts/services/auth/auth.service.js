(function() {

    'use strict';

    angular
        .module('app')
        .factory('AuthService', AuthService);

    AuthService.$inject = ['$http', 'config', '$q', 'localStorageService'];

    /**
     * Service for checking if the current user is authenticated
     */
    function AuthService($http, config, $q, localStorageService) {

        var service = {
            loginUrl: '/api/login',

            hasSession: hasSession,
            getAuth: getAuth
        };

        return service;

        ///////////////


        function generateClientSession() {

        }

        /**
         * Checks if the user has a active session and if it is still valid.
         * @return {Boolean}      [True: user is authenticated | False: not authenticated]
         */
        function hasSession() {
            var q = $q.defer();

            if(localStorageService.isSupported) {
                // fetch 
            }
            else {
                q.reject('storage-error');
            }

            return q.promise;
        }

        /**
         * Requests the authentication of the handed user data.
         * @param  {Object}  loginObj [obj.user, obj.pass]
         * @return {Promise}          [Resolve: true | Reject: false]
         */
        function getAuth(loginObj) {
            var q = $q.defer();

            // make the request
            $http({
                method: 'POST',
                url: config.apiUrl + service.loginUrl,
                data: {
                    'user': loginObj.user,
                    'pass': loginObj.pass
                }
            }).success(function(data, status, header, config, responseText) {
                q.resolve(true);
            }).error(function(data, status, header, config, responseText) {
                q.reject(false);
            });

            return q.promise;
        }

        function setAuth(sessionId) {

        }


    }


})()