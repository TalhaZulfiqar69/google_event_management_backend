const express = require("express");
const router = express.Router();
const validate = require("express-joi-validate");
const {
  signupValidation,
  signinValidation,
} = require("../helpers/validation_helper");
const checkIfAuthenticated = require("../middlewares/checkIfAuthenticated");

const AuthController = require("../controllers/auth.controller");

router.post("/signin", validate(signinValidation), AuthController.login); // signin api
router.post("/signup", validate(signupValidation), AuthController.registration); // signup api
router.get("/google/login", AuthController.googleAuthentication); // signup api
router.get(
  "/google/identity-verification/*",
  AuthController.googelIdentityVerification
);

module.exports = router;
