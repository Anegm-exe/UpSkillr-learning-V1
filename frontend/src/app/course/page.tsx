'use client';
import { useAuth } from "@/components/AuthContext";
import { Admincourses, Studentcourses, Instructorcourses } from '../../components/coursesMainComp';

export default function CoursePage() {
    const { tokenDetails, isLoading } = useAuth();

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    if (!tokenDetails) {
        return <h1>Please log in To See Courses</h1>;
    }

    switch (tokenDetails.role) {
        case 'admin':
            return <Admincourses />;
        case 'student':
            return <Studentcourses tokenDetails={tokenDetails} />;
        case 'instructor':
            return <Instructorcourses tokenDetails={tokenDetails} />;
        default:
            return <h1>Unauthorized Access</h1>;
    }
}