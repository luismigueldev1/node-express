const { Router } = require("express");
const { check } = require("express-validator");

const { login } = require("../controllers/auth");
const { validateRequest } = require("../middlewares/validateRoutes");

const router = Router();

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").not().isEmpty(),
    validateRequest,
  ],
  login
);

module.exports = router;
