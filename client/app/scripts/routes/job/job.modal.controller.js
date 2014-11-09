(function () {

    'use strict';

    angular
        .module('app')
        .controller('JobModalCtrl', JobModalCtrl);

    JobModalCtrl.$inject = ['$modalInstance', 'JobService', '$timeout'];

    /**
     * Handles the dash-board view and all interactions
     */
    function JobModalCtrl($modalInstance, JobService, $timeout) {
        var modal = this;

        /**
         * Closes the modal box.
         */
        function closeModal() {
          $modalInstance.dismiss('cancel');
        }


        function startSearch() {
          // set the loading indicator
          modal.isSearching = true;

          // only start a search, if there is input
          if(modal.searchString === null) {
            // set timeout, for visible search-feedback
            $timeout(function() {
              modal.isSearching = false;
            }, 500);
            return;
          }

          // start the search
          JobService.startSearch(modal.searchString).then(function(success) {
            // parse search results
            modal.isSearching = false;
            modal.foundFiles = success;
            modal.totalFiles = success.length;
          }, function(error) {

          });
        }

        //////////////////////

        angular.extend(modal, {
          isSearching: false,
          searchString: null,
          selectedFiles: 0,
          totalFiles: 0,


          foundFiles: null,


          closeModal: closeModal,
          okModal: closeModal,
          startSearch: startSearch
        });

    }

})();