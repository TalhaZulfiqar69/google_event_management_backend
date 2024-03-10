const axios = require("axios");

// google app config
const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirect: `${process.env.FRONTEND_BASE_URL}/auth/success`,
};

// scopes use for the application
const defaultScope = [
  "https://www.googleapis.com/auth/calendar.events.readonly",
  "profile",
  "email",
];

const getConnectionUrl = () => {
  const params = new URLSearchParams({
    access_type: "offline",
    prompt: "consent",
    scope: defaultScope.join(" "),
    client_id: googleConfig.clientId,
    redirect_uri: googleConfig.redirect,
    response_type: "code",
  });

  const googelURL = `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;
  return googelURL;
};

// get auth url
const urlGoogle = () => {
  return getConnectionUrl();
};

const getGoogleAccountFromCode = async (code, cb) => {
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      code: code,
      client_id: googleConfig.clientId,
      client_secret: googleConfig.clientSecret,
      redirect_uri: googleConfig.redirect,
      grant_type: "authorization_code",
    });

    const tokens = response.data;

    const userResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );

    const userProfile = {
      id: userResponse.data.id,
      accessToken: tokens.access_token,
      name: userResponse.data.name,
      displayPicture: userResponse.data.picture,
      email: userResponse.data.email,
    };

    return userProfile;
  } catch (error) {
    console.error(
      "Error getting Google account from code:",
      error.response ? error.response.data : error.message
    );
  }
};

module.exports = {
  urlGoogle,
  getGoogleAccountFromCode,
};
