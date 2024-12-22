/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useAuth } from "@/components/AuthContext";
import DashboardCss from "../../styles/dashboard.module.css";
import { useFetchNotifications } from "../api/services/useFetchNotifications";
import { useFetchUserCourses, useFetchInstructorCourses } from "../api/services/useFetchCourse";
import NotificationDetails from "../../components/NotificationDetails";
import { AllCoursesDetails, EnrolledCourses, CompletedCourses, SupervisedCourses, DetailedSupervisedCourses } from "../../components/StudentDashboardcourse";

export default function Dashboard() {
    const { tokenDetails, isloading } = useAuth();

    if (!tokenDetails || isloading) {
        return <h1>Loading...</h1>;
    }

    if (tokenDetails.role === 'student') {
       
    }

    if (tokenDetails.role === 'student') {
        return <StudentDashboard/>;
    }

    if (tokenDetails.role === 'instructor') {
        return <InstructorDashboard tokenDetails={tokenDetails} />;
    }

    return <h1>Unauthorized Access</h1>;
}


function StudentDashboard() {
    const { tokenDetails } = useAuth()
    const { enrolledCourseData, completedCourseData } = useFetchUserCourses();
    const { notificationsData } = useFetchNotifications(tokenDetails?._id);

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
                            enrolledCourseData.map((course: { _id: string, title: string, description: string, instructor_ids: string[], category: string[], students: string[], isArchived: boolean, rating: number }) => (
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
                            completedCourseData.map((course: { _id: string, title: string, description: string, instructor_ids: string[], category: string[], students: string[], isArchived: boolean, rating: number }) => (
                                <CompletedCourses key={course._id} courseData={course} />
                            ))
                        ) : (
                            <li style={{ pointerEvents: "none" }}>No Completed Courses Yet</li>
                        )}
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
                    <h1>Enrolled & Completed Courses</h1>
                    <div className={DashboardCss.separatorline} style={{ width: '25%' }}></div>  {/* Separator */}
                    <div className={DashboardCss.courseDiv}>
                        {(enrolledCourseData && enrolledCourseData.length > 0) || (completedCourseData && completedCourseData.length > 0) ? (
                            <>
                                {enrolledCourseData.map((course: { _id: string, title: string, description: string, instructor_ids: string[], category: string[], students: string[], isArchived: boolean, rating: number }) => (
                                    <AllCoursesDetails key={course._id} courseData={course} />
                                ))}
                                {completedCourseData.map((course: { _id: string, title: string, description: string, instructor_ids: string[], category: string[], students: string[], isArchived: boolean, rating: number }) => (
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

// Instructor DashBoard Components
function InstructorDashboard({ tokenDetails }) {
    const { notificationsData } = useFetchNotifications(tokenDetails?._id);
    const { superCourses } = useFetchInstructorCourses(tokenDetails?._id);

    //const [searchQuery, setSearchQuery] = useState("");
    //const [filteredResults, setFilteredResults] = useState();
    //const handleSearch = () => {
    //    setFilteredResults(results);
    //};

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
                <h1>Supervised Courses</h1>
                <div className={DashboardCss["list-container"]}>
                    <ul className={DashboardCss["vertical-list"]}>
                        {(superCourses && superCourses.length > 0) ? (
                            superCourses.map((course: { _id: string, title: string, description: string, instructor_ids: string[], category: string[], students: string[], isArchived: boolean, rating: number }) => (
                                <SupervisedCourses key={course._id} courseData={course} />
                            ))
                        ) : (
                            <li style={{ pointerEvents: "none" }}>No Courses Created Yet</li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Right Container */}
            <div className={DashboardCss.rightcontainer}>
                {/* Top Right Container */}
                <div className={DashboardCss.toprightcontainer}>
                    {/* Last Enrolled Container */}
                    <div className={DashboardCss.LatestEnrolled}>
                        <h1>Check Student Courses</h1>
                        <div className={DashboardCss.separatorline}></div>  {/* Separator */}
                        {/*<div className={DashboardCss.searchContainer}>*/}
                        {/*    <input*/}
                        {/*        type="text"*/}
                        {/*        placeholder="Search students..."*/}
                        {/*        className={DashboardCss.searchBar} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>*/}
                        {/*    <button className={DashboardCss.searchButton} onClick={handleSearch}>Search</button>*/}
                        {/*</div>*/}

                        {/* Results List */}
                        {/*<ul className={DashboardCss.resultsList}>*/}
                        {/*    {filteredResults.map((student, index) => (*/}
                        {/*        <li key={index} className={DashboardCss.resultItem}>*/}
                        {/*            {student}*/}
                        {/*        </li>*/}
                        {/*    ))}*/}
                        {/*</ul>*/}
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
                    <h1>Course Mangment & Details</h1>
                    <div className={DashboardCss.separatorline} style={{ width: '25%' }}></div>  {/* Separator */}
                    <div className={DashboardCss.courseDiv}>
                        {(superCourses && superCourses.length > 0) ? (
                            superCourses.map((course: { _id: string, title: string, description: string, instructor_ids: string[], category: string[], students: string[], isArchived: boolean, rating: number }) => (
                                <DetailedSupervisedCourses key={course._id} courseData={course} />
                            ))
                        ) : (
                            <h1>Create Courses To Be Able To Supervise And Show Details On Here!</h1>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}