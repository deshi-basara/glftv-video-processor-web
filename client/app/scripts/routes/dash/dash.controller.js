(function () {

    'use strict';

    angular
        .module('app')
        .controller('DashCtrl', DashCtrl);

    DashCtrl.$inject = ['SocketService', 'AuthService','$state'];

    /**
     * Handles the dash-board view and all interactions
     */
    function DashCtrl(SocketService, AuthService, $state) {
        var ctrl = this;

        /**
         * Starts the logout process and redirects to the login.
         */
        function submitLogout() {
            AuthService.logout();
            $state.go('login');
        }

        //////////////////////

        angular.extend(ctrl, {
            currentUser: AuthService.getUserName(),
            isAdmin: AuthService.getUserRole(),

            submitLogout: submitLogout
        });

        /////////////////////

    }

})();