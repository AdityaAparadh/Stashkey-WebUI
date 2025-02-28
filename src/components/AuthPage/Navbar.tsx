import { ThemeToggle } from "../Commons/ThemeToggle";
// import { LockKeyhole } from "lucide-react";
// import logo from "../../assets/logo.png";
import { Codesandbox } from "lucide-react";

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 right-0 border-b bg-background">
      <div className="container px-4 sm:px-6 mx-auto">
        <div className="flex h-14 sm:h-16 items-center justify-between max-w-full">
          <div className="flex items-center gap-2">
            <Codesandbox className="h-5 w-5 sm:h-6 sm:w-6" />
            {/* <img src={logo} alt="Stashkey" className="h-5"></img> */}
            <span className="font-semibold text-lg sm:text-xl hidden sm:inline">
              Stashkey
            </span>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
