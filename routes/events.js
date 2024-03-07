const express = require("express");
const router = express.Router();
const checkIfAuthenticated = require("../middlewares/checkIfAuthenticated");
const EventController = require("../controllers/event.controller");

router.get(
  "/google/:accessToken",
  checkIfAuthenticated,
  EventController.fetchGoogleEvents
); // signup api
router.get("/user/disconnect-calendar", EventController.disconnectCalendar);
router.get("/:id", checkIfAuthenticated, EventController.userEventList);
router.post("/", EventController.createEvents);

module.exports = router;
