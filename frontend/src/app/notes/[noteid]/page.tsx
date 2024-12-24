'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "../../api/axios";
import styles from "../../../styles/note.module.css";

interface Note {
  _id?: string;
  user_id?: string;
  module_id?: string;   
  content?: string;
  timestamp?: Date;
  last_updated?: Date;
}

export default function NoteDetails({ params }: { params: Promise<{ noteid: string }> }) {
  const router = useRouter();
  const [note, setNote] = useState<Note>({
    _id: "",
    user_id: "",
    module_id: "",
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
      } catch {
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
    } catch {
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
    } catch {
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
    } catch {
      setError("Failed to update the note");
    }
  };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                {error}
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Note Details</h1>

            {isEditing ? (
                <div className={styles.editNote}>
                    <textarea
                        className={styles.editTextarea}
                        name="content"
                        value={note.content}
                        onChange={handleChange}
                        placeholder="Enter your note here..."
                    />
                    <div className={`${styles.autoSaveIndicator} ${isEditing ? styles.visible : ''}`}>
                        Auto-saving...
                    </div>
                    <div className={styles.editButtons}>
                        <button className={styles.saveButton} onClick={handleSave}>
                            Save
                        </button>
                        <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className={styles.noteDetails}>
                    <div className={styles.metadata}>
                        <span className={styles.metadataItem}>
                            Last updated: {new Date(note.last_updated!).toLocaleString()}
                        </span>
                    </div>
                    <div className={styles.noteContent}>
                        {note.content || 'No content available'}
                    </div>
                    <div className={styles.buttonContainer}>
                        <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                            Edit
                        </button>
                        <button className={styles.deleteButton} onClick={deleteNote}>
                            Delete
                        </button>
                        <button className={styles.backButton2} onClick={() => router.push("/notes")}>
                            Back
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}