const { response, request } = require("express");

const collectionAllowed = (...collection) => {
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
