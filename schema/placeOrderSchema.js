'use strict';
module.exports.schema = {
  "type": "object",
  "additionalProperties": true,
  "properties": {
    "data": {
      "type": "array",
      "required": true,
      "minItems": 1,
      "items": {
        "type": "object",
        "required": true,
        "properties": {
          "c_unique_id": {
            "type": "number",
            "required": true
          },
          "quantity": {
            "type": "number",
            "required": true
          },
          "c_name": {
            "type": "string",
            "required": true
          },
        }
      }
    }
  }
}