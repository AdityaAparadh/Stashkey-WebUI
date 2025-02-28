import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import config from "../../config";
import { createKey } from "@/utils/Key";
import { useAuth } from "../Hooks/useAuth";
import { usePage } from "../Hooks/usePage";
import { PageType } from "@/types/PageType";
import { Vault } from "@/types/Vault";
import { getEncryptedBlobAndIV } from "@/utils/Blob";
import { handleError } from "@/utils/error";
import setToken from "@/utils/setToken";
const TURNSTILE_SITEKEY = config.TURNSTILE_SITE_KEY;

/**
 * The Login Form Component. Tight coupling with AuthBox.
 */
const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const { auth, setAuth, latestAuth, latestSetAuth } = useAuth();
  const { setCurrentPage } = usePage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    if (password.length < 8) {
      setStatus("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const authKey: CryptoKey = await createKey(
        password,
        username,
        config.AUTH_KEY_ITERATIONS,
        true,
      );

      const exportedAuthKey = await crypto.subtle.exportKey("jwk", authKey);
      const authKeyString = JSON.stringify(exportedAuthKey);

      await axios.post(
        `${config.BACKEND_URI}/auth/login`,
        {
          username,
          password: authKeyString,
        },
        { withCredentials: true },
      );

      const encryptionKey: CryptoKey = await createKey(
        password,
        username,
        config.ENCRYPTION_KEY_ITERATIONS,
        true,
      );
      setAuth({
        ...auth,
        authKey,
        encryptionKey,
        isAuthenticated: true,
        username,
      });
      latestAuth.current = {
        ...auth,
        authKey,
        encryptionKey,
        isAuthenticated: true,
        username,
      };
      await setToken(latestAuth.current, latestSetAuth.current);
      setCurrentPage(PageType.MAINPAGE);
    } catch (err) {
      handleError(err, setStatus);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-white/30 dark:border-slate-700/40 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(14,18,28,0.4)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-slate-800 dark:text-slate-100">
          Vault Login
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Enter your username and master password to decrypt and access your
          vault
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-3">
          {status && (
            <Alert variant="destructive">
              <AlertDescription>{status}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-1">
            <Label
              htmlFor="login-username"
              className="text-slate-700 dark:text-slate-300"
            >
              Username
            </Label>
            <Input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="login-masterPassword"
              className="text-slate-700 dark:text-slate-300"
            >
              Master Password
            </Label>
            <Input
              id="login-masterPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full shadow-md bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Unlock Vault"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

/**
 * The Register Form Component. Tight coupling with AuthBox.
 */

const RegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTurnstile = () => {
      if (window.turnstile && turnstileRef.current) {
        window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITEKEY,
          callback: (token: string) => setTurnstileToken(token),
          "expired-callback": () => setTurnstileToken(""),
          "error-callback": () => setTurnstileToken(""),
        });
      }
    };

    if (!window.turnstile) {
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=turnstileOnLoad";
      script.async = true;
      window.turnstileOnLoad = loadTurnstile;
      document.body.appendChild(script);
    } else {
      loadTurnstile();
    }
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    if (password.length < 8) {
      setStatus("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setStatus("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!turnstileToken) {
      setStatus("Please complete the verification challenge");
      setIsLoading(false);
      return;
    }

    try {
      const authKey: CryptoKey = await createKey(
        password,
        username,
        config.AUTH_KEY_ITERATIONS,
        true,
      );
      const encryptionKey: CryptoKey = await createKey(
        password,
        username,
        config.ENCRYPTION_KEY_ITERATIONS,
        false,
      );

      const exportedAuthKey = await crypto.subtle.exportKey("jwk", authKey);

      const initialVault: Vault = {
        username,
        lastModified: new Date(),
        publicKey: "",
        privateKey: "",
        vaultData: null,
      };
      const { blob, iv } = await getEncryptedBlobAndIV(
        initialVault,
        encryptionKey,
      );

      const formData: FormData = new FormData();
      formData.append("username", username);
      formData.append("password", JSON.stringify(exportedAuthKey));
      formData.append("iv", iv);
      formData.append("vault", blob);
      formData.append("turnstileToken", turnstileToken);

      await axios.post(`${config.BACKEND_URI}/auth/signup`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus("Successfully Signed Up! Please Log In to continue");
    } catch (err) {
      window.turnstile.reset();
      handleError(err, setStatus);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-white/30 dark:border-slate-700/40 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(14,18,28,0.4)]">
      <CardHeader className="pb-3">
        <CardTitle className="text-slate-800 dark:text-slate-100">
          Create Your Vault
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Set up your username and master password to securely encrypt and store
          your information in a vault
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleRegister}>
        <CardContent className="space-y-3">
          {status && (
            <Alert variant="destructive">
              <AlertDescription>{status}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-1">
            <Label
              htmlFor="register-username"
              className="text-slate-700 dark:text-slate-300"
            >
              Username
            </Label>
            <Input
              id="register-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="register-masterPassword"
              className="text-slate-700 dark:text-slate-300"
            >
              Master Password
            </Label>
            <Input
              id="register-masterPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="register-confirmMasterPassword"
              className="text-slate-700 dark:text-slate-300"
            >
              Confirm Master Password
            </Label>
            <Input
              id="register-confirmMasterPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
            />
          </div>
          <div className="mt-4">
            {/* The Turnstile widget will render inside this div */}
            <div ref={turnstileRef} />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full shadow-md bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            disabled={isLoading || !turnstileToken}
          >
            {isLoading ? "Loading..." : "Create Vault"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

const AuthBox = () => {
  return (
    <div className="w-full max-w-[400px] relative z-10 p-2">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 dark:from-primary/5 dark:to-purple-600/5 rounded-xl blur-xl -z-10"></div>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 p-1 rounded-lg mb-2 shadow-sm">
          <TabsTrigger
            value="login"
            className="data-[state=active]:bg-white/90 data-[state=active]:dark:bg-slate-700/90 data-[state=active]:shadow-sm transition-all"
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className="data-[state=active]:bg-white/90 data-[state=active]:dark:bg-slate-700/90 data-[state=active]:shadow-sm transition-all"
          >
            Register
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="login"
          className="mt-0 outline-none ring-0 focus:outline-none focus:ring-0"
        >
          <LoginForm />
        </TabsContent>
        <TabsContent
          value="register"
          className="mt-0 outline-none ring-0 focus:outline-none focus:ring-0"
        >
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthBox;
