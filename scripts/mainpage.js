"use strict";

var directionsService;
var directionsDisplay;
var directionsDisplayArray = [];
var hintBuildings = [];
var map;
var allBuildings;
var allBuildingAutos;
var allStairs;
var allUserSavedLocs;
var markers = [];
var count = 0;
var infoLocs;

// UCO LOGO For custom markers
const UCO_LOGO = 'https://i.imgur.com/UBf2qqn.png'
const SAVED_LOGO = 'https://i.imgur.com/b7sZ6Hr.png';
const TEMP_SAVED_LOGO = 'https://i.imgur.com/NMlpaHS.png';

/* ************************************************************************************************************* */
/* ******************************************* MAP INITIALIZATION ********************************************** */
/* ************************************************************************************************************* */
function initApp() {
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
	} // initApp()
	/* ************************************************ */

	/* *************************************** Creation of Map *************************************** */
	map = new google.maps.Map(document.getElementById("map"), {
		//TODO: restriction to UCO BOUNDS not working
		restriction: {
			latLngBounds: UCO_BOUNDS,
			strictBounds: true,
		},
		zoom: zoomLvl,
		center: UCO_NIGH_CENTER,
		minZoom: zoomLvl,
		maxZoom: zoomLvl + 3,
		styles: [
			{
				featureType: "poi",
				stylers: [
					{ visibility: "off" }
				],
			},
			{
				"elementType": "labels",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "administrative.land_parcel",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			},
			{
				"featureType": "administrative.neighborhood",
				"stylers": [
					{
						"visibility": "off"
					}
				]
			}
		]
	});
	/* *********************************************************************************************** */

	/* **************************************** Place Markers**************************************** */
	infoLocs = new google.maps.InfoWindow;
	google.maps.event.addListener(map, 'click', function (e) {
		placeMarker(map, e.latLng, infoLocs);
	});
	/* *********************************************************************************************** */
	// Header Drawer
	document.getElementById('openNav').onclick = function () {
		document.getElementById("mySidenav").style.width = "300px";
	}
	document.getElementById('closeNav').onclick = function () {
		document.getElementById("mySidenav").style.width = "0";
	}
	/* **************************************** DIRECTIONS **************************************** */
	// initializing google maps route/directions variables
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer();
	/* ******************************************************************************************** */
	displayCampusBuildingMarkers(map);
	/* ****************** This initilizes guest / user / admin access inside header drawer ************ */
	initProfile();
} // initApp()
/* ************************************************************************************************************* */

