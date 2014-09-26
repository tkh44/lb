angular.module('leagueApp')
	.controller('dashCtrl', function($scope, rest, leagues) {
		$scope.leagues = leagues;
		console.log($scope.leagues);
	});