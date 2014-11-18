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
         * Sends a request with the currentPage to the server for fetching all stats-entries at
         * the currentPage.
         * @param  {[int]}    currentPage  [Pagination index]
         * @return {Promise}          [Resolve: true | Reject: false]
         */
        function getAllInQueue(currentPage) {
            var q = $q.defer();

            console.log(currentPage);

            // make the request
            $http({
                method: 'POST',
                url: config.apiUrl + service.allUrl,
                data: {
                    page: currentPage
                }
            }).success(function(data) {
                q.resolve(data);
            }).error(function(data, status) {
                q.reject(data, status);
            });

            return q.promise;
        }
    }


})();