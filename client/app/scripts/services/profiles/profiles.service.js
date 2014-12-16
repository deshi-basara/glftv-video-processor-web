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
            allSettingsUrl: '/settings/all',
            newProfileUrl: '/profiles/save',
            newSettingsUrl: '/settings/save',
            removeSettingUrl: '/settings/remove',

            getAllProfiles: getAllProfiles,
            getAllProfileSettings: getAllProfileSettings,
            removeSetting: removeSetting,
            submitNewProfile: submitNewProfile,
            submitNewSettings: submitNewSettings
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
        }

        /**
         * Fetches all available predefined profile settings from the server.
         * @return {[object]} [JSON-object with all available profile settings]
         */
        function getAllProfileSettings() {

            var q = $q.defer();

            // make the request
            $http({
                method: 'GET',
                url: config.apiUrl + service.allSettingsUrl
            }).success(function(data) {
                // parse the data to json
                for (var i = 0; i < data.length; i++) {
                    var jsonString = data[i].json;

                    data[i] = JSON.parse(jsonString);
                }

                q.resolve(data);
            }).error(function(data, status) {
                q.reject(data, status);
            });

            return q.promise;
        }

        /**
         * Removes a setting item from the database.
         * @param  {string} settingName [Name of the setting we want to remove]
         * @return {[promise]}              [Angular promise]
         */
        function removeSetting(settingName) {
            var q = $q.defer();

            console.log(settingName);

            // make the request
            $http({
                method: 'DELETE',
                url: config.apiUrl + service.removeSettingUrl,
                data: {
                    name: settingName
                }
            }).success(function(data) {
                q.resolve(data);
            }).error(function(data, status) {
                q.reject(data, status);
            });

            return q.promise;
        }

        /**
         * Submits a new profile to the server.
         * @param  {[object]}  profileModel [ngModel with all the entered profile data]
         * @return {[promise]}              [Angular promise]
         */
        function submitNewProfile(profileModel) {
            var q = $q.defer();

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

        /**
         * Submits a new profile setting to the server.
         * @param  {boolean}  newOne        [Weather the new profile should be inserted as new one]
         * @return {promise}                [Angular promise]
         */
        function submitNewSettings(settingsModel) {
            var q = $q.defer();

            // make the request
            $http({
                method: 'POST',
                url: config.apiUrl + service.newSettingsUrl,
                data: {
                    name: settingsModel.name,
                    settings: settingsModel
                }
            }).success(function(data, status, header, config, responseText) {
                q.resolve(data);
            }).error(function(data, status, header, config, responseText) {
                q.reject(data, status);
            });

            return q.promise;
        }

    }


})();