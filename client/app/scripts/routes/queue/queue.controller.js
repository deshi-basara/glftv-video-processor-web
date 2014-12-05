(function () {

    'use strict';

    angular
        .module('app')
        .controller('QueueCtrl', QueueCtrl);

    QueueCtrl.$inject = ['QueueService', 'ngTableParams', 'SocketService', '$scope'];

    /**
     * Handles the dash-board view and all interactions
     */
    function QueueCtrl(QueueService, ngTableParams, SocketService, $scope) {
        var ctrl = this;

        /**
         * Is fired when the 'cancel'-icon is clicked.
         * @param  {int} jobId [Id of the job we want to cancel]
         */
        function cancelSelected(jobId) {
            QueueService.cancelJob(jobId).then(function(success) {
                // job was canceled, refetch list
                fetchAll();
            }, function(error) {
                // @todo error handling
            });
        }

        /*
         * Fetches all stats-entries and inserts them
         */
        function fetchAll() {
            QueueService.getAllInQueue().then(function(success) {

                // save result globally
                ctrl.queueData = success;

                // reload table params
                ctrl.tableParams.reload();

            }, function(error) {
                // @todo error handling
            });
        }

        /**
         * Fetches all failed videos and starts a remove request.
         */
        function removeAllFailed() {
            // get all failed
            var failedArray = [];
            for (var i = 0; i < ctrl.queueData.length; i++) {
                var currentVideo = ctrl.queueData[i];

                // check if it's finished
                if(currentVideo.status === 'failed') {
                    failedArray.push(currentVideo.id);
                }
            };

            // send remove request if there are finished videos
            if(failedArray.length > 0) {
                QueueService.removeAll(failedArray).then(function(success) {
                    // refetch all entries
                    console.log(success);
                    fetchAll();

                }, function(error) {
                    // @todo error handling
                });
            }
        }

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
                    finishedArray.push(currentVideo.id);
                }
            };

            // send remove request if there are finished videos
            if(finishedArray.length > 0) {
                QueueService.removeAll(finishedArray).then(function(success) {
                    // refetch all entries
                    console.log(success);
                    fetchAll();

                }, function(error) {
                    // @todo error handling
                });
            }
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
                if(ctrl.queueData) {
                    params.total(ctrl.queueData.length);
                    // slice and set new data for the current page
                    var data = ctrl.queueData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                    $defer.resolve(data);
                }
            }
        });

        //////////////////////

        angular.extend(ctrl, {
            queueData: null,
            tableParams: tableParams,

            cancelSelected: cancelSelected,
            removeAllFailed: removeAllFailed,
            removeAllFinished: removeAllFinished
        });

        //////////////////////

        /**
         * Is fired when a stats-entry is updated.
         * @param  {object} data [id of the stats-entry and all the values that have changed]
         */
        SocketService.socket.on('stats.progress.update', function(data) {

            // loop through all stats entries
            for (var i = 0; i < ctrl.queueData.length; i++) {

                // update the right stats-entry
                if(ctrl.queueData[i].id === data.id) {

                    ctrl.queueData[i].progress = data.progress;

                    return $scope.$apply();
                }
            };
        });

        //////////////////////

        fetchAll();


    }

})();