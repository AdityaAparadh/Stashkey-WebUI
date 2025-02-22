import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import AuthPage from "./components/AuthPage/AuthPage";
import VaultPage from "./components/VaultPage/VaultPage";

function App() {
  return (
    <>
      <div className="">
        {/* <AuthPage /> */}
        <VaultPage />
      </div>
    </>
  );
}

export default App;
