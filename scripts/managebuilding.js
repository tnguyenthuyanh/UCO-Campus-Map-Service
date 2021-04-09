"use strict";

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

let cloudDB = firebase.firestore();

//-------------------------------- HANDLE BUILDING DATA --------------------------------//

let buildingName = document.getElementById('BuildNameBox');
let buildingCode = document.getElementById('BuildCodeBox');
let b_latitude = document.getElementById('BLatBox');
let b_longitude = document.getElementById('BLngBox');

let bName = buildingName.value;
let bCode = buildingCode.value;
let bLat = b_latitude.value;
let bLng = b_longitude.value;

function UpdateB(val, type) {
    if (type == 'bname') bName = val;
    else if (type == 'bcode') bCode = val;
    else if (type == 'blat') bLat = val;
    else if (type == 'blng') bLng = val;
}

// Add buidling
function Add_Building_WithAutoID() { // Auto generate ID for doc
    cloudDB.collection("UCOBuildings").add(
        {
            BuildingName: bName,
            BuildingCode: bCode,
            Latitude: Number(bLat),
            Longitude: Number(bLng),
        }
    ).then(function (docRef) {
        console.log("DocID  ", docRef.id);
    }).catch(function (e) {
        console.error("Error adding", e);
    })
}

function Add_Building_WithID() { // Use custom ID for doc
    cloudDB.collection("UCOBuildings").doc(bCode).set(
        {
            BuildingName: bName,
            BuildingCode: bCode,
            Latitude: Number(bLat),
            Longitude: Number(bLng),
        }
    ).then(function () {
        console.log("DocID  ", bCode);
    }).catch(function (e) {
        console.error("Error adding", e);
    })

}
// Retrieve building
function Retrieve_Building() {
    cloudDB.collection("UCOBuildings").doc(bCode).get(
    ).then(function (doc) {
        if (doc.exists) {
            buildingName.value = doc.data().BuildingName;
            b_latitude.value = doc.data().Latitude;
            b_longitude.value = doc.data().Longitude;
            console.log("Retrieved successfully with docID ", bCode);
        } else {
            console.log("Doc does not exist");
        }
    }).catch(function (e) {
        console.log("error", error);
    })
}


// Update building
function Update_Fields_inDoc() {
    cloudDB.collection("UCOBuildings").doc(bCode).update(
        {
            BuildingName: bName,
            // BuildingCode: bCode,
            Latitude: Number(bLat),
            Longitude: Number(bLng),
        }
    ).then(function (docRef) {
        console.log("Overwritten with ID  ", bCode);
    }).catch(function (e) {
        console.error("Error updating", e);
    })
}

// Delete building
function Delete_Doc() {
    cloudDB.collection("UCOBuildings").doc(bCode).delete()
        .then(function (docRef) {
            console.log("Deleted doc with ID  ", bCode);
        }).catch(function (e) {
            console.error("Error deleting", e);
        })
}

// Reset value
function Reset_Building_Value() {
    buildingName.value = '';
    buildingCode.value = '';
    b_latitude.value = '';
    b_longitude.value = '';
}


//-------------------------------- HANDLE DOOR DATA --------------------------------//

let d_buildingCode = document.getElementById('DBldCodeBox');
let d_latitude = document.getElementById('DLatBox');
let d_longitude = document.getElementById('DLngBox');

let dBldCode = d_buildingCode.value;
let dLat = d_latitude.value;
let dLng = d_longitude.value;

function UpdateD(val, type) {
    if (type == 'dcode') dBldCode = val;
    else if (type == 'dlat') dLat = val;
    else if (type == 'dlng') dLng = val;
}

// Add door

function Add_Door_WithAutoID() { // Auto generate ID for doc
    cloudDB.collection("Doors").add(
        {
            BuildingCode: dBldCode,
            Latitude: Number(dLat),
            Longitude: Number(dLng),
        }
    ).then(function (docRef) {
        console.log("DocID  ", docRef.id);
    }).catch(function (e) {
        console.error("Error adding", e);
    })
}

function Reset_Door_Value() {
    d_buildingCode.value = '';
    d_latitude.value = '';
    d_longitude.value = '';
}


//-------- Event buttons -----------//

document.getElementById('addBldBtn').onclick = function () {
    // Add_Building_WithAutoID();
    Add_Building_WithID();
    Reset_Building_Value();
}
document.getElementById('retrieveBldBtn').onclick = function () {
    Retrieve_Building();
}
document.getElementById('updateBldBtn').onclick = function () {
    Update_Fields_inDoc();
}
document.getElementById('deleteBldBtn').onclick = function () {
    Delete_Doc();
}

document.getElementById('resetBValueBtn').onclick = function () {
    Reset_Building_Value();
}

document.getElementById('addDoorBtn').onclick = function () {
    Add_Door_WithAutoID();
    Reset_Door_Value();
}

document.getElementById('resetDValueBtn').onclick = function () {
    Reset_Door_Value();
}

