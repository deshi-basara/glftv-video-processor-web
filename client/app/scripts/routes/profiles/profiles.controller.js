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

        var profiles = ProfileService.getAllProfiles();

        /**
         * Changes the active profile-sub-view to the clicked one.
         * @param  {[String]]} newActive [Profile-sub-view identifier]
         */
        function changeActive(newActive) {
            ctrl.isActive = newActive;
        }


        function createNewProfile() {

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

        //////////////////////

        angular.extend(ctrl, {
            isActive: 'video',

            allProfiles: profiles,
            newProfile: {},
            selectedProfile: null,

            changeActive: changeActive,
            createNewProfile: createNewProfile,
            onProfileSelect: onProfileSelect
        });

    }

})();