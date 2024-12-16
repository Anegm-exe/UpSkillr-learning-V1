import styles from "../../styles/profile.module.css";
import { cookies } from "next/headers";
import ProfileClient from "./ProfileClient";

interface UserType {
  _id: string;
  role: string;
  name: string;
  profile_picture_url: string;
  dateOfBirth: Date;
}

export default async function Profile() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) {
    return <ProfileClient user={null} error="No token found" />;
  }

  const res = await fetch("http://localhost:3000/user/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return <ProfileClient user={null} error="Failed to fetch user data" />;
  }

  const fetchedUser: UserType = await res.json();

  return <ProfileClient user={fetchedUser} error={null} />;
}
