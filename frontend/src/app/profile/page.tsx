/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from "react";
import styles from "../../styles/profile.module.css";
import { useAuth } from "@/components/AuthContext";

export default function Profile() {
    const { tokenDetails, isLoading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState({
        name: tokenDetails?.name || "",
        email: tokenDetails?.email || "",
        profile_picture_url: tokenDetails?.profile_picture_url || "",
        date_of_birth: tokenDetails?.dateOfBirth || "",
    });

    if (isLoading) {
        return <div className={styles.container}>Loading...</div>;
    }

    const user = tokenDetails;
    if (!user) {
        return <div className={styles.container}>Error: please sign in</div>;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    console.log(tokenDetails);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic (e.g., API call)
        console.log("Updated User Info:", userInfo);
        // After successful submission
        setIsEditing(false);
    };

    return (
        <div className={styles.container}>
            <img src={user.profile_picture_url} alt={`${user.name}'s profile`} className={styles["profile_picture"]}></img>
            <div className={styles["profile_details"]}>
                <h1>{user.name}</h1>
                <p>Role: {user.role}</p>
                <p>User ID: {user._id}</p>

                <button
                    className={styles["edit_button"]}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? "Cancel" : "Edit"}
                </button>

                {isEditing && (
                    <form className={styles["edit_form"]} onSubmit={handleSubmit}>
                        <div className={styles["form_group"]}>
                            <div className={styles["label1"]}>Name</div>
                            <input className={styles["input1"]}
                                type="text"
                                id="name"
                                name="name"
                                value={userInfo.name}
                                onChange={handleInputChange}
                                placeholder="Enter your name"
                            />
                        </div>

                        <div className={styles["form_group"]}>
                            <label htmlFor="profile_picture_url">Profile Picture URL</label>
                            <input className={styles["input1"]}
                                type="text"
                                id="profile_picture_url"
                                name="profile_picture_url"
                                value={userInfo.profile_picture_url}
                                onChange={handleInputChange}
                                placeholder="Enter your profile picture URL"
                            />
                        </div>

                        <div className={styles["form_group"]}>
                            <label htmlFor="email">Email</label>
                            <input className={styles["input1"]}
                                type="email"
                                id="email"
                                name="email"
                                value={userInfo.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className={styles["form_group"]}>
                            <label htmlFor="date_of_birth">Date of Birth</label>
                            <input
                                className={styles["input1"]}
                                type="date"
                                id="date_of_birth"
                                name="date_of_birth"
                                value={userInfo.date_of_birth}
                                onChange={handleInputChange}
                            />
                        </div>
                        <button type="submit" className={styles["submit_button"]}>
                            Save Changes
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
}
