'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "../api/axios";

interface Notification {
  _id: string;
  user_ids: string;
  message: string;
  timestamp: Date;
  expiredTime: number; 
}

export default function NotificationDetails() {
  const router = useRouter();
  const [notification, setNotification] = useState<Notification>({
    _id: "",
    user_ids: "",
    message: "",
    timestamp: new Date(),
    expiredTime: 0,
  });
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch all notifications
  const fetchAllNotifications = async () => {
    try {
      const response = await axios.get("/notifications");
      setAllNotifications(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch notifications");
      setLoading(false);
    }
  };

  // Fetch a single notification by ID
  const fetchNotificationById = async (id: string) => {
    try {
      const response = await axios.get(`/notifications/${id}`);
      setNotification(response.data);
    } catch (err) {
      setError("Failed to fetch the notification");
    }
  };

  // Handle input changes for editing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNotification({ ...notification, [e.target.name]: e.target.value });
  };

  // Save updates to a notification
  const handleSave = async () => {
    try {
      await axios.patch(`/notifications/${notification._id}`, {
        message: notification.message,
      });
      setIsEditing(false);
      alert("Notification updated successfully");
      fetchAllNotifications();
    } catch (err) {
      setError("Failed to update the notification");
    }
  };

  // Delete a notification by ID
  const deleteNotification = async (id: string) => {
    try {
      await axios.delete(`/notifications/${id}`);
      alert("Notification deleted successfully");
      fetchAllNotifications();
    } catch (err) {
      setError("Failed to delete the notification");
    }
  };

  // Create a new notification
  const createNotification = async () => {
    try {
      const newNotification = {
        user_ids: notification.user_ids,
        message: notification.message,
        timestamp: new Date(),
        expiredTime: notification.expiredTime,
      };
      await axios.post("/notifications", newNotification);
      alert("Notification created successfully");
      fetchAllNotifications();
    } catch (err) {
      setError("Failed to create a notification");
    }
  };

  useEffect(() => {
    fetchAllNotifications();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h1>Notifications</h1>

      {isEditing ? (
        <div className="edit-notification">
          <input
            name="message"
            value={notification.message}
            onChange={handleChange}
          />
          <div>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="notification-details">
          <button onClick={() => setIsEditing(true)}>Edit Notification</button>
        </div>
      )}

      <div className="all-notifications">
        <button onClick={createNotification}>Create New Notification</button>
        <ul>
          {allNotifications.map((notif) => (
            <li key={notif._id}>
              {notif.message}{" "}
              <button onClick={() => fetchNotificationById(notif._id)}>
                View
              </button>
              <button onClick={() => deleteNotification(notif._id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        .container {
          padding: 20px;
        }
        .edit-notification input {
          display: block;
          width: 100%;
          margin-bottom: 10px;
          padding: 10px;
          font-size: 14px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
        button {
          margin-right: 10px;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:first-of-type {
          background-color: #0070f3;
          color: white;
        }
        button:last-of-type {
          background-color: #f44336;
          color: white;
        }
      `}</style>
    </div>
  );
}
