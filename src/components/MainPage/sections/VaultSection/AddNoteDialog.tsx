import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useVault } from "@/components/Hooks/useVault";
import { RecordType } from "@/types/Record";
import type { Note } from "@/types/Note";

interface AddNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddNoteDialog = ({ open, onOpenChange }: AddNoteDialogProps) => {
  const { vault, updateVaultData } = useVault();
  const [noteContent, setNoteContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vault) return;
    const now = new Date();
    const newNote: Note = {
      uuid: uuidv4(),
      recordType: RecordType.NOTE,
      createdAt: now,
      modifiedAt: now,
      notes: noteContent,
      meta: null,
    };
    const newVaultData = vault.vaultData
      ? [...vault.vaultData, newNote]
      : [newNote];
    updateVaultData(newVaultData as any);
    setNoteContent("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Enter your note here..."
              required
              className="min-h-[150px] resize-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Note</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNoteDialog;
