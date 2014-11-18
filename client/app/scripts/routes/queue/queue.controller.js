(function () {

    'use strict';

    angular
        .module('app')
        .controller('QueueCtrl', QueueCtrl);

    QueueCtrl.$inject = ['QueueService'];

    /**
     * Handles the dash-board view and all interactions
     */
    function QueueCtrl(QueueService) {
        var ctrl = this;

        var data = [
            {id: 1, status: 'queued', prio: 'high', name: 'GLF-Campus 720p', profile: 'ogv 720p', pass: 1, created: '12.03.1991', user: 'Ada Rhode'},
            {id: 1, status: 'queued', prio: 'high', name: 'GLF-Campus 720p', profile: 'ogv 720p', pass: 1, created: '12.03.1991', user: 'Ada Rhode'},
            {id: 1, status: 'queued', prio: 'high', name: 'GLF-Campus 720p', profile: 'ogv 720p', pass: 1, created: '12.03.1991', user: 'Ada Rhode'},
            {id: 1, status: 'queued', prio: 'high', name: 'GLF-Campus 720p', profile: 'ogv 720p', pass: 1, created: '12.03.1991', user: 'Ada Rhode'},
            {id: 1, status: 'queued', prio: 'high', name: 'GLF-Campus 720p', profile: 'ogv 720p', pass: 1, created: '12.03.1991', user: 'Ada Rhode'},
            {id: 1, status: 'queued', prio: 'high', name: 'GLF-Campus 720p', profile: 'ogv 720p', pass: 1, created: '12.03.1991', user: 'Ada Rhode'},
            {id: 1, status: 'queued', prio: 'high', name: 'GLF-Campus 720p', profile: 'ogv 720p', pass: 1, created: '12.03.1991', user: 'Ada Rhode'},
            {id: 1, status: 'queued', prio: 'high', name: 'GLF-Campus 720p', profile: 'ogv 720p', pass: 1, created: '12.03.1991', user: 'Ada Rhode'},
            {id: 1, status: 'queued', prio: 'high', name: 'GLF-Campus 720p', profile: 'ogv 720p', pass: 1, created: '12.03.1991', user: 'Ada Rhode'},
            {id: 1, status: 'queued', prio: 'high', name: 'GLF-Campus 720p', profile: 'ogv 720p', pass: 1, created: '12.03.1991', user: 'Ada Rhode'}
        ];

        //////////////////////

        QueueService.getAllInQueue(0).then(function(success) {
            console.log(success);
            ctrl.queueData = success;
        }, function(error) {

        });

        //////////////////////

        angular.extend(ctrl, {
            queueData: null
        });
    }

})();