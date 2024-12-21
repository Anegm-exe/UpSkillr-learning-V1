'use client';
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const {tokenDetails,isLoading} = useAuth();
    if(tokenDetails) {
        return router.push('/dashboard')
    }
    return <h1>Welcome</h1>;
}