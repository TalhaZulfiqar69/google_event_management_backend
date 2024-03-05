const express = require("express");
const router = express.Router();
const validate = require("express-joi-validate");

const {
  signupValidation,
  signinValidation,
} = require("../helpers/validation_helper");

module.exports = router;
const AuthController = require("../controllers/auth.controller");

// middleware to check and save session cookie
const setCookie = async (req, res, next) => {
  googleUtil.getGoogleAccountFromCode(req.query.code, (err, res) => {
    if (err) {
      res.redirect("/login");
    } else {
      req.session.user = res;
    }
    next();
  });
};

// redirect uri
router.get("/auth/success", setCookie, async (req, res) => {
  if (req.session.user) {
    const accessToken = req.session.user.accessToken;

    try {
      const response = await axios.get(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            timeMin: new Date().toISOString(),
            maxResults: 10,
            singleEvents: true,
            orderBy: "startTime",
          },
        }
      );

      const events = response.data.items;
      console.log("🚀 ~ router.get ~ events:", events);
      const data = {
        name: req.session.user.name,
        displayPicture: req.session.user.displayPicture,
        id: req.session.user.id,
        email: req.session.user.email,
        events: events,
      };
      console.log("data :", data);
      // res.render("dashboard.html", data);
    } catch (error) {
      console.error(
        "Error fetching events:",
        error.response ? error.response.data : error.message
      );
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
  // res.redirect('/redirect');
});

router.get("/redirect", (req, res) => {
  //user redirect to redirect to the react page
  // res.render("redirect.html");
});

router.post("/signin", validate(signinValidation), AuthController.login); // signin api
router.post("/signup", validate(signupValidation), AuthController.registration); // signup api
router.get("/google/login", AuthController.googleAuthentication); // signup api
// router.get("/login", AuthController.test); // signup api
router.get(
  "/google/identity-verification/*",
  AuthController.googelIdentityVerification
); // signup api
router.get("/google/events/:accessToken", AuthController.fetchGoogleEvents); // signup api
// router.post("/signup", validate(signupValidation), AuthController.registration); // signup api

module.exports = router;

// ya29.a0AfB_byDCEnq6C44QWdFVUR2r14SbaMfOUztjwQlyO8SUsOgORIrkB9tiqpHZU8u6OAuWngsCjUASypL9jCXvmYFvGLi6wKl0JwT_22aoQLdd5deuRkNMnilr1YjhjRdImuReID3LhBAGw3gjGp9Cuu1iAseaWVf5giEfaCgYKAWMSARASFQHGX2MiyMns8NW-wMfLZF_b5XtL1A0171
