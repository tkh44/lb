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
				}
			}
		});


	$stateProvider
		.state('teams', {
			abstract: true,
			url: '/teams',
			templateUrl: 'team/team-main.html'
		})
		.state('teams.list', {
			url: '',
			templateUrl: 'team/team-list.html',
			controller: 'TeamListCtrl as teams',
			resolve: {
				teams: (Rest) => {
					return Rest.teams.getList();
				}
			}
		})
		.state('teams.create', {
			url: '/create',
			templateUrl: 'team/create-team.html',
			controller: 'CreateTeamCtrl as create',
			resolve: {
				leagues: function(Rest) {
					return Rest.leagues.getList();
				}
			}
		})
		.state('teams.details', {
			url: '/details/:teamId',
			templateUrl: 'team/team-details.html',
			controller: 'TeamDetailsCtrl as details',
			resolve: {
				team: (Rest, $stateParams) => {
					return Rest.teams.one($stateParams.teamId).get();
				}
			}
		})
});

