class Header {
  constructor($scope, Rest, UserAuth) {
    this.Rest = Rest;
    this.UserAuth = UserAuth;
    this.user = UserAuth.user || {};

    if (this.user) {
      this.authenticated = true;
    } else {
      UserAuth.getUser().then((res) => {
        this.authenticated = true;
        this.user = res;
      }, (err) => {
        this.authenticated = false;
      });
    }
  }
}

angular.module('leagueApp').controller('headerCtrl', Header);