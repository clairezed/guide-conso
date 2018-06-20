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
  commitDataToGithub();
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

/* Function GREATLY inspired of https://script.google.com/d/1jI_BpCFqKstGFQ8sNY8nJwjOiXXhubKDvD7G9h6U1iE63mzX2e4U-ak_/edit?usp=sharing */
function commitDataToGithub() {
  var branch = 'master';
  var githubToken = PropertiesService.getScriptProperties().getProperty('githubAuthToken');
  
  Github.setTokenService(githubToken);
  Github.setRepo('clairezed', 'guide-conso'); 
  
  var csvFile = spreadsheetToCsv();
  var fileName = 'guide-conso-data.csv';
  
  try {
    var resp = Github.Repository.createFile(branch, fileName, csvFile, 'Add file '+fileName);
    console.log(resp);
  } catch(e) {
    var git_file_obj = Github.Repository.getContents({ref: branch}, fileName);
    Github.Repository.updateFile(branch, fileName, csvFile, git_file_obj.sha, 'Update file '+fileName, {encode: false});
  }
}

/* GREATLY inspired of https://gist.github.com/mderazon/9655893 */
function spreadsheetToCsv() {
  var csvFile = undefined;
  var sheet = SpreadsheetApp.getActive();
  // get available data range in the spreadsheet
  var activeRange = sheet.getDataRange();

  try {
    var data = activeRange.getValues();
    // loop through the data in the range and build a string with the csv data
    if (data.length > 1) {
      var csv = '';
      for (var row = 0; row < data.length; row++) {
        for (var col = 0; col < data[row].length; col++) {
          if (data[row][col].toString().indexOf(',') != -1) {
            data[row][col] = '"' + data[row][col] + '"';
          }
        }

        // join each row's columns
        // add a carriage return to end of each row, except for the last one
        if (row < data.length-1) {
          csv += data[row].join(',') + '\r\n';
        }
        else {
          csv += data[row];
        }
      }
      csvFile = csv;
    }
    return csvFile;
  }
  catch(err) {
    console.log(err);
  }
}