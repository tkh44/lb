angular.module('leagueApp').config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/login');
	$stateProvider
		.state('root', {
			url: '',
			abstract: true,
			views: {
				'header': {
					templateUrl: 'header/header.html',
					controller: 'headerCtrl as header'
				}
			}
			//resolve: {
			//	user: function(Rest) {
			//		return Rest.oneUrl('me', '/api/v1/users/me').get();
			//	}
			//}
		})
		.state('login', {
			url: '/login',
			templateUrl: 'login/login.html',
			controller: 'loginCtrl as login'
		})
		.state('dashboard', {
			url: '/dashboard',
			templateUrl: 'dashboard/dash.html',
			controller: 'dashCtrl as dash',
			resolve: {
				leagues: function(Rest) {
					return Rest.leagues.getList();
				},
				teams: function(Rest) {
					return Rest.teams.getList();
				}
			}
		});

	$stateProvider.state('createTeam', {
		url: '/create-team',
		templateUrl: 'team/create.html',
		controller: 'createTeamCtrl as createTeam',
		resolve: {
			leagues: function(Rest) {
				return Rest.leagues.getList();
			}
		}
	})
});

