import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff } from "lucide-react";
import { useVault } from "@/components/Hooks/useVault";
import { Record, RecordType } from "@/types/Record";
import type { Login } from "@/types/Login";

interface AddLoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddLoginDialog = ({ open, onOpenChange }: AddLoginDialogProps) => {
  const { vault, updateVaultData } = useVault();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    notes: "",
    urls: [""],
  });
  const [passwordVisible, setPasswordVisible] = useState(true);

  const handleUrlChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updatedUrls = [...prev.urls];
      updatedUrls[index] = value;
      return { ...prev, urls: updatedUrls };
    });
  };

  const addUrlField = () => {
    setFormData((prev) => ({ ...prev, urls: [...prev.urls, ""] }));
  };

  const removeUrlField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      urls: prev.urls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vault) return;
    const now = new Date();
    const newLogin: Login & { name?: string } = {
      uuid: uuidv4(),
      recordType: RecordType.LOGIN,
      createdAt: now,
      modifiedAt: now,
      notes: formData.notes,
      username: formData.username,
      password: {
        password: formData.password,
        createdAt: now,
      },
      passwordHistory: [
        {
          password: formData.password,
          createdAt: now,
        },
      ],
      url: formData.urls.filter((url) => url.trim() !== ""),
      name: formData.name,
    };
    const newVaultData = vault.vaultData
      ? [...vault.vaultData, newLogin]
      : [newLogin];
    updateVaultData(newVaultData as Record[]);
    setFormData({
      name: "",
      username: "",
      password: "",
      notes: "",
      urls: [""],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Login</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter a name for this login"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={passwordVisible ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="pr-20"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setPasswordVisible((prev) => !prev)}
                className="absolute right-1 top-1/2 -translate-y-1/2"
              >
                {passwordVisible ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>URL(s)</Label>
            {formData.urls.map((url, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  placeholder="Enter URL"
                  value={url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                />
                {formData.urls.length > 1 && (
                  <Button
                    onClick={() => removeUrlField(index)}
                    type="button"
                    variant="outline"
                    size="icon"
                  >
                    &times;
                  </Button>
                )}
              </div>
            ))}
            <Button onClick={addUrlField} type="button" variant="link">
              + Add URL
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Enter any notes..."
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
            <Button type="submit">Add Login</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLoginDialog;
