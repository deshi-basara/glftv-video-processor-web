(function() {

    'use strict';

    angular
        .module('app')
        .factory('ProfileService', ProfileService);

    ProfileService.$inject = ['$http', 'config', '$q'];

    /**
     * Service for uploading jobs
     */
    function ProfileService($http, config, $q) {

        var service = {
            allProfilesUrl: '/profiles/all',

            getAllProfiles: getAllProfiles
        };

        return service;

        ///////////////

        /**
         * Fetches all available profiles from the server.
         * @return {[type]} [description]
         */
        function getAllProfiles() {

            var profiles = [
                {
                    name: 'Webm - 720p',
                    codec_a: 'libvorbis',
                    ac: 2,
                    ar: 44100,
                    b_a: '360k',
                    codec_v: 'libvpx',
                    quality: 'good',
                    cpuused: 0,
                    qmin: 10,
                    qmax: 42,
                    vf: 'scale=-1:720',
                    threads: 4,
                    output: 'webm'
                },
                {
                    name: 'Ogv - 720p',
                    codec_a: 'libvorbis',
                    ac: 2,
                    ar: 44100,
                    b_a: '360k',
                    codec_v: 'libtheora',
                    qscale_v: 8,
                    threads: 4,
                    output: 'ogv'
                },
                {
                    name: 'mp4 (h264) - 720p',
                    codec_a: 'libfaac',
                    ac: 2,
                    ar: 44100,
                    b_a: '360k',
                    codec_v: 'libx264',
                    b_v: '2000k',
                    bufsize: '4000k',
                    threads: 4
                }

            ];

            return profiles;
        }

    }


})();