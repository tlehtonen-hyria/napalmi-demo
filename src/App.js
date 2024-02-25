// Imports
import React, { useState, useEffect } from "react";
import logo from "./logo.png";

// Constants
const TIMEOUT_DURATION = 2000;

// Questions and answers
const questions = [
  "Kysymys 1 - Paljonko on 1 + 2?",
  "Kysymys 2 - Paljonko on 3 + 4?",
  "Kysymys 3 - Paljonko on 5 + 6?",
  "Kysymys 4 - Paljonko on 7 + 8?",
  "Kysymys 5 - Paljonko on 9 + 10?",
];

const correctAnswers = ["3", "7", "11", "15", "19"];
const incorrectAnswers = [
  ["1", "2", "4", "5"], // Kysymys 1, väärät
  ["5", "6", "8", "9"], // Kysymys 2, väärät
  ["9", "12", "13", "14"], // Kysymys 3, väärät
  ["10", "13", "16", "18"], // Kysymys 4, väärät
  ["18", "20", "22", "24"], // Kysymys 5, väärät
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
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Syötä Nimesi</h2>
      <input
        required
        type="text"
        value={name}
        onChange={handleNameChange}
        placeholder="Nimesi..."
        className="input-field"
      />
      <br />
      <button type="submit" className="submit-button">
        Aloita
      </button>
    </form>
  );
}

// Main App component
export default function App() {
  // State variables
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userInput, setUserInput] = useState();
  const [feedback, setFeedback] = useState("");
  const [isTimeoutActive, setIsTimeoutActive] = useState(false);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Function to shuffle answers
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

    // Shuffle answers if there are more questions
    if (currentQuestion < questions.length) {
      shuffleAnswers();
      setUserInput();
    } else {
      // If all questions are answered, submit score and fetch leaderboard
      if (score >= 20) submitScore(playerName, score);
      else fetchLeaderboard();
    }
  }, [currentQuestion, playerName, score]);

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
      } else setFeedback("Vastaus on väärin!");

      setIsTimeoutActive(true);
      setTimeout(() => {
        if (currentQuestion < questions.length - 1)
          setCurrentQuestion(currentQuestion + 1);
        else setCurrentQuestion(questions.length);

        setUserInput();
        setFeedback("");
        setIsTimeoutActive(false);
      }, TIMEOUT_DURATION);
    } else setFeedback("Vastaus on tyhjä!");
  };

  // Retry quiz handler
  const retryQuiz = () => {
    setCurrentQuestion(0);
    setUserInput();
    setFeedback("");
    setScore(0);
  };

  // Submit score to the server
  const submitScore = (playerName, score) => {
    fetch("http://localhost:3001/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player: playerName, score: score }),
    })
      .then((response) => {
        if (response.ok) setFeedback("Pisteet tallennettu!");
        else throw new Error("Failed to submit score");
      })
      .catch((error) => {
        console.error("Error submitting score:", error);
      })
      .finally(() => {
        fetchLeaderboard();
      });
  };

  // Fetch leaderboard from the server
  const fetchLeaderboard = () => {
    fetch("http://localhost:3001/leaderboard")
      .then((response) => response.json())
      .then((data) => {
        setLeaderboard(data.slice(0, 5));
      })
      .catch((error) => {
        console.error("Error fetching leaderboard:", error);
      });
  };

  return (
    <div className="container">
      <img src={logo} alt="Napalmi-logo" />
      <h1>Napalmi-demo Tietovisa</h1>
      {playerName ? (
        <>
          {currentQuestion < questions.length ? (
            <div>
              <div className="question-container">
                <h2 className="question">{questions[currentQuestion]}</h2>
                {shuffledAnswers.map((answer, index) => (
                  <div key={index} className="answer-option">
                    <input
                      type="radio"
                      id={`vastaus_${index}`}
                      name="answers"
                      value={answer}
                      onChange={handleInputChange}
                      checked={userInput === answer}
                      disabled={isTimeoutActive}
                    />
                    <label htmlFor={`vastaus_${index}`}>{answer}</label>
                  </div>
                ))}
              </div>

              <div className="feedback">
                <p>{feedback}</p>
              </div>

              <button
                onClick={checkAnswer}
                disabled={isTimeoutActive}
                className="submit-button"
              >
                Tarkista vastaus
              </button>

              <div className="player-info">
                <p>Pelaaja: {playerName}</p>
                <p className="player-score">Pisteet: {score}</p>
              </div>
            </div>
          ) : (
            <div>
              <h2>Tietovisa loppui!</h2>
              <p>Pelaaja: {playerName}</p>
              <p>Pisteet: {score}</p>
              <p>{feedback}</p>
              <button onClick={retryQuiz} className="submit-button">
                Aloita alusta
              </button>
              <h2>Tulostaulukko</h2>
              <ol>
                {leaderboard.map((entry, index) => (
                  <li key={index}>
                    {entry.player} - {entry.score} Pistettä
                  </li>
                ))}
              </ol>
            </div>
          )}
        </>
      ) : (
        <NameInput onSubmitName={handleNameSubmit} />
      )}
    </div>
  );
}