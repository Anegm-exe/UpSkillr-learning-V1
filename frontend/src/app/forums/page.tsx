'use client';
import { useAuth } from "@/components/AuthContext";
import { Adminforums, Studentforums, Instructorforums } from '../../components/forumsMainComp';

export default function Dashboard() {
    const { tokenDetails, isLoading } = useAuth();

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    if (!tokenDetails) {
        return <h1>Please log in To See Forums</h1>;
    }

    switch (tokenDetails.role) {
        case 'admin':
            return <Adminforums/>;
        case 'student':
            return <Studentforums tokenDetails={tokenDetails} />;
        case 'instructor':
            return <Instructorforums tokenDetails={tokenDetails} />;
        default:
            return <h1>Unauthorized Access</h1>;
    }
}