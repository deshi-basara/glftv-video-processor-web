(function () {

    'use strict';

    angular
        .module('app')
        .controller('ProfilesCtrl', ProfilesCtrl);

    ProfilesCtrl.$inject = ['ngTableParams', 'ProfileService', 'SweetAlert'];

    /**
     * Handles the dash-board view and all interactions
     */
    function ProfilesCtrl(ngTableParams, ProfileService, SweetAlert) {
        var ctrl = this;

        // fetch needed configuration data from the server
        ProfileService.getAllProfiles().then(function(success) {
            console.log(success);
            ctrl.allProfiles = success;
        }, function(err, status) {

        });

        var settings = ProfileService.getAllProfileSettings();

        /**
         * Changes the active profile-sub-view to the clicked one.
         * @param  {[String]]} newActive [Profile-sub-view identifier]
         */
        function changeActive(newActive) {
            ctrl.isActive = newActive;
        }

        /**
         * Opens an empty newProfile dialog.
         */
        function createNewProfile() {
            ctrl.showSettingBox = true;
            ctrl.newProfile = {};
        }

        /**
         * Validates the new profile settings before submitting them to the server
         * afterwards.
         */
        function submitNewProfile() {

            ProfileService.submitNewProfile(ctrl.newProfile).then(function(success) {
                // @todo refetch allProfiles

            }, function(error, status) {

            });
        }

        /**
         * Is called when a profile was clicked from the 'section-profiles'.
         * Changes the profile-settings-view accordingly to the selected profile.
         * @param  {[type]} clickedProfile [description]
         * @return {[type]}                [description]
         */
        function onProfileSelect(clickedProfile) {
            ctrl.showSettingBox = true;
            ctrl.newProfile = clickedProfile;

            // the user wants to edit a profile, make the select
            changeOutputFormat();

            // prepare the json-string for insertion and insert each key value into
            // the ngModel
            var jsonSettings = angular.fromJson(ctrl.newProfile.json);
            angular.forEach(jsonSettings, function(value, key) {
                ctrl.newProfile[key] = value;
            });
        }

        /**
         * Is called when the output-format select-box is changed.
         * Changes the formly-form accordingly to the selected output format.
         */
        function changeOutputFormat() {
            // change the selected profile setting
            var selectedOutput = ctrl.newProfile.outputFormat;
            ctrl.allProfileSettings = settings[selectedOutput];
        }

        //////////////////////

        angular.extend(ctrl, {
            isActive: 'global', // default active setting tab
            showSettingBox: false,

            allProfiles: null, // all saved profiles from the server
            allProfileSettings: settings[null], // all predefined form settings for the selected output. Default: null
            newProfile: {},

            changeActive: changeActive, // changes the default active settings tab
            changeOutputFormat: changeOutputFormat,
            createNewProfile: createNewProfile,
            onProfileSelect: onProfileSelect, // when a profile is selected from the list
            submitNewProfile: submitNewProfile
        });

    }

})();