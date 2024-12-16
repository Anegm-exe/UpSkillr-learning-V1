"use client";
import Link from "next/link";
import Image from "next/image";
import navbarcss from "../styles/navbar.module.css";
import "../styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getTokenDetails } from "../app/api/services/getTokenDetails";

const Navbar = () => {
  const router = useRouter();
  const [isToken, setIsToken] = useState(false);
  const [tokenDetails, setTokenDetails] = useState({});

  useEffect(() => {
    const fetchTokenDetails = async () => {
      try{
        const userDetails = await getTokenDetails();
        setTokenDetails(userDetails);
        setIsToken(true);
      }catch {
        setIsToken(false);
      }
    }
    fetchTokenDetails();
  }, []);

  const handleLogOut = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      if (response.ok) {
        setIsToken(false);
        router.push('/login');
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
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
      {isToken? (
        <a onClick={handleLogOut} className={navbarcss.button}>
          Log Out
        </a>
      ) : (
        <Link href="/login" className={navbarcss.button}>
          Login
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
