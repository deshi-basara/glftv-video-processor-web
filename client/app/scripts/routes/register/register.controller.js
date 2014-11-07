(function () {

    'use strict';

    angular
        .module('app')
        .controller('RegisterCtrl', RegisterCtrl);

    RegisterCtrl.$inject = ['AuthService', '$timeout'];

    /**
     * Handles the login request and potential error feedbacks.
     */
    function RegisterCtrl(AuthService, $timeout) {
        var ctrl = this;

        /**
         * Submits the form values to the AuthService after validation
         */
        function submitRegistration() {

            ctrl.register = {name: "Simon Schuster", mail: "simon.schuster@hs-furtwangen.de", pass: "Simon123", pass2: "Simon123"};

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
                console.log(success);
            }, function(error) {
                console.log(error);
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

            submitRegistration: submitRegistration
        });
    }

})();