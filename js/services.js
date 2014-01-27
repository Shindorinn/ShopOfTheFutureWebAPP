'use strict';

/* Services */

angular.module('Service', ['ngResource', 'ngCookies' ,'ui.bootstrap'])
	
	  // Login
  .factory('Authenticate', function($resource){
    return $resource(apiIpAddress + '\\:' + apiPort + '/authenticate', 
      {}, 
      {post: {method:'POST', headers: {'Content-Type': 'application/json'}}});
  })
	
	// Account
  .factory('Accounts', function($resource){
    return $resource(apiIpAddress + '\\:' + apiPort + '/accounts',
      {},
      {post: {method:'POST', headers: {'Content-Type': 'application/json'}},
    });
  })

  // AccountEntities
  // AccountInfo
  .factory('Account', function($resource){
    return $resource(apiIpAddress + '\\:' + apiPort + '/accounts/:accountId',
      {},
      {get: {method:'GET', params:{accountId:'accountId'}}
    });
  })
	
	.service('Products', function() {
		
		var firstLoad = false;
		
		var productList = {
			items: [],
			newItems: []
		};
		
		this.getProducts = function(){
			return productList;
		};
		this.addProductToList = function(product) {
			console.log(product);
			productList.newItems.push(product);
		};
		this.emptyCurrentList = function(){
			productList.items = [];
			productList.newItems = [];
		};
		this.getFirstPageLoad = function(){
			if(firstLoad){
				firstLoad = false;
				return firstLoad;
			} else {
				firstLoad = true;
				return firstLoad;
			}
		}
	})
	
	.service('ShoppingLists', function() {
		
		var myShoppingLists = {
			lists: [{
				id: 1,
				name: "Boodschappenlijstje voor dinsdag",
				items: [{
					amount: 2,
					barcode: "1234162342",
					name: "Appel",
					price: 0.50			
				}, {
					amount: 5,
					barcode: "1643541231",
					name: "Brood",
					price: 2.50			
				}]
			},{
				id: 2,
				name: "Dat andere lijstje..",
				items: [{		
					amount: 23,
					barcode: "1234162342",
					name: "Appel",
					price: 0.50			
				}, {
					amount: 10,
					barcode: "1643541231",
					name: "Brood",
					price: 2.50			
				}, {
					amount: 6,
					barcode: "1246234231",
					name: "Kaas",
					price: 1.50			
				}]
			}]
		};
		
		this.createList = function(inputName){
			var jsonThing = {
				id: (myShoppingLists.lists[myShoppingLists.lists.length-1].id+1),
				name: inputName,
				items: []
			}
			myShoppingLists.lists.push(jsonThing);
			console.log(myShoppingLists);
		}
		
		this.giveMeMyShoppingLists = function() {
			return myShoppingLists;
		};
		
		this.deleteList = function(listId){
			for(var i=0;i<myShoppingLists.lists.length;i++){
				if(myShoppingLists.lists[i].id == listId){
					myShoppingLists.lists.splice(i, 1);
					break;
				}
			}
		}
		
	})
;
