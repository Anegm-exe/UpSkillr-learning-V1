"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getTokenDetails } from "../app/api/services/getTokenDetails";
import { useRouter } from "next/navigation";

interface TokenDetails {
    role: 'admin' | 'student' | 'instructor';
    userid: string;
    name: string;
    profile_picture_url: string;
    email: string;
    iat: string;
    exp: string;
}

interface AuthContextType {
    tokenDetails: TokenDetails | null;
    isLoading: boolean;
    login: (details: TokenDetails) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [tokenDetails, setTokenDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

    // Separate function to handle token details fetching
    const fetchTokenDetails = async () => {
        try {
            setIsLoading(true);
            const userDetails = await getTokenDetails();
            setTokenDetails(userDetails.data);
        } catch (error) {
            console.error("Error fetching auth details", error);
            setTokenDetails(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchTokenDetails();
    }, []);

    const logout = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/logout", { method: "POST" });
            if (response.ok) {
                setTokenDetails(null);
                router.push("/login");
            } else {
                throw new Error("Failed to log out");
            }
        } catch (error) {
            console.error("An error occurred during logout:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (details: TokenDetails) => {
        try {
            setIsLoading(true);
            setTokenDetails(details);
            // Optionally force a refresh of token details from server
            await fetchTokenDetails();
        } catch (error) {
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ tokenDetails, isLoading, login, logout }}> {children} </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
