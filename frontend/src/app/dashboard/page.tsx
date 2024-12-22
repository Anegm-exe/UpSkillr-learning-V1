/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useAuth } from "@/components/AuthContext";
import DashboardCss from "../../styles/dashboard.module.css";
import { useFetchNotifications } from "../api/services/useFetchNotifications";
import { useFetchUserCourses, useFetchInstructorCourses, useFetchAllCourses, useFetchAllUsers } from "../api/services/useFetchCourse";
import NotificationDetails from "../../components/NotificationDetails";
import axios from "../../app/api/axios";
import { useState } from 'react';
import { CourseDetailsProps, UserDetailsProps, AllCoursesDetails, EnrolledCourses, CompletedCourses, SupervisedCourses, DetailedSupervisedCourses, AllCourses, AllUsersData } from "../../components/StudentDashboardcourse";

export default function Dashboard() {
    const { tokenDetails, isloading } = useAuth();

    if (!tokenDetails || isloading) {
        return <h1>Loading...</h1>;
    }

    if (tokenDetails.role === 'admin') {
        return <AdminDashboard tokenDetails={tokenDetails} />;
    }

    if (tokenDetails.role === 'student') {
        return <StudentDashboard/>;
    }

    if (tokenDetails.role === 'instructor') {
        return <InstructorDashboard tokenDetails={tokenDetails} />;
    }

    return <h1>Unauthorized Access</h1>;
}

