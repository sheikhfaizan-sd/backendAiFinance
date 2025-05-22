// Import React and the useState hook
import React, { useState } from "react";
// Import axios for making HTTP requests
import axios from "axios";
// Import styles for this component
import "./GeminiChat.css";
import { systemPrompt } from "../utils/geminiPrompt";

// This component takes in 4 props:
// - ticker: the stock symbol (e.g. AAPL)
// - incomeData: income statement for past 3 years
// - balanceData: balance sheet data
// - cashFlowData: cash flow statement data
const GeminiChat = ({ ticker, incomeData, balanceData, cashFlowData }) => {
  // Store user-typed question
  const [question, setQuestion] = useState(""); // Store Gemini's response
  const [geminiResponse, setGeminiResponse] = useState(""); // Store loading state (used to show spinner or "thinking..." message)
  const [loading, setLoading] = useState(false);

  //   const combinedPrompt = `${systemPrompt}\n\n${context}`; // prompt here

  // This function is called when user clicks the Ask Gemini button
  const askGemini = async () => {
    if (!question.trim()) return alert("Please enter a question.");

    // Build the context string that includes all financial data + user question
    const context = `
    ${systemPrompt}
    Ticker: ${ticker}
  
    Income Statement:
    ${incomeData
      .map(
        (item) => `
      Year: ${item.calendarYear}
      Revenue: ${item.revenue}
      Net Income: ${item.netIncome}
      EBIT: ${item.ebit}
      EBITDA: ${item.ebitda}
      EPS: ${item.eps}
    `
      )
      .join("\n")}
  
    Balance Sheet:
    ${balanceData
      .map(
        (item) => `
      Year: ${item.calendarYear}
      Assets: ${item.totalAssets}
      Liabilities: ${item.totalLiabilities}
      Equity: ${item.totalStockholdersEquity}
      Total Debt: ${item.totalDebt}
      Cash: ${item.cashAndShortTermInvestments}
      Shares Outstanding: ${item.weightedAverageShsOut}
    `
      )
      .join("\n")}
  
    Cash Flow Statement:
    ${cashFlowData
      .map(
        (item) => `
      Year: ${item.calendarYear}
      Operating CF: ${item.operatingCashFlow}
      Investing CF: ${item.investmentCashFlow}
      Financing CF: ${item.financingCashFlow}
      Free Cash Flow: ${item.freeCashFlow}
    `
      )
      .join("\n")}
  
    Question: ${question}
  `;

    setLoading(true); // Show loading spinner or text

    try {
      // Make POST request to local backend using Axios
      const res = await axios.post("http://localhost:3000/Ai", {
        prompt: context,
      });

      // Get the response text (assume it's plain string or JSON with `response` key)
      const text = res.data;

      // Try to parse if it's JSON with a 'response' key
      if (typeof text === "object" && text.response) {
        setGeminiResponse(text.response);
      } else {
        // Otherwise just use it as plain string
        setGeminiResponse(
          typeof text === "string" ? text : JSON.stringify(text)
        );
      }
    } catch (err) {
      console.error("Axios error:", err);
      setGeminiResponse("❌ Error reaching Gemini backend.");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  // If incomeData is not yet available (e.g. before ticker is selected), don't show this UI
  if (!incomeData?.length) return null;

  return (
    <div className="ai-section">
      {/* Heading with dynamic ticker name */}
      <h3>Ask Ai stock analyst about : {ticker}</h3>

      {/* Textarea for typing user's question */}
      <textarea
        rows="4"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="e.g. Explain this company’s financial health"
      />

      {/* Button to send question to Gemini. Disabled while loading. */}
      <button onClick={askGemini} disabled={loading}>
        {loading ? "Thinking..." : "Ask Ai "}
      </button>

      {/* Show Gemini's AI response only when it exists */}
      {geminiResponse && (
        <div className="ai-response">
          <h4>Ai Research Assistant:</h4>
          <p>{geminiResponse}</p>
        </div>
      )}
    </div>
  );
};

// Export the component so it can be used inside App.jsx
export default GeminiChat;
