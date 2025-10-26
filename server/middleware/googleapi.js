import { google } from "googleapis";
import keys from "../outh2.json" with { type: "json" };

// Создаем базовый OAuth2 клиент
const createOAuth2Client = () => {
  return new google.auth.OAuth2(
    keys.web.client_id,
    keys.web.client_secret,
    keys.web.redirect_uris[0]
  );
};

export const oauth2url = (state) => {
  return createOAuth2Client().generateAuthUrl({
    access_type: "offline",
    scope: [
      "email",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/gmail.readonly", 
    ],
    prompt: "consent",
    state: state,
  });
};

// Функция для получения OAuth2 клиента с токенами пользователя
export const getAuthenticatedClient = (refreshToken) => {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });
  return oauth2Client;
};

// Функция для обмена authorization code на токены
export const getTokensFromCode = async (code) => {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

// Функция для получения информации о пользователе (включая email)
export const getUserInfo = async (accessToken) => {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({ access_token: accessToken });
  
  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });
  
  const { data } = await oauth2.userinfo.get();
  return data; // { id, email, verified_email, picture }
};

export default createOAuth2Client;
