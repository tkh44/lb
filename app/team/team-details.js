class TeamDetailsCtrl {
  constructor(Rest, team) {
    this.Rest = Rest;
    this.team = team;
    console.log('details.', team);
  }
}

angular.module('leagueApp').controller('TeamDetailsCtrl', TeamDetailsCtrl);