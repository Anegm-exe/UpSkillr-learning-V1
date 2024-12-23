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

  const convertToCSV = (data: CourseAnalytics[]) => {
    const headers = [
      "courseId",
      "courseName",
      "moduleRatings",
      "courseRating",
      "instructorRating",
      "enrolledStudents",
      "completedStudents",
      "belowAverageStudents",
      "averageStudents",
      "aboveAverageStudents",
      "excellentStudents",
    ];

    const rows = data.map((item) =>
      [
        item.courseId,
        item.courseName,
        item.moduleRatings,
        item.courseRating,
        item.instructorRating,
        item.enrolledStudents,
        item.completedStudents,
        item.belowAverageStudents,
        item.averageStudents,
        item.aboveAverageStudents,
        item.excellentStudents,
      ].join(",")
    );

    return [headers.join(","), ...rows].join("\n");
  };

  const downloadCSV = () => {
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "analytics.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return { data, loading, error, downloadCSV };
};
