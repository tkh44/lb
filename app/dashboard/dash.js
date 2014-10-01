class Dash {
	constructor($scope, Rest, leagues, teams) {
		this.leagues = leagues;
		this.teams = teams;
	}
}

angular.module('leagueApp').controller('dashCtrl', Dash);