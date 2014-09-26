angular.module('leagueApp').config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/dashboard');
	$stateProvider
		.state('dashboard', {
			url: '/dashboard',
			templateUrl: 'views/dash.html',
			controller: 'dashCtrl',
			resolve: {
				leagues: function(rest) {
					return rest.leagues.getList();
				}
			}
		});
});

