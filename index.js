/* global L:false, Papa:false */

const mapElement = document.querySelector('[data-map="main"]');
const guideMap = L.map(mapElement, {
  center: [48.1833300, 6.4500000],
  zoom: 11
});

L.tileLayer('https://api.mapbox.com/styles/v1/clairezed/cjiddd8yo07iv2roivsv1ohkz/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiY2xhaXJlemVkIiwiYSI6ImNqMWwydTFwcTAwMDgzM253Njg1aTY1c2UifQ.77uslVJ8ewCRqXqyH6J43w', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
}).addTo(guideMap);

Papa.parse('guide-conso-data.csv', {
  header: true,
  download: true,
  complete: function (results) {
    displayAddressesOnMap(results.data);
  },
  error: function (error) {
    console.error(error);
  }
});

function displayAddressesOnMap(addresses) {
  for (const address of addresses){
    const {Latitude: lat, Longitude : long} = address;
    let marker = L.marker([lat, long]).addTo(guideMap);
    marker.bindPopup(
      `<b>${address['Nom de la structure']} </b><br>`+
        `${address['Rue']} <br>`+
        `${address['Code postal']} ${address['Ville']}<br>`
    ).openPopup();
  }
}
