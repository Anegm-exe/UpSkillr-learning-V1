'use client';
import { useAuth } from "@/components/AuthContext";

export default function Home() {
    const {tokenDetails} = useAuth();
    return <h1>Welcome back {tokenDetails?.name} !</h1>;
}