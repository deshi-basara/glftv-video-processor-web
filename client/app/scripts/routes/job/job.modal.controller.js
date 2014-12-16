(function () {

    'use strict';

    angular
        .module('app')
        .controller('JobModalCtrl', JobModalCtrl);

    JobModalCtrl.$inject = ['$modalInstance', 'JobService', '$timeout', '$rootScope', 'SweetAlert'];

    /**
     * Handles the job-modal view and all interactions
     */
    function JobModalCtrl($modalInstance, JobService, $timeout, $rootScope, SweetAlert) {
        var modal = this;

        /**
         * Closes the modal box.
         */
        function closeModal() {
          $modalInstance.dismiss('cancel');
        }

        /**
         * Marks all foundFiles as selected.
         */
        function selectAll() {
          // only select if there are foundFiles
          if(modal.foundFiles !== 0) {
            for(var i = 0; i < modal.foundFiles.length; i++) {
              modal.foundFiles[i].selected = true;
            }
          }
        }

        /**
         * Hands the searchString to the SearchService and initiates the
         * loading indicator and feedback.
         */
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
            SweetAlert.swal('Server-Fehler', error, 'error');
          });
        }

        /**
         * Closes the server-modal and sends all selected files to the
         * regular job-controller.
         */
        function okModal() {

          // only broadcast file, that were selected
          var selectedFiles = [];
          for (var i = 0; i < modal.foundFiles.length; i++) {
            // check wether the file is selected
            if(modal.foundFiles[i].selected === true) {
              // set missing attributes
              modal.foundFiles[i].status = 'Upload'; // no file is uploading, just for feedback

              // selected, push to array
              selectedFiles.push(modal.foundFiles[i]);
            }
          }

          // if something was selected, start the broadcast
          if(selectedFiles.length !== 0) {
            $rootScope.$broadcast('modal.server.selectedFiles', selectedFiles);
          }

          closeModal();
        }

        //////////////////////

        angular.extend(modal, {
          isSearching: false,
          searchString: null,
          selectedFiles: 0,
          totalFiles: 0,


          foundFiles: [],


          closeModal: closeModal,
          okModal: okModal,
          selectAll: selectAll,
          startSearch: startSearch
        });

        //////////////////////

        startSearch();

    }

})();
