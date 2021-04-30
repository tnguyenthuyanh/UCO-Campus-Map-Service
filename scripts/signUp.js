// ----------------- sign Up Handler ----------------- //

document.getElementById('btn-signup').onclick = function () {
    let name = document.getElementById('sign_up_name').value;
    let email = document.getElementById('sign_up_email').value;
    let password = document.getElementById('sign_up_password').value;
    let c_password = document.getElementById('sign_up_confirmPassword').value;

    if (name.length == 0) {
        alert("Enter your name");
    } else if (email.length == 0 || !email.includes('.') || !email.includes('@')) {
        alert("Enter an email");
    } else if (password.length < 6) {
        alert("Password should be at least 6 characters long");
    } else if (password != c_password) {
        alert("Confirm password does not match");
    } else {
        signUp(email, password, name);
    }
}

function resetForm() {
    name = '';
    email = '';
    password = '';
    c_password = '';
}