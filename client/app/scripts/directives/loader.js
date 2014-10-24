(function() {
	'use strict';

	angular
		.module('app')
		.directive('agsLoader', agsLoader);

	function agsLoader() {
		var directive = {
			transclude: true,
			templateUrl: 'scripts/directives/tpl/agsLoader.html',
			restrict: 'EA'
		};
		return directive;

		/////////////////
		
		function link(scope, element, attrs) {

		}

	};
})();