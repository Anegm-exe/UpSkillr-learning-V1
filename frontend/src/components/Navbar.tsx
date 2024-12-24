"use client";

import Link from "next/link";
import Image from "next/image";
import navbarcss from "../styles/navbar.module.css";
import "../styles/globals.css";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const { tokenDetails, isLoading, logout } = useAuth();

  return (
    <nav className={navbarcss.navbar}>
      <div className={navbarcss.navLinks}>
        <Link href="/">
          <Image src="/images/Logo_Simple.png" alt="Logo" className={navbarcss.img} width={100} height={25} />
        </Link>
        <Link href="/" className={navbarcss.button}>
          Home
        </Link>
        <Link href="/about" className={navbarcss.button}>
          About
        </Link>
        <Link href="/course" className={navbarcss.button}>
          Courses
        </Link>
        <Link href="/forums" className={navbarcss.button}>
          Forums
        </Link>
        <Link href="/chat" className={navbarcss.button}>
          Chats
        </Link>
        {tokenDetails?.role === 'student' && <Link href="/notes" className={navbarcss.button}>
          Notes
        </Link>}
        <Link href="/quiz" className={navbarcss.button}>
          Quizzes
        </Link>
      </div>
      {!isLoading && (
        <div className="flex">
          {tokenDetails ? (
            <div className={navbarcss.navLinks}>
              <a onClick={logout} className={navbarcss.button}>
                Log out
              </a>
              <Link href="/dashboard" className={navbarcss.button}>
                {tokenDetails.name || "User"}
              </Link>
              <Link href="/dashboard" className={navbarcss.button}>
                <Image
                  src={tokenDetails.profile_picture_url || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                  alt="Profile"
                  width={40}
                  height={40}
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </Link>
            </div>
          ) : (
            <Link href="/login" className={navbarcss.button}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
