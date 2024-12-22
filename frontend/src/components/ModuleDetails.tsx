import React, { useState } from 'react';
import modulecss from '../styles/modulecss.module.css';
import moduleup from '../styles/moduleupdate.module.css';

interface ModuleDetailsProps {
  moduleData: {
    _id: string;
    course_id: string;
    title: string;
    difficulty: string;
    resources: string[];
    category?: string[];
    no_questions?: number;
    type?: string;
    question_bank?: string[];
    quizzes?: string[];
    ratings?: number[];
  }[];
  addRating: (_id: string, rating: number) => Promise<void>;
  addQuestion: (_id: string, question: string) => Promise<void>;
  removeQuestion: (_id: string, questionId: string, question: string) => Promise<void>;
  updateModule: (_id: string, moduleData: any) => Promise<any>;
  onClose: () => void;
}

export default function ModuleDetails({ moduleData, addRating, addQuestion, removeQuestion, updateModule, onClose }: ModuleDetailsProps) {
  const [rating, setRating] = useState<number>(0);
  const [question, setQuestion] = useState<string>('');
  const [formData, setFormData] = useState<any>({});
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

  const handleAddRating = async (_id: string) => {
    try {
      await addRating(_id, rating);
    } catch (error) {
      console.error('Failed to add rating:', error);
    }
  };

  const handleAddQuestion = async (_id: string) => {
    try {
      await addQuestion(_id, question);
    } catch (error) {
      console.error('Failed to add question:', error);
    }
  };

  const handleRemoveQuestion = async (_id: string, question: string) => {
    try {
      const questionId = moduleData.find(m => m._id === _id)?.question_bank?.indexOf(question);
      if (questionId !== undefined && questionId !== -1) {
        await removeQuestion(_id, questionId.toString(), question);
      }
    } catch (error) {
      console.error('Failed to remove question:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateModule(formData._id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating module:', error);
    }
  };

  const handleOpenUpdateModal = (module: any) => {
    setFormData(module);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    onClose();
  };

  return (
    <div>
      {moduleData.map((module) => (
        <div key={module._id} className={modulecss.moduleContainer}>
          <h2 className={modulecss.moduleTitle}>Title: {module.title}</h2>
          <p className={modulecss.moduleInfo}>Difficulty: {module.difficulty}</p>
          <p className={modulecss.moduleInfo}>
            Resources: {module.resources.join(', ')}
          </p>
          {module.category && (
            <p className={modulecss.moduleInfo}>
              Category: {module.category.join(', ')}
            </p>
          )}
          {module.no_questions !== undefined && (
            <p className={modulecss.moduleInfo}>
              Number of Questions: {module.no_questions}
            </p>
          )}
          {module.type && (
            <p className={modulecss.moduleInfo}>Type: {module.type}</p>
          )}
          {module.question_bank && (
            <p className={modulecss.moduleInfo}>
              Question Bank: {module.question_bank.join(', ')}
            </p>
          )}
          {module.quizzes && (
            <p className={modulecss.moduleInfo}>
              Quizzes: {module.quizzes.join(', ')}
            </p>
          )}
          {module.ratings && (
            <p className={modulecss.moduleInfo}>
              Ratings: {module.ratings.join(', ')}
            </p>  
          )}
          <div className={modulecss.actions}>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              placeholder="Add Rating"
            />
            <button onClick={() => handleAddRating(module._id)}>Add Rating</button>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Add Question"
            />
            <button onClick={() => handleAddQuestion(module._id)}>Add Question</button>
            <button onClick={() => handleRemoveQuestion(module._id, question)}>Remove Question</button>
            <button onClick={() => handleOpenUpdateModal(module)}>Update Module</button>
          </div>
        </div>
      ))}
      {isUpdateModalOpen && (
        <div className={moduleup.modal}>
          <div className={moduleup.modalContent}>
            <h2>Update Module</h2>
            <form onSubmit={handleSubmit}>
              <div className={moduleup.inputGroup}>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={moduleup.inputGroup}>
                <label htmlFor="difficulty">Difficulty</label>
                <input
                  type="text"
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={moduleup.inputGroup}>
                <label htmlFor="resources">Resources</label>
                <textarea
                  id="resources"
                  name="resources"
                  value={formData.resources || ''}
                  onChange={handleChange}
                />
              </div>
              <div className={moduleup.inputGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                />
              </div>
              <div className={moduleup.inputGroup}>
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category || ''}
                  onChange={handleChange}
                />
              </div>
              <div className={moduleup.inputGroup}>
                <label htmlFor="no_questions">Number of Questions</label>
                <input
                  type="number"
                  id="no_questions"
                  name="no_questions"
                  value={formData.no_questions || ''}
                  onChange={handleChange}
                />
              </div>
              <div className={moduleup.inputGroup}>
                <label htmlFor="type">Type</label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={formData.type || ''}
                  onChange={handleChange}
                />
              </div>
              <div className={moduleup.inputGroup}>
                <label htmlFor="question_bank">Question Bank</label>
                <input
                  type="text"
                  id="question_bank"
                  name="question_bank"
                  value={formData.question_bank || ''}
                  onChange={handleChange}
                />
              </div>
              <div className={moduleup.inputGroup}>
                <label htmlFor="quizzes">Quizzes</label>
                <input
                  type="text"
                  id="quizzes"
                  name="quizzes"
                  value={formData.quizzes || ''}
                  onChange={handleChange}
                />
              </div>
              <div className={moduleup.inputGroup}>
                <label htmlFor="rating">Rating</label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={formData.rating || ''}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className={moduleup.submitButton}>Update Module</button>
              <button type="button" onClick={handleCloseUpdateModal} className={moduleup.cancelButton}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}