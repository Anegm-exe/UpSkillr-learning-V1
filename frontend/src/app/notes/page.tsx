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
  params: { noteId: string };
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

  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [error, setError] = useState("");

  // Fetch all notes
  const getAllNotes = async () => {
    try {
      const response = await axios.get("/note");
      setAllNotes(response.data);
     
    } catch (err) {
      setError("Failed to fetch all notes");
     
    }
  };

  useEffect(() => {
    getAllNotes();
  }, []);

  //if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <div className="note-details">
        <div className="notes-grid">
          {allNotes.map((note) => (
            <div key={note._id} className="note-card">
              <p>{note.content}</p>
              <button onClick={() => router.push(`/notes/${note._id}`)}>
                View
              </button>
            </div>
          ))}
        </div>
        <button
    onClick={() => router.push("/")}
    style={{ marginTop: "20px" }} // Adds space above the Back button
  >
    Back
  </button>
      </div>

      <style jsx>{`
        .container {
          padding: 20px;
        }
        .note-details,
        .edit-note,
        .all-notes {
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
          background-color: rgb(244, 54, 165);
          color: white;
        }
      `}</style>
    </div>
  );
}
