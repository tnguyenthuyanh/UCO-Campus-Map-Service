window.onload = function () {
    const URL_PARAM = new URLSearchParams(window.location.search);
    const UID = URL_PARAM.get('session');

    firebase.auth().onAuthStateChanged(function (user) {
        if (UID == null || UID == '' || !user) {
            window.location = "signin.html";
        } else {
            _init(UID);
        }
    });

}

let getNameBox = document.getElementById('nameBox');
let updateNameButton = document.getElementById('updateName');

let getEmailBox = document.getElementById('emailBox');
let getNewEmailBox = document.getElementById('newEmailBox');
let getPasswordForEmailBox = document.getElementById('passForEmailBox');
let updateEmailButton = document.getElementById('changeEmail');
let showOldPasswordForEmailCheckBox = document.getElementById('showOldPasswordForEmail');

let getPasswordForChangeBox = document.getElementById('passwordForChangeBox');
let getNewPasswordForChangeBox = document.getElementById('newPasswordForChangeBox');
let showPasswordForChangeCheckBox = document.getElementById('showPasswordForChange');
let changePasswordButton = document.getElementById('changePassword');
let resetPasswordValueButton = document.getElementById('resetPasswordValueBox');

let getPasswordForDeletionBox = document.getElementById('passwordForDeletionBox');
let getConfirmPasswordBox = document.getElementById('confirmPasswordBox');
let showPasswordForDeletionCheckBox = document.getElementById('showPasswordForDeletion');
let deleteAccountButton = document.getElementById('deleteAccount');
let resetProfileValueButton = document.getElementById('resetProfileValueBox');

var oneUserProfile;


/** Initialize functions of the page when a user is found */
async function _init(UID) {
    var newEmail;
    var passwordForEmail;

    var passwordForChange;
    var newPasswordForChange;

    var passwordForDeletion;
    var confirmPassword;

    oneUserProfile = await _getUserProfile(UID);
    getNameBox.value = oneUserProfile.Name;
    getEmailBox.value = oneUserProfile.Email;

    /** Name Change */
    updateNameButton.onclick = function () {
        _updateName(UID, getNameBox.value);
    }

    /** Email Change */
    getNewEmailBox.oninput = function () {
        newEmail = String(getNewEmailBox.value);
    }
    getPasswordForEmailBox.oninput = function () {
        passwordForEmail = String(getPasswordForEmailBox.value);
    }
    showOldPasswordForEmailCheckBox.onclick = function () {
        getPasswordForEmailBox.type = _toggleShowPassword(getPasswordForEmailBox);
    }
    updateEmailButton.onclick = function () {
        _updateEmail(UID, newEmail, passwordForEmail);
    }
    resetProfileValueButton.onclick = function () {
        newEmail = '';
        passwordForEmail = '';
        getNewEmailBox.value = '';
        getPasswordForEmailBox.value = '';
    }

    /** Password Change */
    getPasswordForChangeBox.oninput = function () {
        passwordForChange = String(getPasswordForChangeBox.value);
    }
    getNewPasswordForChangeBox.oninput = function () {
        newPasswordForChange = String(getNewPasswordForChangeBox.value);
    }
    showPasswordForChangeCheckBox.onclick = function () {
        getPasswordForChangeBox.type = _toggleShowPassword(getPasswordForChangeBox);
        getNewPasswordForChangeBox.type = _toggleShowPassword(getNewPasswordForChangeBox);
    }
    changePasswordButton.onclick = function () {
        _updatePassword(passwordForChange, newPasswordForChange);
    }


    resetPasswordValueButton.onclick = function () {
        passwordForChange = '';
        newPasswordForChange = '';
        getPasswordForChangeBox.value = '';
        getNewPasswordForChangeBox.value = '';
    }

    /** Account deletion */
    getPasswordForDeletionBox.oninput = function () {
        passwordForDeletion = String(getPasswordForDeletionBox.value);
    }
    getConfirmPasswordBox.oninput = function () {
        confirmPassword = String(getConfirmPasswordBox.value);
    }
    showPasswordForDeletionCheckBox.onclick = function () {
        getPasswordForDeletionBox.type = _toggleShowPassword(getPasswordForDeletionBox);
        getConfirmPasswordBox.type = _toggleShowPassword(getConfirmPasswordBox);
    }
    deleteAccountButton.onclick = function () {
        _deleteAccount(passwordForDeletion, confirmPassword, UID);
    }

}

async function _updateName(UID, name) {
    if (!_validateName(name)) return;
    try {
        await updateProfileName(UID, name);
        alert("Name changed successfully!");
        oneUserProfile.Name = name;
    } catch (e) {
        alert("Update Error: " + e);
    }
}

async function _updateEmail(UID, newEmail, password) {
    if (!_validateEmail(newEmail)) return;
    if (!_validatePassword(password)) return;
    await updateUserEmail(UID, oneUserProfile.Email, newEmail, password);
}

async function _updatePassword(oldPassword, newPassword) {
    if (!_validatePassword(oldPassword)) return;
    if (!_validatePassword(newPassword)) return;
    if (oldPassword == newPassword) {
        alert("Choose a new password");
        return;
    }
    try {
        await updateUserPassword(oldPassword, newPassword);
    } catch (e) {
        alert("Wrong old password!" + e);
    }

}

async function _deleteAccount(password, confirmPassword, UID) {
    if (!_validatePassword(password)) return;
    if (!_validateConfirmPassword(password, confirmPassword)) return;
    await deleteUserAccount(confirmPassword, UID);
}

async function _getUserProfile(UID) {
    var userProfile;
    try {
        userProfile = await getOneProfile(UID);
    } catch (e) {
        alert(e);
    }
    return userProfile;
}

function _validateName(value) {
    if (value.length == 0) {
        alert("Enter your name");
        getNameBox.value = oneUserProfile.Name;
        return false;
    } else {
        return true;
    }
}

function _validateEmail(value) {
    if (value.length == 0 || !value.includes('.') || !value.includes('@')) {
        alert("Enter your new email");
        return false;
    } else {
        return true;
    }
}

function _validatePassword(value) {
    if (String(value).length == 0 || value == null) {
        alert("Enter password");
        return false;
    } else {
        return true;
    }
}

function _validateConfirmPassword(password, confirmPassword) {
    if (password != confirmPassword) {
        alert("Password and confirm password don't match");
        return false;
    } else {
        return true;
    }
}

function _toggleShowPassword(element) {
    if (element.type == "password") {
        return "text";
    } else {
        return "password";
    }
}