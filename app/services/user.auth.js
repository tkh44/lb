class UserAuth {
	constructor(Rest, $window) {
		this.Rest = Rest;
		this.$window = $window;
		this.user = $window.sessionStorage.user || {};
	}

	getUser() {
		return this.Rest.all('users').me((res) => {
			this.$window.sessionStorage.user = this.user = res;
		});
	}
}

angular.module('leagueApp').service('UserAuth', UserAuth);
