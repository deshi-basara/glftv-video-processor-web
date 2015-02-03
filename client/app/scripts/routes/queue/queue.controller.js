(function () {

    'use strict';

    angular
        .module('app')
        .controller('QueueCtrl', QueueCtrl);

    QueueCtrl.$inject = ['QueueService', 'ngTableParams', 'SocketService', '$scope', 'SweetAlert'];

    /**
     * Handles the dash-board view and all interactions
     */
    function QueueCtrl(QueueService, ngTableParams, SocketService, $scope, SweetAlert) {
        var ctrl = this;

        /**
         * Is fired when the 'cancel'-icon is clicked.
         * @param  {int} jobId [Id of the job we want to cancel]
         */
        function cancelSelected(jobId) {

            // ask the user if he is sure
            SweetAlert.swal({
                title: "Bist du dir sicher?",
                text: "Gelöschte Jobs können nicht wiederhergestellt werden!",
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "Ja, löschen",
                cancelButtonText: "Abbrechen",
            },function(isConfirm){
                if(isConfirm) {
                    // user confirmed, make a delete request
                    QueueService.cancelJob(jobId).then(function(success) {
                        // job was canceled, refetch list
                        fetchAll();
                        // give user feedback
                        SweetAlert.swal("Gelöscht!", "Der Job wurde erfolgreich gelöscht.", "success");
                    }, function(error) {
                        SweetAlert.swal('Server-Fehler', error, 'error');
                    });
                }
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
                return SweetAlert.swal('Server-Fehler', error, 'error');
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
            }

            // send remove request if there are finished videos
            if(failedArray.length > 0) {
                QueueService.removeAll(failedArray).then(function(success) {
                    // refetch all entries
                    console.log(success);
                    fetchAll();

                }, function(error) {
                    return SweetAlert.swal('Server-Fehler', error, 'error');
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
            }

            // send remove request if there are finished videos
            if(finishedArray.length > 0) {
                QueueService.removeAll(finishedArray).then(function(success) {
                    // refetch all entries
                    console.log(success);
                    fetchAll();

                }, function(error) {
                    return SweetAlert.swal('Server-Fehler', error, 'error');
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
                    var data = ctrl.queueData.slice((params.page() - 1) *
                            params.count(), params.page() * params.count());
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
        var updateAll = 0;
        SocketService.socket.on('stats.progress.update', function(data) {

            // loop through all stats entries
            for (var i = 0; i < ctrl.queueData.length; i++) {

                // update the right stats-entry
                if(ctrl.queueData[i].id === data.id) {

                    // update the whole stats every 50 steps
                    if(updateAll++ === 50) {
                        updateAll = 0;

                        ctrl.queueData[i] = data;
                    }
                    // only update the progress
                    else {
                        ctrl.queueData[i].progress = data.progress;
                        ctrl.queueData[i].status = data.status;
                    }


                    return $scope.$apply();
                }
            }
        });

        //////////////////////

        fetchAll();


    }

})();