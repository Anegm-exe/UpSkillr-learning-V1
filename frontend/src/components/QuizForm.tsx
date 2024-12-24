import axios from '@/app/api/axios';
import React, { useState } from 'react';
import styles from '@/styles/quizformcss.module.css'; // Import CSS module

interface QuizFormProps {
  quizData: {
    _id: string;
    user_id: { _id: string; name: string };
    module_id: { _id: string; title: string; course_id:string;};
    type: string;
    questions: { _id: string; title: string; options: string[] }[];
    solved:boolean;
    timestamp: Date;
  };
  goBack : () => void;
  goToModule : () => void;
}

interface Answer {
  question_id: string;
  answer: number;
}

export default function QuizForm({ quizData,goBack,goToModule }: QuizFormProps) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [results, setResults] = useState<null | { correctAnswers: Answer[],score:number }>(null);
  const [showScore, setShowScore] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const handleChange = (questionId: string, answerIndex: number) => {
    setAnswers((prevAnswers) => {
      const existingAnswer = prevAnswers.find((ans) => ans.question_id === questionId);
      if (existingAnswer) {
        return prevAnswers.map((ans) =>
          ans.question_id === questionId ? { ...ans, answer: answerIndex } : ans
        );
      }
      return [...prevAnswers, { question_id: questionId, answer: answerIndex }];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      user_id: quizData.user_id,
      quiz_id: quizData._id.toString(),
      answers,
    };

    try {
      const responseId = await axios.post(`/course/module/${quizData.module_id._id}/solvequiz`, payload);
      const response = await axios.get(`/response/${responseId.data}`);
      setResults(response.data); // Store results including correct answers
    } catch (error) {
      //@ts-expect-error
      console.error('Error submitting quiz:', error.response.data.message);
      //@ts-expect-error
      alert(error.response.data.message);
    }
  };

  const handleLeaveQuiz = () => {
      //@ts-expect-error
      setScore(results?.score*100);
      setShowScore(true);
  };

  if (!quizData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {!results ? (
        <form onSubmit={handleSubmit}>
          <h2>{quizData.module_id?.title} Quiz</h2>
          {quizData.questions.map((question) => (
            <div key={question._id} className={styles.question}>
              <h3>{question.title}</h3>
              {question.options.map((option, i) => (
                <label key={i} className={styles.option}>
                  <input
                    type="radio"
                    name={question._id}
                    value={i}
                    checked={answers.some(
                      (ans) => ans.question_id === question._id && ans.answer === i
                    )}
                    onChange={() => handleChange(question._id, i)}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button type="submit" className={styles.button}>
            Submit Quiz
          </button>
        </form>
      ) : (
        <>
          {!showScore ? (
            <div>
              <h2>Quiz Results</h2>
              {quizData.questions.map((question) => {
                const userAnswer = answers.find((ans) => ans.question_id === question._id)?.answer;
                const correctAnswer = results.correctAnswers.find(
                  (ans) => ans.question_id === question._id
                )?.answer;

                return (
                  <div
                    key={question._id}
                    className={`${styles.question} ${
                      userAnswer === correctAnswer ? styles.correct : styles.incorrect
                    }`}
                  >
                    <h3>{question.title}</h3>
                    {question.options.map((option, i) => (
                      <div
                        key={i}
                        className={`${styles.option} ${
                          i === correctAnswer
                            ? styles['correct-answer']
                            : i === userAnswer
                            ? styles['user-answer']
                            : ''
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                );
              })}
              <button onClick={handleLeaveQuiz} className={styles.button}>
                Leave Quiz
              </button>
            </div>
          ) : (
            <>
            {results.score >= 50 ? (
              <div>
                <h2>Congratulations!</h2>
                <p>You scored {score}% on the quiz.</p>
                <button className={styles.button} onClick={goBack}>Go Back</button>
              </div>
            ) : (
              <div>
                {/* Handle case for score less than 50 */}
                <h2>Better luck next time!</h2>
                <p>Your score is {score}%. Keep trying to improve!</p>
                <p>Try checking out the module again.</p>
                <button className={styles.button} onClick={goToModule}>Check out module</button>
              </div>
            )}   
            </>         
          )}
        </>
      )}
    </div>
  );
}
