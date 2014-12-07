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


        /**
         * Adds custom selected profiles from the 'bottom-box' to the selected file.
         * (Custom selected profiles > Select-box selected profiles)
         */
        function customProfiles(profileName) {

            // check if the profile was already added
            var indexOf = ctrl.fileSelected.custom.indexOf(profileName);
            if(indexOf === -1) {
                // not added previously, add to the array
                ctrl.fileSelected.custom.push(profileName);
            }
            else {
                // added previously, remove from the array
                ctrl.fileSelected.custom.shift(indexOf);
            }
        }

        /**
         * Fetches all available profiles from the server.
         */
        function fetchAllProfiles() {
            // get all available profiles
            ProfileService.getAllProfiles().then(function(success) {
                ctrl.profiles = success;
            }, function(error, status) {
                SweetAlert.swal('Server-Fehler', error, 'error');
            });
        }

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

                // set the progress to zero, the status and make custom profiles available
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
            // add an array for all selected profiles
            clickedVideo.custom = [];
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

                // check if the current file is ready and has a selected profile
                if(currentFile.status === 'Bereit' && currentFile.custom.length !== 0) {

                    // add the videoFile to the encoding-queue
                    JobService.startQueue(currentFile.uploadId, currentFile.custom).then(function(success) {
                        currentFile.status = 'Fertig';
                    }, function(error) {
                        currentFile.status = 'Fehler';
                    }, function(progress) {
                        console.log(progress);
                    });
                }
                else if(currentFile.status === 'Bereit' && currentFile.custom.length === 0) {
                    // mark the currentFile as profile-less
                    currentFile.noProfile = true;
                }
            }
        }

        //////////////////////

        angular.extend(ctrl, {
            filesInUploadQueue: [],
            fileSelected: null,
            profiles: null,

            customProfiles: customProfiles,
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

        fetchAllProfiles();


    }

})();