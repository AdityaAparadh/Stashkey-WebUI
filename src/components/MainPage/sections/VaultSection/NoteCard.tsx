import { FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Note } from "@/types/Note";

interface NoteCardProps {
  note: Note;
  onClick?: () => void;
}

export const NoteCard = ({ note, onClick }: NoteCardProps) => {
  return (
    <div
      onClick={onClick}
      className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-center gap-2 sm:gap-4">
        {/* A simple icon for a Note */}
        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-muted flex items-center justify-center">
          <FileText className="w-4 h-4" />
        </div>
        {/* Use “Note” as a title with a preview – you can also choose to show the first few words */}
        <div className="flex flex-col items-start gap-0.5 sm:gap-1 flex-1">
          <h3 className="font-medium text-base sm:text-lg truncate">Note</h3>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            {note.notes}
          </p>
        </div>
        {/* Show when the note was last modified */}
        <div className="hidden md:flex flex-col items-end gap-1">
          <p className="text-xs text-muted-foreground">
            Modified {formatDistanceToNow(note.modifiedAt)} ago
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
