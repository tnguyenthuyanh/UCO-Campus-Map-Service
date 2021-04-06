function initMap() {
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
	}

	// initializing google maps route/directions variables
	var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer;

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

	// creating auto complete var
	var autocomplete = new google.maps.places.Autocomplete()

	// assigning defined map to the directionsDisplay
	directionsDisplay.setMap(map);
	document.getElementById('startBar').addEventListener('change', onChangeHandler);
	document.getElementById('endBar').addEventListener('change', onChangeHandler);

	const geocoder = new google.maps.Geocoder();
	const infowindow = new google.maps.InfoWindow();
	document.getElementById("submit").addEventListener("click", () => {
		geocodeLatLng(geocoder, map, infowindow);
	});
}

// handled when listener is changed
function onChangeHandler() {
	calculateAndDisplayRoute(directionsService, directionsDisplay);
}

function calculateAndDisplayRoute(directionService, directionsDisplay) {
	directionService.route({
		origin: document.getElementById('starBar').value,
		destination: document.getElementById('endBar').value,
		travelMode: google.maps.TravelMode['WALKING'],
	}, function (response, status) {
		if (status === 'OK')
			directionsDisplay.setDirections(response);
		else
			window.alert('Directions request failed due to ' + status);
	}
	);
}

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
}