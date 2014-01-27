'use strict';

/* Controllers */

function MainCtrl($scope) {
}

function updateAccountFromCookie($scope, $cookieStore){
  $scope.Account = Object;
  $scope.Account.firstname = $cookieStore.get("firstname");
  $scope.Account.lastname = $cookieStore.get("lastname");
  $scope.Account.isLoggedOn = $cookieStore.get("key");
  $scope.Account.id = $cookieStore.get("accountId");  
}


function RegisterCtrl($scope, $cookieStore, $location, $http, Authenticate, Accounts){
  $scope.errorMsg = [];
  var foundError = false;
  $scope.isAccountCreated = false;
  $scope.shouldCreateAccount =false;
  $scope.addUser = function(userInfo){

    if(userInfo.password != userInfo.passwordDigest){
      $scope.accountNotCreated = true;
      $scope.errorMsg.push("Wachtwoorden zijn niet gelijk aan elkaar");
      foundError = true;
    }
    if(userInfo.salutation.length < 2){
      $scope.accountNotCreated = true;
      $scope.errorMsg.push("U moet een aanhef invullen");
      foundError = true; 
    }
    if(!foundError){
      var jsonAccount = {};
      jsonAccount.apiUser = false;
      jsonAccount.email = userInfo.email;
      jsonAccount.locations = [{value: "plaatsnaam", type:"Groningen"}];
      jsonAccount.lastname = userInfo.lastname;
      jsonAccount.active = true;
      jsonAccount.firstname = userInfo.firstname;
      jsonAccount.salutation = userInfo.salutation;
      jsonAccount.password = userInfo.password;
      Accounts.post(jsonAccount,function(result){
        $scope.isAccountCreated = true;
        $scope.shouldCreateAccount =  true;   

        var data ={email: userInfo.email, password: userInfo.password};
        $scope.loggedIn =  Authenticate.post(data, function(result){
          $cookieStore.put("authorization","Basic " + window.btoa(userInfo.email +":"+ userInfo.password));
          $http.defaults.headers.common.Authorization = $cookieStore.get("authorization");
          $cookieStore.put("key","true");
          $cookieStore.put("accountId",result.id);
          $cookieStore.put("firstname",result.person.firstname);
          $cookieStore.put("lastname",result.person.lastname);
          updateAccountFromCookie($scope, $cookieStore);
          $location.path('/');
        });
      });
    }
  }
}


function ProductCtrl($scope, $cookieStore, $routeParams, Products) {
	
	$scope.currentShoppingListId = $routeParams.shoppinglistId;
	
	if($routeParams.shoppinglistId != null){
		$scope.hasCurrentShoppingList = true;
	} else {
		$scope.hasCurrentShoppingList = false;
	}
	
	$scope.callToAddToProductList = function(product){
		$scope.aProductHasBeenAdded = true;
		$scope.productThatJustHasBeenAdded = product;
		Products.addProductToList(product);
	};
	
	$scope.productList = {
		items: [{
			barcode: "1234162342",
			name: "Appel",
			price: 0.50			
		}, {
			barcode: "1643541231",
			name: "Brood",
			price: 2.50		
		},{
			barcode: "4034520940",
			name: "Eieren",
			price: 0.99
		},{
			barcode: "3643623412",
			name: "Boter",
			price: 1.99
		}]
	}
	
}

