(function () {

    'use strict';

    angular
        .module('app')
        .controller('JobCtrl', JobCtrl);

    JobCtrl.$inject = ['ngTableParams', 'JobService', 'ProfileService', 'SweetAlert'];

    /**
     * Handles the dash-board view and all interactions
     */
    function JobCtrl(ngTableParams, JobService, ProfileService, SweetAlert) {
        var ctrl = this;

        ctrl.profiles = ProfileService.getAllProfiles();

        /**
         * Is called when files were selected for uploading.
         * @param  {[Array]} $files [Array of files selected]
         * @return {[type]}         [description]
         */
        function onFileSelect($files) {
            // inject
            ctrl.filesInUploadQueue = $files;

            // foreach file start an upload
            for(var i = 0; i < ctrl.filesInUploadQueue.length; i++) {

                // set the progress to zero and the status
                ctrl.filesInUploadQueue[i].progress = parseInt(0);
                ctrl.filesInUploadQueue[i].status = 'Uploading';

                // upload the current file
                JobService.uploadFile(ctrl.filesInUploadQueue[i]).then(function(success) {



                }, function(error, status) {

                    // server not available
                    if(status === null) {
                        return SweetAlert.swal('Der Upload-Server ist nicht erreichbar');
                    }

                }, null);
            }
        }

        /**
         * Is called when on a video in the upload-queue-list is clicked.
         * Changes the 'jop-profile'-box accordingly to the selected video.
         * @param  {[Object]} clickedVideo [fileObject of the clicked video]
         */
        function onVideoSelect(clickedVideo) {
            console.log(clickedVideo);

            ctrl.fileSelected = clickedVideo;
        }

        /**
         * Is called when a profile was clicked from the 'section-profiles'.
         * Changes the profile-settings-view accordingly to the selected profile.
         * @param  {[type]} clickedProfile [description]
         * @return {[type]}                [description]
         */
        function onProfileSelect(clickedProfile) {

        }

        //////////////////////

        angular.extend(ctrl, {
            filesInUploadQueue: [],
            fileSelected: null,

            onFileSelect: onFileSelect,
            onVideoSelect: onVideoSelect,
            onProfileSelect:onProfileSelect
        });

    }

})();