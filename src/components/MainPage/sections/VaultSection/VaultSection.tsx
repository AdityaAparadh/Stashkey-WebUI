import { useState } from "react";
import Fuse from "fuse.js";
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
import AddIdentityDialog from "./AddIdentityDialog";
import IdentityDetails from "./IdentityDetails";
import AddNoteDialog from "./AddNoteDialog";
import NoteDetails from "./NoteDetails";
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
import { Button } from "@/components/ui/button";

export const VaultSection = () => {
  const { vault } = useVault();
  const [selectedLogin, setSelectedLogin] = useState<
    (Login & { name?: string }) | null
  >(null);
  const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(
    null,
  );
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showAddLogin, setShowAddLogin] = useState(false);
  const [showAddIdentity, setShowAddIdentity] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("logins");

  if (!vault) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-8 w-8 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      </div>
    );
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

  const filterRecords = <T,>(records: T[], keys: string[]): T[] => {
    if (!searchQuery.trim()) return records;
    const fuse = new Fuse(records, {
      keys,
      threshold: 0.4,
    });
    return fuse.search(searchQuery).map((result) => result.item);
  };

  const filteredLogins = filterRecords(loginRecords, [
    "username",
    "name",
    "url",
    "notes",
  ]);
  const filteredIdentities = filterRecords(identityRecords, [
    "firstName",
    "lastName",
    "email",
    "notes",
  ]);
  const filteredCards = filterRecords(cardRecords, [
    "cardNumber",
    "cardHolder",
    "expiryDate",
    "notes",
    "cardType",
  ]);
  const filteredNotes = filterRecords(noteRecords, [
    "title",
    "content",
    "notes",
  ]);

  return (
    <div className="h-full flex flex-col gap-4 sm:gap-6">
      {/* Search and Dropdown “Add Record” Button */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${activeTab}...`}
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setShowAddLogin(true)}>
              Login
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setShowAddIdentity(true)}>
              Identity
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setShowAddCard(true)}>
              Card
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setShowAddNote(true)}>
              Note
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabs for each record type */}
      <Tabs
        defaultValue="logins"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value)}
        className="flex-1 flex flex-col"
      >
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
            <span className="hidden sm:inline">Cards</span>
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
          {filteredLogins.length > 0 ? (
            filteredLogins.map((record) => (
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
          {filteredIdentities.length > 0 ? (
            filteredIdentities.map((record) => (
              <IdentityCard
                key={record.uuid}
                identity={record}
                onClick={() => setSelectedIdentity(record)}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No identity records found
            </p>
          )}
        </TabsContent>
        {/* Cards Tab */}
        <TabsContent
          value="cards"
          className="flex-1 overflow-y-auto mt-2 sm:mt-4 pr-2 sm:pr-4 -mr-2 sm:-mr-4"
        >
          {filteredCards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 justify-items-center gap-y-4 gap-x-1">
              {filteredCards.map((record) => (
                <CardCard
                  key={record.uuid}
                  card={record}
                  onClick={() => setSelectedCard(record)}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No card records found
            </p>
          )}
        </TabsContent>
        {/* Notes Tab */}
        <TabsContent
          value="notes"
          className="flex-1 space-y-2 overflow-y-auto mt-2 sm:mt-4 pr-2 sm:pr-4 -mr-2 sm:-mr-4"
        >
          {filteredNotes.length > 0 ? (
            filteredNotes.map((record) => (
              <NoteCard
                key={record.uuid}
                note={record}
                onClick={() => setSelectedNote(record)}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground">
              No note records found
            </p>
          )}
        </TabsContent>
      </Tabs>

      {/* Detail dialogs for each record type */}
      {selectedLogin && (
        <LoginDetails
          login={selectedLogin}
          onClose={() => setSelectedLogin(null)}
        />
      )}

      {selectedIdentity && (
        <IdentityDetails
          identity={selectedIdentity}
          onClose={() => setSelectedIdentity(null)}
        />
      )}

      {selectedCard && (
        <CardDetails
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}

      {selectedNote && (
        <NoteDetails
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
        />
      )}

      {/* Add Record dialogs */}
      {showAddLogin && (
        <AddLoginDialog open={showAddLogin} onOpenChange={setShowAddLogin} />
      )}

      {showAddIdentity && (
        <AddIdentityDialog
          open={showAddIdentity}
          onOpenChange={setShowAddIdentity}
        />
      )}

      {showAddCard && (
        <AddCardDialog open={showAddCard} onOpenChange={setShowAddCard} />
      )}

      {showAddNote && (
        <AddNoteDialog open={showAddNote} onOpenChange={setShowAddNote} />
      )}
    </div>
  );
};

export default VaultSection;
