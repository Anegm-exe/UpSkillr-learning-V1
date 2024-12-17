'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getTokenDetails } from "../app/api/services/getTokenDetails";
import { useRouter } from "next/navigation";

interface AuthContextType {
  tokenDetails: any;
  isLoading: boolean;
  login: (details: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [tokenDetails, setTokenDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTokenDetails = async () => {
      try {
        setIsLoading(true);
        const userDetails = await getTokenDetails();
        setTokenDetails(userDetails.data);
      } catch (error) {
        setTokenDetails(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTokenDetails();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch("/api/logout", { method: "POST" });
      if (response.ok) {
        setTokenDetails(null);
        router.push("/login");
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };
  
  const login = async (details: any) => {
    setTokenDetails(details);
  };

  return (
    <AuthContext.Provider value={{ 
      tokenDetails, 
      isLoading,
      login,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth : any = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};