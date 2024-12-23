import React from "react";

interface AddQuestionFormProps {
  question: string;
  setQuestion: (question: string) => void;
  questionType: string;
  setQuestionType: (type: string) => void;
  questionOptions: string[];
  setQuestionOptions: (options: string[]) => void;
  questionAnswer: number;
  setQuestionAnswer: (answer: number) => void;
  questionDifficulty: string;
  setQuestionDifficulty: (difficulty: string) => void;
  handleAddQuestion: () => void;
}

const AddQuestionForm: React.FC<AddQuestionFormProps> = ({
  question,
  setQuestion,
  questionType,
  setQuestionType,
  questionOptions,
  setQuestionOptions,
  questionAnswer,
  setQuestionAnswer,
  questionDifficulty,
  setQuestionDifficulty,
  handleAddQuestion,
}) => {
  return (
    <div className="mt-6">
      <label htmlFor="question" className="block text-white mb-2">
        New Question
      </label>
      <input
        id="question"
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="New question"
        className="bg-zinc-700 text-white rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent mb-4"
      />
      <label htmlFor="questionType" className="block text-white mb-2">
        Question Type
      </label>
      <select
        id="questionType"
        value={questionType}
        onChange={(e) => setQuestionType(e.target.value)}
        className="bg-zinc-700 text-white rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent mb-4"
      >
        <option value="mcq">Multiple Choice</option>
        <option value="truefalse">True/False</option>
      </select>
      <label htmlFor="questionOptions" className="block text-white mb-2">
        Options (comma separated)
      </label>
      <input
        id="questionOptions"
        type="text"
        value={questionOptions.join(", ")}
        onChange={(e) => setQuestionOptions(e.target.value.split(", "))}
        placeholder="Options (comma separated)"
        className="bg-zinc-700 text-white rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent mb-4"
      />
      <label htmlFor="questionAnswer" className="block text-white mb-2">
        Answer (index)
      </label>
      <input
        id="questionAnswer"
        type="number"
        value={questionAnswer}
        onChange={(e) => setQuestionAnswer(Number(e.target.value))}
        placeholder="Answer (index)"
        className="bg-zinc-700 text-white rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent mb-4"
      />
      <label htmlFor="questionDifficulty" className="block text-white mb-2">
        Difficulty
      </label>
      <select
        id="questionDifficulty"
        value={questionDifficulty}
        onChange={(e) => setQuestionDifficulty(e.target.value)}
        className="bg-zinc-700 text-white rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent mb-4"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <button onClick={handleAddQuestion} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md transition-colors">
        Add Question
      </button>
    </div>
  );
};

export default AddQuestionForm;
