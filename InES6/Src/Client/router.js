export default function routing($urlRouterProvider, $locationProvider, $stateProvider) {

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('/', {
            url: '/',
            template: require('./Partials/testBuilder.html'),
            controller: 'TestBuilderController',
            controllerAs: 'vm'
        })

}
routing.$inject = ['$urlRouterProvider', '$locationProvider', '$stateProvider'];