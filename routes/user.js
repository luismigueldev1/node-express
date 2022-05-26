const { Router } = require("express");
const { check, param, query } = require("express-validator");

const {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} = require("../controllers/user");
const {
  isEmailAlreadyUsed,
  isValidRole,
  existsUserId,
} = require("../helpers/db-validations");

const { validateJWT, isRole, validateRequest } = require("../middlewares");

const router = Router();

router.post(
  "/create-user",
  check("name", "Name is required").not().isEmpty(),
  check("password", "Password must be length than 6 characters").isLength({
    min: 6,
  }),
  check("email", "Email invalid").isEmail(),
  check("email").custom(isEmailAlreadyUsed),
  check("role").custom(isValidRole),
  validateRequest,
  createUser
);

router.put(
  "/update-user/:id",
  [
    param("id", "Id param should be a correct MongoID").isMongoId(),
    param("id").custom(existsUserId),
    check("password", "Password must be length than 6 characters")
      .optional()
      .isLength({
        min: 6,
      }),
    check("role").custom(isValidRole),
    validateRequest,
  ],
  updateUser
);

router.get(
  "/get-users",
  [
    query("limit", "Limit query param must be a number").optional(),
    query("skip", "Skip query param must be a number").optional(),
    validateRequest,
  ],
  getUsers
);

router.delete(
  "/delete-user/:id",
  [
    validateJWT,
    //isAdminRole,
    isRole("ADMIN_ROLE", "SALES_ROLE"),
    param("id", "Id param should be a correct MongoID").isMongoId(),
    param("id").custom(existsUserId),
    validateRequest,
  ],
  deleteUser
);

module.exports = router;
