(function () {

    'use strict';

    angular
        .module('app')
        .controller('RegisterCtrl', RegisterCtrl);

    RegisterCtrl.$inject = ['AuthService', '$timeout', '$state'];

    /**
     * Handles the login request and potential error feedbacks.
     */
    function RegisterCtrl(AuthService, $timeout, $state) {
        var ctrl = this;

        /**
         * Submits the form values to the AuthService after validation
         */
        function submitRegistration() {

            // has the user entered all needed values, otherwise stop
            if(ctrl.register.name.length === 0 || ctrl.register.mail.length === 0 ||
                    ctrl.register.pass.length === 0 || ctrl.register.pass2.length === 0) {

                // show an error toast and break
                ctrl.errorMsg = 'Du hast nicht alle Formular-Felder ausgefüllt';
                ctrl.showError = true;

                // hide the toast after 5000ms
                $timeout(function() {
                    ctrl.showError = false;
                }, 5000);

                return;
            }
            // check if both passwords match
            else if(ctrl.register.pass !== ctrl.register.pass2) {
                // show an error toast and break
                ctrl.errorMsg = 'Die Passwörter stimmen nicht überein';
                ctrl.showError = true;

                // hide the toast after 5000ms
                $timeout(function() {
                    ctrl.showError = false;
                }, 5000);

                return;
            }

            // hand data
            AuthService.getRegistration(ctrl.register).then(function(success) {

                // success message
                ctrl.showSuccess = true;

                // save the token in our localStorage
                AuthService.saveToken(success.token);
                AuthService.saveUserId(success.id);
                AuthService.saveUserName(success.name);
                AuthService.saveUserRole(success.role);

                // hide message, after 5000ms
                $timeout(function() {
                    ctrl.showSuccess = false;

                    // redirect
                    $timeout(function() {
                        $state.go('dash.queue');
                    }, 800);
                }, 5000);

            }, function(error) {
                // show an error toast and break
                ctrl.errorMsg = error;
                ctrl.showError = true;

                // hide the toast after 5000ms
                $timeout(function() {
                    ctrl.showError = false;
                }, 5000);

            });

        }

        //////////////////////

        angular.extend(ctrl, {
            register: {
                name: '',
                mail: '',
                pass: '',
                pass2: ''
            },
            showError: false,
            showSuccess: false,

            submitRegistration: submitRegistration
        });
    }

})();