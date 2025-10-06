import { useState } from 'react';

const API_URL = 'http://localhost:3000/api';

function TakeQuiz({ quiz, user, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const questions = quiz.questions;

  const handleSelectAnswer = (answerIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setShowResults(true);

    try {
      await fetch(`${API_URL}/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          quizId: quiz.id,
          score: correctCount,
          totalQuestions: questions.length
        })
      });
    } catch (err) {
      console.error('Error submitting quiz:', err);
    }
  };

  if (showResults) {
    return (
      <div className="container">
        <div className="score-card">
          <h2>🎉 Quiz Complete!</h2>
          <p className="score">
            You scored: {score} / {questions.length}
          </p>
          <p>Points earned: +{score}</p>
          <button onClick={onComplete} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="container">
      <div className="progress">
        Question {currentQuestion + 1} of {questions.length}
      </div>

      <div className="question-card">
        <h3>{question.question}</h3>
        <div className="options">
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`option ${selectedAnswers[currentQuestion] === index ? 'selected' : ''}`}
              onClick={() => handleSelectAnswer(index)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="btn-success"
        disabled={selectedAnswers[currentQuestion] === undefined}
      >
        {currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
      </button>
    </div>
  );
}

export default TakeQuiz;