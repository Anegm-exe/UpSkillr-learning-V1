import styles from "../../styles/profile.module.css";
import Image from "next/image";
import { cookies } from "next/headers";
import { toast } from "react-toastify";
interface UserType {
  userid: string;
  role: string;
  name: string;
  profile_picture_url: string;
}

export default async function Profile() {
  // Fetch user data from an API or database
  // This is just a placeholder example
  const cookieStore = await cookies();
  const token = await cookieStore.get("token")?.value;
  // console.log(token);
  const data = await fetch("http://localhost:3000/user/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  console.log(token);
  if (!data.ok) {
    // Handle error
    console.error("Failed to fetch user data");
    // toast.error(":(");
  }

  const fetchedUser: UserType = await data.json();
  console.log(fetchedUser);
  //   const fetchedUser: UserType = {
  //     userid: "12345",
  //     role: "admin",
  //     name: "John Doe",
  //     profile_picture_url: "http://localhost:3000/124124",
  //   };

  return (
    <div className={styles.container}>
      {/*change logic later */}
      {fetchedUser.profile_picture_url ? (
        <Image
          src={fetchedUser.profile_picture_url}
          alt={`${fetchedUser.name}'s profile`}
          className={styles["profile-picture"]}
          width={150}
          height={150}
        />
      ) : null}
      <div className={styles["profile-details"]}>
        <h1>{fetchedUser.name}</h1>
        <p>Role: {fetchedUser.role}</p>
        <p>User ID: {fetchedUser.userid}</p>
      </div>
    </div>
  );
}
