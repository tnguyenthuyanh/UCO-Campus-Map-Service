"use strict";

let directionsService;
let directionsDisplay;

// UCO LOGO For custom markers
const ucoLogo = 'https://i.imgur.com/UBf2qqn.png'

/* ************************************************************************************************************* */
/* ******************************************* MAP INITIALIZATION ********************************************** */
/* ************************************************************************************************************* */

function initMap() {
	/* ***************** MAP SETTINGS ***************** */
	const zoomLvl = 17;
	const UCO_BOUNDS = {
		north: -97.47141461743557,
		south: -97.47154865441024,
		west: 35.656448308469805,
		east: 35.65577977364835,
	};
	// center of UCO Nigh Center 
	//  35.655077197908156, -97.47145029368437
	const UCO_NIGH_CENTER = {
		lat: 35.655077197908156,
		lng: -97.47145029368437,
	} // initMap()
	/* ************************************************ */

	/* *************************************** Creation of Map *************************************** */
	const map = new google.maps.Map(document.getElementById("map"), {
		//TODO: restriction to UCO BOUNDS not working
		restriction: {
			latLngBounds: UCO_BOUNDS,
			strictBounds: true,
		},
		zoom: zoomLvl,
		center: UCO_NIGH_CENTER,
		minZoom: zoomLvl,
		maxZoom: zoomLvl + 3,
	});
	/* *********************************************************************************************** */



	/* *************************************** AUTO COMPLETE *************************************** */
	// auto complete options
	const autocompleteOptions = {
		componentRestrictions: { country: "us" },
		fields: ["formatted_address", "geometry", "name"],
		origin: map.getCenter(),
		strictBounds: true,
		types: ["establishment"],
	};

	// creating auto complete for start
	var autocompleteStart = new google.maps.places.Autocomplete(
		document.getElementById('startBar'),
		autocompleteOptions,
	);
	autocompleteStart.bindTo("bounds", map);
	// creating auto complete for end	
	var autocompleteEnd = new google.maps.places.Autocomplete(
		document.getElementById('endBar'),
		autocompleteOptions
	);
	autocompleteEnd.bindTo("bounds", map);
	/* ******************************************************************************************** */


	/* **************************************** DIRECTIONS **************************************** */
	// initializing google maps route/directions variables
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer();

	// assigning defined map to the directionsDisplay
	directionsDisplay.setMap(map);

	/* ******************************************************************************************** */
	displayCampusBuildingMarkers(map);

	/* ****************** This initilizes guest / user / admin access inside header drawer ************ */
	initProfile();
} // initMap()
/* ************************************************************************************************************* */




/* *************************************************************************************************************** */
/* ************************************* Display Campus Building Markers ***************************************** */
/* *************************************************************************************************************** */


var allBuildings;
var allBuildingAutos;
async function displayCampusBuildingMarkers(map) {
	let button;
	let markerId;
	let buildingName;

	// From Firebase Controller
	allBuildings = await Retrieve_All_Buildings();
	allBuildingAutos = await retrieveAllBuildingAutos();

	// creating infowindow for markers
	const infoWindow = new google.maps.InfoWindow();

	for (let i = 0; i < allBuildings.length; i++) {
		let myLatLng = {
			lat: allBuildings[i].Latitude,
			lng: allBuildings[i].Longitude
		};

		const marker = new google.maps.Marker({
			position: myLatLng,
			map,
			title: allBuildings[i].BuildingName,
			icon: ucoLogo,
			optimized: false,
		});

		marker.addListener("click", () => {
			infoWindow.close();
			infoWindow.setContent('<div style="text-align: center">' +
				`<button id="set-start-btn" buildingName="${marker.title}" markerId="${marker.id}"> Start </button>` +
				'<div class="divider"/></div>' +
				`<button id="set-end-btn" buildingName="${marker.title}" markerId="${marker.id}"> End </button>` +
				'</div>'
			);
			infoWindow.open(marker.getMap(), marker);
		});

		google.maps.event.addListener(infoWindow, 'domready', function () {
			if (document.getElementById('set-start-btn')) {

				button = document.getElementById('set-start-btn');
				markerId = parseInt(button.getAttribute('markerId'));
				buildingName = button.getAttribute('buildingName');
				button.onclick = function () {
					setStart(buildingName);
				};
			}
			if (document.getElementById('set-end-btn')) {

				button = document.getElementById('set-end-btn');
				markerId = parseInt(button.getAttribute('markerId'));
				buildingName = button.getAttribute('buildingName');
				button.onclick = function () {
					setEnd(buildingName);
				};
			}
		});
	}
} // displayCampusBuildingMarkers(map)
/* *************************************************************************************************************** */


/* ***************************************************************************************************** */
/* ************************************* Generating Directions ***************************************** */
/* ***************************************************************************************************** */

function getDirections() {
	calculateAndDisplayRoute(directionsService, directionsDisplay);
} // getDirections()

