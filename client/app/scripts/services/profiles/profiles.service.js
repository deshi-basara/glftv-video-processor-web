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
            newProfileUrl: '/profiles/save',

            getAllProfiles: getAllProfiles,
            getAllProfileSettings: getAllProfileSettings,
            submitNewProfile: submitNewProfile
        };

        return service;

        ///////////////

        /**
         * Fetches all available profiles from the server.
         * @return {[object]} [JSON-object with all saved profiles]
         */
        function getAllProfiles() {
            var q = $q.defer();

            // make the request
            $http({
                method: 'GET',
                url: config.apiUrl + service.allProfilesUrl
            }).success(function(data) {
                q.resolve(data);
            }).error(function(data, status) {
                q.reject(data, status);
            });

            return q.promise;

            /*var profiles = [
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

            ];*/

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
                            'key': 'v:c',
                            'type': 'text',
                            'label': 'Video-Codec',
                            'placeholder': 'libvpx'
                        },
                        {
                            'key': 'quality',
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
                            'key': 'qmin',
                            'type': 'text',
                            'label': 'Quantisierungs-Min',
                            'placeholder': 10
                        },
                        {
                            'key': 'qmax',
                            'type': 'text',
                            'label': 'Quantisierungs-Max',
                            'placeholder': 42
                        },
                        {
                            'key': 'threads',
                            'type': 'text',
                            'label': 'Threads',
                            'placeholder': 4
                        }

                    ],

                    'audio': [
                        {
                            'key': 'a:c',
                            'type': 'text',
                            'label': 'Audio-Codec',
                            'placeholder': 'libvorbis'
                        },
                        {
                            'key': 'ac',
                            'type': 'text',
                            'label': 'Audio-Kanäle',
                            'placeholder': 2
                        },
                        {
                            'key': 'ar',
                            'type': 'text',
                            'label': 'Abtastrate',
                            'placeholder': 44100
                        },
                        {
                            'key': 'b:a',
                            'type': 'text',
                            'label': 'Bitrate',
                            'placeholder': '360k'
                        }
                    ]
                }
            };

            return settings;

        }


        /**
         * Submits a new profile to the server.
         * @param  {[object]}  profileModel [ngModel with all the entered profile data]
         * @return {[promise]}              [Angular promise]
         */
        function submitNewProfile(profileModel) {
            var q = $q.defer();

            console.log(profileModel);

            // make the request
            $http({
                method: 'POST',
                url: config.apiUrl + service.newProfileUrl,
                data: {profile: profileModel}
            }).success(function(data, status, header, config, responseText) {
                q.resolve(data);
            }).error(function(data, status, header, config, responseText) {
                q.reject(data, status);
            });

            return q.promise;
        }

    }


})();