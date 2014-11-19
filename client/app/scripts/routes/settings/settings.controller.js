(function () {

    'use strict';

    angular
        .module('app')
        .controller('SettingsCtrl', SettingsCtrl);

    SettingsCtrl.$inject = ['ngTableParams', 'ProfileService', 'SweetAlert', '$modal', '$scope'];

    /**
     * Handles the dash-board view and all interactions
     */
    function SettingsCtrl(ngTableParams, ProfileService, SweetAlert, $modal, $scope) {
        var ctrl = this;

        /**
         * Fetches all available profileSettings.
         */
        function fetchProfileSettings() {
            ProfileService.getAllProfileSettings().then(function(success) {
                ctrl.allSettings = success;
            }, function(error) {

            });
        }

        /**
         * Inserts the selected settings into the highlight.js view.
         * @param  {Object} settingsObj [All available profile settings of the clicked profile]
         * @return {[type]}             [description]
         */
        function insertSettings(settingsObj) {
            ctrl.selectedSetting = toPrettyJSON(settingsObj, 4);
        }

        /**
         * Submits a settings-object to the server after converting
         * and validating it.
         */
        function submitNewSettings() {
            // only submit if the was something entered
            if(ctrl.selectedSetting) {

                // try to convert back to json
                try {
                    var settingsObj = JSON.parse(ctrl.selectedSetting);
                }
                catch(e) {
                    return SweetAlert.swal('Kein gültiger JSON-String');
                }

                // check if it has a valid name
                if(!settingsObj.name) {
                    return SweetAlert.swal('Kein gültiger Name angeben');
                }

                // submit to the server
                ProfileService.submitNewSettings(settingsObj);
            }
        }

        /**
         * Prettifies a json-string.
         * @param  {object} jsonObj  [Json-Object we want to convert]
         * @param  {int}    tabWidth [Tab spacing]
         * @return {string}          [Pretty json-string]
         */
        function toPrettyJSON(jsonObj, tabWidth) {
            return JSON.stringify(jsonObj, null, Number(tabWidth));
        }

        //////////////////////

        angular.extend(ctrl, {
            allSettings: null,
            newOne: false,
            selectedSetting: null,

            insertSettings: insertSettings,
            submitNewSettings: submitNewSettings
        });

        /////////////////////


        /////////////////////
        
        fetchProfileSettings();


    }

})();