function myFunction() {
  var sheet = SpreadsheetApp.getActive();
  ScriptApp.newTrigger("onFormSubmit")
   .forSpreadsheet(sheet)
   .onFormSubmit()
   .create();
}

function onFormSubmit(obj) { 
  var address = formatAddress(obj);
  var response = UrlFetchApp.fetch('https://api-adresse.data.gouv.fr/search/?q='+address);
  var coordinates = getCoordinates(response);
  var longitude = coordinates[0];
  var latitude = coordinates[1];
  var row = obj.range.getRow();
  var latitudeRange = 'P'+row;
  var longitudeRange = 'Q'+row;
  s.getRange(latitudeRange).setValue(latitude);
  s.getRange(longitudeRange).setValue(longitude);
}

function formatAddress(obj) {
  var street = obj.namedValues.Rue[0].replace(/ /g, '-' );
  var zipcode = obj.namedValues['Code postal'][0];
  var city = obj.namedValues['Ville'][0];
  var address = [street, zipcode, city].join('-');
  return address;
}

function getCoordinates(httpResponse) {
  var data = httpResponse.getContentText("UTF-8");
  var parsedData = JSON.parse(data)
  var coordinates = parsedData.features[0].geometry.coordinates;
  return coordinates;
}