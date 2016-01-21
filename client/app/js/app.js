/*global angular */
(function (ng) {
  'use strict';

  var app = ng.module('ngLoadScript', []);

  app.directive('script', function() {
    return {
      restrict: 'E',
      scope: false,
      link: function(scope, elem, attr) {
        if (attr.type === 'text/javascript-lazy') {
          var code = elem.text();
          var f = new Function(code);
          f();
        }
      }
    };
  });

}(angular));

var app = angular.module('PreFixTripApp', [ 'ngLoadScript']);

/* =================================================================== */
/* ========================= MAIN CONTROLLER ========================= */
/* =================================================================== */

app.controller('MainCtrl',function($scope, $http){
	
	$scope.sessionInactive = function(){
		alert('Votre session à expiré, veulliez vous reconnecter !');
		document.location.href = "index.html";
	}

	$scope.makeFakeAccount = function(){
		$http.post('api/users/',{"pseudo": "titi",
								 "email": "titi@gmail.com",
								 "password" : "titi"});
								 
		$http.post('api/users/',{"pseudo": "toto",
								 "email": "toto@gmail.com",
								 "password" : "toto"});
								
		$http.post('api/users/',{"pseudo": "tutu",
								 "email": "tutu@gmail.com",
								 "password" : "tutu"});	
	}
	
	$scope.makeFakeAccount();
	
	$scope.checkLogin = function(){		
		var reg_mail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		if(reg_mail.test($scope.email_field_login)){	
			$http.post('auth/local', {
				email: $scope.email_field_login,
				password: $scope.password_field_login
			}).
			success(function(data) {
				if(data['token'] != undefined){
					sessionStorage.token = JSON.stringify(data['token']);
					$http.get('api/users/me',{ 
					headers: {'Authorization' : 'Bearer ' + data['token']}}).
					success(function(data) {
						sessionStorage.user = JSON.stringify(data);
						document.location.href='home.html';
					}).
					error(function(resultat, statut, erreur){
						if(statut == "401")
							$scope.sessionInactive();
						alert(JSON.stringify(resultat,null,4));
					}.bind(this));
				}
				else
					show_error_mail_login();
			}).
			error(function(resultat, statut, erreur){
				alert('error');
				alert(JSON.stringify(resultat,null,4));
			}.bind(this));
		}
	}
	
	$scope.hideRegistrationFormError = function(){
		$scope.error_pseudo_registration = false;
		$scope.error_confirmation_registration = false;
		$scope.error_incomplete_form = false;	
	}

	$scope.makeAccount = function(){
		
		$scope.hideRegistrationFormError(); // Hide form error
		
		if($scope.pseudo_field_registration != undefined &&
		   $scope.email_field_registration != undefined &&
		   $scope.password_field_registration != undefined &&
		   $scope.confirm_password_field_registration != undefined ){ // If the form is completed
			   
			$http.get('api/users/pseudo/' + $scope.pseudo_field_registration).
			success(function(data) {
				if(data.length == 0){ // pseudo undefined
				
					if($scope.password_field_registration == $scope.confirm_password_field_registration){ // Password is equlal with the cofirmation
						new_user = {'pseudo': $scope.pseudo_field_registration,
									'email': $scope.email_field_registration,
									'password' : $scope.password_field_registration};
						
						//make account
						$http.post('api/users/', new_user).
						success(function(data) {
							//log in
							$scope.email_field_login = $scope.email_field_registration;
							$scope.password_field_login = $scope.password_field_registration;
							$scope.checkLogin();
						}).
						error(function(resultat, statut, erreur){
							if(statut == "401")
								$scope.sessionInactive();
							alert(JSON.stringify(resultat,null,4));
							alert(statut);
						}.bind(this));
					}
					else
						$scope.error_confirmation_registration = true; // show confirmation password error
				}
				else // pseudo already used
					$scope.error_pseudo_registration = true; // show pseudo already used error
			}).
			error(function(resultat, statut, erreur){
				alert(JSON.stringify(resultat,null,4));
			}.bind(this));
		}
		else
			$scope.error_incomplete_form = true; // show incomplete password error
	}
	
	$scope.initLoginRegistrattionForm = function(){
		$scope.email_field_login = 'titi@gmail.com';
		$scope.password_field_login = 'titi';
		
		$scope.pseudo_field_registration = '';
		$scope.email_field_registration = '';
		$scope.password_field_registration = '';
		$scope.confirm_password_field_registration = '';
	}

	//init forms
	$scope.initLoginRegistrattionForm();

});

