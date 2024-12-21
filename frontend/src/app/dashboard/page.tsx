/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useAuth } from "@/components/AuthContext";
import DashboardCss from "../../styles/dashboard.module.css";
import { useFetchNotifications } from "../api/services/useFetchNotifications";
import { useFetchUserCourses } from "../api/services/useFetchCourse";
import NotificationDetails from "../../components/NotificationDetails";
import { AllCoursesDetails, EnrolledCourses, CompletedCourses } from "../../components/StudentDashboardcourse";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();
    const { tokenDetails , isloading} = useAuth();
    const { notificationsData } = useFetchNotifications(tokenDetails?._id);
    const { enrolledCourseData, completedCourseData } = useFetchUserCourses();

    return (
        <div className={DashboardCss.maincontainer}>
            {/* Left Container */}
            <div className={DashboardCss.leftcontainer}>
                {/* profile part */}
                <img src={tokenDetails?.profile_picture_url} alt="ProfileImg"></img>
                <h1>Welcome Back, {tokenDetails?.name}</h1>
                <a href="/profile" className={DashboardCss.viewprofile}>View Profile</a>
                <div className={DashboardCss.separatorline}></div>  {/* Separator */}
                {/* Enrolled Courses part */}
                <h1>Enrolled Courses</h1>
                <div className={DashboardCss["list-container"]}>
                    <ul className={DashboardCss["vertical-list"]}>
                        {(enrolledCourseData && enrolledCourseData.length > 0) ? (
                            enrolledCourseData.map((course: { _id: string, title: string, description: string, instructor: string[], category: string[] }) => (
                                <EnrolledCourses key={course._id} courseData={course} />
                            ))
                        ) : (
                            <li style={{ pointerEvents: "none" }}>Not Enrolled Yet In Any Courses</li>
                        )}
                    </ul>
                </div>
                <div className={DashboardCss.separatorline}></div>  {/* Separator */}
                <h1>Completed Courses</h1>
                <div className={DashboardCss["list-container"]}>
                    <ul className={DashboardCss["vertical-list"]}>
                        {(completedCourseData && completedCourseData.length > 0) ? (
                            completedCourseData.map((course: { _id: string, title: string, description: string, instructor: string[], category: string[] }) => (
                                <CompletedCourses key={course._id} courseData={course} />
                            ))
                        ) : (
                                <li style={{ pointerEvents: "none" }}>No Completed Courses Yet</li>
                        )}
                    </ul>
                </div>
                <div className={DashboardCss.separatorline}></div>  {/* Separator */}
                <h1>Course Progress</h1>
                <div className={DashboardCss["list-container"]}>
                    <ul className={DashboardCss["vertical-list"]}>
                        <li onClick={()=>router.push('/progress')}>Progress</li>
                    </ul>
                </div>
            </div>

            {/* Right Container */}
            <div className={DashboardCss.rightcontainer}>
                {/* Top Right Container */}
                <div className={DashboardCss.toprightcontainer}>
                    {/* Last Enrolled Container */}
                    <div className={DashboardCss.LatestEnrolled}>
                        <h1>Newest Enrollment</h1>
                        <div className={DashboardCss.separatorline}></div>  {/* Separator */}
                        <h1>Progess</h1>
                        <h1>Average Score</h1>
                        <h1>Enrollment Date</h1>
                        <h1>Course Instructor</h1>
                        <h1>Course Name</h1>
                        <h1>Check Course</h1>
                    </div>
                    {/* Notification Container */}
                    <div className={DashboardCss.notificationcenter}>
                        <h1>Notification Center</h1>
                        <div className={DashboardCss.separatorline} style={{ width: '30%' }}></div>  {/* Separator */}
                        <div className={DashboardCss.notificationDiv}>
                            {notificationsData && notificationsData.length > 0 ? (
                                notificationsData.map((notification: { _id: string, message: string, sender_id: string, timestamp: string }) => (
                                    <NotificationDetails key={notification._id} notificationData={notification} />
                                ))
                            ) : (
                                <h1>No Notifications</h1>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Right Container */}
                <div className={DashboardCss.bottomrightcontainer}>
                    <h1>Active & Past Courses</h1>
                    <div className={DashboardCss.separatorline} style={{ width: '25%' }}></div>  {/* Separator */}
                    <div className={DashboardCss.courseDiv}>
                        {(enrolledCourseData && enrolledCourseData.length > 0) || (completedCourseData && completedCourseData.length > 0) ? (
                            <>
                                {enrolledCourseData.map((course: { _id: string, title: string, description: string, instructor: string[], category: string[] }) => (
                                    <AllCoursesDetails key={course._id} courseData={course} />
                                ))}
                                {completedCourseData.map((course: { _id: string, title: string, description: string, instructor: string[], category: string[] }) => (
                                    <AllCoursesDetails key={course._id} courseData={course} />
                                ))}
                            </>
                        ) : (
                            <h1>No Courses History Available</h1>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
