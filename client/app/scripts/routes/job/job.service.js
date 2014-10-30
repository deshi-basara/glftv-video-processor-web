(function() {

    'use strict';

    angular
        .module('app')
        .factory('JobService', JobService);

    JobService.$inject = ['$upload', '$http', 'config', '$q'];

    /**
     * Service for uploading jobs
     */
    function JobService($upload, $http, config, $q) {

        var service = {
            uploadUrl: '/videos/create',
            startUrl: '/videos/start',

            uploadFile: uploadFile,
            startFile: startFile
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

                // save the database id of the uploaded file in the queue-array
                fileObj.uploadId = data.id;
                q.resolve(data);
            }).error(function(data, status, header, config, responseText) {
                // file upload error
                fileObj.status = 'Fehler';
                q.reject(data, status);
            });

            return q.promise;
        }

        /**
         * Sends a request with the fileId to the server for enqueuing the file.
         * @param  {[int]} fileId  [Serverside database id of the file]
         * @return {Promise}       [Resolve: true | Reject: false]
         */
        function startFile(fileId) {
            var q = $q.defer();

            console.log('starting: '+fileId);

            // make the request
            $http({
                method: 'POST',
                url: config.apiUrl + service.startUrl,
                data: {id: fileId}
            }).success(function() {
                q.resolve();
            }).error(function(data, status) {
                q.reject(data, status);
            });

            return q.promise;
        }
    }


})();