/* =================================================================== */
/* ========================= HOME CONTROLLER ========================= */
/* =================================================================== */

app.controller('HomeCtrl', function($scope, $http){	

	$scope.sessionInactive = function(){
		alert('Votre session à expiré ! Vous devez vous connecter de nouveau !');
		document.location.href= "index.html";
	}
	
	//user connected
	$scope.user = JSON.parse(sessionStorage.user);
	//alert(sessionStorage.user);
	$scope.token = JSON.parse(sessionStorage.token);
	
	//stock the current page
	$scope.page = "";
	
	$scope.indexCurrentGroup = 0;
	
	$scope.groups = [];
	
	$scope.selectGroup = function(index){
		$scope.indexCurrentGroup = index;
		$scope.page = "users.html";
	}
	
	$scope.loadGroups = function(){
		$http.get('api/group/user/'+$scope.user['pseudo'],{ 
			headers: {'Authorization' : 'Bearer ' + $scope.token}}).
			success(function(data) {
				if(data.length>0){
					$scope.page = "users.html";
					$scope.groups = data;
				}
			}).
			error(function(resultat, statut, erreur){
				if(statut == "401")
					$scope.sessionInactive();
				alert(JSON.stringify(resultat,null,4));
			}.bind(this));	
	}
	$scope.loadGroups();
	
	$scope.rejoinGroup = function(){
		if($scope.newGroupName != undefined && $scope.newGroupPassword != undefined){
			//we are looking for the group with the good name
			$http.get('api/group/search/' + $scope.newGroupName,
				{headers: {'Authorization' : 'Bearer ' + $scope.token}}).
				success(function(data) {
					if(data.length > 0){ // if the group exist
					
						if(!$scope.existUserIntoGroup(data[0]['users'], $scope.user['pseudo'])){ // If the user is not in the group
						
							if(data[0]['password'] == $scope.newGroupPassword){// if the password is true
								data[0]['users'].push({ // We add the current user to the group 
									'pseudo' : $scope.user['pseudo'],
									'email' : $scope.user['email'],
									'role' : ''
								});
								$scope.groups.push(data[0]);
								$scope.indexCurrentGroup = $scope.groups.length - 1;
								$scope.updateGroup();
							}
							else
								alert('Erreur de mot de passe !');
						}
						else
							alert('Vous êtes déjà dans ce groupe !');
					}
					else
						alert('Groupe inconnu !');
				}).
				error(function(resultat, statut, erreur){
					if(statut == "401")
						$scope.sessionInactive();
					alert(statut);
					alert(JSON.stringify(resultat,null,4));
				}.bind(this));
		}
		else
			alert('Formulaire incomplet !');		
	}
	
	$scope.addGroup = function(){
		if($scope.newGroupName != undefined && $scope.newGroupPassword != undefined){
						
			$http.get('api/group/search/' + $scope.newGroupName, 
				{ headers: {'Authorization' : 'Bearer ' + $scope.token}}).
				success(function(data) {
					if(data.length == 0){ // if the name is not used
						var newGroup = {
							'name' : $scope.newGroupName,
							'password' : $scope.newGroupPassword,
							'users' : [
								{
								'pseudo' : $scope.user['pseudo'],
								'email' : $scope.user['email'],
								'role' : 'Créateur'
								}
							]
						};
						
						$http.post('api/group/',
							newGroup,{ 
							headers: {'Authorization' : 'Bearer ' + $scope.token}}).
							success(function(data) {
								//alert('success : ' + data);
								//alert(JSON.stringify(data));
								$scope.groups.push(data);
								$scope.newGroupName = undefined;
								$scope.newGroupPassword = undefined;
							}).
							error(function(resultat, statut, erreur){
								if(statut == "401")
									$scope.sessionInactive();
								alert(statut);
								alert(JSON.stringify(resultat,null,4));
							}.bind(this));
					}
					else
						alert('Un grouoe portant ce nom exite déjà !');
				}).
				error(function(resultat, statut, erreur){
					if(statut == "401")
						$scope.sessionInactive();
					alert(statut);
					alert(JSON.stringify(resultat,null,4));
				}.bind(this));				
		}
		else
			alert('Formulaire incomplet !');
	}
	
	/* =================== GROUP USER  ========================= */

	$scope.existUserIntoGroup = function(users, pseudo){
		for(var i=0; i<users.length; ++i){
			if(users[i]["pseudo"] == pseudo)
				return true;	
		}
		return false;
	}
	
	$scope.updateGroup = function(){
		$http.put('api/group/' + $scope.groups[$scope.indexCurrentGroup]['_id'],
		$scope.groups[$scope.indexCurrentGroup],
		{ headers: {'Authorization' : 'Bearer ' + $scope.token}}).
		error(function(resultat, statut, erreur){
			if(statut == "401")
				$scope.sessionInactive();
			alert(JSON.stringify(resultat,null,4));
		});
	}
	
	$scope.addUserIntoGroup = function(){
		if($scope.pseudoNewUser != undefined && $scope.pseudoNewUser != ""){
			if(!$scope.existUserIntoGroup($scope.groups[$scope.indexCurrentGroup]['users'],$scope.pseudoNewUser)){
				$http.get('api/users/search?pseudo=' + $scope.pseudoNewUser,{
				headers: {'Authorization' : 'Bearer ' + $scope.token}}).
				success(function(data) {
					if(data.length > 0){
						var newUser = { 'pseudo' : data[0]['pseudo'],
										'email' : data[0]['email'],
										'role' : '' };
						
						//$scope.groupUsers.push(newUser);
						$scope.groups[$scope.indexCurrentGroup]['users'].push(newUser);
						
						$scope.updateGroup();
						
						$scope.pseudoNewUser = "";
					}
					else
						alert('Utilisateur inconnu !');
				}).
				error(function(resultat, statut, erreur){
					if(statut == "401")
						$scope.sessionInactive();
					alert(JSON.stringify(resultat,null,4));
				}.bind(this));	
			}
			else
				alert('Cet utilisateur est déjà dans le groupe !');
		}
		else
			alert('Veuillez indiquer un nom !');
	}
	
	/* =================== GROUP BILLS  ========================= */
	
	$scope.getTitleBill = function(id){
		for(var i=0; i<$scope.bills.length; ++i){
			if($scope.bills[i]['_id'] == id)
				return 	$scope.bills[i]['title'];
		}
	}
	
	$scope.sum = function(array){
		var sum = 0;
		for(var i=0; i<array.length; ++i)
			sum += array[i];
		return sum;
	}
	
	$scope.updateDebts = function(index){
		$http.put('api/debs/' + $scope.debts[i]['_id'],
		$scope.debts[i],
		{ headers: {'Authorization' : 'Bearer ' + $scope.token}}).
		error(function(resultat, statut, erreur){
			if(statut == "401")
				$scope.sessionInactive();
			alert(JSON.stringify(resultat,null,4));
		});
	}

	$scope.debts = [{
		'lender' : 'titi',
		'indebted' : 'toto',
		'amount' : 75,
		'transactions' : [],
		'list_bill_amount' : [
				{'bill' : '0',
				 'amount' : 75}
			]
	}];

	$scope.initBillDebts = function(id){
		for(var i=0; i<$scope.debts.length; ++i){			
			$http.post('api/debs/',
			$scope.debts[i],
			{ headers: {'Authorization' : 'Bearer ' + $scope.token}}).
			error(function(resultat, statut, erreur){
				if(statut == "401")
					$scope.sessionInactive();
				alert(JSON.stringify(resultat,null,4));
			});	
		}
		
		for(var i=0; i<$scope.bills.length; ++i){			
			$http.post('api/bill/',
			$scope.bills[i],
			{ headers: {'Authorization' : 'Bearer ' + $scope.token}}).
			error(function(resultat, statut, erreur){
				if(statut == "401")
					$scope.sessionInactive();
				alert(JSON.stringify(resultat,null,4));
			});	
		}
	}
	
	$scope.groupDebts = [{
		'lender' : 'titi',
		'indebted' : 'toto',
		'amount' : 75,
		'transactions' : [],
		'list_bill_amount' : [
				{'bill' : '0',
				 'amount' : 75}
			]
	},{
		'lender' : 'tutu',
		'indebted' : 'toto',
		'amount' : 75,
		'transactions' : [],
		'list_bill_amount' : [
				{'bill' : '0',
				 'amount' : 75}
			]
	}];
	
	$scope.currentBill;
	
	$scope.fetchAmount = function(listAmount){
		for(var i=0; i<listAmount.length; ++i){
			if(listAmount[i]['bill'] == $scope.currentBill['_id'])
				return listAmount[i]['amount'];	
		}
	}
	
	$scope.showDebts = function(bill){
		/*$http.get('api/debs/search/' + bill['_id'],
		{ headers: {'Authorization' : 'Bearer ' + $scope.token}}).
		success(function(data){
			$scope.groupDebts = data;
			$scope.currentBill = bill;
			page = "groupDebts.html";
		}).
		error(function(resultat, statut, erreur){
			if(statut == "401")
				$scope.sessionInactive();
			alert(JSON.stringify(resultat,null,4));
		});*/
		
		//$scope.groupDebts = data;
		
		$scope.currentBill = bill;
		$scope.page = "groupDebts.html";
	}
	
	$scope.billPayedState = "";

	$scope.bills = [{
		'payed' : '1',
		'title' : 'Titre',
		'amount' : 1000,
		'indebted' : [{
			'user' : 'titi',
			'amount' : 75
			},{
			'user' : 'tutu',
			'amount' : 75
			}],
		'lender' : [{
			'user' : 'toto',
			'amount' : 150
			}],
		'group_owner_id' : '',
		'description' : 'Description du contexte !',
		'mode' : '',
		'date' : '18/01/2016',
		'linkedFiles' : [],
		'_id' : '0'
	},{
		'payed' : '1',
		'title' : 'Titre 2',
		'amount' : 1000,
		'indebted' : [{
			'user' : 'tata',
			'amount' : 100
			},{
			'user' : 'toto',
			'amount' : 100
			}],
		'lender' : [{
			'user' : 'tutu',
			'amount' : 200
			}],
		'group_owner_id' : '',
		'description' : 'Description du contexte !',
		'mode' : '',
		'date' : '18/01/2016',
		'linkedFiles' : [],
		'_id' : '1'
	}];
		
});

