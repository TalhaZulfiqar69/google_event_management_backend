const express = require("express");
const router = express.Router();

module.exports = router;
const EventController = require("../controllers/event.controller");

router.get("/:id", EventController.userEventList); // User events listing api
router.post("/", EventController.createEvents); // Create events for user api

module.exports = router;