function calculateAndDisplayRoute(directionService, directionsDisplay) {

	// grabbing data from start and end search bar
	let startLoc = document.getElementById('startBar').value;
	let endLoc = document.getElementById('endBar').value;

	// error handling for empty search bars
	if (startLoc.trim() == "" || endLoc.trim() == "") {
		// let msgStart = startLoc.trim();
		// let msgEnd = endLoc.trim();
		window.alert('Please enter a location!');
		return;
	}

	// checking if provided start/end is a UCO custom marker
	// TODO: also check if provided start/end is a USER custom marker
	allBuildings.forEach(e => {
		if (e.BuildingName == startLoc)
			startLoc = {
				BuildingCode: e.BuildingCode,
				lat: e.Latitude,
				lng: e.Longitude,
			}
		if (e.BuildingName == endLoc)
			endLoc = {
				BuildingCode: e.BuildingCode,
				lat: e.Latitude,
				lng: e.Longitude,
			}
	});

	// TODO: provide wheel chair accessible routes

	// if wheel chair mode, change destination to automatic doors.
	if (document.getElementById('wheelChairBox').checked == true) {
		allBuildingAutos.forEach(e => {
			if (startLoc.BuildingCode == e.BuildingCode) {
				console.log('startTest');
				startLoc = {
					BuildingCode: e.BuildingCode,
					lat: e.Latitude,
					lng: e.Longitude,
				};
			}
			if (endLoc.BuildingCode == e.BuildingCode) {
				console.log('endTest');
				endLoc = {
					BuildingCode: e.BuildingCode,
					lat: e.Latitude,
					lng: e.Longitude,
				};
			}
		});
	}

	directionService.route({
		origin: {
			lat: startLoc.lat,
			lng: startLoc.lng,
		},
		destination: {
			lat: endLoc.lat,
			lng: endLoc.lng,
		},
		travelMode: google.maps.TravelMode['WALKING'],
		provideRouteAlternatives: true,
	}, function (response, status) {
		if (status === 'OK')
			directionsDisplay.setDirections(response);
		else
			window.alert('Directions request failed due to ' + status);
	}
	);
} // calculateAndDisplayRoute(directionService, directionsDisplay)

/* ***************************************************************************************************** */



/* ********************************************************************************************************** */
/* ************************************* Start/End Field Management ***************************************** */
/* ********************************************************************************************************** */

function swapStartEnd() {
	let temp = document.getElementById('startBar').value;
	document.getElementById('startBar').value = document.getElementById('endBar').value;
	document.getElementById('endBar').value = temp;
} // swapStartEnd()


function setStart(buildingStartName) {
	document.getElementById('startBar').value = buildingStartName;
}

function setEnd(buildingEndName) {
	document.getElementById('endBar').value = buildingEndName;
}
/* ********************************************************************************************************** */


function geocodeLatLng(geocoder, map, infowindow) {
	const input = document.getElementById("latlng").value;
	const latlngStr = input.split(",", 2);
	const latlng = {
		lat: parseFloat(latlngStr[0]),
		lng: parseFloat(latlngStr[1]),
	};
	geocoder.geocode({ location: latlng }, (results, status) => {
		if (status === "OK") {
			if (results[0]) {
				map.setZoom(16);
				const marker = new google.maps.Marker({
					position: latlng,
					map: map,
				});
				infowindow.setContent(results[0].formatted_address);
				infowindow.open(map, marker);
			} else {
				window.alert("No results found");
			}
		} else {
			window.alert("Geocoder failed due to: " + status);
		}
	});
} // geocodeLatLng(geocoder, map, infowindow)

function initProfile() {
	/** ************************************************* INSIDE HTML BODY ********************************************/
	// Header Drawer
	document.getElementById('openNav').onclick = function () {
		document.getElementById("mySidenav").style.width = "300px";
	}
	document.getElementById('closeNav').onclick = function () {
		document.getElementById("mySidenav").style.width = "0";
	}
	// Find if one user is logging in
	const urlParam = new URLSearchParams(window.location.search);
	const uid = urlParam.get('session');

	firebase.auth().onAuthStateChanged(function (user) {
		// console.log(user.uid);
		if (uid != null && user) // If user or admin
			// user activities loaded in here, such as retrieving user info, user's saved locations
			getUserProfile(uid);
		if (uid == "guest" || user.uid == null) { // If guest
			document.getElementById("nameTitle").appendChild(document.createTextNode('Welcome, guest'));
			var getSideNavItems = document.getElementById("sideNavItems");
			// Create Sign In Inside Drawer
			var signIn = document.createElement("a");
			signIn.appendChild(document.createTextNode('Sign In'));
			signIn.href = "signin.html";
			getSideNavItems.append(signIn);

			// Create Sign Up Inside Drawer
			var signUp = document.createElement("a");
			signUp.appendChild(document.createTextNode('Sign Up'));
			signUp.href = "signup.html";
			getSideNavItems.append(signUp);
		}
	});


}


async function getUserProfile(uid) {
	/** These code to stop users from using return button in the browser */
	// window.history.pushState(null, "", window.location.href);
	// window.onpopstate = function () {
	// 	this.window.history.pushState(null, "", window.location.href);
	// }
	/** *******************************************************************/

	var user = await Get_One_Profile(uid);
	console.log(user);
	var getSideNavItems = document.getElementById("sideNavItems");

	// Create Name Title Inside sideNavBar
	document.getElementById("nameTitle").appendChild(document.createTextNode('Hello, ' + user.Name));

	// Create Email Title Inside sideNavBar
	document.getElementById("emailTitle").appendChild(document.createTextNode(user.Email));


	// Create Link to Admin Management
	if (user.Admin == true) {
		var buildingSettings = document.createElement("a");
		buildingSettings.appendChild(document.createTextNode('Building Settings'));
		getSideNavItems.append(buildingSettings);
		buildingSettings.href = "managebuilding.html?user=" + uid;
	}

	// Create Link to User Settings
	var userSettings = document.createElement("a");
	userSettings.appendChild(document.createTextNode('User Settings'));
	getSideNavItems.append(userSettings);
	userSettings.href = "";

	// Create Log Out Inside sideNavBar
	var logOut = document.createElement("a");
	logOut.appendChild(document.createTextNode('Log out'));
	logOut.onclick = function () {
		sign_Out();
	};
	logOut.href = "";
	getSideNavItems.append(logOut);

}