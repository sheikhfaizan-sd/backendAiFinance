// App.jsx
import React, { useState } from "react";
import CompanyFinancials from "./components/financeSearch";
import TickerSearch from "./components/TickerSearch";

function App() {
  const [selectedTicker, setSelectedTicker] = useState("");

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>📊 AI Stock Analyst</h1>

      {/* Ticker Search Box  onSelectTicker is prop that we snd to ticker search*/}
      <TickerSearch onSelectTicker={setSelectedTicker} />

      {/* Show Company Financials only if a ticker is selected //ticker prop drilled */}
      {selectedTicker && <CompanyFinancials ticker={selectedTicker} />}
      {!selectedTicker && (
        <div className="gif-placeholder">
          <h3>🔍 Search a company ticker to view financials</h3>
          <img
            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2trcTNwZGowdmFvYXIxem5zZjBsNWhuZG8xdTFvMmJpOHFncnlvYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/h8RDGogSns9wpOJFzR/giphy.gif"
            alt="Stock GIF"
            className="stock-gif"
          />
        </div>
      )}
    </div>
  );
}

export default App;
// step 1 at first search query is made to get ticker value sent and recieved as prop
//step 2 then comapare fifncial is made with ticker sent to it as from which we got from search query
// step 3 app assembles it all to help send prop

// 1. User types in a search box (in TickerSearch.jsx).
// 2. TickerSearch calls `onSelectTicker(tickerSymbol)` when user selects a ticker.
// 3. This updates `selectedTicker` in App.jsx using setSelectedTicker().
// 4. App passes that ticker down to CompanyFinancials as a prop: `ticker={selectedTicker}`.
// 5. CompanyFinancials fetches and shows financial data for that ticker.
