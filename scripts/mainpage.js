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
	const geocoder = new google.maps.Geocoder();
	const infowindow = new google.maps.InfoWindow();
	document.getElementById("submit").addEventListener("click", () => {
		geocodeLatLng(geocoder, map, infowindow);
	});
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