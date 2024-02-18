//TODO:
// Connect to a DB
// Leaderboards
// Questions and answers from DB
// Clean up code

import React, { useState, useEffect } from "react";
import "./App.css";

// Constants
const TIMEOUT_DURATION = 2000;

const questions = [
  "Kysymys 1 - Paljonko on 1 + 1?",
  "Kysymys 2 - Paljonko on 2 + 2?",
  "Kysymys 3 - Paljonko on 3 + 3?",
  "Kysymys 4 - Paljonko on 4 + 4?",
  "Kysymys 5 - Paljonko on 5 + 5?",
];

const correctAnswers = ["2", "4", "6", "8", "10"];
const incorrectAnswers = [
  ["1", "3", "4", "5"],
  ["2", "3", "5", "6"],
  ["4", "5", "7", "8"],
  ["6", "9", "7", "10"],
  ["8", "9", "12", "15"],
];

// Name input component
function NameInput({ onSubmitName }) {
  const [name, setName] = useState("");

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmitName(name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Syötä Nimesi</h2>
      <input
        type="text"
        value={name}
        onChange={handleNameChange}
        placeholder="Nimesi..."
      />
      <button type="submit">Aloita</button>
    </form>
  );
}

// Main App component
export default function App() {
  // State variables
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isTimeoutActive, setIsTimeoutActive] = useState(false);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  // Reset radio input selection and shuffle answers when question changes
  useEffect(() => {
    // Shuffle answers function
    const shuffleAnswers = () => {
      setShuffledAnswers(
        shuffleArray([
          correctAnswers[currentQuestion],
          ...incorrectAnswers[currentQuestion],
        ])
      );
    };

    // Helper function to shuffle array
    const shuffleArray = (array) => {
      const shuffledArray = array.slice();
      for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [
          shuffledArray[j],
          shuffledArray[i],
        ];
      }
      return shuffledArray;
    };

    if (currentQuestion < questions.length) {
      shuffleAnswers();
      setUserInput("");
    }
  }, [currentQuestion]);

  // Submit name handler
  const handleNameSubmit = (name) => {
    setPlayerName(name);
  };

  // Input change handler
  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  // Check answer handler
  const checkAnswer = () => {
    if (userInput) {
      if (userInput === correctAnswers[currentQuestion]) {
        setFeedback("Vastaus on oikein!");
        setScore(score + 20);
      }
      else 
        setFeedback("Vastaus on väärin!");

      setIsTimeoutActive(true);
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) 
          setCurrentQuestion(currentQuestion + 1);
        else 
          setCurrentQuestion(questions.length);

        setUserInput();
        setFeedback("");
        setIsTimeoutActive(false);
      }, TIMEOUT_DURATION);
    } 
    else 
      setFeedback("Vastaus on tyhjä!");
  };

  // Retry quiz handler
  const retryQuiz = () => {
    setCurrentQuestion(0);
    setUserInput();
    setFeedback("");
    setScore(0);
  };

  return (
    <div>
      <center>
        <h1>Napalmi-demo Tietovisa</h1>
        {playerName ? (
          <>
            {currentQuestion < questions.length ? (
              <div>
                <h2>{questions[currentQuestion]}</h2>

                {shuffledAnswers.map((answer, index) => (
                  <div key={index}>
                    <input
                      type="radio"
                      id={`answer_${index}`}
                      name="answers"
                      value={answer}
                      onChange={handleInputChange}
                      checked={userInput === answer}
                      disabled={isTimeoutActive}
                    />
                    <label htmlFor={`answer_${index}`}>{answer}</label>
                  </div>
                ))}

                <p>{feedback}</p>
                <button onClick={checkAnswer} disabled={isTimeoutActive}>
                  Tarkista vastaus
                </button>
                <p>Pelaaja: {playerName}</p>
                <p>Pisteet: {score}</p>
              </div>
            ) : (
              <div>
                <h2>Tietovisa loppui!</h2>
                <p>Pelaaja: {playerName}</p>
                <p>Pisteet: {score}</p>
                <button onClick={retryQuiz}>Aloita alusta</button>
              </div>
            )}
          </>
        ) : (
          <NameInput onSubmitName={handleNameSubmit} />
        )}
      </center>
    </div>
  );
}
