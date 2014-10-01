class LoginCtrl {
	constructor($scope, $window, Rest, $state) {
		console.log('loginCtrl');
		this.Rest = Rest;
		this.$state = $state;
		this.$window = $window;
		this.user = {};
	}

	login() {
		this.Rest.oneUrl('auth', '/auth').customPOST(this.user).then((res) =>{
			this.$window.sessionStorage.token = res.token;
			console.log('authenticated');
			this.$state.go('dashboard');
		}, (err) => {
			delete this.$window.sessionStorage.token;
			console.log('Could not authenticate ', err);
		});
	}
}

angular.module('leagueApp').controller('loginCtrl', LoginCtrl);