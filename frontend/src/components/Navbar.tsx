'use client';

import Link from "next/link";
import Image from "next/image";
import navbarcss from "../styles/navbar.module.css";
import "../styles/globals.css";

const Navbar = () => {
  return (
    <nav className={navbarcss.navbar}>
      <Image src="/images/Logo_Simple.png" alt="Logo" className={navbarcss.img} width={800} height={65}></Image>
      <Link href="/" className={navbarcss.button}>
        Home
      </Link>
      <Link href="/about" className={navbarcss.button}>
        About
      </Link>
      <Link href="/login" className={navbarcss.button}>
        Login
      </Link>
    </nav>
  );
};

export default Navbar;
