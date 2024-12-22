import React, { useState } from 'react';
import modulecss from '../styles/modulecreate.module.css';

interface ModuleFormModalProps {
  courseId: string;
  onClose: () => void;
  createModule: (courseId: string, moduleData: any) => Promise<any>;
}

const CreateModule: React.FC<ModuleFormModalProps> = ({ courseId, onClose, createModule }) => {
  const [formData, setFormData] = useState({
    course_id: courseId,
    title: '',
    difficulty: '',
    resources: '',
    description: '',
    category: '',
    no_questions: '',
    type: '',
    question_bank: '',
    quizzes: '',
    rating: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createModule(courseId, formData);
      onClose();
    } catch (error) {
      console.error('Error creating module:', error);
    }
  };

  return (
    <div className={modulecss.modal}>
      <div className={modulecss.modalContent}>
        <h2>Add New Module</h2>
        <form onSubmit={handleSubmit}>
          <div className={modulecss.inputGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className={modulecss.inputGroup}>
            <label htmlFor="difficulty">Difficulty</label>
            <input
              type="text"
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
            />
          </div>
          <div className={modulecss.inputGroup}>
            <label htmlFor="resources">Resources</label>
            <textarea
              id="resources"
              name="resources"
              value={formData.resources}
              onChange={handleChange}
            />
          </div>
          <div className={modulecss.inputGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className={modulecss.inputGroup}>
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>
          <div className={modulecss.inputGroup}>
            <label htmlFor="no_questions">Number of Questions</label>
            <input
              type="number"
              id="no_questions"
              name="no_questions"
              value={formData.no_questions}
              onChange={handleChange}
              required
            />
          </div>
          <div className={modulecss.inputGroup}>
            <label htmlFor="type">Type</label>
            <input
              type="text"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            />
          </div>
          <div className={modulecss.inputGroup}>
            <label htmlFor="question_bank">Question Bank</label>
            <input
              type="text"
              id="question_bank"
              name="question_bank"
              value={formData.question_bank}
              onChange={handleChange}
            />
          </div>
          <div className={modulecss.inputGroup}>
            <label htmlFor="quizzes">Quizzes</label>
            <input
              type="text"
              id="quizzes"
              name="quizzes"
              value={formData.quizzes}
              onChange={handleChange}
            />
          </div>
          <div className={modulecss.inputGroup}>
            <label htmlFor="rating">Rating</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className={modulecss.submitButton}>Add Module</button>
          <button type="button" onClick={onClose} className={modulecss.cancelButton}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default CreateModule;