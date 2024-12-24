'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "../api/axios";
import styles from '../../styles/note.module.css';

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
    const [allNotes, setAllNotes] = useState<Note[]>([]);
    const [error, setError] = useState("");

    const getAllNotes = async () => {
        try {
            const response = await axios.get("/note/user");
            setAllNotes(response.data);
        } catch (err) {
            setError("Failed to fetch notes");
        }
    };

    useEffect(() => {
        getAllNotes();
    }, []);

    const truncateText = (text: string, maxLength: number = 150) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + "...";
    };

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <p className={styles.errorMessage}>{error}</p>
            </div>
        );
    }

    return (
        <div className={styles.notesContainer}>
            <h1 className={styles.pageTitle}>All Notes</h1>

            <div className={styles.notesGrid}>
                {allNotes.map((note) => (
                    <div key={note._id} className={styles.noteCard} onClick={() => router.push(`/notes/${note._id}`)}>
                        <div className={styles.noteContent}>
                            <p className={styles.notePreview}>{truncateText(note.content)}</p>
                        </div>
                        <div className={styles.noteFooter}>
                            <span className={styles.noteDate}>
                                {new Date(note.last_updated).toLocaleDateString()}
                            </span>
                            <span className={styles.viewMore}>Click to view more</span>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => router.push("/dashboard")} className={styles.backButton}>DashBoard</button>
        </div>
    );
}