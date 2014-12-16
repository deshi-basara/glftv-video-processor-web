(function() {

    angular
        .module('app')
        .factory('SocketService', SocketService);

    SocketService.$inject = ['config', '$q', 'SweetAlert'];

    /**
     * Service for checking if the current user is authenticated
     */
    function SocketService(config, $q, SweetAlert) {

        var service = {
            socket: null,

            connectSocket: connectSocket
        };

        return service;

        ///////////////

        /**
         * Connects to die sails.io.js WebSocket.
         */
        function connectSocket() {
            try {
                service.socket = io.connect(config.apiUrl);
            }
            catch(err) {
                return SweetAlert.swal('Server-Fehler', 'Es konnte keine Verbindung zum WebSocket hergestellt werden', 'error');
            }

            // when the socket is connected, start listening for updates
            service.socket.on('connect', function() {
                registerListeners();
            });
        }

        /**
         * All service-event-listeners, that shoud be added.
         */
        function registerListeners() {
            // nothing to do here (yet :P)
        }


    }


})()