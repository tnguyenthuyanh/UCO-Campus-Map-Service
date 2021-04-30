//-------------------------------- Configuration for FirebaseFirestore --------------------------------//

const firebaseConfig = {
    apiKey: "AIzaSyDJ4SVerZgGodKbClc3xRSgFNVDpPMslPg",
    authDomain: "uco-cms.firebaseapp.com",
    projectId: "uco-cms",
    storageBucket: "uco-cms.appspot.com",
    messagingSenderId: "318740561508",
    appId: "1:318740561508:web:6c29f6a5a80d4262cf6971",
    measurementId: "G-M1E63ZQ6DM"
};

firebase.initializeApp(firebaseConfig);

let cloudDatabase = firebase.firestore();
let authDatabase = firebase.auth();

// Add buidling
async function addBuildingWithID(oneBuilding) { // Use custom ID for doc
    await cloudDatabase.collection("UCOBuildings")
        .doc(oneBuilding.BuildingCode)
        .set(oneBuilding);
}

// Add stairs
async function addStairs(stairsLocation) { // Use custom ID for doc
    cloudDatabase.collection("Stairs").add(stairsLocation);
}

async function getAllStairs() {
    const snapShot = await cloudDatabase.collection('Stairs').get();
    return snapShot.docs.map(doc => doc.data());
}

// Retrieve building
async function retrieveBuilding(bCode) {
    const snapshot = await cloudDatabase.collection("UCOBuildings")
        .where("BuildingCode", "==", bCode)
        .limit(1)
        .get();
    var data = snapshot.docs[0].data();
    let buildingData = {
        BuildingName: data.BuildingName,
        BuildingCode: data.BuildingCode,
        Latitude: data.Latitude,
        Longitude: data.Longitude,
    }
    return buildingData;

}

// Retrieve all buildings in collection "UCOBuildings"
async function retrieveAllBuilding() {
    const snapShot = await cloudDatabase.collection('UCOBuildings').get()
    return snapShot.docs.map(doc => doc.data());
}

// Retrieves all auto door from collection "Doors"
async function retrieveAllBuildingAutos() {
    const snapShot = await cloudDatabase.collection('Doors').get();
    return snapShot.docs.map(doc => doc.data());
}

// Update building
async function updateBuildingOfDoc(oneBuilding) {
    await cloudDatabase.collection("UCOBuildings")
        .doc(oneBuilding.BuildingCode)
        .update(oneBuilding);
}

// Delete building
async function deleteBuilding(bCode) {
    await cloudDatabase.collection("UCOBuildings")
        .doc(bCode)
        .delete();
}

// Add door
async function addDoorWithAutoID(oneDoor) { // Auto generate ID for doc
    await cloudDatabase.collection("Doors").add(oneDoor);
}

// FirebaseAuth
firebase.auth.Auth.Persistence.LOCAL;

function signIn(email, password) {
    var result = authDatabase.signInWithEmailAndPassword(email, password)
        .then(function (data) {
            // console.log(data.user.uid);
            if (data.user.uid.length != 0) {
                window.location.href = "main.html?session=" + data.user.uid;
            }
        });
    result.catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        window.alert("Message : " + errorMessage);
    });
}

function signOut() {
    authDatabase.signOut().then(function () {
        // window.alert("Sign out Successfully");
        window.location.href = "signin.html";
    }).catch(function (e) {
        alert(e);
    });
}

function signUp(email, password, name) {
    authDatabase.createUserWithEmailAndPassword(email, password).
        then(data => {
            let uid = data.user.uid;
            console.log("UID: " + uid);
            createUserProfile(uid, email, name, false);
            alert("Account created!");
        }).
        catch(function (e) {
            console.log(e.errorCode + '...' + e.errorMessage);
        });
}

function createUserProfile(uid, email, name, admin_flag) {
    cloudDatabase.collection("userProfile").add(
        {
            UID: uid,
            Email: email,
            Name: name,
            Admin: admin_flag,
        }
    ).then(function (docRef) {
        console.log("User added!  ", docRef.id);
        window.location.href = "signin.html";
    }).catch(function (e) {
        console.error("Error adding", e);
    })
}

async function getOneProfile(uid) {
    var snapShot = await cloudDatabase.collection("userProfile").where("UID", "==", uid).get();
    var data = snapShot.docs[0].data();
    let userProfile =
    {
        UID: data.UID,
        Email: data.Email,
        Name: data.Name,
        Admin: data.Admin,
    };
    return userProfile;
}