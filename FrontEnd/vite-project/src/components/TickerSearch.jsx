// Importing React and required hooks
import React, { useState, useEffect } from "react";

// Axios is used to make HTTP requests (like GET data from API)
import axios from "axios";

// Import custom CSS styling for this component
import "./tickerSearch.css";

// Your API key for accessing Financial Modeling Prep (FMP)
const API_KEY = "5YmmMEtEKKSoHpfOPhTPN0xpIs1uD0ut";

// React functional component for ticker search
export default function TickerSearch({ onSelectTicker }) {
  // useState creates state variables in React.
  // 'query' stores the current text in the search box.
  const [query, setQuery] = useState("");

  // 'suggestions' will store the list of ticker results returned from API
  const [suggestions, setSuggestions] = useState([]);

  // useEffect runs a function every time 'query' changes
  useEffect(() => {
    // Inner function that fetches suggestions from the API
    const fetchSuggestions = async () => {
      // If query is too short (e.g., less than 2 characters), clear suggestions
      if (query.length < 2) return setSuggestions([]);

      try {
        // Make GET request to FMP's search-ticker endpoint
        const res = await axios.get(
          `https://financialmodelingprep.com/api/v3/search-ticker`,
          {
            params: {
              query, // the search input value
              limit: 3, // max 10 suggestions
              exchange: "NASDAQ", // filter for NASDAQ stocks
              apikey: API_KEY, // API authentication
            },
          }
        );

        // Save the results in 'suggestions' state
        setSuggestions(res.data);
      } catch (err) {
        // If API request fails, log error in the console
        console.error("Search error:", err);
      }
    };

    // Debounce: delay the API call by 400ms after typing stops
    const delayDebounce = setTimeout(fetchSuggestions, 400);

    // Cleanup function: clears the previous timeout if query changes before 400ms
    return () => clearTimeout(delayDebounce);
  }, [query]); // Dependency array: useEffect will run when 'query' changes

  return (
    <div className="search-container">
      {/* Input field where user types the stock ticker */}
      <input
        type="text"
        placeholder="🔍 Search ticker (e.g. AAPL)"
        value={query} // Controlled input: value comes from state
        onChange={(e) => setQuery(e.target.value)} // Update state when typing
      />

      {/* If we have any suggestions, show them in a dropdown list */}
      {suggestions.length > 0 && (
        <ul className="suggestion-list">
          {suggestions.map((ticker) => (
            <li
              key={ticker.symbol} // React requires unique key for each list item
              onClick={() => {
                onSelectTicker(ticker.symbol); // Send selected symbol to parent
                setQuery(""); // Clear the search box after selection
                setSuggestions([]); // Hide the dropdown list
              }}
            >
              {/* Display ticker symbol and company name */}
              {ticker.symbol} - {ticker.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
