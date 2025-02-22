import axios from "axios";
import config from "../config";

/**
 * Sends a POST request to the server and fetches a new refresh token valid for 10 min
 * @param username
 * @returns A string of the new refresh token
 */
export const fetchRefreshToken = async (
  username: string,
): Promise<string | null> => {
  let token: string | null = null;

  await axios
    .post(
      `${config.BACKEND_URI}/auth/refresh`,
      {
        username,
      },
      { withCredentials: true },
    )
    .then((res) => {
      token = res.data.token;
    })
    .catch((err) => {
      console.error(err);
      console.log("ERROR FETCHING REFRESH TOKEN");
    });
  return token;
};
