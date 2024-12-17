"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "../../api/axios";
import logincss from "../../../styles/login.module.css";
import "../../../styles/globals.css";
import { useAuth } from "@/components/AuthContext"; // Import useAuth

export default function Login() {
  const router = useRouter();
  const { login } = useAuth(); // Use the auth context
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/auth/login",formData);
      login(response.data.user)
      console.log("Login successful:", response.data);
      router.push("/");
    } catch (error) {
      alert("login failed");
      console.log(error);
    }
  };

  return (
    <>
      <div className={logincss.loginContainer}>
        <h1>Login</h1>
        <form className={logincss.loginForm} onSubmit={handleSubmit}>
          <div className={logincss.inputGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className={logincss.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className={logincss.signInButton}>
            Sign In
          </button>
        </form>
        <p className={logincss.signupText}>
          Don&apos;t have an account?{" "}
          <Link href="/register" className={logincss.signupLink}>
            Sign up now
          </Link>
        </p>
      </div>
    </>
  );
}
