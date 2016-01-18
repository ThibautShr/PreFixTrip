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

app.controller('MainCtrl',function($rootScope, $http){
	
	$rootScope.check_login = function(){		
		var reg_mail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		if(reg_mail.test($rootScope.mail_field_login)){			
			$http.post('auth/local', {
				email: $rootScope.mail_field_login,
				password: $rootScope.password_field_login
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
							$scope.session_inactive();
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

	$rootScope.makeAccount = function(){
		if($rootScope.mail_field_registration != undefined &&
		   $rootScope.password_field_registration != undefined &&
		   $rootScope.confirm_password_field_registration != undefined ){
			if($rootScope.password_field_registration == $rootScope.confirm_password_field_registration){ 
				new_user = {'email': $rootScope.mail_field_registration,
							'password' : $rootScope.password_field_registration};
				
				//make account
				$http.post('api/users/', new_user).
				success(function(data) {
					//sign in
					$rootScope.mail_field_login = $rootScope.mail_field_registration;
					$rootScope.password_field_login = $rootScope.password_field_registration;
					$rootScope.check_login();
				}).
				error(function(resultat, statut, erreur){
					if(statut == "401")
						$scope.session_inactive();
					alert(JSON.stringify(resultat,null,4));
					alert(statut);
					alert(erreur);
				}.bind(this));
			}
			else
				alert('Erreur - Confirmation du mot de passe !');
		}
		else
			alert('Erreur - Formulaire incomplet');
	}
	
	$rootScope.initLoginRegistrattionForm = function(){
		$rootScope.mail_field_login = '';
		$rootScope.password_field_login = '';
		
		$rootScope.first_name_registration = '';
		$rootScope.last_name_registration = '';
		$rootScope.mail_field_registration = '';
		$rootScope.password_field_registration = '';
		$rootScope.confirm_password_field_registration = '';
	}

	//init forms
	$rootScope.initLoginRegistrattionForm();

});

/* =================================================================== */
/* ========================= HOME CONTROLLER ========================= */
/* =================================================================== */

app.controller('HomeCtrl', function($scope, $http){	

	$scope.session_inactive = function(){
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
					$scope.session_inactive();
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
						$scope.session_inactive();
					alert(statut);
					alert(JSON.stringify(resultat,null,4));
				}.bind(this));
		}
		else
			alert('Veuillez indiquer le nom du groupe !');
	}
});
