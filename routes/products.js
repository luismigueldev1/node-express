const { Router } = require("express");
const { check, param } = require("express-validator");

const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");
const {
  existProductId,
  existsCategoryId,
} = require("../helpers/db-validations");
const { validateJWT, isAdminRole, validateRequest } = require("../middlewares");

const router = Router();

router.get("/get-products", getProducts);

router.get(
  "/get-product/:id",
  [
    param("id", "Id param should be a correct MongoID").isMongoId(),
    param("id").custom(existProductId),
  ],
  getProduct
);

router.post(
  "/create-product",
  [
    validateJWT,
    isAdminRole,
    check("category", "Id param should be a correct MongoID").isMongoId(),
    check("category").custom(existsCategoryId),
    check("name", "name is required").not().isEmpty(),
    validateRequest,
  ],
  createProduct
);

router.put(
  "/update-product/:id",
  [
    validateJWT,
    isAdminRole,
    param("id", "Id param should be a correct MongoID").isMongoId(),
    param("id").custom(existProductId),
    validateRequest,
  ],
  updateProduct
);

router.delete(
  "/delete-product/:id",
  [
    validateJWT,
    isAdminRole,
    param("id", "Id param should be a correct MongoID").isMongoId(),
    param("id").custom(existProductId),
  ],
  deleteProduct
);

//export router
module.exports = router;
