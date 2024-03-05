const express = require("express");
const router = express.Router();
const authRouter = require("./users");
const eventsRouter = require("./events");

/* GET default server response. */
router.get("/", function (req, res) {
  res.status(200).json({
    status: 200,
    success: true,
    message: "Welcome to Backend APIs",
    data: {},
  });
});

router.use("/auth", authRouter); // Auth routes
router.use("/events", eventsRouter); // Events routes

module.exports = router;
