'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from '../../api/axios';
import registercss from '../../../styles/register.module.css';
import { useRouter } from 'next/navigation';
import { useFetchCategory } from '@/app/api/services/useFetchCategory';

// Define interface for form data
interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
  role: string;
  categories: string[];
}

export default function Register() {
  // Initial state with type annotation
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    role: 'student',
    categories: [],
  });

  // State for form validation and error handling
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks
  const router = useRouter();
  const { categoryData } = useFetchCategory();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Category selection handler
  const handleCategoryChange = (category: string) => {
    setFormData(prev => {
      // Toggle category selection
      const currentCategories = prev.categories;
      const newCategories = currentCategories.includes(category)
        ? currentCategories.filter(cat => cat !== category)
        : [...currentCategories, category];

      return {
        ...prev,
        categories: newCategories
      };
    });
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterFormData> = {};

    // Basic validation examples
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of Birth is required';
    if (formData.categories.length === 0) newErrors.categories = 'Please select at least one category';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
        console.log(formData)
      const response = await axios.post('/auth/register', formData);
      
      // Success handling
      console.log('Registration successful:', response.data);
      router.push('/login');
    } catch (error) {
      // Error handling
      console.error('Registration error:', error);
      
      // You might want to set a general error or show a toast
      setErrors(prev => ({
        ...prev,
        form: 'Registration failed. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render method
  return (
    <div className={registercss.registerContainer}>
      <h1>Register</h1>
      
      <form onSubmit={handleSubmit} className={registercss.form}>
        {/* Name Input */}
        <div className={registercss.inputGroup}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
          {errors.name && <span className={registercss.error}>{errors.name}</span>}
        </div>

        {/* Email Input */}
        <div className={registercss.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <span className={registercss.error}>{errors.email}</span>}
        </div>

        {/* Password Input */}
        <div className={registercss.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          {errors.password && <span className={registercss.error}>{errors.password}</span>}
        </div>

        {/* Date of Birth Input */}
        <div className={registercss.inputGroup}>
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          {errors.dateOfBirth && <span className={registercss.error}>{errors.dateOfBirth}</span>}
        </div>

        {/* Category Selection */}
        <div className={registercss.inputGroup}>
          <label>Categories</label>
          <div className={registercss.categoryGrid}>
            {categoryData?.map(category => (
              <div 
                key={category}
                className={`
                  ${registercss.categoryItem}
                  ${formData.categories.includes(category) ? registercss.selected : ''}
                `}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </div>
            ))}
          </div>
          {errors.categories && <span className={registercss.error}>{errors.categories}</span>}

          {/* Selected Categories Display */}
          {formData.categories.length > 0 && (
            <div className={registercss.selectedCategories}>
              <strong>Selected Categories:</strong>
              {formData.categories.map(cat => (
                <span key={cat} className={registercss.selectedCategory}>
                  {cat}
                  <button 
                    type="button" 
                    onClick={() => handleCategoryChange(cat)}
                    className={registercss.removeCategory}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        {/* Role Selection */}
        <div className={registercss.roleSelection}>
          <div className={registercss.roleOptions}>
            <label 
              className={`${registercss.roleOption} ${formData.role === 'student' ? registercss.selected : ''}`}
            >
              <input
                type="radio"
                name="role"
                value="student"
                checked={formData.role === 'student'}
                onChange={handleChange}
                className={registercss.roleRadio}
              />
              <span>Student</span>
            </label>
            <label 
              className={`${registercss.roleOption} ${formData.role === 'instructor' ? registercss.selected : ''}`}
            >
              <input
                type="radio"
                name="role"
                value="instructor"
                checked={formData.role === 'instructor'}
                onChange={handleChange}
                className={registercss.roleRadio}
              />
              <span>Instructor</span>
            </label>
          </div>
          {errors.role && <span className={registercss.error}>{errors.role}</span>}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={registercss.submitButton}
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>

      {/* Login Link */}
      <p className={registercss.loginLink}>
        Already have an account? 
        <Link href="/login">Login</Link>
      </p>
    </div>
  );
}