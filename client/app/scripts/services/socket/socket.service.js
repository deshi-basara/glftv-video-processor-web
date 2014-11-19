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


        function connectSocket() {
            try {
                service.socket = io.connect('http://localhost:1337');
            }
            catch(err) {
                return SweetAlert.swal('Es konnte keine Verbindung zum WebSocket hergetsellt werden');
            }

            // when the socket is connected, start listening for updates
            service.socket.on('connect', function() {
                registerListeners();
            });
        }

        function registerListeners() {

            service.socket.on('hello', function(msg) {
                console.log(msg);
            });

        }


    }


})()