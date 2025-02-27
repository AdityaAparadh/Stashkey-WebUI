import { createContext, useContext, useState, ReactNode } from "react";
import { Record } from "../../types/Record";
import { Vault } from "../../types/Vault";
import { useAuth } from "./useAuth";
import syncVault from "@/utils/syncVault";

const VaultContext = createContext<{
  vault: Vault | null;
  setVault: (vault: Vault) => void;
} | null>(null);

export const VaultProvider = ({ children }: { children: ReactNode }) => {
  const [vault, setVault] = useState<Vault | null>(null);

  return (
    <VaultContext.Provider value={{ vault, setVault }}>
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);

  if (!context) {
    throw new Error("useVault must be used within a VaultProvider");
  }

  const { vault, setVault } = context;
  const { auth } = useAuth();

  const updateVault = (newVault: Vault) => {
    console.log("INSIDE updateVault");
    setVault({
      ...newVault,
      lastModified: new Date(),
    });
    if (auth.isAuthenticated && auth.encryptionKey && auth.token) {
      syncVault(newVault, auth.encryptionKey, auth.token);
    } else {
      console.error("Vault sync failed due to unset key and token in auth");
    }
  };

  const updateVaultData = (records: Record[]) => {
    if (!vault) return;

    setVault({
      ...vault,
      vaultData: records,
      lastModified: new Date(),
    });
    if (auth.isAuthenticated && auth.encryptionKey && auth.token) {
      syncVault(
        { ...vault, vaultData: records, lastModified: new Date() },
        auth.encryptionKey,
        auth.token,
      );
    } else {
      console.error("Vault sync failed due to unset key and token in auth");
    }
  };

  return {
    vault,
    updateVault,
    updateVaultData,
    setVault,
  };
};
