import React, { useState } from "react";
import "./App.css"; 
const App = () => {
  const [mode, setMode] = useState("build");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ text: "", type: "text", options: "" });
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const addQuestion = () => {
    if (!newQuestion.text) return;
    const question = {
      id: Date.now(),
      ...newQuestion,
      options:
        newQuestion.type === "text"
          ? []
          : newQuestion.options.split(",").map((opt) => opt.trim()),
    };
    setQuestions([...questions, question]);
    setNewQuestion({ text: "", type: "text", options: "" });
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleResponseChange = (id, value) => {
    setResponses({ ...responses, [id]: value });
  };

  const handleCheckboxChange = (id, option) => {
    const current = responses[id] || [];
    if (current.includes(option)) {
      setResponses({ ...responses, [id]: current.filter((o) => o !== option) });
    } else {
      setResponses({ ...responses, [id]: [...current, option] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="app">
      <h1>Survey Form Builder</h1>
      <button className="toggle-button" onClick={() => { setMode(mode === "build" ? "fill" : "build"); setSubmitted(false); }}>
        Switch to {mode === "build" ? "Fill Mode" : "Build Mode"}
      </button>

      {mode === "build" && (
        <div className="build-mode">
          <h2>Build Mode</h2>
          <div className="form-control">
            <input
              type="text"
              placeholder="Question text"
              value={newQuestion.text}
              onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
            />
            <select
              value={newQuestion.type}
              onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
            >
              <option value="text">Text</option>
              <option value="radio">Radio</option>
              <option value="checkbox">Checkbox</option>
            </select>
            {(newQuestion.type === "radio" || newQuestion.type === "checkbox") && (
              <input
                type="text"
                placeholder="Comma-separated options"
                value={newQuestion.options}
                onChange={(e) => setNewQuestion({ ...newQuestion, options: e.target.value })}
              />
            )}
            <button onClick={addQuestion}>Add Question</button>
          </div>
          <ul className="question-list">
            {questions.map((q) => (
              <li key={q.id}>
                <strong>{q.text}</strong> ({q.type})
                {q.options && q.options.length > 0 && (
                  <ul>
                    {q.options.map((opt, idx) => (
                      <li key={idx}>{opt}</li>
                    ))}
                  </ul>
                )}
                <button onClick={() => deleteQuestion(q.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {mode === "fill" && (
        <div className="fill-mode">
          <h2>Fill Mode</h2>
          <form onSubmit={handleSubmit}>
            {questions.map((q) => (
              <div key={q.id} className="form-group">
                <label><strong>{q.text}</strong></label>
                <div>
                  {q.type === "text" && (
                    <input
                      type="text"
                      onChange={(e) => handleResponseChange(q.id, e.target.value)}
                    />
                  )}
                  {q.type === "radio" &&
                    q.options.map((opt, idx) => (
                      <label key={idx}>
                        <input
                          type="radio"
                          name={q_${q.id}}
                          value={opt}
                          onChange={(e) => handleResponseChange(q.id, e.target.value)}
                        />{" "}
                        {opt}
                      </label>
                    ))}
                  {q.type === "checkbox" &&
                    q.options.map((opt, idx) => (
                      <label key={idx}>
                        <input
                          type="checkbox"
                          value={opt}
                          onChange={() => handleCheckboxChange(q.id, opt)}
                        />{" "}
                        {opt}
                      </label>
                    ))}
                </div>
              </div>
            ))}
            <button type="submit" className="submit-button">Submit</button>
          </form>

          {submitted && (
            <div className="summary">
              <h3>Responses Summary:</h3>
              <ul>
                {questions.map((q) => (
                  <li key={q.id}>
                    <strong>{q.text}:</strong>{" "}
                    {Array.isArray(responses[q.id])
                      ? responses[q.id].join(", ")
                      : responses[q.id]}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;