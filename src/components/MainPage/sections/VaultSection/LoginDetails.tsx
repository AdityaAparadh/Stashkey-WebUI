import { useState, useEffect } from "react";
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
import {
  Eye,
  EyeOff,
  Edit,
  Save,
  X,
  Copy,
  CopyCheck,
  Trash2, // imported for delete action
} from "lucide-react";
import { useVault } from "@/components/Hooks/useVault";
import type { Login } from "@/types/Login";

interface LoginDetailsProps {
  login: Login & { name?: string };
  onClose: () => void;
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
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

export const LoginDetails = ({ login, onClose }: LoginDetailsProps) => {
  const { vault, updateVaultData } = useVault();

  const [isEditing, setIsEditing] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: login.name || "",
    username: login.username,
    password: login.password.password,
    notes: login.notes,
    urls: [...login.url],
  });

  useEffect(() => {
    setFormData({
      name: login.name || "",
      username: login.username,
      password: login.password.password,
      notes: login.notes,
      urls: [...login.url],
    });
  }, [login]);

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

  const handleSave = () => {
    if (!vault) return;
    const now = new Date();
    const updatedLogin: Login & { name?: string } = {
      ...login,
      name: formData.name,
      username: formData.username,
      password: {
        password: formData.password,
        createdAt: login.password.createdAt,
      },
      passwordHistory: [
        ...login.passwordHistory,
        { password: formData.password, createdAt: now },
      ],
      notes: formData.notes,
      url: formData.urls.filter((url) => url.trim() !== ""),
      modifiedAt: now,
    };
    const newVaultData = vault.vaultData?.map((record) =>
      record.uuid === login.uuid ? updatedLogin : record,
    );
    updateVaultData(newVaultData as any);
    setIsEditing(false);
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      name: login.name || "",
      username: login.username,
      password: login.password.password,
      notes: login.notes,
      urls: [...login.url],
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    // Ask for confirmation
    if (!window.confirm("Are you sure you want to delete this login?")) {
      return;
    }
    if (!vault) return;
    const newVaultData = vault.vaultData?.filter(
      (record) => record.uuid !== login.uuid,
    );
    updateVaultData(newVaultData as any);
    onClose();
  };

  const renderCopyButton = (text: string) => {
    if (!isEditing) {
      return <CopyButton text={text} />;
    }
    return null;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle>Login Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          {/* Name Field */}
          <div className="grid gap-2">
            <Label htmlFor="name-details">Name</Label>
            <div className="relative">
              <Input
                id="name-details"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                readOnly={!isEditing}
                placeholder="Name for this login"
                className="pr-16 h-10"
              />
              {!isEditing && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {renderCopyButton(formData.name)}
                </div>
              )}
            </div>
          </div>

          {/* Username Field */}
          <div className="grid gap-2">
            <Label htmlFor="username-details">Username</Label>
            <div className="relative">
              <Input
                id="username-details"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                readOnly={!isEditing}
                placeholder="Username"
                className="pr-16 h-10"
              />
              {!isEditing && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {renderCopyButton(formData.username)}
                </div>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div className="grid gap-2">
            <Label htmlFor="password-details">Password</Label>
            <div className="relative">
              <Input
                id="password-details"
                type={passwordVisible ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                readOnly={!isEditing}
                className="pr-28 h-10"
              />
              <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                {!isEditing && renderCopyButton(formData.password)}
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPasswordVisible((prev) => !prev)}
                >
                  {passwordVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* URL(s) Fields */}
          <div className="grid gap-2">
            <Label>URL(s)</Label>
            <div className="grid gap-2">
              {formData.urls.map((url, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Enter URL"
                      value={url}
                      onChange={(e) => handleUrlChange(index, e.target.value)}
                      readOnly={!isEditing}
                      className="pr-16 h-10"
                    />
                    {!isEditing && (
                      <div className="absolute inset-y-0 right-2 flex items-center">
                        {renderCopyButton(url)}
                      </div>
                    )}
                  </div>
                  {isEditing && formData.urls.length > 1 && (
                    <Button
                      onClick={() => removeUrlField(index)}
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                    >
                      &times;
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <Button
                className="w-fit mt-1"
                onClick={addUrlField}
                type="button"
                variant="outline"
              >
                + Add URL
              </Button>
            )}
          </div>

          {/* Notes Field */}
          <div className="grid gap-2">
            <Label htmlFor="notes-details">Notes</Label>
            <Textarea
              id="notes-details"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              readOnly={!isEditing}
              placeholder="Enter any notes..."
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
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
