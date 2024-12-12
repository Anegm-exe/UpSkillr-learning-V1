'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import '../../styles/register.css'; // Assuming you'll create this CSS file

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        dateOfBirth: '',
        role: ''
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
            const response = await axios.post('http://localhost:3001/register', formData);
            console.log('Registration successful:', response.data);
            // Redirect or show success message
        } catch (error) {
            console.error('Error registering:', error);
            // Handle error (show error message to the user)
        }
    };
    return (
        <div className="registerContainer">
            <h1>Register</h1>
            <form className="registerForm" onSubmit={handleSubmit}>
                <div className="inputGroup">
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
                <div className="inputGroup">
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
                <div className="inputGroup">
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
                <div className="inputGroup">
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
                <div className="inputGroup">
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
                <button type="submit" className="signupButton">Sign Up</button>
            </form>
            <p className="loginText">
                Already have an account?{' '}
                <Link href="/login" className="loginLink">
                    Login now
                </Link>
            </p>
        </div>
    );
}
