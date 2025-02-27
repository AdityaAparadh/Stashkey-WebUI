import { ThemeToggle } from "../Commons/ThemeToggle";
import { Codesandbox, LogOut, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../Hooks/useAuth";
// import logo from "../../assets/logo.png";
interface NavbarProps {
  onMenuClick: () => void;
  handleLogout: () => void;
}

const Navbar = ({ onMenuClick, handleLogout }: NavbarProps) => {
  const { auth } = useAuth();

  return (
    <div className="fixed top-0 left-0 right-0 border-b bg-background">
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="flex h-14 sm:h-16 items-center justify-between max-w-full">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="md:hidden mr-2"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* <img src={logo} alt="Stashkey" className="h-5"></img> */}
            <Codesandbox className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="font-semibold text-lg sm:text-xl hidden sm:inline">
              Stashkey
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{auth.username}</span>
            <ThemeToggle />
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
