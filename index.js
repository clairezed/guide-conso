const guideMap = L.map('mapid', {
    center: [48.1833300,  6.4500000],
    zoom: 11
});

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2xhaXJlemVkIiwiYSI6ImNqMWwydTFwcTAwMDgzM253Njg1aTY1c2UifQ.77uslVJ8ewCRqXqyH6J43w', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'your.mapbox.access.token'
}).addTo(guideMap);

Papa.parse('guide-conso-data.csv', {
    header: true,
	download: true,
	complete: function(results) {
		displayAddressesOnMap(results.data);
    },
    error: function(error, file) {
        console.log(error);
    }
});

function displayAddressesOnMap(addresses) {
    addresses.map(address => {
        let lat = address['Latitude'];
        let long = address['Longitude'];
        L.marker([lat, long]).addTo(guideMap);
    })
};