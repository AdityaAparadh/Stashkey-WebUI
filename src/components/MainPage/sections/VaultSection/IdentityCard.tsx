import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Identity } from "@/types/Identity";

interface IdentityCardProps {
  identity: Identity;
  onClick?: () => void;
}

export const IdentityCard = ({ identity, onClick }: IdentityCardProps) => {
  const fullName = `${identity.firstName} ${identity.lastName}`;

  return (
    <div
      onClick={onClick}
      className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-center gap-2 sm:gap-4">
        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-muted flex items-center justify-center">
          <span className="text-sm font-medium">
            {identity.firstName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex flex-col items-start gap-0.5 sm:gap-1 min-w-0 flex-1">
          <h3 className="font-medium text-base sm:text-lg truncate">
            {fullName}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            {identity.email}
          </p>
        </div>
        <div className="hidden md:flex flex-col flex-1 items-start gap-1 px-4">
          {identity.notes && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {identity.notes}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Modified {formatDistanceToNow(identity.modifiedAt)} ago
          </p>
        </div>
        <div className="flex gap-1 sm:gap-2 shrink-0">
          <Button variant="outline" size="icon">
            <User className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IdentityCard;
