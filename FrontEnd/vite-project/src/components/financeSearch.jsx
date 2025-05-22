// Import React and hooks
import React, { useEffect, useState } from "react";
import "./FinanceSearch.css";
import GeminiChat from "./GeminiChat";

// API key (Keep safe in production)
const API_KEY = "5YmmMEtEKKSoHpfOPhTPN0xpIs1uD0ut";

// Main component
const CompanyFinancials = ({ ticker }) => {
  const [incomeData, setIncomeData] = useState([]);
  const [balanceData, setBalanceData] = useState([]);
  const [cashFlowData, setCashFlowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFinancials = async () => {
      if (!ticker) return;

      setLoading(true);
      setError("");
      setIncomeData([]);
      setBalanceData([]);
      setCashFlowData([]);

      try {
        const [incomeRes, balanceRes, cashRes] = await Promise.all([
          fetch(
            `https://financialmodelingprep.com/api/v3/income-statement/${ticker}?period=annual&apikey=${API_KEY}`
          ),
          fetch(
            `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?period=annual&apikey=${API_KEY}`
          ),
          fetch(
            `https://financialmodelingprep.com/api/v3/cash-flow-statement/${ticker}?period=annual&apikey=${API_KEY}`
          ),
        ]);

        const income = await incomeRes.json();
        const balance = await balanceRes.json();
        const cash = await cashRes.json();

        if (
          !Array.isArray(income) ||
          !Array.isArray(balance) ||
          !Array.isArray(cash)
        ) {
          throw new Error("Invalid ticker or API issue.");
        }

        setIncomeData(income.slice(0, 5));
        setBalanceData(balance.slice(0, 5));
        setCashFlowData(cash.slice(0, 5));

        console.log("income", income);
        console.log("balance", balance);
        console.log("cash", cash);
      } catch (err) {
        setError(
          "❌ Could not fetch financial data. Please check ticker or API."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFinancials();
  }, [ticker]);

  return (
    <div className="financials-container">
      <h2>📈 Financials for: {ticker}</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* Income Statement */}
      {incomeData.length > 0 && (
        <section>
          <h3>Income Statement</h3>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Revenue</th>
                <th>Gross Profit</th>
                <th>Net Income</th>
                <th>EBIT</th>
                <th>EBITDA</th>
                <th>EPS</th>
              </tr>
            </thead>
            <tbody>
              {incomeData.map((item, i) => (
                <tr key={i}>
                  <td>{item.calendarYear}</td>
                  <td>${item.revenue?.toLocaleString()}</td>
                  <td>${item.grossProfit?.toLocaleString()}</td>
                  <td>${item.netIncome?.toLocaleString()}</td>
                  <td>${item.ebit?.toLocaleString()}</td>
                  <td>${item.ebitda?.toLocaleString()}</td>
                  <td>{item.eps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Balance Sheet */}
      {balanceData.length > 0 && (
        <section>
          <h3>Balance Sheet</h3>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Total Assets</th>
                <th>Total Liabilities</th>
                <th>Equity</th>
                <th>Total Debt</th>
                <th>Cash</th>
                <th>Shares Outstanding</th>
              </tr>
            </thead>
            <tbody>
              {balanceData.map((item, i) => (
                <tr key={i}>
                  <td>{item.calendarYear}</td>
                  <td>${item.totalAssets?.toLocaleString()}</td>
                  <td>${item.totalLiabilities?.toLocaleString()}</td>
                  <td>${item.totalStockholdersEquity?.toLocaleString()}</td>
                  <td>${item.totalDebt?.toLocaleString()}</td>
                  <td>${item.cashAndShortTermInvestments?.toLocaleString()}</td>
                  <td>{item.weightedAverageShsOut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Cash Flow Statement */}
      {cashFlowData.length > 0 && (
        <section>
          <h3>Cash Flow Statement</h3>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Operating</th>
                <th>Investing</th>
                <th>Financing</th>
                <th>Free Cash Flow</th>
              </tr>
            </thead>
            <tbody>
              {cashFlowData.map((item, i) => (
                <tr key={i}>
                  <td>{item.calendarYear}</td>
                  <td>${item.operatingCashFlow?.toLocaleString()}</td>
                  <td>${item.investmentCashFlow?.toLocaleString()}</td>
                  <td>${item.financingCashFlow?.toLocaleString()}</td>
                  <td>${item.freeCashFlow?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Chat with Gemini */}
      {incomeData.length > 0 && (
        <GeminiChat
          ticker={ticker}
          incomeData={incomeData}
          balanceData={balanceData}
          cashFlowData={cashFlowData}
        />
      )}
    </div>
  );
};

export default CompanyFinancials;
