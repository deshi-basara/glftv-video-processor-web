(function () {

    'use strict';

    angular
        .module('app')
        .controller('JobCtrl', JobCtrl);

    JobCtrl.$inject = ['ngTableParams', 'JobService', 'SweetAlert'];

    /**
     * Handles the dash-board view and all interactions
     */
    function JobCtrl(ngTableParams, JobService, SweetAlert) {
        var ctrl = this;

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
                JobService.uploadFile(ctrl.filesInUploadQueue[i]).then(null, function(data, status) {
                    // server not available
                    if(status === null) {
                        return SweetAlert.swal('Der Upload-Server ist nicht erreichbar');
                    }
                });
            }
        }

        //////////////////////

        angular.extend(ctrl, {
            filesInUploadQueue: [],

            onFileSelect: onFileSelect
        });

    }

})();