(function() {

    'use strict';

    angular
        .module('app')
        .factory('JobService', JobService);

    JobService.$inject = ['$upload', 'config', '$q'];

    /**
     * Service for uploading jobs
     */
    function JobService($upload, config, $q) {

        var service = {
            uploadUrl: '/videos/create',

            uploadFile: uploadFile
        };

        return service;

        ///////////////


        /**
         * Upload the handed file to the rest api.
         * @param  {File Object}  loginObj [File data from angular-file-upload]
         * @return {Promise}               [Resolve: true | Reject: false]
         */
        function uploadFile(fileObj) {
            var q = $q.defer();

            // make the request
            $upload.upload({
                method: 'POST',
                url: config.apiUrl + service.uploadUrl,
                file: fileObj,
                fileFormDataName: 'videoFile'
            }).progress(function(evt) {
                // calculate the progress in percentage and notify
                fileObj.progress = parseInt(100.00 * evt.loaded / evt.total);
            }).success(function(data, status, header, config, responseText) {
                // file upload complete
                fileObj.status = 'Fertig';
                q.resolve();
            }).error(function(data, status, header, config, responseText) {
                // file upload error
                fileObj.status = 'Fehler';
                q.reject(data, status);
            });

            return q.promise;
        }
    }


})();