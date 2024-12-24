"use client";

import React from "react";
import { useAnalytics } from "@/app/_hooks/useAnalytics";

export interface CourseAnalytics {
  courseId: string;
  courseName: string;
  moduleRatings: string;
  courseRating: number;
  instructorRating: number;
  enrolledStudents: number;
  completedStudents: number;
  belowAverageStudents: number;
  averageStudents: number;
  aboveAverageStudents: number;
  excellentStudents: number;
}

const AnalyticsPage = () => {
  const { data, loading, error, downloadCSV } = useAnalytics();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );

  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-accent">Course Analytics</h1>
      <button onClick={downloadCSV} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors">
        Download CSV
      </button>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ratings</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Students</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Performance Distribution</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {data.map((course) => (
              <tr key={course.courseId} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-white">{course.courseName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    <div>Course: {course.courseRating || "N/A"}</div>
                    <div>Instructor: {course.instructorRating || "N/A"}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">
                    <div>Enrolled: {course.enrolledStudents || "N/A"}</div>
                    <div>Completed: {course.completedStudents || "N/A"}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-4 text-sm text-gray-300">
                    <div>Below: {course.belowAverageStudents}</div>
                    <div>Average: {course.averageStudents}</div>
                    <div>Above: {course.aboveAverageStudents}</div>
                    <div>Excellent: {course.excellentStudents}</div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalyticsPage;
