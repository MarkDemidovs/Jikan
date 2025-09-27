const express = require("express");
const router = express.Router();
const jikanController = require("../controllers/jikanController");

router.get("/", jikanController.getAllJikans);

//router.post("/", jikanController.addJikan);

//router.patch("/:id", jikanController.updateJikan);

//router.delete("/:id", jikanController.deleteJikan);

module.exports = router;