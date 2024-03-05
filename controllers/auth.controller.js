const ResponseHelper = require("../helpers/response_helper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Event = require("../models/event.model");
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
   * @description Method to logout
   * @date 28 Feb 2024
   * @updated 28 Feb 2024
   */
  static async logout(req, res) {
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
      response.message = "Logout successfully.";
      response.status = 200;
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
