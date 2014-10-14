class Dash {
	constructor($scope, Rest, leagues) {
		this.leagues = leagues;
	}
}

angular.module('leagueApp').controller('dashCtrl', Dash);