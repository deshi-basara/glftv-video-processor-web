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
            loginUrl: '/user/login',
            registerUrl: '/user/register',
            sessionUrl: '/user/session',

            hasSession: hasSession,
            getAuth: getAuth,
            getRegistration: getRegistration,
            getToken: getToken,
            saveToken: saveToken
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

            // make the request
            $http({
                method: 'POST',
                url: config.apiUrl + service.sessionUrl
            }).success(function(data) {
                q.resolve(data);
            }).error(function(data, status) {
                q.reject(data, status);
            });

            /*if(localStorageService.isSupported) {
                // fetch 
            }
            else {
                q.reject('storage-error');
            }*/

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
                    'mail': loginObj.user,
                    'pass': loginObj.pass
                }
            }).success(function(data) {
                q.resolve(data);
            }).error(function(data, status) {
                q.reject(data, status);
            });

            return q.promise;
        }

        function setAuth(sessionId) {

        }

        /**
         * Submits an registration attemp to the server.
         * @param  {object} registerModel [ngModel with all registration form inputs]
         * @return {promise}              [$q promise]
         */
        function getRegistration(registerModel) {
            var q = $q.defer();

            // make the request
            $http({
                method: 'POST',
                url: config.apiUrl + service.registerUrl,
                data: registerModel
            }).success(function(data) {
                q.resolve(data);
            }).error(function(data, status) {
                q.reject(data, status);
            });

            return q.promise;
        }

        /**
         * Returns the saved authToken from the localStorage.
         * @return {string} [Authentication token]
         */
        function getToken() {
            return localStorageService.get('authToken');
        }

        /**
         * Saves the current authToken into the localStorage.
         * @param  {string}    token [Authentication token]
         */
        function saveToken(token) {
            localStorageService.set('authToken', token);
        }


    }


})();