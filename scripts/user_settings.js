// 

let user;

function validateSignupForm(event) {
	event.preventDefault();
	const { target } = event;
	const email = target.email.value;
	const confirmEmail = target.confirmEmail.value;
	const password = target.password.value;
	const newPassword = target.newPassword.value;
	const confirmPassword = target.confirmPassword.value;

	if (email !== confirmEmail) return alert("Confirm Email does not match!")
	if (newPassword !== confirmPassword) return alert("Confirm Passowrd does not match!")

	authDatabase.signInWithEmailAndPassword(user.email, password)
		.then(({ user }) => user.updateEmail(email))
		.then(_ => {
			return Promise.all[
				user.updatePassword(newPassword),
				cloudDatabase.doc(`users/${user.uid}`).set({
					Email: email,
				}, { merge: true })
			]
		})
		.then(_ => {
			target.reset();
			alert('Success')
		})
		.catch(err => alert(err.message))
}


const unsubscribeFromAuth = firebase.auth().onAuthStateChanged(currentUser => {
	if (!currentUser) return window.location.href = "/signin";
	user = currentUser;
})