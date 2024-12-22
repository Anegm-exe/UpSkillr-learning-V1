"use client";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { tokenDetails, isLoading } = useAuth();

  useEffect(() => {
    if (tokenDetails) {
      // router.push("/dashboard");
    }
  }, [tokenDetails, router]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (tokenDetails) {
    return null;
  }

  return <h1>Welcome</h1>;
}
