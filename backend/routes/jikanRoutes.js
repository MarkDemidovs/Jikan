const express = require("express");
const router = express.Router();
const jikanController = require("../controllers/jikanController");

// GET routes
router.get("/", jikanController.getAllJikans);
router.get("/events/:teamId", jikanController.lookJikans);
router.get("/verify", jikanController.verifyToken);
router.get("/teams/user/:userId", jikanController.getUserTeams); // Move this BEFORE /:id
router.get("/:id", jikanController.getJikan);

// POST routes
router.post("/users", jikanController.addUser);
router.post("/login", jikanController.loginUser);
router.post("/teams", jikanController.addTeam);
router.post("/teams/:teamId/users/:userId", jikanController.addUserToTeam);
router.post("/events", jikanController.addEvent);

// DELETE routes
router.delete("/events/:eventId", jikanController.removeEvent);

module.exports = router;