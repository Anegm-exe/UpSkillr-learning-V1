"use client";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
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

  if (tokenDetails?.role === "instructor") {
    return (
      <div className=" flex flex-col items-center justify-center gap-16 mt-16">
        <h1 className="text-5xl">Welcome to the Upskillr Quick Access Portal</h1>
        <div className="grid gap-8 grid-cols-4 border border-zinc-500 p-16 rounded-2xl">
          <Link
            className="hover:scale-125 ease-out duration-300 text-3xl flex justify-center items-center w-48 h-48 rounded-lg bg-gradient-to-r from-[#fda4af]  to-[#f43f5e]"
            href="/chat"
          >
            Chat
          </Link>
          <Link
            className="hover:scale-125 ease-out duration-300  text-3xl flex justify-center items-center w-48 h-48 rounded-lg bg-gradient-to-l from-[#2dd4bf]  to-[#1f2937]"
            href="/course"
          >
            Courses
          </Link>
          <Link
            className="hover:scale-125 ease-out duration-300  text-3xl flex justify-center items-center w-48 h-48 rounded-lg bg-gradient-to-l from-[#fb7185] via-[#a21caf] to-[#6366f1]"
            href="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className="hover:scale-125 ease-out duration-300  text-3xl flex justify-center items-center w-48 h-48 rounded-lg bg-gradient-to-t from-[#b91c1c] via-[#ef4444] to-[#fca5a5]"
            href="/analytics"
          >
            Analytics
          </Link>
        </div>
      </div>
    );
  }

  if (tokenDetails?.role === "student") {
    return (
      <div className=" flex flex-col items-center justify-center gap-16 mt-16">
        <h1 className="text-5xl">Welcome to the Upskillr Quick Access Portal</h1>
        <div className="grid gap-8 grid-cols-4 border border-zinc-500 p-16 rounded-2xl">
          <Link
            className="hover:scale-125 ease-out duration-300 text-3xl flex justify-center items-center w-48 h-48 rounded-lg bg-gradient-to-r from-[#fda4af]  to-[#f43f5e]"
            href="/chat"
          >
            Chat
          </Link>
          <Link
            className="hover:scale-125 ease-out duration-300  text-3xl flex justify-center items-center w-48 h-48 rounded-lg bg-gradient-to-l from-[#2dd4bf]  to-[#1f2937]"
            href="/course"
          >
            Courses
          </Link>
          <Link
            className="hover:scale-125 ease-out duration-300  text-3xl flex justify-center items-center w-48 h-48 rounded-lg bg-gradient-to-l from-[#fb7185] via-[#a21caf] to-[#6366f1]"
            href="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className="hover:scale-125 ease-out duration-300  text-3xl flex justify-center items-center w-48 h-48 rounded-lg bg-gradient-to-t from-[#b91c1c] via-[#ef4444] to-[#fca5a5]"
            href="/quiz"
          >
            Quizzes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className=" flex flex-col items-center justify-center gap-60 mt-16">
      <h1 className="text-5xl">Welcome to Upskillr!</h1>
      <h2 className="text-3xl">
        Please{" "}
        <Link className=" text-blue-700 underline" href="/login">
          Login
        </Link>{" "}
        to continue
      </h2>
    </div>
  );
}
