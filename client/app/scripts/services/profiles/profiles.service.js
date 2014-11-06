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

            getAllProfiles: getAllProfiles,
            getAllProfileSettings: getAllProfileSettings
        };

        return service;

        ///////////////

        /**
         * Fetches all available profiles from the server.
         * @return {[object]} [JSON-object with all saved profiles]
         */
        function getAllProfiles() {

            var profiles = [
                {
                    name: 'Webm - 720p',
                    codec_a: 'libvorbis',
                    ac: 2,
                    ar: 44100,
                    b_a: '360k',

                    // Video
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
                    threads: 4,
                    output: 'mp4'
                }

            ];

            return profiles;
        }

        /**
         * Fetches all available predefined profile settings from the server.
         * @return {[object]} [JSON-object with all available profile settings]
         */
        function getAllProfileSettings() {

            var settings = {
                'webm': {

                    'video': [
                        {
                            'key': 'videoCodec',
                            'type': 'text',
                            'label': 'Video-Codec',
                            'placeholder': 'libvpx'
                        },
                        {
                            'key': 'videoQuality',
                            'type': 'select',
                            'label': 'Qualität',
                            'options': [
                                {
                                    'name': 'good (empfohlen)',
                                    'value': 'good'
                                },
                                {
                                    'name': 'best',
                                    'value': 'best'
                                },
                                {
                                    'name': 'realtime',
                                    'value': 'realtime'
                                }
                            ]
                        },
                        {
                            'key': 'videoQualityQmin',
                            'type': 'number',
                            'label': 'Quantisierungs-Min',
                            'default': 10,
                            'min': 0
                        },
                        {
                            'key': 'videoQualityQmax',
                            'type': 'number',
                            'label': 'Quantisierungs-Max',
                            'default': 42,
                            'min': 0
                        },
                        {
                            'key': 'videoThreads',
                            'type': 'number',
                            'label': 'Threads',
                            'default': 4,
                            'min': 0
                        }

                    ],

                    'audio': [
                        {
                            'key': 'audioCodec',
                            'type': 'text',
                            'label': 'Audio-Codec',
                            'placeholder': 'libvorbis'
                        },
                        {
                            'key': 'audioChannels',
                            'type': 'number',
                            'label': 'Audio-Kanäle',
                            'default': 2,
                            'placeholder': 2,
                            'min': 1
                        },
                        {
                            'key': 'audioSamplerate',
                            'type': 'number',
                            'label': 'Abtastrate',
                            'default': 44100,
                            'placeholder': 44100,
                            'min': 1
                        },
                        {
                            'key': 'audioBitrate',
                            'type': 'text',
                            'label': 'Bitrate',
                            'placeholder': '360k'
                        }
                    ]
                }
            };

            return settings;

            /**
             *                     codec_a: 'libvorbis',
                    ac: 2,
                    ar: 44100,
                    b_a: '360k',
             */
        }

    }


})();