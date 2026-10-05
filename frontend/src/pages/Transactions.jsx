import { useEffect, useState } from "react";
import api from "../api";



function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/history");

      setTransactions(response.data);
    } catch (err) {
      console.error("Failed to load transactions:", err);
      setError("Unable to load transaction history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div className="page">

      <div className="page-heading">
        <div>
          <h1>Transactions</h1>
          <p className="page-subtitle">
            Complete transaction risk history
          </p>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={loadTransactions}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <section className="transactions-panel">

        {loading && (
          <div className="table-state">
            Loading transactions...
          </div>
        )}

        {!loading && error && (
          <div className="page-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          transactions.length === 0 && (
            <div className="table-state">
              No transactions found.
            </div>
          )}

        {!loading &&
          !error &&
          transactions.length > 0 && (
            <div className="transactions-table-wrapper">

              <table className="transactions-table">

                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Risk</th>
                    <th>Probability</th>
                    <th>Risk Score</th>
                    <th>Decision</th>
                  </tr>
                </thead>

                <tbody>

                  {transactions.map(
                    (transaction, index) => (
                      <tr
                        key={
                          transaction.timestamp
                            ? `${transaction.timestamp}-${index}`
                            : index
                        }
                      >

                        <td>
                          {transaction.timestamp
                            ? new Date(
                                transaction.timestamp
                              ).toLocaleString()
                            : "N/A"}
                        </td>

                        <td>
                          <span
                            className={`transaction-risk ${
                              transaction.risk_level.toLowerCase()
                            }`}
                          >
                            {transaction.risk_level}
                          </span>
                        </td>

                        <td>
                          {(
                            transaction.fraud_probability *
                            100
                          ).toFixed(4)}
                          %
                        </td>

                        <td>
                          {Number(
                            transaction.risk_score
                          ).toFixed(2)}{" "}
                          / 100
                        </td>

                        <td>
                          <span
                            className={
                              transaction.is_fraud
                                ? "transaction-fraud"
                                : "transaction-safe"
                            }
                          >
                            {transaction.is_fraud
                              ? "FRAUD"
                              : "SAFE"}
                          </span>
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

      </section>

    </div>
  );
}

export default Transactions;