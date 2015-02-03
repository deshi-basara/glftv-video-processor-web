(function() {

    'use strict';

    angular
        .module('app')
        .factory('QueueService', QueueService);

    QueueService.$inject = ['$http', 'config', '$q'];

    /**
     * Service for uploading jobs
     */
    function QueueService($http, config, $q) {

        var service = {
            allUrl: '/stats/all',
            cancelUrl: '/stats/cancel',
            downloadUrl: '/videos/download',
            removeUrl: '/stats/remove',

            cancelJob: cancelJob,
            downloadTranscode: downloadTranscode,
            getAllInQueue: getAllInQueue,
            removeAll: removeAll
        };

        return service;

        /**
         * Sends a download request to the server.
         * @param  {int}    statsId [Stats db id of the transcoded video-file]
         * @return {Promise}        [Resolve: Object | Reject: false]
         */
        function downloadTranscode(statsId) {
            window.open(config.apiUrl + service.downloadUrl + '/' + statsId);
        }

        /**
         * Sends a cancel request to the server and reacts to the server feedback.
         * @param  {int}      jobId [Id of the job we want to cancel]
         * @return {Promise}        [Resolve: Object | Reject: false]
         */
        function cancelJob(jobId) {
            var q = $q.defer();

            // make the request
            $http({
                method: 'DELETE',
                url: config.apiUrl + service.cancelUrl,
                data: {
                    id: jobId
                }
            }).success(function(data) {
                q.resolve(data);
            }).error(function(data, status) {
                q.reject(data, status);
            });

            return q.promise;
        }

        /**
         * Sends a request with to the server for fetching all stats-entries at.
         * @return {Promise}          [Resolve: Object | Reject: false]
         */
        function getAllInQueue() {
            var q = $q.defer();

            // make the request
            $http({
                method: 'GET',
                url: config.apiUrl + service.allUrl
            }).success(function(data) {
                q.resolve(data);
            }).error(function(data, status) {
                q.reject(data, status);
            });

            return q.promise;
        }

        /**
         * Sends a delete request to the server with all stats-entry-ids that
         * should be destroyed.
         * @param  {object}  ids [All stats-entry-ids that should be destroyed]
         * @return {Promise}     [Resolve: true | Reject: false]
         */
        function removeAll(ids) {
            var q = $q.defer();

            // make the request
            $http({
                method: 'DELETE',
                url: config.apiUrl + service.removeUrl,
                data: {removeIds: ids}
            }).success(function(data) {
                q.resolve(data);
            }).error(function(data, status) {
                q.reject(data, status);
            });

            return q.promise;
        }
    }


})();