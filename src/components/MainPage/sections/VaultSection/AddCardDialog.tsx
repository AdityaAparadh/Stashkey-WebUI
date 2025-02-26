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
import { Plus, Minus } from "lucide-react";
import { useVault } from "@/components/Hooks/useVault";
import { Record, RecordType } from "@/types/Record";
import type { Card } from "@/types/Card";
import { CardType, MonthType } from "@/types/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddCardDialog = ({ open, onOpenChange }: AddCardDialogProps) => {
  const { vault, updateVaultData } = useVault();
  const [formData, setFormData] = useState({
    cardHolder: "",
    cardNumber: "",
    expirationMonth: MonthType.JAN,
    expirationYear: new Date().getFullYear(),
    cvv: "",
    cardType: CardType.OTHERS,
    securityCode: "",
    notes: "",
  });

  const monthOptions = Object.values(MonthType).filter(
    (m) => typeof m === "number",
  ) as number[];
  const cardTypeOptions = Object.values(CardType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vault) return;
    const now = new Date();
    const newCard: Card = {
      uuid: uuidv4(),
      recordType: RecordType.CARD,
      createdAt: now,
      modifiedAt: now,
      notes: formData.notes,
      cardHolder: formData.cardHolder,
      cardNumber: formData.cardNumber,
      expirationMonth: formData.expirationMonth,
      expirationYear: formData.expirationYear,
      cvv: Number(formData.cvv),
      cardType: formData.cardType,
      securityCode: formData.securityCode,
    };
    const newVaultData = vault.vaultData
      ? [...vault.vaultData, newCard]
      : [newCard];
    updateVaultData(newVaultData as [Record]);
    setFormData({
      cardHolder: "",
      cardNumber: "",
      expirationMonth: MonthType.JAN,
      expirationYear: new Date().getFullYear(),
      cvv: "",
      cardType: CardType.OTHERS,
      securityCode: "",
      notes: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="cardHolder">Card Holder</Label>
            <Input
              id="cardHolder"
              value={formData.cardHolder}
              onChange={(e) =>
                setFormData({ ...formData, cardHolder: e.target.value })
              }
              placeholder="Enter card holder name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              value={formData.cardNumber}
              onChange={(e) =>
                setFormData({ ...formData, cardNumber: e.target.value })
              }
              placeholder="Enter card number"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Expiration Month */}
            <div className="space-y-2">
              <Label htmlFor="expirationMonth">Expiration Month</Label>
              <Select
                value={formData.expirationMonth.toString()}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    expirationMonth: Number(value) as MonthType,
                  })
                }
              >
                <SelectTrigger id="expirationMonth" className="h-10">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {month.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Expiration Year */}
            <div className="space-y-2">
              <Label htmlFor="expirationYear">Expiration Year</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="expirationYear"
                  type="text"
                  value={formData.expirationYear.toString()}
                  onChange={(e) => {
                    const numericValue = parseInt(e.target.value, 10);
                    setFormData({
                      ...formData,
                      expirationYear: isNaN(numericValue) ? 0 : numericValue,
                    });
                  }}
                  required
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
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                value={formData.cvv}
                onChange={(e) =>
                  setFormData({ ...formData, cvv: e.target.value })
                }
                placeholder="CVV"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="securityCode">Security Code / PIN</Label>
              <Input
                id="securityCode"
                value={formData.securityCode}
                onChange={(e) =>
                  setFormData({ ...formData, securityCode: e.target.value })
                }
                placeholder="Security code"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardType">Card Network</Label>
            <Select
              value={formData.cardType}
              onValueChange={(value) =>
                setFormData({ ...formData, cardType: value as CardType })
              }
            >
              <SelectTrigger id="cardType" className="h-10">
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
            <Button type="submit">Add Card</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCardDialog;
