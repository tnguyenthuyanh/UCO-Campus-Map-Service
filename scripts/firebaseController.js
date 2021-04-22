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
let authDB = firebase.auth();
var markers = [];

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

// Add stairs
function Add_Stairs() { // Use custom ID for doc
    cloudDB.collection("Stairs").add(
        {
            Latitude: Number(sLat),
            Longitude: Number(sLng),
        }
    ).then(function () {
        console.log("DocID  ", bCode);
    }).catch(function (e) {
        console.error("Error adding", e);
    });
}

async function getAllStairs() {
    const snapshot = await cloudDB.collection('Stairs').get();
    return snapshot.docs.map(doc => doc.data());
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

// Retrieve all buildings in collection "UCOBuildings"
async function Retrieve_All_Buildings() {
    const snapshot = await cloudDB.collection('UCOBuildings').get()
    return snapshot.docs.map(doc => doc.data());
}

// Retrieves all auto door from collection "Doors"
async function retrieveAllBuildingAutos() {
    const snapshot = await cloudDB.collection('Doors').get();
    return snapshot.docs.map(doc => doc.data());
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

// FirebaseAuth
firebase.auth.Auth.Persistence.LOCAL;

function sign_In(email, password) {
    var result = authDB.signInWithEmailAndPassword(email, password)
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

function sign_Out() {
    authDB.signOut().then(function () {
        // window.alert("Sign out Successfully");
        window.location.href = "signin.html";
    }).catch(function (e) {
        alert(e);
    });
}

function sign_Up(email, password, name) {
    authDB.createUserWithEmailAndPassword(email, password).
        then(data => {
            let uid = data.user.uid;
            console.log("UID: " + uid);
            create_User_Profile(uid, email, name, false);
            alert("Account created!");
        }).
        catch(function (e) {
            console.log(e.errorCode + '...' + e.errorMessage);
        });
}

function create_User_Profile(uid, email, name, admin_flag) {
    cloudDB.collection("userProfile").add(
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

async function Get_One_Profile(uid) {
    var snapShot = await cloudDB.collection("userProfile").where("UID", "==", uid).get();
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

// add saved locations 
function Add_savedLocs(uid, inputName, lat, lng) { 
    cloudDB.collection("savedLocations").add(
        {
            NameLocation: inputName,
            Longitude: Number(lng),
            Latitude: Number(lat),
            UID: uid
        }
    ).then(function(docRef) {
        console.log("Document successfully written!", docRef.id);
    }).catch(function (e) {console.error("Error", e);})
}

// show all saved markers
function show_markers(map, uid) { 
    let button;
    let markerPos;
    let lat;
    let lng;
    var ar = [];
    var infoLocs = new google.maps.InfoWindow;
    cloudDB.collection("savedLocations").where("UID", "==", uid).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            ar.push((doc.data().Latitude,doc.data().Longitude));
            console.log(doc.data().Latitude, " " , doc.data().Longitude);

            var marker = new google.maps.Marker({
                position: {lat: doc.data().Latitude, lng: doc.data().Longitude},
                map: map,
                title: doc.data().NameLocation,
            });

            markers.push(marker);
            infoLocs.close();

            google.maps.event.addListener(marker, "click", function (e) {
                
                infoLocs.setContent('<div style="text-align: center">' + marker.title + '</div>' +
                    'Name:  <input class="input-save" id="Name" type="text" size="30" maxlength="30" value=""/>' + 
                    '<div style="text-align: center">' +
                    '<button id="changeName" markerPos="' + marker.position + '" lat="' + doc.data().Latitude + '" lng="' + doc.data().Longitude + '"> Change Name </button>' +
                    '<div class="divider"/></div>' +
                    '<button id="deleteMarker" markerPos="' + '" lat="' + doc.data().Latitude + '" lng="' + doc.data().Longitude + '"> Delete </button>' +
                    '</div>'
                );
                infoLocs.open(map, marker);
            });

            google.maps.event.addListener(infoLocs, 'domready', function () {
                const urlParam = new URLSearchParams(window.location.search);
                const uid = urlParam.get('session');
                
                if (document.getElementById('deleteMarker')) {
                    
                    button = document.getElementById('deleteMarker');
                    lat = button.getAttribute('lat');
                    lng = button.getAttribute('lng');
                    button.onclick = function () {
                        deleteLocation(lat, lng, uid);
                    };
                    
                }
                // if (document.getElementById('changeName')) {
                //     button = document.getElementById('changeName');
                //     markerId = parseInt(button.getAttribute('markerPos'));
                //     lat = button.getAttribute('lat');
                //     lng = button.getAttribute('lng');
                //     button.onclick = function () {
                //         if (uid == "guest" || uid == null) {
                //             infoLocs.setContent('Please log in to save location');
                //         }
                //         else {
                //             saveMarker(uid, infoLocs, document.getElementById('inputName').value, lat, lng);
                //         }
                //     };
                // } 
            });

        })
    }).catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

function deleteLocation(lat, lng, uid) {
    for (var i = 0; i < markers.length; i++) {
		if (markers[i].position == {lat: lat, lng: lng}) {           
			markers[i].setMap(null); //Remove the marker from map     
			markers.splice(i, 1); //Remove the marker from markers array

            var id = cloudDB.collection("savedLocations").where("UID", "==", uid).where("Latitude","==", lat).where("Longitude","==", lng);
            cloudDB.collection("savedLocations").doc(id).delete()
                .then(function (docRef) {
                    console.log("Deleted doc with ID  ", id);
                }).catch(function (e) {
                    console.error("Error deleting", e);
                })
		}
	}
}

function return_markers() {
    return markers;
}