/* *************************************************************************************************************** */
/* ************************************* Display Campus Building Markers ***************************************** */
/* *************************************************************************************************************** */
async function displayCampusBuildingMarkers(map) {
	let button;
	let markerId;
	let buildingName;
	const URL_PARAM = new URLSearchParams(window.location.search);
	const UID = URL_PARAM.get('session');


	// From Firebase Controller
	allBuildings = await retrieveAllBuilding();
	allBuildingAutos = await retrieveAllBuildingAutos();
	allStairs = await getAllStairs();
	allUserSavedLocs = await getAllUserSavedLocs(UID);

	// adding all user saved locations to the hint buildings
	for (let i = 0; i < allUserSavedLocs.length; i++) {
		hintBuildings.push(allUserSavedLocs[i].NameLocation);
	}

	for (let i = 0; i < allBuildings.length; i++) {
		// adding all building names to the hintText array
		hintBuildings.push(allBuildings[i].BuildingName);
		// get current building lat/lng
		let myLatLng = {
			lat: allBuildings[i].Latitude,
			lng: allBuildings[i].Longitude
		};


		// create a marker with current building information
		const marker = new google.maps.Marker({
			position: myLatLng,
			map,
			title: allBuildings[i].BuildingName,
			icon: {
				url: UCO_LOGO,
				labelOrigin: new google.maps.Point(35, 80),
			},
			optimized: false,
			label: {
				text: allBuildings[i].BuildingName,
				fontWeight: 'bold',
			},
		});

		// add click-event for each marker for infowindow pop up
		marker.addListener("click", () => {
			infoLocs.close();
			infoLocs.setContent('<div style="text-align: center">' +
				`<button id="set-start-btn" buildingName="${marker.title}"` +
				`markerId="${marker.id}"> Start </button>` +
				'<div class="divider"/></div>' +
				`<button id="set-end-btn" buildingName="${marker.title}"` +
				`markerId="${marker.id}"> End </button>` +
				'</div>'
			);
			infoLocs.open(marker.getMap(), marker);
		});

		google.maps.event.addListener(infoLocs, 'domready', function () {
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

function calculateAndDisplayRoute(directionsService) {
	// clearing past route results for multiple routes
	for (var i = 0; i < directionsDisplayArray.length; i++) {
		directionsDisplayArray[i].setMap(null);
		directionsDisplayArray[i] = null;
	}
	directionsDisplayArray = [];

	// clearing past route result for single route
	directionsDisplay.setMap(null);
	directionsDisplay = null;
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(map);


	// grabbing data from start and end search bar
	let startLocName = document.getElementById('startBar').value;
	let endLocName = document.getElementById('endBar').value;
	var startLoc;
	var endLoc;
	var realStartLoc = false;
	var realEndLoc = false;

	// error handling for empty search bars
	if (startLocName.trim() == "" || endLocName.trim() == "") {
		window.alert('Please enter a location!');
		return;
	} else if (startLocName == endLocName) {
		window.alert('The same location has been entered for the Start Location and End Location.');
		return;
	}

	// checking if provided start/end is a UCO custom marker
	allBuildings.forEach(e => {
		if (e.BuildingName == startLocName) {
			startLoc = {
				BuildingCode: e.BuildingCode,
				lat: e.Latitude,
				lng: e.Longitude,
			}
			realStartLoc = true;
		}
		if (e.BuildingName == endLocName) {
			endLoc = {
				BuildingCode: e.BuildingCode,
				lat: e.Latitude,
				lng: e.Longitude,
			}
			realEndLoc = true;
		}
	});

	// checking if provided start/end is a User Saved Location custom marker
	allUserSavedLocs.forEach(e => {
		if (e.NameLocation == startLocName) {
			startLoc = {
				lat: e.Latitude,
				lng: e.Longitude,
			}
			realStartLoc = true;
		}
		if (e.NameLocation == endLocName) {
			endLoc = {
				lat: e.Latitude,
				lng: e.Longitude,
			}
			realEndLoc = true;
		}
	});

	if (!realStartLoc || !realEndLoc) {
		window.alert('Location(s) not recognized. Please enter the location name exactly as displayed or use the hint text.');
		return;
	}

	// TODO: provide wheel chair accessible routes

	/* 
	 * if wheel chair mode, change destination to 
	 * automatic doors & avoid stair routes
	 */
	if (document.getElementById('wheelChairBox').checked == true) {
		allBuildingAutos.forEach(e => {
			if (startLoc.BuildingCode == e.BuildingCode) {
				startLoc = {
					BuildingCode: e.BuildingCode,
					lat: e.Latitude,
					lng: e.Longitude,
				};
			}
			if (endLoc.BuildingCode == e.BuildingCode) {
				endLoc = {
					BuildingCode: e.BuildingCode,
					lat: e.Latitude,
					lng: e.Longitude,
				};
			}
		});
	}

	directionsService.route({
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
		if (status === 'OK') {

			var isLocationOnEdge = google.maps.geometry.poly.isLocationOnEdge;

			for (var i = 0, len = response.routes.length; i < len; i++) {
				// check if route passes through all stairs locations pulled from firebase
				//		if it doesn not, end look  and display route.

				// if wheelChairBox is checked
				// 		for each of the stairscases on walking paths
				if (document.getElementById('wheelChairBox').checked == true) {
					for (var j = 0; j < allStairs.length; j++) {
						// getting staircase coordinates
						let loc = new google.maps.LatLng(allStairs[j].Latitude, allStairs[j].Longitude);
						// check if path goes over stairscase. If it does, continue
						var polyline = new google.maps.Polyline({ path: response.routes[i].overview_path });

						// if route does not pass through 
						//	TODO: multiple routes still being displayed, some are still going through bad routes.
						//		  somehow getting called 6 times from MCS -> Murdaugh hall
						// 10e-4, 0.0005
						if (!isLocationOnEdge(loc, polyline, 0.00045)) {
							directionsDisplayArray.push(new google.maps.DirectionsRenderer({
								map: map,
								directions: response,
								routeIndex: i,
							}));
							j = allStairs.length;
							i = response.routes.length;
						}
					}
				} else { // if wheelchairbox is not checked
					// assigning defined map to the directionsDisplay
					directionsDisplay.setDirections(response);
				}
			}
		}
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

/* ********************************************************************************************* */
/* ************************************* Profile Login ***************************************** */
/* ********************************************************************************************* */

function initProfile() {
	/** ************************************************* INSIDE HTML BODY ********************************************/
	// Find if one user is logging in
	const URL_PARAM = new URLSearchParams(window.location.search);
	const UID = URL_PARAM.get('session');

	firebase.auth().onAuthStateChanged(function (user) {
		// console.log(user.UID);
		if (UID != null && user) { // If user or admin
			// user activities loaded in here, such as retrieving user info, 
			//		user's saved locations
			getUserProfile(UID);
			showUserSavedLocMarkers();
		}
		if (UID == "guest" || user.uid == null) { // If guest
			document.getElementById("nameTitle")
			getSideNavItems.appendChild(document.createTextNode('Welcome, guest'));
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

async function getUserProfile(UID) {
	var user = await getOneProfile(UID);
	var getSideNavItems = document.getElementById("sideNavItems");

	// Create Name Title Inside sideNavBar
	document.getElementById("nameTitle")
		.appendChild(document.createTextNode('Hello, ' + user.Name));

	// Create Email Title Inside sideNavBar
	document.getElementById("emailTitle")
		.appendChild(document.createTextNode(user.Email));


	// Create Link to Admin Management
	if (user.Admin == true) {
		var buildingSettings = document.createElement("a");
		buildingSettings
			.appendChild(document.createTextNode('Building Settings'));
		getSideNavItems.append(buildingSettings);
		buildingSettings.href = "managebuilding.html?session=" + UID;
	}

	// Create Link to User Settings
	var userSettings = document.createElement("a");
	userSettings.appendChild(document.createTextNode('User Settings'));
	getSideNavItems.append(userSettings);
	userSettings.href = "usersettings.html?session=" + UID;
	// Create Log Out Inside sideNavBar
	var logOut = document.createElement("a");
	logOut.appendChild(document.createTextNode('Log out'));
	logOut.onclick = function () {
		signOut();
	};
	logOut.href = "";
	getSideNavItems.append(logOut);
}
/* ********************************************************************************************* */

function placeMarker(map, location, infoLocs) {
	infoLocs.close();

	let button;
	let markerId;
	let lat;
	let lng;

	count++;
	var marker = new google.maps.Marker({
		position: location,
		map: map,
		id: count,
		icon: TEMP_SAVED_LOGO,
	});
	markers.push(marker);

	//Attach click event handler to the marker.
	google.maps.event.addListener(marker, "click", function (e) {
		infoLocs.setContent('Latitude: ' + location.lat() +
			'<br />Longitude: ' + location.lng() +
			'<br />Name:  <input class="input-save" id="inputName"' +
			'type="text" size="30" maxlength="30" value=""/>' +
			'<div style="text-align: center">' +
			'<button id="saveMarker" markerId="' + marker.id + '" lat="' +
			location.lat() + '" lng="' + location.lng() + '"> Save </button>' +
			'<div class="divider"/></div>' +
			'<button id="removeMarker" markerId="' + marker.id +
			'"> Remove </button>' +
			'</div>'
		);
		infoLocs.open(map, marker);

		google.maps.event.addListener(infoLocs, 'domready', function () {
			const URL_PARAM = new URLSearchParams(window.location.search);
			const UID = URL_PARAM.get('session');

			if (document.getElementById('removeMarker')) {
				button = document.getElementById('removeMarker');
				markerId = parseInt(button.getAttribute('markerId'));
				button.onclick = function () {
					removeMarker(markerId);
				};
			}
			if (document.getElementById('saveMarker')) {
				button = document.getElementById('saveMarker');
				markerId = parseInt(button.getAttribute('markerId'));
				lat = button.getAttribute('lat');
				lng = button.getAttribute('lng');
				button.onclick = function () {
					if (UID == "guest" || UID == null) {
						infoLocs.setContent('Please log in to save location');
					} else {
						saveMarker(marker, UID, document.getElementById('inputName').value, location);
					}
				};
			}
		});
	});
}

async function saveMarker(marker, UID, inputName, location) {
	var docID = await addSavedLocs(UID, inputName, location.lat(), location.lng());
	console.log(docID);
	infoLocs.setContent('Successfully saved');
	removeMarker(marker.id);
	var newMarker = new google.maps.Marker({
		position: location,
		icon: {
			url: SAVED_LOGO,
			labelOrigin: new google.maps.Point(35, 80),
		},
		map: map,
		docID: docID,
		title: inputName,
		label: {
			text: inputName,
			fontWeight: 'bold',
		},
	});

	hintBuildings.push(inputName);
	allUserSavedLocs.push({
		Latitude: location.lat(),
		Longitude: location.lng(),
		NameLocation: inputName,
		UID: UID,
	});

	pushMarkers(newMarker);
	addMarkerListener(map, newMarker, infoLocs);
}

function removeMarker(markerId) {
	for (var i = 0; i < markers.length; i++) {
		if (markers[i].id == markerId) {
			markers[i].setMap(null); //Remove the marker from map     
			markers.splice(i, 1); //Remove the marker from markers array
		}
	}
}

function showUserSavedLocMarkers() {
	const URL_PARAM = new URLSearchParams(window.location.search);
	const UID = URL_PARAM.get('session');

	showMarkers(map, UID, infoLocs, SAVED_LOGO);
}