// Admin Dashboard Comopnenets
function AdminDashboard({ tokenDetails }) {
    const { AllCoursesdata } = useFetchAllCourses();
    const { UsersData } = useFetchAllUsers();
    const [notificationText, setNotificationText] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent page refresh
        try {
            const response = await axios.post('/notifications/send', {
                text: notificationText,
            });
            console.log('Notification sent:', response.data);
            alert('Notification sent successfully!');
            setNotificationText(""); // Clear the text area
        } catch (error) {
            console.error('Error sending notification:', error);
            alert('Failed to send notification. Please try again.');
        }
    };

    const backupserver = () => {
        //Do Something Here
    };

    return (
        <div className={DashboardCss.maincontainer}>
            {/* Left Container */}
            <div className={DashboardCss.leftcontainer}>
                {/* profile part */}
                <img src={tokenDetails?.profile_picture_url} alt="ProfileImg"></img>
                <h1>Welcome Back, {tokenDetails?.name}</h1>
                <a href="/profile" className={DashboardCss.viewprofile}>View Profile</a>
                <div className={DashboardCss.separatorline}></div>  {/* Separator */}
                {/* All Courses Showcase */}
                <h1>All Courses</h1>
                <div className={DashboardCss["list-container"]}>
                    <ul className={DashboardCss["vertical-list"]}>
                        {(AllCoursesdata && AllCoursesdata.length > 0) ? (
                            AllCoursesdata.map((course: CourseDetailsProps['courseData'] ) => (
                                <AllCourses key={course._id} courseData={course} />
                            ))
                        ) : (
                            <li style={{ pointerEvents: "none" }}>No Courses Yet Avaliable</li>
                        )}
                        <div className={DashboardCss.separatorline} style={{ 'margin': '1.25rem auto' }}></div>  {/* Separator */}
                        <li style={{ 'padding': '.8rem', 'fontSize': '1.1rem', 'fontFamily': 'roboto-condensed' }} onClick={backupserver}>Call BackUp Server</li>
                    </ul>
                </div>
            </div>

            {/* Right Container */}
            <div className={DashboardCss.rightcontainer}>
                {/* Top Right Container */}
                <div className={DashboardCss.toprightcontainer}>
                    {/* Notification Form */}
                    <div className={DashboardCss.LatestEnrolled}>
                        <h1>System Notification</h1>
                        <div className={DashboardCss.separatorline}></div>  {/* Separator */}
                        <form onSubmit={handleSubmit} className={DashboardCss.notificationForm}>
                            <textarea value={notificationText} onChange={(e) => setNotificationText(e.target.value)} placeholder="Type a system notification..." className={DashboardCss.textArea}/>
                            <button type="submit" className={DashboardCss.submitButton}> Submit Notification </button>
                        </form>
                    </div>
                    {/* Users Mangment Section */}
                    <div className={DashboardCss.notificationcenter}>
                        <h1>Manage User Accounts</h1>
                        <div className={DashboardCss.separatorline} style={{ width: '30%' }}></div>  {/* Separator */}
                        <div className={DashboardCss.notificationDiv}>
                            {UsersData && UsersData.length > 0 ? (
                                UsersData.map((data: UserDetailsProps['userData']) => (
                                    <AllUsersData key={data._id} userData={data} />
                                ))
                            ) : (
                                <h1>No Accounts Avaliable</h1>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Right Container */}
                <div className={DashboardCss.bottomrightcontainer}>
                    <h1>All Courses Information</h1>
                    <div className={DashboardCss.separatorline} style={{ width: '25%' }}></div>  {/* Separator */}
                    <div className={DashboardCss.courseDiv}>
                        {(AllCoursesdata && AllCoursesdata.length > 0) ? (
                            AllCoursesdata.map((course: CourseDetailsProps['courseData']) => (
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

// Student Dashboard Comopnenets
function StudentDashboard({ tokenDetails }) {
    const { enrolledCourseData, completedCourseData } = useFetchUserCourses();
    const { notificationsData } = useFetchNotifications(tokenDetails._id);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const [StudentCourses, setStudentCourses] = useState([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleISearch = async () => {
        if (!searchQuery.trim()) {
            return;
        }

        try {
            const response = await axios.get(`/user/search-intructor/${searchQuery}`);
            setFilteredResults(response.data);
        } catch {
            console.error("Error fetching student courses!");
        }
    };

    const showInstructorCourses = async (id: string) => {
        try {
            const response = await axios.get(`/course/instructor/` + id);
            setStudentCourses(response.data);
            console.log(response.data);
        } catch {
            console.error("Error fetching student courses!");
            setStudentCourses([]);
        }
    };

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
                            enrolledCourseData.map((course: CourseDetailsProps['courseData']) => (
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
                            completedCourseData.map((course: CourseDetailsProps['courseData']) => (
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
                        <h1>Search-Up Instructors</h1>
                        <div className={DashboardCss.separatorline}></div>  {/* Separator */}
                        <div className={DashboardCss.searchbox}>
                            <input type="text" value={searchQuery} placeholder="Instructor Name" onChange={handleChange} className={DashboardCss.searchbar} />
                            <button onClick={handleISearch} className={DashboardCss.searchbutton}>Search</button>
                        </div>
                        <ul className={DashboardCss.resultsList}>
                            {filteredResults.map((user: { _id: string, email: string, profile_picture_url: string, name: string }) => (
                                <li key={user._id} className={DashboardCss.resultItem} onClick={() => showInstructorCourses(user._id)}>
                                    <div className={DashboardCss.resultDiv}>
                                        <img src={user.profile_picture_url} alt={`profile pic`} className={DashboardCss.userAvatar} />
                                        <div className={DashboardCss.userInfo}>
                                            <p>{user.name}</p>
                                            <p>{user.email}</p>
                                            <span>ID: {user._id}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {StudentCourses.length > 0 && (
                                <div className={DashboardCss.modal}>
                                    <div className={DashboardCss.closeButton} onClick={() => setStudentCourses([])}></div>
                                    <div className={DashboardCss.modalContent}>
                                        <h2>Instructor Supervising Courses</h2>
                                        <div className={DashboardCss.separatorline} style={{ width: '25%' }}></div>  {/* Separator */}
                                        <ul>
                                            {StudentCourses.map((course: CourseDetailsProps['courseData']) => (
                                                <li key={course._id} className={DashboardCss.courseItem}>
                                                    <h3>{course.title}</h3>
                                                    <p><strong>Description:</strong> {course.description}</p>
                                                    <p><strong>Category:</strong> {course.category}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </ul>
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
                                {enrolledCourseData.map((course: CourseDetailsProps['courseData']) => (
                                    <AllCoursesDetails key={course._id} courseData={course} />
                                ))}
                                {completedCourseData.map((course: CourseDetailsProps['courseData']) => (
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

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const [StudentCourses, setStudentCourses] = useState([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSSearch = async () => {
        if (!searchQuery.trim()) {
            return;
        }

        try {
            const response = await axios.get(`/user/search-student/${searchQuery}`);
            setFilteredResults(response.data);
        } catch {
            console.error("Error fetching student courses!");
        }
    };

    const showStudentCourses = async (id: string) => {
        try {
            const response = await axios.get(`/course/enrolled/` + id);
            setStudentCourses(response.data);
            console.log(response.data);
        } catch {
            console.error("Error fetching student courses!");
            setStudentCourses([]);
        }
    };

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
                            superCourses.map((course: CourseDetailsProps['courseData']) => (
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
                    {/* Search For Students Students */}
                    <div className={DashboardCss.LatestEnrolled}>
                        <h1>Search-Up Students</h1>
                        <div className={DashboardCss.separatorline}></div>  {/* Separator */}
                        <div className={DashboardCss.searchbox}>
                            <input type="text" value={searchQuery} placeholder="Student Name" onChange={handleChange} className={DashboardCss.searchbar} />
                            <button onClick={handleSSearch} className={DashboardCss.searchbutton}>Search</button>
                        </div>
                        <ul className={DashboardCss.resultsList}>
                            {filteredResults.map((user: { _id: string, email: string, profile_picture_url: string, name: string }) => (
                                <li key={user._id} className={DashboardCss.resultItem} onClick={() => showStudentCourses(user._id)}>
                                    <div className={DashboardCss.resultDiv}>
                                        <img src={user.profile_picture_url} alt={`profile pic`} className={DashboardCss.userAvatar} />
                                        <div className={DashboardCss.userInfo}>
                                            <p>{user.name}</p>
                                            <p>{user.email}</p>
                                            <span>ID: {user._id}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {StudentCourses.length > 0 && (
                                <div className={DashboardCss.modal}>
                                    <div className={DashboardCss.closeButton} onClick={() => setStudentCourses([])}></div>
                                    <div className={DashboardCss.modalContent}>
                                        <h2>Student Enrolled Courses</h2>
                                        <div className={DashboardCss.separatorline} style={{ width: '25%' }}></div>  {/* Separator */}
                                        <ul>
                                            {StudentCourses.map((course: CourseDetailsProps['courseData']) => (
                                                <li key={course._id} className={DashboardCss.courseItem}>
                                                    <h3>{course.title}</h3>
                                                    <p><strong>Description:</strong> {course.description}</p>
                                                    <p><strong>Instructors:</strong> {course.instructor_ids}</p>
                                                    <p><strong>Category:</strong> {course.category}</p>
                                                    <p><strong>Active:</strong> {course.isArchived ? "No" : "Yes"}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </ul>
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
                            superCourses.map((course: CourseDetailsProps['courseData']) => (
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