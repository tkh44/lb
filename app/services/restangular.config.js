angular.module('leagueApp')
	.config(function(RestangularProvider) {
		RestangularProvider.setBaseUrl('/api/v1');
		RestangularProvider.setRestangularFields({
			id: '_id'
		});
	})
	.run(function(Restangular, $window, $state) {
		Restangular.addFullRequestInterceptor((element, operation, what, url, headers, params, httpConfig) => {
			if ($window.sessionStorage.token) {
				headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
			}

			return {headers};
		});

		Restangular.addResponseInterceptor((data, operation, what, url, response, deferred) => {
			if (response.status === 401) {
				console.log('user is not authorized');
				$state.go('login');
			}

			return data;
		});


		Restangular.addElementTransformer('users', true, function(users) {
			users.addRestangularMethod('me', 'get', 'me');
			return users;
		});
	})
	.service('Rest', function(Restangular) {
		this.all = Restangular.all;
		this.one = Restangular.one;
		this.oneUrl = Restangular.oneUrl;
		this.allUrl = Restangular.allUrl;
		this.copy = Restangular.copy;
		this.withConfig = Restangular.withConfig;
		this.several = Restangular.several;
		this.strip = Restangular.stripRestangular;
		this.createElement = Restangular.restangularizeElement;
		this.restangularizeCollection = Restangular.restangularizeCollection;


		this.users = Restangular.service('users');
		this.leagues = Restangular.service('leagues');
		this.games = Restangular.service('games');
		this.teams = Restangular.service('teams');
	});