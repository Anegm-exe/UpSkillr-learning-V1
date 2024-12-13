'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import logincss from '../../styles/login.module.css';
import '../../styles/globals.css';

export default function Login() {
    return (
        <div className={logincss.loginContainer}>
            <h1>Login</h1>
            <form className={logincss.loginForm}>
                <div className={logincss.inputGroup}> 
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" placeholder="Enter your email" required />
                </div>
                <div className={logincss.inputGroup}>
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="Enter your password" required />
                </div>
                <button type="submit" className={logincss.signInButton}>Sign In</button>
            </form>
            <p className={logincss.signupText}>
                Don't have an account?{' '}
                <Link href="/register" className={logincss.signupLink}>
                    Sign up now
                </Link>
            </p>
        </div>
    );
}
