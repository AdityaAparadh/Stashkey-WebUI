// AuthBox.tsx
import { useState } from "react";
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

/**
 * The Login Form Component. Tight coupling with AuthBox.
 */
const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const { auth, setAuth } = useAuth();
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

      setCurrentPage(PageType.MAINPAGE);
    } catch (err) {
      handleError(err, setStatus);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vault Login</CardTitle>
        <CardDescription>
          Enter your username and master password to decrypt and access your
          vault
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-2">
          {status && (
            <Alert variant="destructive">
              <AlertDescription>{status}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-1">
            <Label htmlFor="login-username">Username</Label>
            <Input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="login-masterPassword">Master Password</Label>
            <Input
              id="login-masterPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
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

      await axios.post(`${config.BACKEND_URI}/auth/signup`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsLoading(false);
      setStatus("Successfully Signed Up! Please Log In to continue");
    } catch (err) {
      handleError(err, setStatus);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your Vault</CardTitle>
        <CardDescription>
          Set up your username and master password to securely encrypt and store
          your information in a vault
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleRegister}>
        <CardContent className="space-y-2">
          {status && (
            <Alert variant="destructive">
              <AlertDescription>{status}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-1">
            <Label htmlFor="register-username">Username</Label>
            <Input
              id="register-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="register-masterPassword">Master Password</Label>
            <Input
              id="register-masterPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="register-confirmMasterPassword">
              Confirm Master Password
            </Label>
            <Input
              id="register-confirmMasterPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Loading..." : "Create Vault"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

const AuthBox = () => {
  return (
    <Tabs defaultValue="login" className="w-full max-w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <LoginForm />
      </TabsContent>
      <TabsContent value="register">
        <RegisterForm />
      </TabsContent>
    </Tabs>
  );
};

export default AuthBox;
