const validateJWT = require("../middlewares/validateJWT");
const validateRoles = require("../middlewares/validateRoles");
const validateRoutes = require("../middlewares/validateRoutes");
const validateFile = require("../middlewares/validateFile");
module.exports = {
  ...validateJWT,
  ...validateRoles,
  ...validateRoutes,
  ...validateFile,
};
