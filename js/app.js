'use strict';

/* App Module */
angular.module('SotF', ['Service', 'Directive']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    /* when('/zoeken', {templateUrl: 'partials/search.html', controller: SearchFindCtrl}).
    when('/vergelijk/apparaten', {templateUrl: 'partials/compare/equation.html', controller: CompareGraphCtrl}).
    when('/account/apparaten', {templateUrl: 'partials/account/entities.html', controller: AccountEntityCtrl}).
    when('/apparaten/:entityId', {templateUrl: 'partials/entity.html',   controller: EntityCtrl}).
    when('/apparaten', {templateUrl: 'partials/entities.html', controller: EntitiesListCtrl}). 
    when('/test', {templateUrl: 'partials/test.html', controller: TestHighchartsCtrl}).
    
    when('/projecten/:projectId', {templateUrl: 'partials/project.html', controller: ProjectCtrl}).
    when('/projecten', {templateUrl: 'partials/projecten.html', controller: ProjectListCtrl}).
    when('/vergelijk_projecten', {templateUrl: 'partials/vergelijk_projecten.html', controller: CompareProjectsCtrl}). */
    when('/over',{templateUrl: 'partials/about.html'}).
		when('/products',{templateUrl: 'partials/products.html', controller: ProductCtrl}).
		when('/products/:shoppinglistId',{templateUrl: 'partials/products.html', controller: ProductCtrl}).
		when('/myshoppinglists',{templateUrl: 'partials/myshoppinglists.html', controller: ShoppinglistCtrl}).
		when('/shoppinglist/:shoppinglistId', {templateUrl: 'partials/shoppinglist.html',   controller: ShoppinglistCtrl}).
		when('/registreren', {templateUrl:'partials/register.html', controller: RegisterCtrl}).
	
      
    when('/', {templateUrl: 'partials/main.html', controller: MainCtrl}).
    otherwise({redirectTo: '/'});
}]);