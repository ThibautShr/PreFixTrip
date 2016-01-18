'use strict';

$('#account_section').addClass('display-none');

function account(){
	$('#login_section').addClass('display-none');
	$('#account_section').removeClass('display-none');
}

function login(){
	$('#account_section').addClass('display-none');
	$('#login_section').removeClass('display-none');
}

/*function hideErrorMessage(){
	$('#error_mail_login').hide();
	$('#invalid_mail_login').hide();
	$('#error_password_login').hide();
	$('#error_mail_registration').hide();
	$('#error_confirmation_registration').hide();
}
hideErrorMessage();*/