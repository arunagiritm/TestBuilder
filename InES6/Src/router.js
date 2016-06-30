export default function routing($urlRouterProvider,$locationProvider,$stateProvider){

	$locationProvider.html5Mode(true);
	// $urlRouterProvider.otherWise('/');
	$stateProvider
	.state('/',{
		url:'/',
		template:require('./main.html'),
		controller:'MainController',
		controllerAs:'vm'
	})

}
routing.$inject=['$urlRouterProvider','$locationProvider','$stateProvider'];
