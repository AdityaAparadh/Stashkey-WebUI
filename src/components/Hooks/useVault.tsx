import { createContext, useContext, useState, ReactNode } from "react";
import { Record } from "../../types/Record";
import { Vault } from "../../types/Vault";

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

  const updateVault = (newVault: Vault) => {
    setVault({
      ...newVault,
      lastModified: new Date(),
    });
  };

  const initializeVault = (
    username: string,
    publicKey: string,
    privateKey: string,
  ) => {
    setVault({
      username,
      publicKey,
      privateKey,
      lastModified: new Date(),
      vaultData: null,
    });
  };

  const updateVaultData = (records: [Record]) => {
    if (!vault) return;

    setVault({
      ...vault,
      vaultData: records,
      lastModified: new Date(),
    });
  };

  return {
    vault,
    updateVault,
    initializeVault,
    updateVaultData,
  };
};
