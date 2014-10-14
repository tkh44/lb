angular.module('leagueApp').directive('teamList', teamList);

function teamList(Rest, $state) {
  return {
    restrict: 'EA',
    templateUrl: 'team/team-list.directive.html',
    controller: controller,
    controllerAs: 'tl'
  };

  function controller($scope) {
    let tl = this;
    tl.teams = [];
    tl.loading = true;

    Rest.teams.getList().then((res) => {
      tl.teams = res;
    }, (err) => {
      console.log("Could not load teams. ", err);
    }).finally(() => {
      tl.loading = false;
    });

    tl.getDetails = (id) => {
      $state.go('teams.details', {'teamId': id});
    }
  }
}