'use client';

import Image from "next/image";
import styles from "../../styles/profile.module.css";
import { useAuth } from "@/components/AuthContext";


export default function Profile() {
  const {tokenDetails,isLoading} = useAuth();
  if (isLoading) {
    return <div className={styles.container}>Loading...</div>;
  }
  const user = tokenDetails;
  if (!user) {
    return <div className={styles.container}>Error: please sign in</div>;
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
