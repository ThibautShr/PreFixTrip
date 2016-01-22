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
	
	/*if(sessionStorage.token != undefined){
		//user connected
		$scope.user = JSON.parse(sessionStorage.user);
		//alert(sessionStorage.user);
		$scope.token = JSON.parse(sessionStorage.token);
		document.location.href = "home.html";
	}*/
	
	$scope.sessionInactive = function(){
		alert('Votre session à expiré, veulliez vous reconnecter !');
		document.location.href = "index.html";
	}

	$scope.makeFakeAccount = function(){
		$http.post('api/users/',{"pseudo": "titi",
								 "email": "titi@gmail.com",
								 "password" : "titi",
								 "paypal" : ""});
								 
		$http.post('api/users/',{"pseudo": "toto",
								 "email": "toto@gmail.com",
								 "password" : "toto",
								 "paypal" : ""});
								
		$http.post('api/users/',{"pseudo": "tutu",
								 "email": "tutu@gmail.com",
								 "password" : "tutu",
								 "paypal" : ""});	
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
									'password' : $scope.password_field_registration,
									'paypal' : ''};
						
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
		alert('Problème de session ! Vous devez vous connecter de nouveau !');
		document.location.href= "index.html";
	}
	
	//user connected
	$scope.user = JSON.parse(sessionStorage.user);
	//alert(sessionStorage.user);
	$scope.token = JSON.parse(sessionStorage.token);
	
	if($scope.token == undefined)
		document.location.href = "index.html";
		
	$scope.logOut = function(){
		sessionStorage.clear();
		document.location.href = "index.html";	
	}
	
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
	

	$scope.loadBills = function(){
		$http.get('api/bill/fromGroup/'+$scope.groups[$scope.indexCurrentGroup]['_id'],{ 
			headers: {'Authorization' : 'Bearer ' + $scope.token}}).
			success(function(data) {
				alert(JSON.stringify(data));
				$scope.bills = data;
				alert(JSON.stringify($scope.bills));
			}).
			error(function(resultat, statut, erreur){
				if(statut == "401")
					$scope.sessionInactive();
				alert(JSON.stringify(resultat,null,4));
			}.bind(this));	
	}

	$scope.clickBill = function(){
		$scope.page='bills.html';
		$scope.loadBills();
	}

	$scope.loadDebts = function(){
		$http.get('api/debt/fromUser/'+$scope.user['pseudo'],{ 
			headers: {'Authorization' : 'Bearer ' + $scope.token}}).
			success(function(data) {
				if(data.length>0){
					$scope.debts = data;
				}
			}).
			error(function(resultat, statut, erreur){
				if(statut == "401")
					$scope.sessionInactive();
				alert(JSON.stringify(resultat,null,4));
			}.bind(this));	
	}

	$scope.clickDebts = function(){
		$scope.page='debts.html';
		$scope.loadDebts();
		$scope.loadBills();
	}

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
									'role' : '',
									'paypal' : ''
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
	
	$scope.getAlreadyPayed = function(debt,bill){
		var payed = 0;
		for(var i=0; i<debt['transactions'].length; ++i){
			if(debt['transactions'][i]['bill_id'] == bill)
				payed += debt['transactions'][i]['amount'];	
		}
		
		return payed;
	}
	
	$scope.sum = function(arrayTransaction){
		var sum = 0;
		for(var i=0; i<arrayTransaction.length; ++i)
			sum += arrayTransaction[i]['amount'];
		return sum;
	}
	
	$scope.updateDebts = function(index){
		$http.put('api/debt/' + $scope.debts[index]['_id'],
		$scope.debts[index],
		{ headers: {'Authorization' : 'Bearer ' + $scope.token}}).
		error(function(resultat, statut, erreur){
			if(statut == "401")
				$scope.sessionInactive();
			alert(JSON.stringify(resultat,null,4));
		});
	}

	/*$scope.debts = [{
		'lender' : 'titi',
		'indebted' : 'toto',
		'amount' : 150,
		'transactions' : [],
		'list_bill_amount' : [
				{
				 'bill' : '0',
				 'amount' : 75
				},{
				 'bill' : '1',
				 'amount' : 75
				}
			]
	},{
		'lender' : 'toto',
		'indebted' : 'titi',
		'amount' : 150,
		'transactions' : [],
		'list_bill_amount' : [
				{
				 'bill' : '0',
				 'amount' : 75
				},{
				 'bill' : '1',
				 'amount' : 75
				}
			]
	}];*/

	$scope.debts = [];

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
	
	/*$scope.groupDebts = [{
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
	}];*/

	$scope.groupDebts = [];


	
	$scope.currentBill;
	
	$scope.fetchAmount = function(listAmount){
		for(var i=0; i<listAmount.length; ++i){
			if(listAmount[i]['bill_id'] == $scope.currentBill['_id'])
				return listAmount[i]['amount'];	
		}
	}
	
	$scope.showDebts = function(bill){
		$http.get('api/debt/search/' + bill['_id'],
		{ headers: {'Authorization' : 'Bearer ' + $scope.token}}).
		success(function(data){
			$scope.groupDebts = data;
			$scope.currentBill = bill;
			$scope.page = "groupDebts.html";
		}).
		error(function(resultat, statut, erreur){
			if(statut == "401")
				$scope.sessionInactive();
			alert(JSON.stringify(resultat,null,4));
		});
		
		//$scope.groupDebts = data;
		
		//$scope.currentBill = bill;
		//$scope.page = "groupDebts.html";
	}
	
	$scope.billPayedState = "";

	/*$scope.bills = [{
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
		'lenders' : [{
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
		'lenders' : [{
			'user' : 'tutu',
			'amount' : 200
			}],
		'group_owner_id' : '',
		'description' : 'Description du contexte !',
		'mode' : '',
		'date' : '18/01/2016',
		'linkedFiles' : [],
		'_id' : '1'
	}];*/

	$scope.bills = [];
		
});

