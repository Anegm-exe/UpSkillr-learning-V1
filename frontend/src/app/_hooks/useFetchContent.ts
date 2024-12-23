import { useState, useEffect } from "react";
import axios from "../api/axios";
import { Content } from "../types";

export const useFetchContent = (contentId: string) => {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`content/${contentId}`);
        setContent(response.data as Content);
      } catch (err: any) {
        setError("Failed to fetch content. " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (contentId) {
      fetchContent();
    }
  }, [contentId]);

  return { content, loading, error };
};
