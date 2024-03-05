const Joi = require("@hapi/joi");

const signupValidation = {
  body: {
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    password: Joi.string()
      .min(6)
      .required()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "password"
      ),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .label("confirmPassword")
      .messages({ "any.only": "{{#label}} does not match the password" }),
  },
};

const signinValidation = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(6)
      .required()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "password"
      ),
  },
};

module.exports = {
  signupValidation,
  signinValidation,
};
