import { useEffect } from "react";
import "./App.css";
import AuthPage from "./components/AuthPage/AuthPage";
import { useAuth } from "./components/Hooks/useAuth";
import setToken from "./utils/setToken";
import { usePage } from "./components/Hooks/usePage";
import { PageType } from "./types/PageType";
import MainPage from "./components/VaultPage/MainPage";
import LandingPage from "./components/LandingPage/LandingPage";

function App() {
  /**
   * Periodically update the refresh token
   */
  const { latestAuth, latestSetAuth } = useAuth();
  useEffect(() => {
    // const INTERVAL = config.REFRESH_TOKEN_INTERVAL * 60 * 1000;
    const INTERVAL = 10 * 1000;
    const refreshToken = async () => {
      try {
        await setToken(latestAuth.current, latestSetAuth.current);
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    };
    refreshToken();
    const interval = setInterval(refreshToken, INTERVAL);
    return () => {
      clearInterval(interval);
    };
  }, []); // setAuth never changes defn so no issues

  const { currentPage } = usePage();

  return (
    <>
      <div className="">
        {currentPage == PageType.AUTHPAGE ? (
          <AuthPage />
        ) : currentPage == PageType.MAINPAGE ? (
          <MainPage />
        ) : (
          <LandingPage />
        )}
      </div>
    </>
  );
}

export default App;
