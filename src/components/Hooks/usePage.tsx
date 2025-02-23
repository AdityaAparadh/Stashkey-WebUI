import { createContext } from "react";
import { useContext } from "react";
import { PageType } from "../../types/PageType";
import { ReactNode, useState } from "react";

type PageContextType = {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
};

export const PageContext = createContext<PageContextType>({
  currentPage: PageType.AUTHPAGE,
  setCurrentPage: () => {},
});

export const usePage = () => {
  const context = useContext(PageContext);

  if (!context) {
    throw new Error("usePage must be used within a PageProvider");
  }

  return context;
};

type PageProviderProps = {
  children: ReactNode;
};

export const PageProvider = ({ children }: PageProviderProps) => {
  const [currentPage, setCurrentPage] = useState<PageType>(PageType.AUTHPAGE);

  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </PageContext.Provider>
  );
};
