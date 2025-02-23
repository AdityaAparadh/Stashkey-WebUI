import { AuthState } from "@/components/Hooks/useAuth";
import axios from "axios";
import config from "../config";

interface RefreshResponse {
  token: string;
}

/**
 * Function to fetch and set the refresh token.
 * To be called periodically, as well as after certain interactions like Login.
 * @param auth Current auth state
 * @param setAuth function to set auth state
 * @returns {Promise<void>}
 */
const setToken = async (
  auth: AuthState,
  setAuth: (auth: AuthState) => void,
): Promise<void> => {
  // console.log(`setToken called`);
  // console.log(auth);
  try {
    if (auth.isAuthenticated) {
      const res = await axios.post<RefreshResponse>(
        `${config.BACKEND_URI}/auth/refresh`,
        { username: auth.username },
        { withCredentials: true },
      );
      setAuth({ ...auth, token: res.data.token });
    }
  } catch (error) {
    console.error("ERROR FETCHING REFRESH TOKEN");
    console.log(error);
  }
};

export default setToken;
