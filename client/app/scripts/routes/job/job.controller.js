(function () {

    'use strict';

    angular
        .module('app')
        .controller('JobCtrl', JobCtrl);

    JobCtrl.$inject = ['ngTableParams', 'JobService', 'ProfileService', 'SweetAlert', '$modal', '$scope'];

    /**
     * Handles the dash-board view and all interactions
     */
    function JobCtrl(ngTableParams, JobService, ProfileService, SweetAlert, $modal, $scope) {
        var ctrl = this;

        // get all available profiles
        ProfileService.getAllProfiles().then(function(success) {
            ctrl.profiles = success;
        }, function(error, status) {

        });

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
         * Opens the 'chose-files from the server'-modal.
         */
        function onServerSelect() {
            var modalInstance = $modal.open({
                templateUrl: 'server-modal.html',
                controller: 'JobModalCtrl',
                controllerAs: 'modal',
                size: 'lg'
            });
        }

        /**
         * Hands all finished file to the JobService.startQueue(id) function.
         * There an queue-request is send.
         */
        function queueUploadedVideos() {
            // iterate through all files in the queue
            for(var i = 0; i < ctrl.filesInUploadQueue.length; i++) {
                var currentFile = ctrl.filesInUploadQueue[i];

                console.log(currentFile);

                // check if the current file is ready and has a selected profile
                if(currentFile.status === 'Bereit' && currentFile.profile) {

                    // add the videoFile to the encoding-queue
                    JobService.startQueue(currentFile.uploadId, currentFile.profile).then(function(success) {
                        currentFile.status = 'Fertig';
                    }, function(error) {
                        currentFile.status = 'Fehler';
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
            profiles: null,

            onFileSelect: onFileSelect,
            onVideoSelect: onVideoSelect,
            onProfileSelect: onProfileSelect,
            onServerSelect: onServerSelect,
            queueUploadedVideos: queueUploadedVideos
        });

        /////////////////////

        /**
         * Listens for files from the modal-job-controller.
         * @param  {Object} broadcast [Angularjs broadcast-object]
         * @param  {Array}  files     [Holds all selected file objects]
         */
        $scope.$on('modal.server.selectedFiles', function(broadcast, files) {
            // inject found files
            ctrl.filesInUploadQueue = files;

            // create video-model for each file on the server
            for (var i = 0; i < ctrl.filesInUploadQueue.length; i++) {
                JobService.createModel(ctrl.filesInUploadQueue[i]).then(function(success) {
                    console.log(success);
                }, function(error) {

                });
            };
        });

        /////////////////////

        onServerSelect();


    }

})();