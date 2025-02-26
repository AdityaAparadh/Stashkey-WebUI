import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Key, User, CreditCard, FileText, Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LoginCard } from "./LoginCard";
import { IdentityCard } from "./IdentityCard";
import { CardCard } from "./CardCard";
import { NoteCard } from "./NoteCard";
import { LoginDetails } from "./LoginDetails";
import { CardDetails } from "./CardDetails";
import { AddLoginDialog } from "./AddLoginDialog";
import AddCardDialog from "./AddCardDialog";
import { useVault } from "@/components/Hooks/useVault";
import { RecordType } from "@/types/Record";
import type { Login } from "@/types/Login";
import type { Identity } from "@/types/Identity";
import type { Card } from "@/types/Card";
import type { Note } from "@/types/Note";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const VaultSection = () => {
  const { vault } = useVault();
  const [selectedLogin, setSelectedLogin] = useState<
    (Login & { name?: string }) | null
  >(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showAddLogin, setShowAddLogin] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);

  if (!vault) {
    return <div className="p-4">Vault not found.</div>;
  }

  const loginRecords = vault.vaultData
    ? (vault.vaultData.filter(
        (record) => record.recordType === RecordType.LOGIN,
      ) as (Login & { name?: string })[])
    : [];
  const identityRecords = vault.vaultData
    ? (vault.vaultData.filter(
        (record) => record.recordType === RecordType.IDENTITY,
      ) as Identity[])
    : [];
  const cardRecords = vault.vaultData
    ? (vault.vaultData.filter(
        (record) => record.recordType === RecordType.CARD,
      ) as Card[])
    : [];
  const noteRecords = vault.vaultData
    ? (vault.vaultData.filter(
        (record) => record.recordType === RecordType.NOTE,
      ) as Note[])
    : [];

  const getLoginDisplayName = (record: Login & { name?: string }): string => {
    if (record.name && record.name.trim() !== "") return record.name;
    if (record.url && record.url.length > 0) {
      const domain = record.url[0]
        .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
        .split(".")[0];
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    }
    return record.username;
  };

  return (
    <div className="h-full flex flex-col gap-4 sm:gap-6">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search vault..." className="pl-9" />
        </div>
        {/* Dropdown “Add Record” Button using lucide Plus icon */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="btn btn-outline">
              <Plus className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setShowAddLogin(true)}>
              Add Login
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setShowAddCard(true)}>
              Add Card
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => {}}>
              Add Identity
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => {}}>Add Note</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs defaultValue="logins" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="logins" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            <span className="hidden sm:inline">Logins</span>
          </TabsTrigger>
          <TabsTrigger value="identities" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Identities</span>
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Credit Cards</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Notes</span>
          </TabsTrigger>
        </TabsList>

        {/* Logins Tab */}
        <TabsContent
          value="logins"
          className="flex-1 space-y-2 overflow-y-auto mt-2 sm:mt-4 pr-2 sm:pr-4 -mr-2 sm:-mr-4"
        >
          {loginRecords.length > 0 ? (
            loginRecords.map((record) => (
              <LoginCard
                key={record.uuid}
                name={getLoginDisplayName(record)}
                username={record.username}
                url={
                  record.url && record.url.length > 0
                    ? record.url[0]
                    : undefined
                }
                notes={record.notes}
                modifiedAt={record.modifiedAt}
                onClick={() => setSelectedLogin(record)}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No login records found
            </p>
          )}
        </TabsContent>

        {/* Identities Tab */}
        <TabsContent
          value="identities"
          className="flex-1 space-y-2 overflow-y-auto mt-2 sm:mt-4 pr-2 sm:pr-4 -mr-2 sm:-mr-4"
        >
          {identityRecords.length > 0 ? (
            identityRecords.map((record) => <IdentityCard key={record.uuid} />)
          ) : (
            <p className="text-center text-muted-foreground">
              No identity records found
            </p>
          )}
        </TabsContent>

        {/* Cards Tab */}
        <TabsContent
          value="cards"
          className="flex-1 space-y-4 overflow-y-auto mt-2 sm:mt-4 pr-2 sm:pr-4 -mr-2 sm:-mr-4"
        >
          {cardRecords.length > 0 ? (
            cardRecords.map((record) => (
              <CardCard
                key={record.uuid}
                card={record}
                onClick={() => setSelectedCard(record)}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No credit card records found
            </p>
          )}
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent
          value="notes"
          className="flex-1 space-y-2 overflow-y-auto mt-2 sm:mt-4 pr-2 sm:pr-4 -mr-2 sm:-mr-4"
        >
          {noteRecords.length > 0 ? (
            noteRecords.map((record) => (
              <NoteCard key={record.uuid} note={record} />
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No note records found
            </p>
          )}
        </TabsContent>
      </Tabs>

      {selectedLogin && (
        <LoginDetails
          login={selectedLogin}
          onClose={() => setSelectedLogin(null)}
        />
      )}

      {selectedCard && (
        <CardDetails
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}

      {showAddLogin && (
        <AddLoginDialog open={showAddLogin} onOpenChange={setShowAddLogin} />
      )}

      {showAddCard && (
        <AddCardDialog open={showAddCard} onOpenChange={setShowAddCard} />
      )}
    </div>
  );
};

export default VaultSection;
