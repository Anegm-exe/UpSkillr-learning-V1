'use client';
import { useEffect, useState } from "react";
import axios from '../../api/axios';

export function useFetchCategory() {
    const [categoryData, setCategoryData] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategoryData = async () => {
        try {
            const response = await axios.get(`/course/find/categories`);
            setCategoryData(response.data);
        } catch (error) {
            console.error('Error fetching chat data:', error);
            setError('Failed to fetch chat data.');
        }
        };

        fetchCategoryData();
    }, []);

    return { categoryData, error };
}