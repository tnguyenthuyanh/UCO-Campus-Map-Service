//-------------------------------- Configuration for FirebaseFirestore --------------------------------//

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDJ4SVerZgGodKbClc3xRSgFNVDpPMslPg",
    authDomain: "uco-cms.firebaseapp.com",
    projectId: "uco-cms",
    storageBucket: "uco-cms.appspot.com",
    messagingSenderId: "318740561508",
    appId: "1:318740561508:web:6c29f6a5a80d4262cf6971",
    measurementId: "G-M1E63ZQ6DM"
};

firebase.initializeApp(FIREBASE_CONFIG);

let cloudDB = firebase.firestore();
let authDB = firebase.auth();
var markers = [];


// Add buidling
function addBuildingWithAutoID() { // Auto generate ID for doc
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

function addBuildingWithID() { // Use custom ID for doc
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
function addStairs() { // Use custom ID for doc
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
function retrieveBuilding() {
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
async function retrieveAllBuildings() {
    const snapshot = await cloudDB.collection('UCOBuildings').get()
    return snapshot.docs.map(doc => doc.data());
}

// Retrieves all auto door from collection "Doors"
async function retrieveAllBuildingAutos() {
    const snapshot = await cloudDB.collection('Doors').get();
    return snapshot.docs.map(doc => doc.data());
}

async function getAllUserSavedLocs(uid) {
    const snapshot = await cloudDB.collection("savedLocations").where("UID", "==", uid).get();
    return snapshot.docs.map(doc => doc.data());
}

// Update building
function updateFieldsInDoc() {
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
function addDoorWithAutoID() { // Auto generate ID for doc
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

function signIn(email, password) {
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

function signOut() {
    authDB.signOut().then(function () {
        // window.alert("Sign out Successfully");
        window.location.href = "signin.html";
    }).catch(function (e) {
        alert(e);
    });
}

function signUp(email, password, name) {
    authDB.createUserWithEmailAndPassword(email, password).
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

async function getOneProfile(uid) {
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
async function addSavedLocs(uid, inputName, lat, lng) { 
    let doc_ref = cloudDB.collection("savedLocations").add(
        {
            NameLocation: inputName,
            Longitude: Number(lng),
            Latitude: Number(lat),
            UID: uid
        });

    const docAdded = await doc_ref;
    console.log(docAdded.id);
    return docAdded.id;
}

// show all saved markers
function showMarkers(map, uid, infoLocs, SAVED_LOGO) { 
    cloudDB.collection("savedLocations").where("UID", "==", uid).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {

            if (isMarkerFree(doc.data().Latitude,doc.data().Longitude)) {
            var marker = new google.maps.Marker({
                position: {lat: doc.data().Latitude, lng: doc.data().Longitude},
                icon: {
                    url: SAVED_LOGO,
                    labelOrigin: new google.maps.Point(35, 80),
                },
                map: map,
                docID: doc.id,
                title: doc.data().NameLocation,
                label: {
                    text: doc.data().NameLocation,
                    fontWeight: 'bold',
                },
            });
            
            markers.push(marker);
            addMarkerListener(map, marker, infoLocs);
        }
        })
    }).catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

function addMarkerListener (map, marker, infoLocs) {

    google.maps.event.addListener(marker, "click", function (e) {
        infoLocs.close();    
        infoLocs.setContent('<div style="text-align: center">' + marker.title + '</div>' +
            '<div style="text-align: center">' +
            `<button id="set-start-btn" buildingName="${marker.title}"> Start </button>` +
            '<div class="divider"/></div>' +
            `<button id="set-end-btn" buildingName="${marker.title}"> End </button>` +
            '</div>' +
            'New Name:  <input class="input-save" id="Name" type="text" size="30" maxlength="30" value=""/>' + 
            '<div style="text-align: center">' +
            '<button id="changeName"' + ' docID="'+ marker.docID + '" lat="' + marker.getPosition().lat() + '" lng="' + marker.getPosition().lng() + '"> Change Name </button>' +
            '<div class="divider"/></div>' +
            '<button id="deleteMarker"'+ ' docID="'+ marker.docID + '" lat="' + marker.getPosition().lat() + '" lng="' + marker.getPosition().lng() + '" title="' + marker.title + '"> Delete </button>' +
            '</div>'
        );
        infoLocs.open(map, marker);

        google.maps.event.addListener(infoLocs, 'domready', function () {
        
            if (document.getElementById('deleteMarker')) {
                
                button = document.getElementById('deleteMarker');
                lat = button.getAttribute('lat');
                lng = button.getAttribute('lng');
                docID = button.getAttribute('docID');
                title = button.getAttribute('title');
                button.onclick = function () {
                    deleteLocation(docID, lat, lng, title);
                };
            }
            if (document.getElementById('changeName')) {
                
                button = document.getElementById('changeName');
                lat = button.getAttribute('lat');
                lng = button.getAttribute('lng');
                docID = button.getAttribute('docID');
                button.onclick = function () {
                    changeName(map, marker, docID, infoLocs, document.getElementById('Name').value);
                };
            }
            if (document.getElementById('set-start-btn')) {

				button = document.getElementById('set-start-btn');
				buildingName = button.getAttribute('buildingName');
				button.onclick = function () {
					setStart(buildingName);
				};
			}
			if (document.getElementById('set-end-btn')) {

				button = document.getElementById('set-end-btn');
				buildingName = button.getAttribute('buildingName');
				button.onclick = function () {
					setEnd(buildingName);
				};
			}
        });
    });
}

function changeName(map, marker, docID, infoLocs, newName) {
    cloudDB.collection("savedLocations").doc(docID).update({NameLocation: newName}) 
        .then(function (docRef) {
            console.log("Name updated!");
        }).catch(function (e) {
            console.error("Error updating", e);
        })
    infoLocs.setContent("Location's Name updated!");
    for (var i = 0; i < hintBuildings.length; i++) {
        if (hintBuildings[i] == marker.title) {
            hintBuildings[i] = newName;
            marker.getLabel().text = newName;
            break;
        }
    } 
    
    for (var i = 0; i < allUserSavedLocs.length; i++) {
        if (allUserSavedLocs[i].NameLocation == marker.title && allUserSavedLocs[i].Latitude == marker.getPosition().lat() && allUserSavedLocs[i].Longitude == marker.getPosition().lng()) {
            allUserSavedLocs[i].NameLocation = newName;
            break;
        }
    } 
    marker.title = newName;
    marker.setMap(null);
    marker.setMap(map);
    
}

function deleteLocation(docID, lat, lng, title) {
    for (var i = 0; i < markers.length; i++) {
		if (markers[i].getPosition().lat() == lat && markers[i].getPosition().lng() == lng) { 

            // remove from hint buildings
            for (var x = 0; x < hintBuildings.length; x++) {
                if (hintBuildings[x] == title) {
                    console.log(hintBuildings[x]);
                    hintBuildings.splice(x, 1);
                    
                    break;
                }
            } 

			markers[i].setMap(null); //Remove the marker from map     
			markers.splice(i, 1); //Remove the marker from markers array
            cloudDB.collection("savedLocations").doc(docID).delete()
                .then(function (docRef) {
                    console.log("Successfully deleted from Saved Locations collection!");
                }).catch(function (e) {
                    console.error("Error deleting", e);
                })
            break;
		}
	}
}

function isMarkerFree(lat, lng) {
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].getPosition().lat() == lat && markers[i].getPosition().lng() == lng) {
        return false;
      }
    }
    return true;
}

function pushMarkers(marker) {
    markers.push(marker);
}