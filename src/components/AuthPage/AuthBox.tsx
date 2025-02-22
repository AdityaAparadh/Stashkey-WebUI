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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthBox = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (
    event: React.FormEvent,
    type: "login" | "register",
  ) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      console.log(`${type} submission`);
    } catch (error) {
      console.error(error);
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
          <form onSubmit={(e) => onSubmit(e, "login")}>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="masterPassword">Master Password</Label>
                <Input id="masterPassword" type="password" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : "Unlock Vault"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

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
          <form onSubmit={(e) => onSubmit(e, "register")}>
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
