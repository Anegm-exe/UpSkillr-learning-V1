"use client";

import { useEffect } from "react";
import styles from "../../styles/profile.module.css";
import Image from "next/image";
import { toast } from "react-toastify";
interface UserType {
  _id: string;
  role: string;
  name: string;
  profile_picture_url: string;
  dateOfBirth: Date;
}

interface ProfileClientProps {
  user: UserType | null;
  error: string | null;
}

export default function ProfileClient({ user, error }: ProfileClientProps) {
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (error) {
    return <div className={styles.container}>Error: {error}</div>;
  }

  if (!user) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Image src={user.profile_picture_url} alt={`${user.name}'s profile`} className={styles["profile_picture"]} width={150} height={150} />
      <div className={styles["profile_details"]}>
        <h1>{user.name}</h1>
        <p>Role: {user.role}</p>
        <p>User ID: {user._id}</p>
      </div>
    </div>
  );
}
