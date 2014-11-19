(function () {

    'use strict';

    angular
        .module('app')
        .controller('QueueCtrl', QueueCtrl);

    QueueCtrl.$inject = ['QueueService', 'ngTableParams'];

    /**
     * Handles the dash-board view and all interactions
     */
    function QueueCtrl(QueueService, ngTableParams) {
        var ctrl = this;

        /**
         * Fetches all finished videos and starts a remove request.
         */
        function removeAllFinished() {
            // get all finished
            var finishedArray = [];
            for (var i = 0; i < ctrl.queueData.length; i++) {
                var currentVideo = ctrl.queueData[i];

                // check if it's finished
                if(currentVideo.status === 'finished') {
                    finishedArray.push(currentVideo);
                }
            };

            console.log(finishedArray);
        }



        //////////////////////

        // ngTable settings
        var tableParams = new ngTableParams({
            page: 1,
            count: 15
        }, {
            total: 0,
            counts: [],
            getData: function($defer, params) {
                // fetch the table data
                QueueService.getAllInQueue().then(function(success) {
                    // update the table params
                    params.total(success.length);
                    // slice and set new data for the current page
                    var data = success.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    $defer.resolve(data);

                    // save result globally
                    ctrl.queueData = success;

                }, function(error) {

                });
            }
        });

        //////////////////////

        angular.extend(ctrl, {
            queueData: null,
            tableParams: tableParams,

            removeAllFinished: removeAllFinished
        });

        //////////////////////

        //////////////////////


    }

})();