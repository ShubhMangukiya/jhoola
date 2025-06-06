const express = require("express");
const router = express.Router();
const multer = require("multer");
const productController = require("../controller/productController");

// Multer setup to store files in 'uploads' folder with unique filenames
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // make sure folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.array("images", 8), productController.createProduct);

router.get("/", productController.getAllProducts);

router.get("/:id", productController.getProductById);

router.put("/:id", upload.array("images", 8), productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

// router.get("/:productId", productController.getProductById);


module.exports = router;
