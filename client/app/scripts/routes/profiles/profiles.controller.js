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




        /**
         * Changes the active profile-sub-view to the clicked one.
         * @param  {[String]]} newActive [Profile-sub-view identifier]
         */
        function changeActive(newActive) {
            ctrl.isActive = newActive;
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

        /**
         * Opens an empty newProfile dialog.
         */
        function createNewProfile() {
            ctrl.showSettingBox = true;
            ctrl.newProfile = {};
        }

        /**
         * Requests all available profiles from the server.
         */
        function fetchAllProfiles() {
            ProfileService.getAllProfiles().then(function(success) {
                ctrl.allProfiles = success;
            }, function(err, status) {
                // @todo error response
            });
        }

        /**
         * Requests all available profile-settings from the server.
         */
        var settings;
        function fetchAllProfileSettings() {
            settings = ProfileService.getAllProfileSettings();
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
         * Validates the new profile settings before submitting them to the server
         * afterwards.
         */
        function submitNewProfile() {

            ProfileService.submitNewProfile(ctrl.newProfile).then(function(success) {
                // refetch all profiles, for updating the all-profile-view
                fetchAllProfiles();
            }, function(error, status) {

            });
        }

        //////////////////////

        fetchAllProfiles();
        fetchAllProfileSettings();

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