class CreateTeamCtrl {
	constructor(Rest, leagues, $state) {
		this.Rest = Rest;
		this.$state = $state;
		this.leagues = leagues;
		this.team = {};
		this.team.league = {
			_id: _.first(leagues)._id || 0
		}
	}

	create() {
		this.Rest.teams.post(this.team).then((res) => {
			console.log(res);
			this.$state.go('dashboard');
		});
	}
}

angular.module('leagueApp').controller('CreateTeamCtrl', CreateTeamCtrl);