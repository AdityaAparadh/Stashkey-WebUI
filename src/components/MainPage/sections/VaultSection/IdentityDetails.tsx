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
import { Edit, Save, X, Copy, CopyCheck, Trash2 } from "lucide-react";
import { useVault } from "@/components/Hooks/useVault";
import type { Identity } from "@/types/Identity";

interface IdentityDetailsProps {
  identity: Identity;
  onClose: () => void;
}

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

export const IdentityDetails = ({
  identity,
  onClose,
}: IdentityDetailsProps) => {
  const { vault, updateVaultData } = useVault();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: identity.firstName,
    lastName: identity.lastName,
    email: identity.email,
    dateOfBirth: identity.dateOfBirth.toISOString().split("T")[0],
    phoneNumber: identity.phoneNumber,
    addressLine1: identity.addressLine1,
    addressLine2: identity.addressLine2,
    addressLine3: identity.addressLine3,
    city: identity.city,
    state: identity.state,
    zipCode: identity.zipCode,
    country: identity.country,
    notes: identity.notes,
  });

  useEffect(() => {
    setFormData({
      firstName: identity.firstName,
      lastName: identity.lastName,
      email: identity.email,
      dateOfBirth: identity.dateOfBirth.toISOString().split("T")[0],
      phoneNumber: identity.phoneNumber,
      addressLine1: identity.addressLine1,
      addressLine2: identity.addressLine2,
      addressLine3: identity.addressLine3,
      city: identity.city,
      state: identity.state,
      zipCode: identity.zipCode,
      country: identity.country,
      notes: identity.notes,
    });
  }, [identity]);

  const handleSave = () => {
    if (!vault) return;
    const now = new Date();
    const updatedIdentity: Identity = {
      ...identity,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      dateOfBirth: new Date(formData.dateOfBirth),
      phoneNumber: formData.phoneNumber,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      addressLine3: formData.addressLine3,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      country: formData.country,
      notes: formData.notes,
      modifiedAt: now,
    };

    const newVaultData = vault.vaultData?.map((record) =>
      record.uuid === identity.uuid ? updatedIdentity : record,
    );
    updateVaultData(newVaultData as any);
    setIsEditing(false);
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      firstName: identity.firstName,
      lastName: identity.lastName,
      email: identity.email,
      dateOfBirth: identity.dateOfBirth.toISOString().split("T")[0],
      phoneNumber: identity.phoneNumber,
      addressLine1: identity.addressLine1,
      addressLine2: identity.addressLine2,
      addressLine3: identity.addressLine3,
      city: identity.city,
      state: identity.state,
      zipCode: identity.zipCode,
      country: identity.country,
      notes: identity.notes,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this identity?")) {
      return;
    }
    if (!vault) return;
    const newVaultData = vault.vaultData?.filter(
      (record) => record.uuid !== identity.uuid,
    );
    updateVaultData(newVaultData as any);
    onClose();
  };

  const renderCopyButton = (text: string) => {
    return !isEditing ? <CopyButton text={text} /> : null;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle>Identity Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          {/* First Name */}
          <div className="grid gap-2">
            <Label htmlFor="firstName-details">First Name</Label>
            <div className="relative">
              <Input
                id="firstName-details"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                readOnly={!isEditing}
                placeholder="First name"
                className="pr-16 h-10"
              />
              {!isEditing && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {renderCopyButton(formData.firstName)}
                </div>
              )}
            </div>
          </div>
          {/* Last Name */}
          <div className="grid gap-2">
            <Label htmlFor="lastName-details">Last Name</Label>
            <div className="relative">
              <Input
                id="lastName-details"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                readOnly={!isEditing}
                placeholder="Last name"
                className="pr-16 h-10"
              />
              {!isEditing && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {renderCopyButton(formData.lastName)}
                </div>
              )}
            </div>
          </div>
          {/* Email */}
          <div className="grid gap-2">
            <Label htmlFor="email-details">Email</Label>
            <div className="relative">
              <Input
                id="email-details"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                readOnly={!isEditing}
                placeholder="Email"
                className="pr-16 h-10"
              />
              {!isEditing && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {renderCopyButton(formData.email)}
                </div>
              )}
            </div>
          </div>
          {/* Date of Birth */}
          <div className="grid gap-2">
            <Label htmlFor="dateOfBirth-details">Date of Birth</Label>
            <div className="relative">
              <Input
                id="dateOfBirth-details"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                readOnly={!isEditing}
                className="pr-16 h-10"
              />
              {!isEditing && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {renderCopyButton(formData.dateOfBirth)}
                </div>
              )}
            </div>
          </div>
          {/* Phone Number */}
          <div className="grid gap-2">
            <Label htmlFor="phoneNumber-details">Phone Number</Label>
            <div className="relative">
              <Input
                id="phoneNumber-details"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                readOnly={!isEditing}
                placeholder="Phone number"
                className="pr-16 h-10"
              />
              {!isEditing && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {renderCopyButton(formData.phoneNumber)}
                </div>
              )}
            </div>
          </div>
          {/* Address Line 1 */}
          <div className="grid gap-2">
            <Label htmlFor="addressLine1-details">Address Line 1</Label>
            <div className="relative">
              <Input
                id="addressLine1-details"
                value={formData.addressLine1}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine1: e.target.value })
                }
                readOnly={!isEditing}
                placeholder="Address Line 1"
                className="pr-16 h-10"
              />
              {!isEditing && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {renderCopyButton(formData.addressLine1)}
                </div>
              )}
            </div>
          </div>
          {/* Address Line 2 */}
          <div className="grid gap-2">
            <Label htmlFor="addressLine2-details">Address Line 2</Label>
            <div className="relative">
              <Input
                id="addressLine2-details"
                value={formData.addressLine2}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine2: e.target.value })
                }
                readOnly={!isEditing}
                placeholder="Address Line 2"
                className="pr-16 h-10"
              />
              {!isEditing && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {renderCopyButton(formData.addressLine2)}
                </div>
              )}
            </div>
          </div>
          {/* Address Line 3 */}
          <div className="grid gap-2">
            <Label htmlFor="addressLine3-details">Address Line 3</Label>
            <div className="relative">
              <Input
                id="addressLine3-details"
                value={formData.addressLine3}
                onChange={(e) =>
                  setFormData({ ...formData, addressLine3: e.target.value })
                }
                readOnly={!isEditing}
                placeholder="Address Line 3"
                className="pr-16 h-10"
              />
              {!isEditing && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {renderCopyButton(formData.addressLine3)}
                </div>
              )}
            </div>
          </div>
          {/* City */}
          <div className="grid gap-2">
            <Label htmlFor="city-details">City</Label>
            <div className="relative">
              <Input
                id="city-details"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                readOnly={!isEditing}
                placeholder="City"
                className="pr-16 h-10"
              />
              {!isEditing && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {renderCopyButton(formData.city)}
                </div>
              )}
            </div>
          </div>
          {/* State */}
          <div className="grid gap-2">
            <Label htmlFor="state-details">State</Label>
            <div className="relative">
              <Input
                id="state-details"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                readOnly={!isEditing}
                placeholder="State"
                className="pr-16 h-10"
              />
              {!isEditing && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {renderCopyButton(formData.state)}
                </div>
              )}
            </div>
          </div>
          {/* Zip Code */}
          <div className="grid gap-2">
            <Label htmlFor="zipCode-details">Zip Code</Label>
            <div className="relative">
              <Input
                id="zipCode-details"
                value={formData.zipCode}
                onChange={(e) =>
                  setFormData({ ...formData, zipCode: e.target.value })
                }
                readOnly={!isEditing}
                placeholder="Zip Code"
                className="pr-16 h-10"
              />
              {!isEditing && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {renderCopyButton(formData.zipCode)}
                </div>
              )}
            </div>
          </div>
          {/* Country */}
          <div className="grid gap-2">
            <Label htmlFor="country-details">Country</Label>
            <div className="relative">
              <Input
                id="country-details"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                readOnly={!isEditing}
                placeholder="Country"
                className="pr-16 h-10"
              />
              {!isEditing && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {renderCopyButton(formData.country)}
                </div>
              )}
            </div>
          </div>
          {/* Notes */}
          <div className="grid gap-2">
            <Label htmlFor="notes-details">Notes</Label>
            <div className="relative">
              <Textarea
                id="notes-details"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                readOnly={!isEditing}
                placeholder="Enter any notes..."
                className="pr-16 min-h-[100px] resize-none"
              />
              {!isEditing && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {renderCopyButton(formData.notes)}
                </div>
              )}
            </div>
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

export default IdentityDetails;
