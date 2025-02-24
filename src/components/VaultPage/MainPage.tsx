import { useState } from "react";
import Navbar from "./Navbar";
import { Button } from "../ui/button";
import { Shield, Share2, User, KeyRound, Pi } from "lucide-react";
import { VaultSection } from "./sections/VaultSection/VaultSection";
import { SharingSection } from "./sections/SharingSection/SharingSection";
import { ProtectionSection } from "./sections/ProtectionSection/ProtectionSection";
import { AccountSection } from "./sections/AccountSection/AccountSection";
import config from "../../config";
import axios from "axios";
import { usePage } from "../Hooks/usePage";
import { PageType } from "@/types/PageType";
type Section = "vault" | "sharing" | "protection" | "account";

const MainPage = () => {
  const [activeSection, setActiveSection] = useState<Section>("vault");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { setCurrentPage } = usePage();
  const handleLogout = () => {
    try {
      axios.post(
        `${config.BACKEND_URI}/auth/logout`,
        {},
        { withCredentials: true },
      );

      /**
       * @todo Remove any state stored in localStorage
       */
      setCurrentPage(PageType.AUTHPAGE);
    } catch (e) {
      console.error("Failed to log out");
      console.error(e);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "vault":
        return <VaultSection />;
      case "sharing":
        return <SharingSection />;
      case "protection":
        return <ProtectionSection />;
      case "account":
        return <AccountSection />;
      default:
        return <VaultSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onMenuClick={() => {
          setIsSidebarOpen(!isSidebarOpen);
        }}
        handleLogout={handleLogout}
      />

      <div className="pt-14 sm:pt-16 flex">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          } w-64 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] border-r fixed left-0 bg-background transition-transform duration-200 ease-in-out z-40`}
        >
          <div className="flex flex-col p-2 gap-2">
            <Button
              variant={activeSection === "vault" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => {
                setActiveSection("vault");
                setIsSidebarOpen(false);
              }}
            >
              <KeyRound className="h-5 w-5 mr-2" />
              <span>Vault</span>
            </Button>
            <Button
              variant={activeSection === "sharing" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => {
                setActiveSection("sharing");
                setIsSidebarOpen(false);
              }}
            >
              <Share2 className="h-5 w-5 mr-2" />
              <span>Sharing</span>
            </Button>
            <Button
              variant={activeSection === "protection" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => {
                setActiveSection("protection");
                setIsSidebarOpen(false);
              }}
            >
              <Shield className="h-5 w-5 mr-2" />
              <span>Protection</span>
            </Button>
            <Button
              variant={activeSection === "account" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => {
                setActiveSection("account");
                setIsSidebarOpen(false);
              }}
            >
              <User className="h-5 w-5 mr-2" />
              <span>Account</span>
            </Button>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 md:ml-64">{renderSection()}</div>
      </div>
    </div>
  );
};

export default MainPage;
