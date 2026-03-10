const express = require("express");
const multer = require("multer");

const {
  uploadMedia,
  deleteMedia,
  bulkUploadMedia,
} = require("../../controllers/media/media-controller");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadMedia);
router.delete("/delete/:id", deleteMedia);
router.post("/bulk-upload", upload.array("files", 10), bulkUploadMedia);

module.exports = router;