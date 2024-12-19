'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "../api/axios";

interface Note {
  _id: string;
  user_id: string;
  course_id?: string;   
  content: string;
  timestamp: Date;
  last_updated: Date;
}

export default function NoteDetails({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const router = useRouter();
  const [note, setNote] = useState<Note>({
    _id: "",
    user_id: "",
    course_id: "",
    content: "",
    timestamp: new Date(),
    last_updated: new Date(),
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Use React.use to unwrap params
  const { noteId } = React.use(params);

  // Fetch note details by ID
  useEffect(() => {
    if (!noteId) return;

    const fetchNote = async () => {
      try {
        const response = await axios.get(`/note/${noteId}`);
        setNote(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch the note");
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId]);

  // Handle input changes for editing
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote({ ...note, content: e.target.value });
  };

  // Save updates to the note
  const handleSave = async () => {
    try {
      await axios.patch(`/note/${note._id}`, {
        content: note.content,
      });
      setIsEditing(false);
      alert("Note updated successfully");
    } catch (err) {
      setError("Failed to update the note");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h1>Note Details</h1>
      {isEditing ? (
        <div className="edit-note">
          <textarea
            name="content"
            value={note.content}
            onChange={handleChange}
          />
          <div>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="note-details">
          <p>{note.content || 'No content available'}</p>
          <div>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={() => router.push("/")}>Back</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .container {
          padding: 20px;
        }
        .note-details,
        .edit-note {
          margin-bottom: 20px;
        }
        .edit-note textarea {
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

