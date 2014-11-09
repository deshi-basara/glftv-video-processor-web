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
            searchUrl: '/videos/search',
            startUrl: '/videos/start',

            uploadFile: uploadFile,
            startFile: startFile,
            startSearch: startSearch
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
            }).success(function(data) {
                // file upload complete
                fileObj.status = 'Bereit';

                // save the database id of the uploaded file in the queue-array
                fileObj.uploadId = data.id;
                q.resolve(data);
            }).error(function(data, status) {
                // file upload error
                fileObj.status = 'Fehler';
                q.reject(data, status);
            });

            return q.promise;
        }

        /**
         * Sends a request with the fileId to the server for enqueuing the file.
         * @param  {[int]}    fileId  [Serverside database id of the file]
         * @param  {[string]} profile [Name of the selected converting profile]
         * @return {Promise}          [Resolve: true | Reject: false]
         */
        function startFile(fileId, profile) {
            var q = $q.defer();

            console.log('starting: '+fileId +' + '+profile);

            // make the request
            $http({
                method: 'POST',
                url: config.apiUrl + service.startUrl,
                data: {
                    id: fileId,
                    profile: profile
                }
            }).success(function() {
                q.resolve();
            }).error(function(data, status) {
                q.reject(data, status);
            });

            return q.promise;
        }

        /**
         * [startSearch description]
         * @param  {String}  searchPath   [Path in which we start the search for files]
         * @return {Promise}              [Resolve: true | Reject: false]
         */
        function startSearch(searchPath) {
            var q = $q.defer();

            console.log('search: '+searchPath);

            // make the request
            $http({
                method: 'POST',
                url: config.apiUrl + service.searchUrl,
                data: {path: searchPath}
            }).success(function(data) {
                q.resolve(data);
            }).error(function(data, status) {
                q.reject(data, status);
            });

            return q.promise;
        }
    }


})();