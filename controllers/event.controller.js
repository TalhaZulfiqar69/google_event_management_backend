const ResponseHelper = require("../helpers/response_helper");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const User = require("../models/user.model");
const Event = require("../models/event.model");

class EventController {
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
      const authorizationToken = req.headers["authorization"].split(" ");
      const userEmail = jwt.verify(
        authorizationToken[1],
        process.env.JWT_SECRET_STRING
      );

      const user = await User.findOne({ email: userEmail?.email });

      if (!user) {
        response.message = "User not found with this email.";
        return;
      }

      await User.updateOne(
        { _id: user?._id },
        {
          $set: {
            googleAccessToken: accessToken
              ? accessToken
              : user?.googleAccessToken,
          },
        }
      );

      const {
        data: { items: events },
      } = await axios.get(
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

      const eventsData = [];
      events.forEach((event) => {
        eventsData.push({
          userId: user?._id,
          eventName: event?.summary,
          eventDate: event?.originalStartTime?.dateTime,
          end: event?.end?.dateTime,
          start: event?.start?.dateTime,
          description: event?.description,
          attendees: event?.attendees,
          organizer: event?.organizer?.email || event?.creator?.email,
        });
      });

      if (eventsData.length > 0) {
        await Event.insertMany(eventsData);
        response.success = true;
        response.message = "Events fetched from google successfully.";
        response.status = 200;
        response.data = eventsData;
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
   * @description Method to signup
   * @date 28 Feb 2024
   * @updated 28 Feb 2024
   */
  static async userEventList(req, res) {
    let response = ResponseHelper.getResponse(
      false,
      "Something went wrong",
      {},
      400
    );

    try {
      const { id } = req.params;
      const events = await Event.find({ userId: id });
      if (events) {
        response.success = true;
        response.message = "Events list.";
        response.status = 200;
        response.data = events;
      } else {
        response.success = true;
        response.message = "No events available.";
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
   * @description Method to signin
   * @date 28 Feb 2024
   * @updated 28 Feb 2024
   */
  static async createEvents(req, res) {
    let response = ResponseHelper.getResponse(
      false,
      "Something went wrong",
      {},
      400
    );

    try {
      const { eventsData } = req.body;

      const events = await Event.insertMany(eventsData);
      if (events) {
        response.success = true;
        response.status = 200;
        response.message = "Your events saved successfully.";
      }
    } catch (err) {
      response.message = err.message || "Internal Server Error";
      response.status = 500;
    } finally {
      return res.status(response.status).json(response);
    }
  }
  /**
   * @param req request body
   * @param res callback response object
   * @description Method to logout
   * @date 28 Feb 2024
   * @updated 28 Feb 2024
   */
  static async disconnectCalendar(req, res) {
    let response = ResponseHelper.getResponse(
      false,
      "Something went wrong",
      {},
      400
    );

    try {
      const authorizationToken = req.headers["authorization"].split(" ");
      const userEmail = jwt.verify(
        authorizationToken[1],
        process.env.JWT_SECRET_STRING
      );
      const user = await User.findOne({ email: userEmail?.email });
      if (!user) {
        response.message = "User not found with this email.";
        return;
      }
      await User.updateOne(
        { _id: user?._id },
        {
          $set: {
            googleAccessToken: "",
          },
        }
      );
      await Event.deleteMany({ userId: user?._id });
      response.success = true;
      response.message = "Calender disconnected successfully.";
      response.status = 200;
    } catch (err) {
      console.log("error", err);
      response.message = err.message || "Internal Server Error";
      response.status = 500;
    } finally {
      return res.status(response.status).json(response);
    }
  }
}

module.exports = EventController;
