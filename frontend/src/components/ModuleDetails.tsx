"use client";

import React, { useState } from "react";
import modulecss from "../styles/modulecss.module.css";
import moduleup from "../styles/moduleupdate.module.css";

interface ModuleDetailsProps {
  moduleData: {
    _id: string;
    title: string;
    difficulty: string;
    resources: string[];
    category?: string[];
    no_questions?: number;
    type?: string;
    question_bank?: string[];
    quizzes?: string[];
    ratings?: number[];
  };
  addRating: (_id: string, rating: number) => Promise<void>;
  addQuestion: (_id: string, question: string) => Promise<void>;
  removeQuestion: (_id: string, questionId: string) => Promise<void>;
  updateModule: (_id: string, moduleData: Record<string, unknown>) => Promise<void>;
  onClose: () => void;
}

const ModuleDetails: React.FC<ModuleDetailsProps> = ({ moduleData, addRating, addQuestion, removeQuestion, updateModule, onClose }) => {
  const [rating, setRating] = useState<number>(0);
  const [question, setQuestion] = useState<string>("");
  const [formData, setFormData] = useState(moduleData); // Declare formData here

  const handleAddRating = async () => {
    try {
      await addRating(moduleData._id, rating);
      setRating(0);
    } catch (error) {
      console.error("Error adding rating:", error);
    }
  };

  const handleAddQuestion = async () => {
    try {
      await addQuestion(moduleData._id, question);
      setQuestion("");
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleRemoveQuestion = async (questionId: string) => {
    try {
      await removeQuestion(moduleData._id, questionId);
    } catch (error) {
      console.error("Error removing question:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateModule(moduleData._id, formData);
      onClose();
    } catch (error) {
      console.error("Error updating module:", error);
    }
  };

  return (
    <div className={modulecss.moduleContainer}>
      <h2 className={modulecss.moduleTitle}>{moduleData.title}</h2>
      <p className={modulecss.moduleText}>Difficulty: {moduleData.difficulty}</p>
      <p className={modulecss.moduleText}>Resources: {moduleData.resources.join(", ")}</p>

      <div className={modulecss.moduleDivInput}>
        <div>
          <input
            type="number"
            className={modulecss.moduleInput}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            placeholder="Add Rating"
          />
          <button className={modulecss.moduleButton} onClick={handleAddRating}>
            Add Rating
          </button>
        </div>

        <div>
          <input
            type="text"
            className={modulecss.moduleInput}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Add Question"
          />
          <button className={modulecss.moduleButton} onClick={handleAddQuestion}>
            Add Question
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={modulecss.moduleForm}>
        <label className={modulecss.moduleLabel}>
          Title:
          <input type="text" name="title" className={modulecss.moduleInput} value={formData.title} onChange={handleInputChange} />
        </label>
        {/* Additional fields can go here */}
        <button type="submit" className={modulecss.moduleButton}>
          Update Module
        </button>
      </form>

      <div className={modulecss.moduleCloseButton}>
        <button className={modulecss.moduleButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ModuleDetails;
