const ResponseHelper = require("../helpers/response_helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../models/user.model");
const saltRounds = 10;

const googleHelper = require("../helpers/google_helper");

class AuthController {
  /**
   * @param req request body
   * @param res callback response object
   * @description Method to signup
   * @date 28 Feb 2024
   * @updated 28 Feb 2024
   */
  static async registration(req, res) {
    let response = ResponseHelper.getResponse(
      false,
      "Something went wrong",
      {},
      400
    );

    try {
      const { email, name, password } = req.body;

      const hashedPassword = bcrypt.hashSync(password, saltRounds);
      console.log({ email, name, password, hashedPassword });
      const user = await User.create({
        email,
        name,
        password: hashedPassword,
      });
      if (user) {
        response.success = true;
        response.message = "Account created successfully. Thank you.";
        response.status = 200;
      }
    } catch (error) {
      response.message = error.message || "An internal server error occurred";
      response.status = 500;
      response.success = false;
    } finally {
      return res.status(response.status).json(response);
    }
  }
  /**
   * @param req request body
   * @param res callback response object
   * @description Method to signin
   * @date 28 Feb 2024
   * @updated 28 Feb 2024
   */
  static async login(req, res) {
    let response = ResponseHelper.getResponse(
      false,
      "Something went wrong",
      {},
      400
    );

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        response.message = "Email or password is incorrect.";
        return false;
      }
      const compareHashPassword = await bcrypt.compareSync(
        password,
        user.password
      );

      console.log("compareHashPassword :", compareHashPassword);
      if (compareHashPassword === false) {
        response.message = "Password is incorrect.";
        return false;
      }

      if (user) {
        const token = jwt.sign(
          { email: user.email },
          process.env.JWT_SECRET_STRING
        );

        response.success = true;
        response.message = "Logged in successfully.";
        response.status = 200;
        response.data = {
          ...user._doc,
          token,
        };
      }
    } catch (err) {
      console.log("error", err);
      response.message = err.message || "Internal Server Error";
      response.status = 500;
    } finally {
      return res.status(response.status).json(response);
    }
  }
  /**
   * @param req request body
   * @param res callback response object
   * @description Method to googel authentication
   * @date 28 Feb 2024
   * @updated 28 Feb 2024
   */

  static async googleAuthentication(req, res) {
    let response = ResponseHelper.getResponse(
      false,
      "Something went wrong",
      {},
      400
    );

    try {
      const google = googleHelper.urlGoogle();
      if (google) {
        response.success = true;
        response.message = "Account created successfully. Thank you.";
        response.status = 200;
        response.data = google;
      }
    } catch (error) {
      response.message = error.message || "An internal server error occurred";
      response.status = 500;
      response.success = false;
    } finally {
      return res.status(response.status).json(response);
    }
  }
  /**
   * @param req request body
   * @param res callback response object
   * @description Method to googel identity verification
   * @date 28 Feb 2024
   * @updated 28 Feb 2024
   */
  static async fetchGoogleEvents(req, res) {
    let response = ResponseHelper.getResponse(
      false,
      "Something went wrong",
      {},
      400
    );

    try {
      const { accessToken } = req.params;
      const eventsData = await axios.get(
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
      // const events = {
      //   id: eventsData.data.items?.id,
      //   status: eventsData.data.items?.id,
      //   createdDate: eventsData.data.items?.id,
      //   summary: eventsData.data.items?.id,
      //   description: eventsData.data.items?.id,
      //   creator: eventsData.data.items?.creator?.email,
      //   organizer: eventsData.data.items?.organizer?.email,
      //   start: eventsData.data.items?.Start?.dateTime,
      //   end: eventsData.data.items?.end?.dateTime,
      //   attendees: eventsData.data.items?.id,
      // };
      const events = eventsData.data.items;

      console.log("events :", events);
      if (events && events?.length) {
        // const userEvents = await Event.insertMany(eventsToInsert);
        response.success = true;
        response.message = "Events fetched successfully.";
        response.status = 200;
        response.data = events;
      }
    } catch (error) {
      response.message = error.message || "An internal server error occurred";
      response.status = 500;
      response.success = false;
    } finally {
      return res.status(response.status).json(response);
    }
  }
  /**
   * @param req request body
   * @param res callback response object
   * @description Method to googel identity verification
   * @date 28 Feb 2024
   * @updated 28 Feb 2024
   */
  static async googelIdentityVerification(req, res) {
    let response = ResponseHelper.getResponse(
      false,
      "Something went wrong",
      {},
      400
    );

    try {
      const code = req.params[0];
      const google = await googleHelper.getGoogleAccountFromCode(code);

      console.log("googlegooglegoogle :", google);
      // console.log("pain di siri :", google?.accessToken);
      // const events = await this.fetchGoogleEvents(google?.accessToken);
      // console.log("eventseventseventsevents :", events);
      if (google) {
        response.success = true;
        response.message = "Authenticated from google successfully. Thank you.";
        response.status = 200;
        response.data = google;
      }
    } catch (error) {
      response.message = error.message || "An internal server error occurred";
      response.status = 500;
      response.success = false;
    } finally {
      return res.status(response.status).json(response);
    }
  }
}

module.exports = AuthController;
