const validateJWT = require("../middlewares/validateJWT");
const validateRoles = require("../middlewares/validateRoles");
const validateRoutes = require("../middlewares/validateRoutes");

module.exports = {
  ...validateJWT,
  ...validateRoles,
  ...validateRoutes,
};
