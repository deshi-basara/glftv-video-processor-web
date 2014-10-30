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
            // inject files into the view
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

        /**
         * Hands all finished file to the JobService.startFile(id) function.
         * There an queue-request is send.
         */
        function queueUploadedVideos() {
            // iterate through all files in the queue
            for(var i = 0; i < ctrl.filesInUploadQueue.length; i++) {
                var currentFile = ctrl.filesInUploadQueue[i];

                console.log(currentFile.status);
                // check if the current file is ready
                if(currentFile.status === 'Fertig') {
                    // add the videoFile to the encoding-queue
                    JobService.startFile(currentFile.uploadId).then(function(success) {
                        console.log(success);
                    }, function(error) {
                        console.log(error);
                    }, function(progress) {
                        console.log(progress);
                    });
                }
            }
        }

        //////////////////////

        angular.extend(ctrl, {
            filesInUploadQueue: [],
            fileSelected: null,

            onFileSelect: onFileSelect,
            onVideoSelect: onVideoSelect,
            onProfileSelect: onProfileSelect,
            queueUploadedVideos: queueUploadedVideos
        });

    }

})();