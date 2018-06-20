/* exported addSpreadsheetTrigger, onFormSubmitTrigger */

function addSpreadsheetTrigger() {
  var sheet = SpreadsheetApp.getActive();
  ScriptApp.newTrigger('onFormSubmitTrigger')
    .forSpreadsheet(sheet)
    .onFormSubmit()
    .create();
}

function onFormSubmitTrigger(event) { 
  var address = formatAddress(event);
  var response = UrlFetchApp.fetch('https://api-adresse.data.gouv.fr/search/?q='+address);
  var coordinates = getAddressCoordinates(response);
  setRangeCoordinates(event, coordinates);
}


function formatAddress(event) {
  var street  = event.namedValues['Rue'][0];
  var zipcode = event.namedValues['Code postal'][0];
  var city    = event.namedValues['Ville'][0];
  var address = [street, zipcode, city].join('-').replace(/\W/g, '-' );
  return address;
}

function getAddressCoordinates(httpResponse) {
  var data = httpResponse.getContentText('UTF-8');
  var parsedData = JSON.parse(data);
  if(parsedData.features[0]){
    var coordinates = parsedData.features[0].geometry.coordinates;
    return coordinates;
  }else{
    MailApp.sendEmail({
      to: 'clairezuliani@gmail.com',
      subject: '[GuideConso] appscript error',
      htmlBody: 'No geocoding response for : '+ parsedData.query
    });
    return null; 
  }
}

function setRangeCoordinates(event, coordinates) {
  if(coordinates){
    var longitude = coordinates[0];
    var latitude = coordinates[1];
    var row = event.range.getRow();
    var latitudeRange = 'P' + row;
    var longitudeRange = 'Q' + row;
    var sheet = event.range.getSheet();
    sheet.getRange(latitudeRange).setValue(latitude);
    sheet.getRange(longitudeRange).setValue(longitude);
  }
}