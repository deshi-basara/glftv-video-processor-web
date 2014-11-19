(function() {

    'use strict';

    angular
        .module('app')
        .factory('SettingsService', SettingsService);

    SettingsService.$inject = ['$upload', '$http', 'config', '$q'];

    /**
     * Service for uploading jobs
     */
    function SettingsService($upload, $http, config, $q) {

        var service = {
            modelUrl: '/videos/model',
            uploadUrl: '/videos/upload',
            searchUrl: '/videos/search',
            startUrl: '/videos/start',

            createModel: createModel,
            uploadFile: uploadFile,
            startQueue: startQueue,
            startSearch: startSearch
        }

        return service;

        ///////////////
        ///
        /**
         * Creates a video-model on the server for files that aren't uploaded,
         * but already exist on the server.
         * @param  {File Object}  fileObj [File data from the job-modal]
         * @return {Promise}              [Resolve: true | Reject: false]
         */
        function createModel(fileObj) {
            var q = $q.defer();

            // make the request
            $http({
                method: 'POST',
                url: config.apiUrl + service.modelUrl,
                data: {
                    name: fileObj.name,
                    path: fileObj.path
                }
            }).success(function(data) {
                // file upload complete
                fileObj.progress = 100;
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
         * Upload the handed file to the rest api.
         * @param  {File Object}  fileObj [File data from angular-file-upload]
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
         * Sends a request with the fileId to the server for enqueuing an uploaded file.
         * @param  {[int]}    fileId  [Serverside database id of the file]
         * @param  {[string]} profile [Name of the selected converting profile]
         * @return {Promise}          [Resolve: true | Reject: false]
         */
        function startQueue(fileId, profile) {
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
         * Initiates a server-side search with the handed searchPath.
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