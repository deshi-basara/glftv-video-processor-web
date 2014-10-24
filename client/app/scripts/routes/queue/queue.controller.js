(function () {

    'use strict';

    angular
        .module('app')
        .controller('QueueCtrl', QueueCtrl);

    QueueCtrl.$inject = [];

    /**
     * Handles the dash-board view and all interactions
     */
    function QueueCtrl() {
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

        angular.extend(ctrl, {
            queueData: data
        });
    }

})();