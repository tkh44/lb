angular.module('leagueApp', [
	'restangular',
	'ui.router',
	'ui.bootstrap'
]);
angular.module('leagueApp').controller('appController', function($scope, $rootScope, $state) {
	$rootScope.go = $state.go.bind($state);
});