function ShoppinglistCtrl($scope, $cookieStore, $routeParams, Products, ShoppingLists) {
	
	$scope.currentListId = $routeParams.shoppinglistId;
	$scope.myShoppingLists = ShoppingLists.giveMeMyShoppingLists();
	
	$scope.callSendCurrentListToProducts = function(){
		 // empty current shared list in products
		Products.emptyCurrentList();
		/*// find current shopping list to send to products
		for(var i=0;i<$scope.myShoppingLists.lists.length;i++){
			if($scope.myShoppingLists.lists[i].id == $scope.currentListId){
				// for each item in the current shopping list, add that item
				for(var j=0;j<$scope.myShoppingLists.lists[i].items.length;j++){
					console.log("adding " + $scope.myShoppingLists.lists[i].items[j].amount + " " + $scope.myShoppingLists.lists[i].items[j].name + " to list in products.");
					Products.addProductToList($scope.myShoppingLists.lists[i].items[j]);
				}
			}		
		} */
	}
	
	$scope.getCurrentShoppinglistName = function(){
		for(var i=0;i<$scope.myShoppingLists.lists.length;i++){
			if($scope.myShoppingLists.lists[i].id == $scope.currentListId){
				return $scope.myShoppingLists.lists[i].name;
			}		
		}
		return "Onbekende lijst";
	}
	
	$scope.getThisShoppinglistTotal = function(shoppinglistId){
		var total = 0;
		for(var z=0;z<$scope.myShoppingLists.lists.length;z++){
			if(shoppinglistId == $scope.myShoppingLists.lists[z].id){
				for(var i=0;i<$scope.myShoppingLists.lists[z].items.length;i++){
					total += ($scope.myShoppingLists.lists[z].items[i].amount * $scope.myShoppingLists.lists[z].items[i].price);
				}
				return total;
			}
		}
		
	}

	$scope.addOne = function(barcode){
		for(var z=0;z<$scope.myShoppingLists.lists.length;z++){
			if($scope.currentListId == $scope.myShoppingLists.lists[z].id){
				for(var i=0;i<$scope.myShoppingLists.lists[z].items.length;i++){
					if($scope.myShoppingLists.lists[z].items[i].barcode == barcode){
						$scope.myShoppingLists.lists[z].items[i].amount++;
					}
				}
			}
		}
	}
	
	$scope.removeOne = function(barcode){
		for(var z=0;z<$scope.myShoppingLists.lists.length;z++){
			if($scope.currentListId == $scope.myShoppingLists.lists[z].id){
				for(var i=0;i<$scope.myShoppingLists.lists[z].items.length;i++){
					if($scope.myShoppingLists.lists[z].items[i].barcode == barcode && $scope.myShoppingLists.lists[z].items[i].amount > 0){
						$scope.myShoppingLists.lists[z].items[i].amount--;
					}
				}
			}
		}
	}
	
	$scope.removeAll = function(barcode){
		for(var z=0;z<$scope.myShoppingLists.lists.length;z++){
			if($scope.currentListId == $scope.myShoppingLists.lists[z].id){
				for(var i=0;i<$scope.myShoppingLists.lists[z].items.length;i++){
					if($scope.myShoppingLists.lists[z].items[i].barcode == barcode){
						$scope.myShoppingLists.lists[z].items.splice(i, 1);
					}
				}
			}
		}
	}
	
	$scope.deleteThisList = function(listId){
		ShoppingLists.deleteList(listId);
	}
	
	$scope.updateCurrentList = function(){
		// find right list
		for(var i=0;i<$scope.myShoppingLists.lists.length;i++){
			if($scope.myShoppingLists.lists[i].id == $scope.currentListId){
				// loop through new products
				for(var j=0;j<Products.getProducts().newItems.length;j++){
					// loop through current items to see if they match
					var itemID=-1;
					for(var k=0;k<=$scope.myShoppingLists.lists[i].items.length;k++){
						if(k==$scope.myShoppingLists.lists[i].items.length) {
							// if same item, add new amount to old amount
							if(itemID!=-1){
								var temp = parseInt(Products.getProducts().newItems[j].amount);
								var temp2 = parseInt($scope.myShoppingLists.lists[i].items[itemID].amount);
								var temp3 = temp + temp2;
								$scope.myShoppingLists.lists[i].items[itemID].amount = temp3;
							// else add new item (newItems[j] should have all the information) to list
							} else {
								$scope.myShoppingLists.lists[i].items.push(Products.getProducts().newItems[j]);
							}
							break;
						} else {
							if(Products.getProducts().newItems[j].barcode == $scope.myShoppingLists.lists[i].items[k].barcode) {
								itemID=k;
							}
						}
					}
				}
				$scope.shoppingList = $scope.myShoppingLists.lists[i];
			}
		}
	}
	
	if(Products.getFirstPageLoad()){
		$scope.updateCurrentList();
	}
	
	$scope.open = function () {
    $scope.shouldBeOpen = true;
  };

  $scope.close = function () {
    $scope.shouldBeOpen = false;
  };

  $scope.opts = {
    backdropFade: true,
    dialogFade:true
  };
	
	$scope.createShoppingList = function(name){
		ShoppingLists.createList(name);
		$scope.close();
		$scope.myShoppingLists = ShoppingLists.giveMeMyShoppingLists();
	}
	
}

function LoginCtrl($scope, $cookieStore,$http,$location,Authenticate) {

	$scope.isLoggedOn = false;
	$scope.name = "Klant A";

  if($cookieStore.get("authorization")!= undefined){
    $http.defaults.headers.common.Authorization = $cookieStore.get("authorization");
  }else{
    $cookieStore.put("authorization","Basic ");
    $http.defaults.headers.common.Authorization = $cookieStore.get("authorization");
  }
  $scope.Account = {};
  $scope.removeCookie = function(){
    $cookieStore.remove("compareList");
  }
  updateAccountFromCookie($scope, $cookieStore);
  $scope.logOn = function (account) {
		
		$scope.isLoggedOn = true;
	
    var data ={email: account.email, password: account.password};
    $scope.loggedIn =  Authenticate.post(data, function(result){
      $cookieStore.put("authorization","Basic " + window.btoa(account.email.trim() +":"+ account.password.trim()));
      $http.defaults.headers.common.Authorization = $cookieStore.get("authorization");
      $cookieStore.put("key","true");
      $cookieStore.put("accountId",result.id);
      $cookieStore.put("firstname",result.person.firstname);
      $cookieStore.put("lastname",result.person.lastname);
      updateAccountFromCookie($scope, $cookieStore);
    });
  }


  $scope.doLogout= function() {
	
		$scope.isLoggedOn = false;
		
    $cookieStore.put("authorization", "Basic ");
    $http.defaults.headers.common.Authorization = $cookieStore.get("authorization");
    $cookieStore.remove("key");
    $cookieStore.remove("accountId");
    $cookieStore.remove("firstname");
    $cookieStore.remove("lastname");
    $cookieStore.remove("authorization");
    $cookieStore.remove("compareList");
    $scope.Account.isLoggedOn = $cookieStore.get("key");
    $location.path('/');
  }

}

