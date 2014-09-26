angular.module('leagueApp', [
	'restangular',
	'ui.router'
]);
angular.module('leagueApp').controller('appController', function($scope) {
	$scope.message = 'df';

	var a = () => 'b';
	console.log(a());
});