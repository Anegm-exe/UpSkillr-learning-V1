/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from "react";
import styles from "../../styles/profile.module.css";
import { useAuth } from "@/components/AuthContext";
import axios from "../api/axios";

export default function Profile() {
    const { tokenDetails, isLoading,logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState({
        _id: tokenDetails?._id || "",
        name: tokenDetails?.name || "",
        email: tokenDetails?.email || "",
        profile_picture_url: tokenDetails?.profile_picture_url || "",
        date_of_birth: tokenDetails?.dateOfBirth || "",
    });

    if (isLoading) {
        return <div className={styles.container}>Loading...</div>;
    }

    if (!tokenDetails) {
        return <div className={styles.container}>Error: please sign in</div>;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic (e.g., API call)
        try{
            const updatedUser = axios.patch(`user/${tokenDetails?._id}`,userInfo)
            // After successful submission
            setIsEditing(false);
        }catch {
            console.error("Error updating user info");
        }
    };

    const kys = () => {
        try {
            axios.delete(`/user/${tokenDetails._id}`);
            logout()
          }catch(error) {
            //@ts-expect-error
            console.error("Error deleting user:" + error.response.data.message);
          }
    }

    return (
        <div className={styles.container}>
            <img src={tokenDetails.profile_picture_url} alt={`${tokenDetails.name}'s profile`} className={styles["profile_picture"]}></img>
            <div className={styles["profile_details"]}>
                <h1>{tokenDetails.name}</h1>
                <p>Role: {tokenDetails.role}</p>
                <p>User ID: {tokenDetails._id}</p>

                <button
                    className={styles["edit_button"]}
                    onClick={() => {
                        setIsEditing(!isEditing)
                        setUserInfo(tokenDetails)
                    }}
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
                    <button onClick={kys} className={styles["submit_button"]}>
                        KILL YOURSELF????
                    </button>
            </div>
        </div>
    );
}
