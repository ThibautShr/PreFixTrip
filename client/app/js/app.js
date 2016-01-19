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
	
	$scope.checkLogin = function(){		
		var reg_mail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		if(reg_mail.test($scope.email_field_login)){	
			$http.post('auth/local', {
				pseudo: $scope.pseudo_field_login,
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
				alert(JSON.stringify(data,null,4));
				if(data.length == 0){ // pseudo undefined
				
					if($scope.password_field_registration == $scope.confirm_password_field_registration){ // Password is equlal with the cofirmation
						new_user = {'pseudo': $scope.pseudo_field_registration,
									'email': $scope.email_field_registration,
									'password' : $scope.password_field_registration};
						
						alert(JSON.stringify(new_user));
						
						//make account
						$http.post('api/users/', new_user).
						success(function(data) {
							//log in
							alert('success');
							alert(JSON.stringify(data));
							$scope.email_field_login = $scope.email_field_registration;
							$scope.password_field_login = $scope.password_field_registration;
							$scope.checkLogin();
						}).
						error(function(resultat, statut, erreur){
							if(statut == "401")
								$scope.sessionInactive();
							alert(JSON.stringify(resultat,null,4));
							alert(statut);
							alert(erreur);
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
		$scope.mail_field_login = '';
		$scope.password_field_login = '';
		
		$scope.pseudo_field_registration = 'titi';
		$scope.email_field_registration = 'titi@titi.com';
		$scope.password_field_registration = 'titi';
		$scope.confirm_password_field_registration = 'titi';
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
	
	$scope.groups = [];
	
	$scope.loadGroups = function(){
		$http.get('api/group/user/'+$scope.user['_id'],{ 
			headers: {'Authorization' : 'Bearer ' + $scope.token}}).
			success(function(data) {
				$scope.groups = data;
			}).
			error(function(resultat, statut, erreur){
				if(statut == "401")
					$scope.sessionInactive();
				alert(JSON.stringify(resultat,null,4));
			}.bind(this));	
	}
	$scope.loadGroups();
	
	$scope.addGroup = function(){
		if($scope.newGroupName != undefined){
			var newGroup = {
				'name' : $scope.newGroupName,
				'users' : [
					{
					'_id' : $scope.user['_id']
					}
				]
			};
			
			//alert(JSON.stringify(newGroup));
			
			$http.post('api/group/',
				newGroup,{ 
				headers: {'Authorization' : 'Bearer ' + $scope.token}}).
				success(function(data) {
					//alert('success : ' + data);
					//alert(JSON.stringify(data));
					$scope.groups.push(data);
					$scope.newGroupName = undefined;
				}).
				error(function(resultat, statut, erreur){
					if(statut == "401")
						$scope.sessionInactive();
					alert(statut);
					alert(JSON.stringify(resultat,null,4));
				}.bind(this));
		}
		else
			alert('Veuillez indiquer le nom du groupe !');
	}
});
