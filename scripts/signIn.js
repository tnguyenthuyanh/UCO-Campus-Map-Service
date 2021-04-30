// --------------- login handler ------------------ //

$("#btn-login").click(function () {

    var email = $("#email").val();
    var password = $("#password").val();

    if (email.length == 0 || !email.includes('@') || !email.includes('.')) {
        window.alert("Enter an email");
    } else if (password.length == 0) {
        window.alert("Enter password");
    } else {
        try {
            signIn(email, password);
        }
        catch (e) {
            alert(e);
        }

    }

});