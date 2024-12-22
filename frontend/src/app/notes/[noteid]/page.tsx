'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "../../api/axios";
import notecss from "@/styles/notecss.module.css";

interface Note {
  _id?: string;
  user_id?: string;
  course_id?: string;   
  content?: string;
  timestamp?: Date;
  last_updated?: Date;
}

export default function NoteDetails({
  params,
}: {
  params: Promise<{ noteid: string }>;
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

  const { noteid: noteId } = React.use(params);

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

  // Auto-save function
  const autoSave = async () => {
    try {
      if (note._id) {
        await axios.patch(`/note/${note._id}`, {
          content: note.content
        });
        console.log("Note auto-saved");
      }
    } catch (err) {
      console.error("Auto-save failed");
    }
  };

  // Set up auto-save when editing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isEditing) {
      interval = setInterval(() => {
        autoSave();
      }, 2000); // Auto-save every 2 seconds
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isEditing, note.content]);

  // Delete note by ID
  const deleteNote = async () => {
    try {
      if (note._id) {
        await axios.delete(`/note/${note._id}`);
        alert("Note deleted successfully");
        router.push("/"); // Redirect to home or reload the list of notes
      }
    } catch (err) {
      setError("Failed to delete the note");
    }
  };

  // Handle input changes for editing
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote({ ...note, content: e.target.value });
  };

  // Save updates to the note
  const handleSave = async () => {
    try {
      await axios.patch(`/note/${note._id}`, {
        content: note.content
      });
      setIsEditing(false);
      alert("Note updated successfully");
    } catch (err) {
      setError("Failed to update the note");
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h1>Note Details</h1>
      {isEditing ? (
        <div className={notecss.edit_note}>
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
        <div className={notecss.note_details}>
          <p>{note.content || 'No content available'}</p>
          <div>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={() => deleteNote()}>Delete</button>
            <button onClick={() => router.push("/notes")}>Back</button>
          </div>
        </div>
      )}
    </div>
  );
}
