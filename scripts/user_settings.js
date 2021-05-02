var password = document.getElementById("password")
	, confirm_password = document.getElementById("confirmPassword");
var email = document.getElementById("email")
	, confirm_email = document.getElementById("confirmEmail");

document.getElementById('signupLogo').src = "design_files/images/UCO_logo.png";
enableSubmitButton();

function validateEmail() {
	if (password.value != confirm_email.value) {
		confirm_email.setCustomValidity("Emails Don't Match");
		return false;
	} else {
		confirm_email.setCustomValidity('');
		return true;
	}
}
password.onchange = validateEmail;
confirm_password.onkeyup = validateEmail;

function validatePassword() {
	if (password.value != confirm_password.value) {
		confirm_password.setCustomValidity("Passwords Don't Match");
		return false;
	} else {
		confirm_password.setCustomValidity('');
		return true;
	}
}

password.onchange = validatePassword;
confirm_password.onkeyup = validatePassword;

function enableSubmitButton() {
	document.getElementById('submitButton').disabled = false;
	document.getElementById('loader').style.display = 'none';
}

function disableSubmitButton() {
	document.getElementById('submitButton').disabled = true;
	document.getElementById('loader').style.display = 'none';
}

function validateSignupForm() {
	var form = document.getElementById('signupForm');

	for (var i = 0; i < form.elements.length; i++) {
		if (form.elements[i].value === '' && form.elements[i].hasAttribute('required')) {
			console.log('There are some required fields!');
			return false;
		}
	}

	if (!validatePassword()) {
		return false;
	}

	if (!validateEmail()) {
		return false;
	}

	onSignup();
}

function onSignup() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {

		disableSubmitButton();

		if (this.readyState == 4 && this.status == 200) {
			enableSubmitButton();
		}
		else {
			console.log('AJAX call failed!');
			setTimeout(function () {
				enableSubmitButton();
			}, 1000);
		}

	};

	xhttp.open("GET", "ajax_info.txt", true);
	xhttp.send();
}