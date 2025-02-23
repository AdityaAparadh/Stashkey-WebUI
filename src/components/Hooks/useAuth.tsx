import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useRef,
  useEffect,
  RefObject,
} from "react";

export interface AuthState {
  username: string | null;
  token: string | null;
  authKey: CryptoKey | null;
  encryptionKey: CryptoKey | null;
  iv: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType {
  auth: AuthState;
  setAuth: (auth: AuthState) => void;
  latestAuth: RefObject<AuthState>;
  latestSetAuth: RefObject<(auth: AuthState) => void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = useState<AuthState>({
    username: "",
    token: "",
    authKey: null,
    encryptionKey: null,
    iv: "",
    isAuthenticated: false,
  });

  const latestAuth = useRef(auth);
  const latestSetAuth = useRef(setAuth);

  useEffect(() => {
    latestAuth.current = auth;
  }, [auth]);

  useEffect(() => {
    latestSetAuth.current = setAuth;
  }, [setAuth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, latestAuth, latestSetAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
