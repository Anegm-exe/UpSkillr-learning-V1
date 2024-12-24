import { useState, useEffect } from "react";
import axios from "../api/axios";
import { CourseModule } from "../types";

export const useModules = (courseId: string) => {
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(`/module/course/${courseId}`);
        setModules(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchModules();
    }
  }, [courseId]);

  return { modules, loading, error };
};
