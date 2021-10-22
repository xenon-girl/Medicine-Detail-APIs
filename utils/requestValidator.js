var validator = require('json-schema');
var requestValidator = function (req, requiredKeys) {

  let response = {
    success: true,
    error: false,
  };

  try {
    let body = JSON.parse(req.body);
    let inputKeys = Object.keys(body);

    for (let key of requiredKeys) {
      if (!inputKeys.includes(key)) {
        response.key = key;
        response.success = false;
        response.error = true;
        response.message = 'Invalid request missing key ' + key;
        return response;
      }
    };

    return response;

  } catch (error) {
    response.message = error.toString();
    response.success = false;
    response.error = true;
    return response;
  }
}

function jsonValidate(request, schema) {
  try {
    // console.log("Validating Request: ", request);
    var validation = validator.validate(request, schema);
    return validation;
  } catch (e) {
    console.error(e);
  }
}

module.exports.requestValidator = requestValidator;
module.exports.jsonValidate = jsonValidate;