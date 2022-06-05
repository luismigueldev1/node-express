const { Router } = require("express");
const { check, param } = require("express-validator");
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");
const { existsCategoryId } = require("../helpers/db-validations");
const { validateJWT, validateRequest, isAdminRole } = require("../middlewares");

//router is an instance of Router
const router = Router();

//GET ALL CATEGORIES /api/categories/get-categories
router.get("/get-categories", getCategories);

//GET ONE CATEGORY /api/category/get-category/:id
router.get(
  "/get-category/:id",
  [
    param("id", "Id param should be a correct MongoID").isMongoId(),
    param("id").custom(existsCategoryId),
    validateRequest,
  ],
  getCategory
);

//POST CREATE CATEGORY /api/categories
router.post(
  "/create-category",
  [
    validateJWT,
    isAdminRole,
    check("name", "name is required").not().isEmpty(),
    validateRequest,
  ],
  createCategory
);

//PUT UPDATE CATEGORY /api/categories/:id (Private - ADMIN ROLE)
router.put(
  "/update-category/:id",

  [
    validateJWT,
    isAdminRole,
    param("id", "Id param should be a correct MongoID").isMongoId(),
    param("id").custom(existsCategoryId),
    check("name", "name is required").not().isEmpty(),
    validateRequest,
  ],
  updateCategory
);

//DELETE UPDATE CATEGORY /api/categories/delete-category/:id (Private - ADMIN_ROLE)
router.delete(
  "/delete-category/:id",
  [
    validateJWT,
    isAdminRole,
    param("id", "Id param should be a correct MongoID").isMongoId(),
    param("id").custom(existsCategoryId),
    validateRequest,
  ],
  deleteCategory
);

//export router
module.exports = router;
