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

            getAllInQueue: getAllInQueue
        };

        return service;

        ///////////////

        /**
         * Sends a request with to the server for fetching all stats-entries at.
         * @return {Promise}          [Resolve: true | Reject: false]
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
    }


})();