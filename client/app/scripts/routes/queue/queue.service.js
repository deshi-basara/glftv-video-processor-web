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
            removeUrl: '/stats/remove',

            getAllInQueue: getAllInQueue,
            removeAllFinished: removeAllFinished
        };

        return service;

        ///////////////

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
         * @param  {object} finishedIds [All stats-entry-ids that should be destroyed]
         * @return {Promise}            [Resolve: true | Reject: false]
         */
        function removeAllFinished(finishedIds) {
            var q = $q.defer();

            console.log(finishedIds);

            // make the request
            $http({
                method: 'DELETE',
                url: config.apiUrl + service.removeUrl,
                data: {removeIds: finishedIds}
            }).success(function(data) {
                q.resolve(data);
            }).error(function(data, status) {
                q.reject(data, status);
            });

            return q.promise;
        }
    }


})();