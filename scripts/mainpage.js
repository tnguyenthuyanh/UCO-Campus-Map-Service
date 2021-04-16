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

	// const geocoder = new google.maps.Geocoder();
	// const infowindow = new google.maps.InfoWindow();
	// document.getElementById("submit").addEventListener("click", () => {
	// 	geocodeLatLng(geocoder, map, infowindow);
	// });
	/* ******************************************************************************************** */

	displayCampusBuildingMarkers(map);
} // initMap()
/* ************************************************************************************************************* */




/* *************************************************************************************************************** */
/* ************************************* Display Campus Building Markers ***************************************** */
/* *************************************************************************************************************** */


var allBuildings;
async function displayCampusBuildingMarkers(map) {
	allBuildings = await Retrieve_All_Buildings();

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
			infoWindow.setContent(marker.getTitle());
			infoWindow.open(marker.getMap(), marker);
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
				lat: e.Latitude,
				lng: e.Longitude,
			}
		if (e.BuildingName == endLoc)
			endLoc = {
				lat: e.Latitude,
				lng: e.Longitude,
			}
	});

	// TODO: provide wheel chair accessible routes

	directionService.route({
		origin: startLoc,
		destination: endLoc,
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




function swapStartEnd() {
	let temp = document.getElementById('startBar').value;
	document.getElementById('startBar').value = document.getElementById('endBar').value;
	document.getElementById('endBar').value = temp;
} // swapStartEnd()




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