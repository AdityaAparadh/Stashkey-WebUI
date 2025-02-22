import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { LoginCard } from "./LoginCard";
import { IdentityCard } from "./IdentityCard";
import { CreditCardCard } from "./CreditCardCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const mockLogins = [
  {
    id: "1",
    name: "Google",
    username: "user@gmail.com",
    url: "google.com",
    notes: "This is my personal Google account for all Google services",
    modifiedAt: new Date(2024, 0, 15),
  },
  {
    id: "2",
    name: "GitHub",
    username: "developer123",
    url: "github.com",
    notes: "Work GitHub account",
    modifiedAt: new Date(2024, 0, 10),
  },
  {
    id: "3",
    name: "Netflix",
    username: "netflix_user",
    url: "netflix.com",
    notes: "Family Netflix subscription",
    modifiedAt: new Date(2024, 0, 5),
  },
  {
    id: "4",
    name: "Amazon",
    username: "shopper@email.com",
    url: "amazon.com",
    notes: "Prime membership account",
    modifiedAt: new Date(2024, 0, 1),
  },
  {
    id: "5",
    name: "Microsoft",
    username: "msuser@outlook.com",
    url: "microsoft.com",
    notes: "Microsoft 365 account",
    modifiedAt: new Date(2023, 11, 25),
  },
  {
    id: "6",
    name: "Portfolio",
    username: "aditya.aparadh.0@gmail.com",
    url: "aditya.software",
    notes: "My personal portfolio site",
    modifiedAt: new Date(2023, 11, 25),
  },
];
export const VaultSection = () => {
  return (
    <div className="h-full flex flex-col gap-4 sm:gap-6">
      {/* Search Section */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search vault..." className="pl-9" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="logins" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="logins">Logins</TabsTrigger>
          <TabsTrigger value="identities">Identities</TabsTrigger>
          <TabsTrigger value="cards">Credit Cards</TabsTrigger>
        </TabsList>

        {/* Login Records */}
        <TabsContent
          value="logins"
          className="flex-1 space-y-2 overflow-y-auto mt-2 sm:mt-4 pr-2 sm:pr-4 -mr-2 sm:-mr-4"
        >
          {mockLogins.map((login) => (
            <LoginCard
              key={login.id}
              name={login.name}
              username={login.username}
              url={login.url}
              notes={login.notes}
              modifiedAt={login.modifiedAt}
            />
          ))}
        </TabsContent>

        {/* Identity Records */}
        <TabsContent
          value="identities"
          className="flex-1 space-y-2 overflow-y-auto mt-2 sm:mt-4 pr-2 sm:pr-4 -mr-2 sm:-mr-4"
        >
          <IdentityCard />
        </TabsContent>

        {/* Credit Card Records */}
        <TabsContent
          value="cards"
          className="flex-1 space-y-2 overflow-y-auto mt-2 sm:mt-4 pr-2 sm:pr-4 -mr-2 sm:-mr-4"
        >
          <CreditCardCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};
