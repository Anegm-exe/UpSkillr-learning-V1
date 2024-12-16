"use client";
import Link from "next/link";
import Image from "next/image";
import navbarcss from "../styles/navbar.module.css";
import "../styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getTokenDetails } from "../../api/services/getTokenDetails";

const Navbar = () => {
  const router = useRouter();
  const [tokenDetails, setTokenDetails] = useState(false);

  useEffect(() => {
    const fetchTokenDetails = async () => {
      try{
        const tokenDetails = await getTokenDetails();
        setTokenDetails(true);
      }catch {
        setTokenDetails(false);
      }
    }
    fetchTokenDetails();
  }, []);

  const handleLogOut = () => {
    setTokenDetails(false);
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
      {tokenDetails? (
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
