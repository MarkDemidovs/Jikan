const express = require("express");
const router = express.Router();
const jikanController = require("../controllers/jikanController");

router.get("/", jikanController.getAllJikans);

router.get("/:id", jikanController.getJikan);

router.post("/users", jikanController.addUser);

router.post("/login", jikanController.loginUser);

router.post("/teams", jikanController.addTeam);

/*
router.post("/teams/:teamId/users/:userId", jikanController.addUserToTeam);

router.post("/events", jikanController.addEvent);*/

module.exports = router;