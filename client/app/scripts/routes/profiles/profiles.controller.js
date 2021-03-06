(function () {

    'use strict';

    angular
        .module('app')
        .controller('ProfilesCtrl', ProfilesCtrl);

    ProfilesCtrl.$inject = ['ngTableParams', 'ProfileService', 'SweetAlert', 'AuthService'];

    /**
     * Handles the dash-board view and all interactions
     */
    function ProfilesCtrl(ngTableParams, ProfileService, SweetAlert, AuthService) {
        var ctrl = this;

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

            // get the settings of the selected outputFormat
            for (var i = 0; i < ctrl.allGlobalSettings.length; i++) {

                if(ctrl.allGlobalSettings[i].name === selectedOutput) {
                    ctrl.allProfileSettings = ctrl.allGlobalSettings[i];
                    return;
                }

            }
        }

        /**
         * Opens an empty newProfile dialog.
         */
        function createNewProfile() {
            ctrl.showSettingBox = true;
            ctrl.newProfile = {
                twoPass: true
            };
        }

        /**
         * Requests all available profiles from the server.
         */
        function fetchAllProfiles() {
            ProfileService.getAllProfiles().then(function(success) {
                ctrl.allProfiles = success;

                // reload the table
                ctrl.tableParams.reload();

            }, function(error) {
                SweetAlert.swal('Server-Fehler', error, 'error');
            });
        }

        /**
         * Requests all available profile-settings from the server.
         */
        function fetchAllProfileSettings() {
            ProfileService.getAllProfileSettings().then(function(success) {
                ctrl.allGlobalSettings = success;
            }, function(error) {
                SweetAlert.swal('Server-Fehler', error, 'error');
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
         * Validates the new profile settings before submitting them to the server
         * afterwards.
         */
        function submitNewProfile() {

            console.log(ctrl.newProfile);

            ProfileService.submitNewProfile(ctrl.newProfile).then(function(success) {
                // refetch all profiles, for updating the all-profile-view
                fetchAllProfiles();
            }, function(error) {
                SweetAlert.swal('Server-Fehler', error, 'error');
            });
        }

        /**
         * Sends a remove request for the clicked profile after confirming the
         * remove dialog.
         * @param  {int} profileId [Id of the profile the user wants to remove]
         */
        function removeProfile(profileId) {

            // ask the user if he is sure
            SweetAlert.swal({
                title: "Bist du dir sicher?",
                text: "Gelöschte Profile können nicht wiederhergestellt werden!",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Ja, löschen",
                cancelButtonText: "Abbrechen",
            },function(isConfirm){
                if(isConfirm) {
                    // user confirmed, make a delete request
                    ProfileService.removeProfile(profileId).then(function(success) {
                        // reload profiles after removing one
                        ctrl.showSettingBox = false;
                        fetchAllProfiles();
                        // give user feedback
                        SweetAlert.swal("Gelöscht!", "Das Profile wurde erfolgreich gelöscht.", "success");
                    }, function(error) {
                        SweetAlert.swal('Server-Fehler', error, 'error');
                    });
                }
            });
        }

        //////////////////////

        fetchAllProfiles();
        fetchAllProfileSettings();

        // ngTable settings
        var tableParams = new ngTableParams({
            page: 1,
            count: 10
        }, {
            total: 0,
            counts: [],
            getData: function($defer, params) {
                // fetch the table data
                if(ctrl.allProfiles) {
                    params.total(ctrl.allProfiles.length);
                    // slice and set new data for the current page
                    var data = ctrl.allProfiles.slice((params.page() - 1) *
                            params.count(), params.page() * params.count());
                    $defer.resolve(data);
                }
            }
        });

        //////////////////////

        angular.extend(ctrl, {
            isActive: 'global', // default active setting tab
            showSettingBox: false,
            userId: AuthService.getUserId(),
            userRole: AuthService.getUserRole(),

            allProfiles: null, // all saved profiles from the server
            allGlobalSettings: [], // all saved profile-settings from the server
            allProfileSettings: [], // all predefined form settings for the selected output. Default: null
            tableParams: tableParams,

            changeActive: changeActive, // changes the default active settings tab
            changeOutputFormat: changeOutputFormat,
            createNewProfile: createNewProfile,
            onProfileSelect: onProfileSelect, // when a profile is selected from the list
            submitNewProfile: submitNewProfile,
            removeProfile: removeProfile
        });

    }

})();