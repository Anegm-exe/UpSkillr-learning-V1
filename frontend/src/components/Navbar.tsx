"use client";
import Link from "next/link";
import Image from "next/image";
import navbarcss from "../styles/navbar.module.css";
import "../styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const [isLockedIn, setLockedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuthStatus = () => {
      setLockedIn(document.cookie.includes("token="));
    };

    // Check authentication status on initial load
    checkAuthStatus();

    // Check authentication status on route change
    checkAuthStatus();
  }, [pathname]);

  const handleLogOut = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setLockedIn(false);
    router.push("/login");
  };

  return (
    <nav className={navbarcss.navbar}>
      <Image src="/images/Logo_Simple.png" alt="Logo" className={navbarcss.img} width={800} height={65} />
      <Link href="/" className={navbarcss.button}>
        Home
      </Link>
      <Link href="/about" className={navbarcss.button}>
        About
      </Link>
      {isLockedIn ? (
        <button onClick={handleLogOut} className={navbarcss.button}>
          Log Out
        </button>
      ) : (
        <Link href="/login" className={navbarcss.button}>
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
