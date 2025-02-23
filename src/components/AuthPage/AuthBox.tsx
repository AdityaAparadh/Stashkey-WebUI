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

const AuthBox = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
      console.error("Login Error:", err);

      if (axios.isAxiosError(err) && err.response) {
        switch (err.response.status) {
          case 400:
            setStatus("Bad Request. Please check your input.");
            break;
          case 401:
            setStatus("Invalid credentials. Please try again.");
            break;
          case 404:
            setStatus("User not found.");
            break;
          case 409:
            setStatus("Username already taken.");
            break;
          case 429:
            setStatus("Too many requests. Please try again later.");
            break;
          case 500:
            setStatus("Internal Server Error. Please try again later.");
            break;
          default:
            setStatus("An unexpected error occurred.");
        }
      } else {
        setStatus("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="login" className="w-full max-w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      {/* Login Tab */}
      <TabsContent value="login">
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
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="masterPassword">Master Password</Label>
                <Input
                  id="masterPassword"
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
      </TabsContent>{" "}
      {/* Register Tab */}
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle>Create Your Vault</CardTitle>
            <CardDescription>
              Set up your username and master password to securely encrpyt and
              store your information in a vault
            </CardDescription>
          </CardHeader>
          <form onSubmit={(e) => handleLogin(e)}>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="masterPassword">Master Password</Label>
                <Input id="masterPassword" type="password" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirmMasterPassword">
                  Confirm Master Password
                </Label>
                <Input id="confirmMasterPassword" type="password" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : "Create Vault"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AuthBox;