/* =================================================================== */
/* ====================== ACCOUNT CONTROLLER ========================= */
/* =================================================================== */

app.controller('AccountController', function($scope, $http){

	$scope.newEmail = $scope.user['email'];
	$scope.newPaypal = $scope.user['paypal'];

	$scope.updateUser = function(){
			
		$scope.user['email'] = $scope.newEmail;
		$scope.user['paypal'] = $scope.newPaypal;	
		//delete $scope.user['_id'];
		$http.put('api/users/'+$scope.user['_id'],
			$scope.user,
			{headers: {'Authorization' : 'Bearer ' + $scope.token}}).
			success(function(data) {
				sessionStorage.user = $scope.user;
				alert('Enregistrement avec succès !');
			}).
			error(function(resultat, statut, erreur){
				if(statut == "401")
					$scope.sessionInactive();
				alert(JSON.stringify(resultat,null,4));
			}.bind(this));
	}
});

/* =================================================================== */
/* ========================= DEBTS CONTROLLER ======================== */
/* =================================================================== */

app.controller('DebtsController', function($scope, $http){
	
	/*
		$scope.debts = [{
		'lender' : 'titi',
		'indebted' : 'toto',
		'amount' : 150,
		'transactions' : [{
				 'bill' : '0',
				 'amount' : 15
				},{
				 'bill' : '0',
				 'amount' : 15
				}],
		'list_bill_amount' : [
				{
				 'bill' : '0',
				 'amount' : 75
				},{
				 'bill' : '1',
				 'amount' : 75
				}
			]
	}];
	*/
	
	$scope.getAmountTransactions = function(debt,bill){
		var amount = 0;
		for(var i=0; i<debt['transactions'].length; ++i){
			if(debt['transactions'][i]['bill'] == bill)
				amount += debt['transactions'][i]['amount'];	
		}
		return amount;
	}
	
	$scope.getTotalAmount = function(debt,bill){
		for(var i=0; i<debt['list_bill_amount'].length; ++i){
			if(debt['list_bill_amount'][i]['bill_id'] == bill)
				return debt['list_bill_amount'][i]['amount'];	
		}
	}
	
	$scope.addPayment = function(debt){
		if($scope.paymentAmount != undefined && $scope.paymentAmount != ""){

			$http.get('api/users/pseudo/' + debt['lender']).
			success(function(data) {
				if(data.length > 0) {
					
					var paypal = data[0]['paypal'];
					if(paypal != undefined && paypal != ""){
						var siteName = "PreFixTrip";
						var urlKO = "";
						var urlOK = "";
						document.location.href="https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business="+paypal+"&lc=FR&item_name="+siteName+"&no_shipping=1&amount="+$scope.paymentAmount+"&currency_code=EUR&cancel_return="+urlKO+"&return="+urlOK+"&cbt=Retour "+siteName+"&custom="+debt['_id'];
					}
					else
						alert(debt['lender'] + ' n\'a pas indiqué son compte PayPal !');
				}
				else
					alert(debt['lender']+' n\'exite plus !');
			}).
			error(function(resultat, statut, erreur){
				if(statut == "401")
					$scope.sessionInactive();
				alert(JSON.stringify(resultat,null,4));
			}.bind(this));

		}
		else
			alert('Le montant du versement est vide !');
	}

	$scope.signalizedPayment = function(debt){
		if($scope.paymentAmount != undefined && $scope.paymentAmount != ""){
			if(parseInt($scope.paymentAmount) + $scope.getAmountTransactions(debt,$scope.billSelected['bill_id']) > $scope.getTotalAmount(debt,$scope.billSelected['bill_id']))
				alert('le montant est trop grand !');
			else{
				for(var i=0; i<$scope.debts.length; ++i){
					if($scope.debts[i]['_id'] == debt['_id']){
						$scope.debts[i]['transactions'].push({'bill' : $scope.billSelected['bill_id'], 'amount' : parseInt($scope.paymentAmount)});
						$scope.updateDebts(i);
						return i;
					}
				}
			}
		}
		else
			alert('Le montant du versement est vide !');
	}
});

