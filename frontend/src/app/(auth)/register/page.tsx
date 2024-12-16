'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from '../../../../api/axios';
import registercss from '../../../styles/register.module.css';
import '../../../styles/globals.css';
import { useRouter } from 'next/navigation'

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        dateOfBirth: '',
        role: ''
    });

    const router = useRouter(); // Initialize the router

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
            const response = await axios.post('/auth/register', formData);
            console.log('Registration successful:', response.data);
            // Redirect or show success message
            console.log('Redirecting to home...');
            router.push('/'); 
        } catch (error) {
            alert('Registration failed');
            // Handle error (show error message to the user)
        }
    };

    return (
        <div className={registercss.registerContainer}> {/* Apply the CSS class */}
            <h1 className={registercss.h1}>Register</h1>
            <form className={registercss.registerForm} onSubmit={handleSubmit}> {/* Apply the CSS class */}
                <div className={registercss.inputGroup}> {/* Apply the CSS class */}
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={registercss.inputGroup}> {/* Apply the CSS class */}
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={registercss.inputGroup}> {/* Apply the CSS class */}
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
                <div className={registercss.inputGroup}> {/* Apply the CSS class */}
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={registercss.inputGroup}> {/* Apply the CSS class */}
                    <label htmlFor="role">Role</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>
                            Select your role
                        </option>
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                    </select>
                </div>
                <button type="submit" className={registercss.signupButton}>Sign Up</button> {/* Apply the CSS class */}
            </form>
            <p className={registercss.loginText}>
                Already have an account?{' '}
                <Link href="/auth/login" className={registercss.loginLink}>
                    Login now
                </Link>
            </p>
        </div>
    );
}