class CreateTeam {
	constructor(Rest, leagues) {
		this.Rest = Rest;
		this.leagues = leagues;
		this.team = {};
	}

	create() {
		this.Rest.teams.post(this.team).then((res) => {
			console.log(res);

		});
	}
}

angular.module('leagueApp').controller('createTeamCtrl', CreateTeam);