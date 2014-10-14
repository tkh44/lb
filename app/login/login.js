class LoginCtrl {
  constructor($scope, $window, Rest, UserAuth, $state) {
    console.log('loginCtrl');
    this.Rest = Rest;
    this.UserAuth = UserAuth;
    this.$state = $state;
    this.$window = $window;
    this.user = {};
  }

  login() {
    this.Rest.oneUrl('auth', '/auth').customPOST(this.user).then((res) => {
      this.$window.sessionStorage.token = res.token;

      this.UserAuth.getUser().then((res) => {
        this.$state.go('dashboard');
      });
    }, (err) => {
      delete this.$window.sessionStorage.token;
      console.log('Could not authenticate ', err);
    });
  }
}

angular.module('leagueApp').controller('loginCtrl', LoginCtrl);