const dbValidations = require("../../helpers/db-validations");
const generateJWT = require("../../helpers/generateJWT");
const googleVerify = require("../../helpers/googleVerify");
const uploadFile = require("../../helpers/uploadFile");

module.exports = {
  ...dbValidations,
  ...generateJWT,
  ...googleVerify,
  ...dbValidations,
};
