const { Router } = require("express");
const {
  uploadFile,
  getImage,
  updateImageCloudinary,
} = require("../controllers/uploads");
const { param } = require("express-validator");
const { validateRequest, validateFile } = require("../middlewares");

const router = Router();

router.post("/", validateFile, uploadFile);
router.put(
  "/:collection/:id",
  [
    validateFile,
    param("id", "id is not a mongo id").isMongoId(),
    param("collection", "Invalid collection").isIn(["users", "products"]),
    validateRequest,
  ],
  updateImageCloudinary
);
router.get(
  "/get-image/:collection/:id",
  [
    param("id", "id is not a mongo id").isMongoId(),
    param("collection", "Invalid collection").isIn(["users", "products"]),
    validateRequest,
  ],
  getImage
);
module.exports = router;
