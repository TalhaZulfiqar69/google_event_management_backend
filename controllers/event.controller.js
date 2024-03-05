const ResponseHelper = require("../helpers/response_helper");
const Event = require("../models/event.model");

class EventController {
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
      const { userId } = req.params;
      console.log("userI :d:", userId);
      const events = await Event.find({ userId: userId });
      if (events) {
        response.success = true;
        response.message = "Events list.";
        response.status = 200;
        response.data = {
          ...events._doc,
        };
      } else {
        response.success = true;
        response.message = "No events available.";
        response.status = 200;
        response.data = {
          ...events._doc,
        };
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
}

module.exports = EventController;
