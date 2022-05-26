const { request, response } = require("express");
const User = require("../models/user");

const isAdminRole = (req = request, res = response, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: "You must validate jwt and after validate role",
    });
  }
  const { role, name } = req.user;

  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name} is not a admin. Permission denied `,
    });
  }

  next();
};

const isRole = (...roles) => {
  return (req = request, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: "You must validate jwt and after validate role",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: `This service require thoses roles: [${roles}]`,
      });
    }

    next();
  };
};

module.exports = {
  isAdminRole,
  isRole,
};
