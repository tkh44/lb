angular.module('leagueApp')
	.config(function(RestangularProvider) {
		RestangularProvider.setBaseUrl('/api/v1');
		RestangularProvider.setRestangularFields({
			id: '_id'
		});
	}).service('rest', function(Restangular) {
		this.all = Restangular.all;
		this.one = Restangular.one;
		this.oneUrl = Restangular.oneUrl;
		this.allUrl = Restangular.allUrl;
		this.copy = Restangular.copy;
		this.withConfig = Restangular.withConfig;
		this.several = Restangular.several;
		this.strip = Restangular.stripRestangular;
		this.restangularizeElement = Restangular.restangularizeElement;
		this.restangularizeCollection = Restangular.restangularizeCollection;


		this.users = Restangular.service('users');
		this.leagues = Restangular.service('leagues');
		this.games = Restangular.service('games');
		this.teams = Restangular.service('teams');

	});