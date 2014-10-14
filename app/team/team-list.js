class TeamListCtrl {
	constructor(Rest, teams) {
		this.Rest = Rest;
		this.teams = teams;
		console.log(teams);
	}
}

angular.module('leagueApp').controller('TeamListCtrl', TeamListCtrl);