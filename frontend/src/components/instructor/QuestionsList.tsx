import React, { useState } from "react";

export interface Questions {
  _id?: string;
  title: string;
  type: string;
  options: string[];
  answer: number;
  difficulty: string;
}

interface UpdateQuestionDto {
  title?: string;
  options?: string[];
  answer?: number;
  difficulty?: string;
  type?: string;
}

interface QuestionsListProps {
  questions: Questions[];
  loadingQuestions: boolean;
  errorQuestions: string | null;
  handleDeleteQuestion: (questionId: string) => void;
  handleUpdateQuestion: (questionId: string, updateQuestionDto: UpdateQuestionDto) => void;
}
const QuestionsList: React.FC<QuestionsListProps> = ({ questions, loadingQuestions, errorQuestions, handleDeleteQuestion, handleUpdateQuestion }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UpdateQuestionDto>({});

  const handleEdit = (question: Questions) => {
    setEditingId(question._id);
    setEditForm({
      title: question.title,
      options: question.options,
      answer: question.answer,
      difficulty: question.difficulty,
    });
  };

  const handleSave = async (questionId: string) => {
    await handleUpdateQuestion(questionId, editForm);
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-white mb-4">Questions</h3>
      {loadingQuestions ? (
        <p className="text-zinc-400">Loading questions...</p>
      ) : errorQuestions ? (
        <p className="text-red-500">{errorQuestions}</p>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question._id} className="bg-zinc-700/50 rounded-md p-4 border border-zinc-600">
              {editingId === question._id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="bg-zinc-600 text-white rounded-md px-3 py-2 w-full"
                  />
                  <input
                    type="text"
                    value={editForm.options?.join(", ")}
                    onChange={(e) => setEditForm({ ...editForm, options: e.target.value.split(", ") })}
                    className="bg-zinc-600 text-white rounded-md px-3 py-2 w-full"
                  />
                  <input
                    type="number"
                    value={editForm.answer}
                    onChange={(e) => setEditForm({ ...editForm, answer: parseInt(e.target.value) })}
                    className="bg-zinc-600 text-white rounded-md px-3 py-2 w-full"
                  />
                  <select
                    value={editForm.difficulty}
                    onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}
                    className="bg-zinc-600 text-white rounded-md px-3 py-2 w-full"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={() => handleSave(question._id!)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md">
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white">{question.title}</p>
                    <p className="text-zinc-400 text-sm">Type: {question.type}</p>
                    <p className="text-zinc-400 text-sm">Difficulty: {question.difficulty}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(question)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question._id!)}
                      className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionsList;
