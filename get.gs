// Execute url: https://script.google.com/macros/s/AKfycbxYKwsjq6jB2Oo0xwz4bmkd3-5hdguopA6VJ5KD/exec?type=

/**
 * Test use method
 */
function test() {
  // let data = { type: "answer", sn: 1 }
  // let data = { type: undefined, sn: undefined }
  doGet(data);
}

/**
 * Native function of Apps Script, triggered when requests send with GET method
 * @param {Request} request request sent from client
 */
function doGet(request) {
  let parameters = request.parameter;
  let response = reflect(parameters);

  return ContentService.createTextOutput(response).setMimeType(ContentService.MimeType.JSON);
}

/**
 * To reflect request to corresponding response
 * @param parameters parameters sent with get method
 * @param reflectorIndex index of reflector to try
 */
function reflect(parameters, reflectorIndex = 0) {
  if (checkRequirements(parameters, REFLECTORS[reflectorIndex].requirements))
    return REFLECTORS[reflectorIndex].action(parameters);

  return reflect(parameters, ++reflectorIndex);
}

/**
 * Check parameters is satisfied with requirements of reflector
 * @param parameters parameters sent with get method
 * @param requirements requirements of reflector to test parameters
 */
function checkRequirements(parameters, requirements) {
  var passed = [];
  for (let key in requirements) {
    if (parameters[key])
      passed.push(requirements[key].test(parameters[key]));
    else
      passed.push(false);
  }
  return passed.indexOf(false) == -1;
}