/* =================================================================== */
/* ===================== DASHBOARD CONTROLLER ======================== */
/* =================================================================== */

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

/* =================================================================== */
/* ========================= BILL CONTROLLER ========================= */
/* =================================================================== */

app.controller('billControl', function($scope, $http){	
$scope.bill = new Object()
var nbInBill=0

//$http.get("api/group/"+$scope.groups[$scope.indexCurrentGroup]._id,fuction(data){$scope.group=data});
var indebted =[]

    var amountLent
    var lendertmp
    var indebted
    $scope.nblendleft=0
   $scope.bill.lenders=[]
    $scope.bill.indebted=[]
    $scope.bill.amount=0
    $scope.subtotal=0
    $scope.left=0

    $scope.addLender=function(lendername,amountLent){
	if (amountLent>0){
	lender=new Object()
	lender.user=lendername
	lender.amount=amountLent
	lender.participate=1
	$scope.deleteLender(lender)
    	$scope.bill.amount=$scope.bill.amount+amountLent
	nbInBill=nbInBill+1
	deleteIndebtedPrivate(lender)
	$scope.bill.lenders.push(lender)
	console.log(lender)
	$scope.update($scope.bill)
	}
	else{
		alert("montant invalide")
	}
}


var fixaddIndebted=function(indebtedname,fixedAmount){

	if(fixedAmount>0.01 && fixedAmount<=$scope.left){
			indebt=new Object()
			indebt.user=indebtedname
			deleteIndebtedPrivate(indebt)
			indebt.amount=fixedAmount
			$scope.bill.indebted.push(indebt)
			nbInBill=nbInBill+1
			$scope.update($scope.bill)
	}
	else{
		alert("montant incorrect, il doit être d'au moins 1 centime et ne doit pas exceder la somme restante à rembourser") 
	}
}



var isLender=function(name){
	for(var i= 0; i < $scope.bill.lenders.length; i++)
		{
		if ($scope.bill.lenders[i].user==name){
			return true
		}
			
		}
	return false


}




var egaladdIndebted=function(indebtedname){
		if(!isLender(indebtedname)){
		indebt=new Object()
		nbInBill=nbInBill+1
		cleanlenders($scope.bill)
		indebt.user=indebtedname
		deleteIndebtedPrivateMinus(indebt)
		$scope.bill.indebted.push(indebt)
		$scope.update($scope.bill)
		}
}



$scope.addIndebted=function(indebtedname,fixedAmount){
	if($scope.bill.mode=="fix"){
		fixaddIndebted(indebtedname,fixedAmount)
	}
	if($scope.bill.mode=="egal"){
		egaladdIndebted(indebtedname)
	}
	
}

$scope.selfish=function(victim){
	if(victim.participate==1){
		victim.participate=0
		victim.part=0
		nbInBill=nbInBill-1
		
	}
	else{
		victim.participate=1
		nbInBill=nbInBill+1
	}
	$scope.update($scope.bill)
}

$scope.deleteIndebted=function(victim){
	var tmptab=[]
	for(var i= 0; i < $scope.bill.indebted.length; i++)
	{
	var tmp=$scope.bill.indebted[i]
	if(tmp.user!=victim.user){
		tmptab.push(tmp)
	}
	else{
		nbInBill=nbInBill-1	
	}
	}
	$scope.bill.indebted=tmptab
	$scope.update($scope.bill)
}

var deleteIndebtedPrivateMinus=function(victim){
	var tmptab=[]
	console.log($scope.bill.indebted.length)
	for(var i= 0; i < $scope.bill.indebted.length; i++)
	{
	var tmp=$scope.bill.indebted[i]
	console.log(victim.user)
	if(tmp.user!=victim.user){
		tmptab.push(tmp)
	}
	else{
		nbInBill=nbInBill-1	
	}
	}
	$scope.bill.indebted=tmptab
	
}

var deleteIndebtedPrivate=function(victim){
		var tmptab=[]
		for(var i= 0; i < $scope.bill.indebted.length; i++)
		{
		var tmp=$scope.bill.indebted[i]
		if(tmp.user!=victim.user){
			tmptab.push(tmp)
		}
		}
		$scope.bill.indebted=tmptab
}


$scope.deleteLender=function(victim){
		var tmptab=[]
		for(var i= 0; i < $scope.bill.lenders.length; i++)
		{
		var tmp=$scope.bill.lenders[i]
		if(tmp.user!=victim.user){
			tmptab.push(tmp)
		}
		else{
			if(victim.participate==1){
				nbInBill=nbInBill-1
			}
			$scope.bill.amount=$scope.bill.amount-tmp.amount		
		}
		}
		$scope.bill.lenders=tmptab
		$scope.update($scope.bill)
}  


var deleteLenderPrivate=function(victim){
		var tmptab=[]
		for(var i= 0; i < $scope.bill.lenders.length; i++)
		{
		var tmp=$scope.bill.lenders[i]
		if(tmp.user!=victim.user){
			tmptab.push(tmp)
		}
		else{
			$scope.bill.amount=$scope.bill.amount-tmp.amount		
		}
		}
		$scope.bill.lenders=tmptab
}  


	   

$scope.updateMode=function(){
	$scope.secondfield=$scope.bill.mode=="fix"
}




var cleanlenders=function(bill){
for(var i= 0; i < bill.lenders.length; i++)
	{
	    	tmp=bill.lenders[i]
		indebt=new Object()
		indebt.user=tmp.user
		deleteIndebtedPrivateMinus(indebt)
		
	}
}


var updateEgal=function(bill){
	var part=bill.amount
	if(nbInBill>0){
	 part=bill.amount/nbInBill
	}
     	var indebtedtmp = bill.indebted
	bill.indebted=[]
	for(var i= 0; i < indebtedtmp.length; i++)
	{
	    indebt=new Object()
	    indebt=indebtedtmp[i]
	    indebt.amount=part
	    deleteIndebtedPrivate(indebt)
	    bill.indebted.push(indebt)
	}
	for(var i= 0; i < bill.lenders.length; i++)
	{
	    tmp=bill.lenders[i]
	    if(tmp.participate==1){
		tmp.part=part
		if(tmp.amount<part){
		indebt=new Object()
		indebt.user=tmp.user
		indebt.amount=part-tmp.amount
		console.log(part)
		console.log("-")
		console.log(tmp.amount)
		deleteIndebtedPrivate(indebt)
		bill.indebted.push(indebt)
		}
	    }
	    else{
		indebt=new Object()
		indebt.user=tmp.user
		deleteIndebtedPrivate(indebt)
		}
	}
}


var updateFix=function(bill){
		var total=bill.amount
		var subTotal=0
		var participatingLenders=[]
		for(var i= 0; i < bill.lenders.length; i++)
		{
			indebt=new Object()
			indebt.user=bill.lenders[i].user
			if(bill.lenders[i].participate==1){
				participatingLenders.push(bill.lenders[i])
			}
			else{
				bill.lenders[i].part=0
				}
		}
		for(var i= 0; i < bill.indebted.length; i++)
		{
			subTotal=subTotal+bill.indebted[i].amount
		}
		$scope.nblendleft=participatingLenders.length
		$scope.subtotal=subTotal
		var leftover=total-subTotal
		$scope.left=leftover
		for(var i= 0; i < participatingLenders.length; i++){
			participatingLenders[i].part=leftover/participatingLenders.length
			if(participatingLenders[i].amount<participatingLenders[i].part){
					indebt.amount=participatingLenders[i].part-participatingLenders[i].amount
					bill.indebted.push(indebt)
				}
		}
}

$scope.update=function(bill){
     
    if(bill.mode=="egal"){
	updateEgal(bill)
    }

    if(bill.mode=="fix"){
	updateFix(bill)			
    }
}




var upDebt = function(bill){
	
	   
	//$http.get('api/debt/' + bill).success(function(data) {
	var toPay = 0;
	
	for(var j = 0; j < bill.lenders.length ; j++){
		if(bill.lenders[j].amount - bill.lenders[j].part > 0)
			toPay += bill.lenders[j].amount - bill.lenders[j].part;
	}
	
	if(toPay > 0 ){
		for(var k = 0; k < bill.lenders.length ; k++){
			if(bill.lenders[k].amount - bill.lenders[k].part > 0){
				var prorata = (bill.lenders[k].amount - bill.lenders[k].part)/toPay;
				for(var j = 0; j < bill.indebted.length ; j++){
					var amount = bill.indebted[j].amount * prorata;
					//$http.get("api/debt/btw/" + bill.lenders[k].user + "/" + bill.indebted[j].user ).success(function(debt) {
						var tmpDebt = {};
						/*if(debt.length > 0)
							tmpDebt = debt[0];*/

						tmpDebt.list_bill_amount = [{
							bill_id : bill._id,
							amount: amount
						}]
						
						//if(debt.length > 0){
							tmpDebt.amount = amount;	
							/*$http.put("api/debt/" + tmpDebt._id , tmpDebt, 
							{ headers: {'Authorization' : 'Bearer ' + $scope.token}}).
							success(function(data) {
								alert(JSON.stringify(data));
							});*/
						//}
						//else{
							console.log('k : ' + k);
							tmpDebt.lender = bill.lenders[k].user;
							tmpDebt.indebted = bill.indebted[j].user;
							$http.post("api/debt/" , tmpDebt, { headers: {'Authorization' : 'Bearer ' + $scope.token}}).
							success(function(data) {
								
								find = false;
								for(var i=0; i<$scope.groupDebts.length; ++i){
									if($scope.groupDebts[i]['_id'] == data['_id']){
										$scope.groupDebts[i] = data;
										find = true;
										if(data['lender'] == $scope.user['pseudo'] || data['indebted'] == $scope.user['pseudo']){
											for(var j=0; j<$scope.debts.length; ++j){
												if($scope.debts[j]['_id'] == data['_id']){
													$scope.debts[j] = data;
												}	
											}
										}
									}
								}
								if(!find){
									$scope.groupDebts.push(data);
									if(data['lender'] == $scope.user['pseudo'] || data['indebted'] == $scope.user['pseudo'])
										$scope.debts.push(data);
								}
								
							});
						//}
					//});
				}
			}
		}
	}
	
}


$scope.finish=function(bill){

	if(bill.amount>0){
		if(bill.mode=="fix"){
			if ($scope.nblendleft==0 && $scope.left!=0){
				alert("il manque "+$scope.left+"€ à rembourser")
				return
			}
		}
		$scope.update(bill)
		bill.group_owner_id = $scope.groups[$scope.indexCurrentGroup]['_id'];
		bill.payed = '0';

	    $http.post('api/bill/', bill,
	    	{ headers: {'Authorization' : 'Bearer ' + $scope.token}}).
			success(function(data) {
				upDebt(data);
				
				alert('Facture créée !');

			    $scope.amountProvided = ''
			    $scope.fixedAmount = ''
			    $scope.bill = new Object();
			}).
			error(function(resultat, statut, erreur){
				if(statut == "401")
					$scope.sessionInactive();
				alert(JSON.stringify(resultat,null,4));
				alert(statut);
			})

	}
	else{
		alert("Facture vide")
	}
}

});