app.controller('DebtsController', function($scope, $http){
	
	$scope.addPayment = function(debt){
		if(parseInt($scope.paymentAmount) > (debt['amount'] - $scope.sum(debt['transactions'])))
			alert('le montant est trop grand !');
		else{
			for(var i=0; i<$scope.debts.length; ++i){
				if($scope.debts[i]['_id'] == debt['_id']){
					$scope.debts[i]['transactions'].push(parseInt($scope.paymentAmount));
					//$scope.updateDebts(i);
					return i;
				}
			}
		}
	}
});

app.controller('DashboardController', function($scope, $http){
	
	$scope.nbTransactionCreditedPayed = 0; 
	
	$scope.nbTransactionCreditingPayed = 0;
	
	$scope.nbTransactionCreditedNotPayed = 0;
	
	$scope.nbTransactionCreditingNotPayed = 0;
	
	$scope.amountPayed = 0;
	$scope.amountRefund = 0;
	$scope.amountToPayed = 0;
	
	$scope.loadDashboard = function(){
		for(var i=0; i<$scope.debts.length; ++i){
			var sumTransactions = $scope.sum($scope.debts[i]['transactions']);
			if($scope.debts[i]['lender'] == $scope.user['pseudo']){ // transaction crediting
				$scope.amountPayed += $scope.debts[i]['amount'];
				$scope.amountRefund += sumTransactions;
				if(sumTransactions == $scope.debts[i]['amount']) // payed
					$scope.nbTransactionCreditingPayed++;
				else // not payed
					$scope.nbTransactionCreditingNotPayed++;
			}
			else{ // transaction credited
				$scope.amountToPayed += $scope.debts[i]['amount'] - sumTransactions;
				if(sumTransactions == $scope.debts[i]['amount']) // payed
					$scope.nbTransactionCreditedPayed++;
				else // not payed
					$scope.nbTransactionCreditingNotPayed++;
			}
		}
	}
	
	$scope.loadDashboard();

});