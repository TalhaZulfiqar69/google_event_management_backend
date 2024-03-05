const express = require("express");
const router = express.Router();
const checkIfAuthenticated = require("../middlewares/checkIfAuthenticated");
const EventController = require("../controllers/event.controller");

// router.get("/:id", EventController.fetchGoogleEvents); // User events listing api

router.get(
  "/google/:accessToken",
  checkIfAuthenticated,
  EventController.fetchGoogleEvents
); // signup api
router.get("/:id", checkIfAuthenticated, EventController.userEventList); // User events listing api
router.post("/", EventController.createEvents); // Create events for user api

module.exports = router;
