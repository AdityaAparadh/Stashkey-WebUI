import { Button } from "@/components/ui/button";
import { User, Key } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface LoginCardProps {
  name: string;
  username: string;
  url?: string;
  notes?: string;
  modifiedAt: Date;
}

const getFaviconUrl = (url: string) => {
  try {
    const cleanUrl = url.replace(/^(https?:\/\/)?(www\.)?/, "");
    const domain = cleanUrl.split("/")[0];
    return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
  } catch {
    return null;
  }
};
export const LoginCard = ({
  name,
  username,
  url,
  notes,
  modifiedAt,
}: LoginCardProps) => {
  return (
    <div className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
      <div className="flex justify-between items-center gap-2 sm:gap-4">
        {/* Favicon */}
        <div className="w-8 sm:w-10 h-8 sm:h-10 shrink-0 flex items-center justify-center">
          {url ? (
            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-secondary flex items-center justify-center p-1.5">
              {" "}
              <img
                src={getFaviconUrl(url)}
                alt={`${name} favicon`}
                className="w-4/5 h-4/5 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = document.createElement("div");
                  fallback.className =
                    "w-full h-full rounded-full bg-muted flex items-center justify-center";
                  fallback.innerHTML = `<span class="text-sm font-medium">${name[0].toUpperCase()}</span>`;
                  target.parentNode?.appendChild(fallback);
                }}
              />
            </div>
          ) : (
            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-medium">
                {" "}
                {/* Increased text size */}
                {name[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>
        {/* Name and Username */}
        <div className="flex flex-col items-start gap-0.5 sm:gap-1 min-w-0 flex-1">
          <h3 className="font-medium text-base sm:text-lg truncate w-full">
            {name}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground truncate w-full">
            {username}
          </p>
        </div>
        {/* Additional Info - Hidden on mobile */}
        <div className="hidden md:flex flex-col flex-1 items-start gap-1 px-4">
          {notes && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {notes}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Modified {formatDistanceToNow(modifiedAt)} ago
          </p>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-1 sm:gap-2 shrink-0">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <User className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <Key className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
