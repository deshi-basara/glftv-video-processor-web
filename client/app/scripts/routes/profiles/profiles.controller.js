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
            ctrl.selectedProfile = {};
        }

        /**
         * Validates the new profile settings before submitting them to the server
         * afterwards.
         */
        function submitNewProfile() {
            var debugObj = {
                audioBitrate: "360k",
                audioChannels: "2",
                audioCodec: "libvorbis",
                audioSamplerate: "44100",
                outputFormat: "webm",
                ownParams: "-test param",
                profileName: "Simon",
                scale: "1080p",
                videoCodec: "libvpx",
                videoQuality: "good",
                videoQualityQmax: "42",
                videoQualityQmin: "10",
                videoThreads: "4"
            };

            ProfileService.submitNewProfile(debugObj).then(function(success) {
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
            console.log(clickedProfile);
            ctrl.selectedProfile = clickedProfile;
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

            allProfiles: null, // all saved profiles from the server
            allProfileSettings: settings[null], // all predefined form settings for the selected output. Default: null
            newProfile: {},
            selectedProfile: null,

            changeActive: changeActive, // changes the default active settings tab
            changeOutputFormat: changeOutputFormat,
            createNewProfile: createNewProfile,
            onProfileSelect: onProfileSelect, // when a profile is selected from the list
            submitNewProfile: submitNewProfile
        });

    }

})();