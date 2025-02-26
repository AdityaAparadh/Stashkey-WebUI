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
  Plus,
  Minus,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useVault } from "@/components/Hooks/useVault";
import type { Card } from "@/types/Card";
import { CardType, MonthType } from "@/types/Card";

interface CardDetailsProps {
  card: Card;
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

export const CardDetails = ({ card, onClose }: CardDetailsProps) => {
  const { vault, updateVaultData } = useVault();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    cardHolder: card.cardHolder,
    cardNumber: card.cardNumber,
    expirationMonth: card.expirationMonth,
    expirationYear: card.expirationYear,
    cvv: card.cvv.toString(),
    cardType: card.cardType,
    securityCode: card.securityCode,
    notes: card.notes,
  });
  const [showSecurity, setShowSecurity] = useState(false);

  useEffect(() => {
    setFormData({
      cardHolder: card.cardHolder,
      cardNumber: card.cardNumber,
      expirationMonth: card.expirationMonth,
      expirationYear: card.expirationYear,
      cvv: card.cvv.toString(),
      cardType: card.cardType,
      securityCode: card.securityCode,
      notes: card.notes,
    });
  }, [card]);

  const handleSave = () => {
    if (!vault) return;
    const now = new Date();
    const updatedCard: Card = {
      ...card,
      cardHolder: formData.cardHolder,
      cardNumber: formData.cardNumber,
      expirationMonth: formData.expirationMonth,
      expirationYear: formData.expirationYear,
      cvv: Number(formData.cvv),
      cardType: formData.cardType,
      securityCode: formData.securityCode,
      notes: formData.notes,
      modifiedAt: now,
    };
    const newVaultData = vault.vaultData?.map((record) =>
      record.uuid === card.uuid ? updatedCard : record,
    );
    updateVaultData(newVaultData as any);
    setIsEditing(false);
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      cardHolder: card.cardHolder,
      cardNumber: card.cardNumber,
      expirationMonth: card.expirationMonth,
      expirationYear: card.expirationYear,
      cvv: card.cvv.toString(),
      cardType: card.cardType,
      securityCode: card.securityCode,
      notes: card.notes,
    });
    setIsEditing(false);
  };

  const renderCopyButton = (text: string) => {
    if (!isEditing) {
      return <CopyButton text={text} />;
    }
    return null;
  };

  // For the select options.
  const monthOptions = Object.values(MonthType).filter(
    (m) => typeof m === "number",
  ) as number[];
  const cardTypeOptions = Object.values(CardType);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-4">
          <DialogTitle>Card Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          {/* Card Holder */}
          <div className="grid gap-2">
            <Label htmlFor="cardHolder-details">Card Holder</Label>
            <div className="relative">
              <Input
                id="cardHolder-details"
                value={formData.cardHolder}
                onChange={(e) =>
                  setFormData({ ...formData, cardHolder: e.target.value })
                }
                readOnly={!isEditing}
                placeholder="Card holder name"
                className="pr-16 h-10"
              />
              {!isEditing && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {renderCopyButton(formData.cardHolder)}
                </div>
              )}
            </div>
          </div>
          {/* Card Number */}
          <div className="grid gap-2">
            <Label htmlFor="cardNumber-details">Card Number</Label>
            <div className="relative">
              <Input
                id="cardNumber-details"
                value={formData.cardNumber}
                onChange={(e) =>
                  setFormData({ ...formData, cardNumber: e.target.value })
                }
                readOnly={!isEditing}
                placeholder="Card number"
                className="pr-16 h-10"
              />
              {!isEditing && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {renderCopyButton(formData.cardNumber)}
                </div>
              )}
            </div>
          </div>
          {/* Expiration Month & Year */}
          <div className="grid grid-cols-2 gap-4">
            {/* Expiration Month */}
            <div className="grid gap-2">
              <Label htmlFor="expirationMonth-details">Expiration Month</Label>
              {isEditing ? (
                <Select
                  value={formData.expirationMonth.toString()}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      expirationMonth: Number(value) as MonthType,
                    })
                  }
                >
                  <SelectTrigger id="expirationMonth-details" className="h-10">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((m) => (
                      <SelectItem key={m} value={m.toString()}>
                        {m.toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={formData.expirationMonth.toString().padStart(2, "0")}
                  readOnly
                  className="pr-16 h-10"
                />
              )}
            </div>
            {/* Expiration Year */}
            <div className="grid gap-2">
              <Label htmlFor="expirationYear-details">Expiration Year</Label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    id="expirationYear-details"
                    // Use text type to remove native spinner arrows
                    type="text"
                    value={formData.expirationYear.toString()}
                    onChange={(e) => {
                      const numericValue = parseInt(e.target.value, 10);
                      setFormData({
                        ...formData,
                        expirationYear: isNaN(numericValue) ? 0 : numericValue,
                      });
                    }}
                    className="h-10 w-full"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        expirationYear: formData.expirationYear - 1,
                      })
                    }
                    className="h-8 w-8 flex items-center justify-center"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        expirationYear: formData.expirationYear + 1,
                      })
                    }
                    className="h-8 w-8 flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Input
                  id="expirationYear-details"
                  type="text"
                  value={formData.expirationYear.toString()}
                  readOnly
                  className="pr-16 h-10"
                />
              )}
            </div>
          </div>
          {/* CVV Field */}
          <div className="grid gap-2">
            <Label htmlFor="cvv-details">CVV</Label>
            <div className="relative">
              <Input
                id="cvv-details"
                value={formData.cvv}
                onChange={(e) =>
                  setFormData({ ...formData, cvv: e.target.value })
                }
                readOnly={!isEditing}
                className="pr-16 h-10"
              />
              {!isEditing && (
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {renderCopyButton(formData.cvv)}
                </div>
              )}
            </div>
          </div>
          {/* Security Code / PIN Field */}
          <div className="grid gap-2">
            <Label htmlFor="securityCode-details">Security Code / PIN</Label>
            <div className="relative">
              <Input
                id="securityCode-details"
                type={showSecurity ? "text" : "password"}
                value={formData.securityCode}
                onChange={(e) =>
                  setFormData({ ...formData, securityCode: e.target.value })
                }
                readOnly={!isEditing}
                className="pr-28 h-10"
              />
              <div className="absolute inset-y-0 right-2 flex items-center gap-2">
                {!isEditing && renderCopyButton(formData.securityCode)}
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowSecurity((prev) => !prev)}
                  className="h-8 w-8"
                >
                  {showSecurity ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          {/* Card Network */}
          <div className="grid gap-2">
            <Label htmlFor="cardType-details">Card Network</Label>
            {isEditing ? (
              <Select
                value={formData.cardType}
                onValueChange={(value) =>
                  setFormData({ ...formData, cardType: value })
                }
              >
                <SelectTrigger id="cardType-details" className="h-10">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  {cardTypeOptions.map((ct) => (
                    <SelectItem key={ct} value={ct}>
                      {ct}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="relative">
                <Input
                  value={formData.cardType}
                  readOnly
                  className="pr-16 h-10"
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                  {renderCopyButton(formData.cardType)}
                </div>
              </div>
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

export default CardDetails;
