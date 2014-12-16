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

            getAuth: getAuth,
            getRegistration: getRegistration,
            getToken: getToken,
            getUserId: getUserId,
            getUserName: getUserName,
            getUserRole: getUserRole,
            logout: logout,
            saveToken: saveToken,
            saveUserId: saveUserId,
            saveUserName: saveUserName,
            saveUserRole: saveUserRole
        };

        return service;

        ///////////////

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
         * Returns the saved userId from the localStorage.
         * @return {int}    [Server database id of the user]
         */
        function getUserId() {
            return localStorageService.get('userId');
        }

        /**
         * Returns the saved userName from the localStorage.
         * @return {string}    [Name of the user]
         */
        function getUserName() {
            return localStorageService.get('userName');
        }

        /**
         * Returns the saved userRole from the localStorage.
         */
        function getUserRole() {
            return localStorageService.get('userRole');
        }

        /**
         * Removes the localStorage auth-credentials and forces a logout.
         */
        function logout() {
            localStorageService.remove('authToken');
            localStorageService.remove('userId');
            localStorageService.remove('userName');
            localStorageService.remove('userRole');
        }

        /**
         * Saves the current authToken into the localStorage.
         * @param  {string}    token [Authentication token]
         */
        function saveToken(token) {
            localStorageService.set('authToken', token);
        }

        /**
         * Saves the current authToken into the localStorage.
         * @param  {int}    id [Server database id of the user]
         */
        function saveUserId(id) {
            localStorageService.set('userId', id);
        }

        /**
         * Saves the current user's name into the localStorage.
         * @param  {string} name [User name]
         */
        function saveUserName(name) {
            localStorageService.set('userName', name);
        }

        /**
         * Saves the current user's role into the localStorage.
         * @param  {inz}    role [User role: 1 = admin, 0 = user]
         */
        function saveUserRole(role) {
            localStorageService.set('userRole', role);
        }


    }


})();