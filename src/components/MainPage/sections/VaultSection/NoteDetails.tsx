import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, X, Trash2, Copy, CopyCheck } from "lucide-react";
import { useVault } from "@/components/Hooks/useVault";
import type { Note } from "@/types/Note";

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleCopy}
      className="h-8 w-8 ml-2"
    >
      {copied ? (
        <CopyCheck className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
};

interface NoteDetailsProps {
  note: Note;
  onClose: () => void;
}

export const NoteDetails = ({ note, onClose }: NoteDetailsProps) => {
  const { vault, updateVaultData } = useVault();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.notes);

  useEffect(() => {
    setContent(note.notes);
  }, [note]);

  const handleSave = () => {
    if (!vault) return;
    const now = new Date();
    const updatedNote: Note = {
      ...note,
      notes: content,
      modifiedAt: now,
      meta: null,
    };
    const newVaultData = vault.vaultData?.map((record) =>
      record.uuid === note.uuid ? updatedNote : record,
    );
    updateVaultData(newVaultData as any);
    setIsEditing(false);
    onClose();
  };

  const handleCancel = () => {
    setContent(note.notes);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    if (!vault) return;
    const newVaultData = vault.vaultData?.filter(
      (record) => record.uuid !== note.uuid,
    );
    updateVaultData(newVaultData as any);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Note Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              readOnly={!isEditing}
              placeholder="Enter your note here..."
              className="min-h-[150px] resize-none"
            />
            {!isEditing && (
              <div className="flex justify-end">
                <CopyButton text={content} />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            {!isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDelete}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSave}
                  className="h-8 w-8"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDetails;
