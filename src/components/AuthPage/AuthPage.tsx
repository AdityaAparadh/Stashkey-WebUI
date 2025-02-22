import Navbar from "./Navbar";
import AuthBox from "./AuthBox";

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-14 sm:pt-16 px-4 sm:px-6">
        <AuthBox />
      </div>
    </div>
  );
};

export default AuthPage;
