import { useState, useEffect } from "react";
import axios from "../api/axios";

export interface CourseAnalytics {
  courseId: string;
  courseName: string;
  moduleRatings: string;
  courseRating: number;
  instructorRating: number;
  enrolledStudents: string;
  completedStudents: string;
  belowAverageStudents: number;
  averageStudents: number;
  aboveAverageStudents: number;
  excellentStudents: number;
}

export const useAnalytics = () => {
  const [data, setData] = useState<CourseAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get("user/instructor/analytics", {
          responseType: "text",
        });

        const rows = response.data.split("\n");
        const headers = rows[0].split(",");

        const parsedData = rows.slice(1).map((row) => {
          const values = row.split(",");
          return {
            courseId: values[0],
            courseName: values[1],
            moduleRatings: values[2],
            courseRating: parseFloat(values[3]),
            instructorRating: parseFloat(values[4]),
            enrolledStudents: values[5],
            completedStudents: values[6],
            belowAverageStudents: parseInt(values[7]),
            averageStudents: parseInt(values[8]),
            aboveAverageStudents: parseInt(values[9]),
            excellentStudents: parseInt(values[10]),
          };
        });

        setData(parsedData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const downloadCSV = async () => {
    try {
      const response = await axios.get('/user/instructor/analytics', {
        responseType: 'blob', // Specify blob to handle binary data
      });
  
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
  
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'courses_analytics.csv'); // Filename
      document.body.appendChild(link);
      link.click();
  
      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };
  
  return { data, loading, error, downloadCSV };
};
