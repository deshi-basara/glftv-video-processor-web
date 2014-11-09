(function () {

    'use strict';

    angular
        .module('app')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['AuthService', '$timeout', '$state'];

    /**
     * Handles the login request and potential error feedbacks.
     */
    function LoginCtrl(AuthService, $timeout, $state) {
        var ctrl = this;

        /**
         * Submits the form values to the AuthService after validation
         */
        function submitLogin() {

            // has the user entered all needed values, otherwise stop
            if(ctrl.login.user.length === 0 || ctrl.login.pass.length === 0) {

                // show an error toast and break
                ctrl.errorMsg = 'Du hast nicht alle Formular-Felder ausgefüllt';
                ctrl.showError = true;

                // hide the toast after 5000ms
                $timeout(function() {
                    ctrl.showError = false;
                }, 5000);

                return;
            }

            // hand data
            AuthService.getAuth(ctrl.login).then(function(success) {
                // everything went well, redirect
                $state.go('dash.job');
            }, function(error, status) {
                // show error message
            });

        }


        //////////////////////

        angular.extend(ctrl, {
            login: {
                user: '',
                pass: ''
            },
            showError: false,

            submitLogin: submitLogin
        });
    }

})();