import { useEffect, useState } from "react";
import api from "../api";


function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const [analyticsResponse, historyResponse] =
        await Promise.all([
          api.get("/api/analytics"),
          api.get("/api/history"),
        ]);

      setAnalytics(analyticsResponse.data);
      setTransactions(historyResponse.data);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError("Unable to load analytics data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h1>Analytics</h1>
        <p className="page-subtitle">
          Loading analytics...
        </p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="page">
        <h1>Analytics</h1>

        <div className="page-error">
          {error || "Analytics data unavailable."}
        </div>
      </div>
    );
  }

  const total = analytics.total_transactions;

  const highPercentage = total
    ? (analytics.risk_distribution.high / total) * 100
    : 0;

  const mediumPercentage = total
    ? (analytics.risk_distribution.medium / total) * 100
    : 0;

  const lowPercentage = total
    ? (analytics.risk_distribution.low / total) * 100
    : 0;

  return (
    <div className="page">

      {/* Header */}

      <div className="page-heading">
        <div>
          <h1>Analytics</h1>

          <p className="page-subtitle">
            Detailed fraud and transaction risk intelligence
          </p>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={loadAnalytics}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {/* KPI Cards */}

      <div className="analytics-kpi-grid">

        <div className="analytics-kpi">
          <span>Total Transactions</span>
          <strong>
            {analytics.total_transactions}
          </strong>
          <small>Analyzed by the ML engine</small>
        </div>

        <div className="analytics-kpi">
          <span>Fraud Transactions</span>
          <strong className="danger-text">
            {analytics.fraud_transactions}
          </strong>
          <small>Transactions classified as fraud</small>
        </div>

        <div className="analytics-kpi">
          <span>Fraud Rate</span>
          <strong>
            {analytics.fraud_rate}%
          </strong>
          <small>Fraud / total transactions</small>
        </div>

        <div className="analytics-kpi">
          <span>Average Risk Score</span>
          <strong>
            {analytics.average_risk_score}
          </strong>
          <small>Out of 100</small>
        </div>

      </div>

      {/* Risk Distribution + Fraud Summary */}

      <div className="analytics-two-column">

        <section className="analytics-panel">

          <div className="panel-heading">
            <div>
              <h2>Risk Distribution</h2>

              <p>
                Distribution of analyzed transactions
              </p>
            </div>
          </div>

          <div className="analytics-bars">

            <div className="analytics-bar-item">

              <div className="analytics-bar-label">
                <span>High Risk</span>
                <strong>
                  {analytics.risk_distribution.high}
                </strong>
              </div>

              <div className="analytics-bar-track">
                <div
                  className="analytics-bar-fill high"
                  style={{
                    width: `${highPercentage}%`,
                  }}
                />
              </div>

              <small>
                {highPercentage.toFixed(1)}%
              </small>

            </div>

            <div className="analytics-bar-item">

              <div className="analytics-bar-label">
                <span>Medium Risk</span>
                <strong>
                  {analytics.risk_distribution.medium}
                </strong>
              </div>

              <div className="analytics-bar-track">
                <div
                  className="analytics-bar-fill medium"
                  style={{
                    width: `${mediumPercentage}%`,
                  }}
                />
              </div>

              <small>
                {mediumPercentage.toFixed(1)}%
              </small>

            </div>

            <div className="analytics-bar-item">

              <div className="analytics-bar-label">
                <span>Low Risk</span>
                <strong>
                  {analytics.risk_distribution.low}
                </strong>
              </div>

              <div className="analytics-bar-track">
                <div
                  className="analytics-bar-fill low"
                  style={{
                    width: `${lowPercentage}%`,
                  }}
                />
              </div>

              <small>
                {lowPercentage.toFixed(1)}%
              </small>

            </div>

          </div>

        </section>

        {/* Fraud vs Safe */}

        <section className="analytics-panel">

          <div className="panel-heading">
            <div>
              <h2>Fraud Overview</h2>

              <p>
                Current fraud detection summary
              </p>
            </div>
          </div>

          <div className="fraud-summary">

            <div className="fraud-summary-item">

              <div className="summary-number safe-number">
                {Math.max(
                  total - analytics.fraud_transactions,
                  0
                )}
              </div>

              <span>Safe Transactions</span>

            </div>

            <div className="fraud-summary-item">

              <div className="summary-number fraud-number">
                {analytics.fraud_transactions}
              </div>

              <span>Fraud Transactions</span>

            </div>

          </div>

          <div className="fraud-ratio">

            <div className="fraud-ratio-track">

              <div
                className="fraud-ratio-safe"
                style={{
                  width: `${
                    total
                      ? (
                          (total -
                            analytics.fraud_transactions) /
                          total
                        ) * 100
                      : 100
                  }%`,
                }}
              />

              <div
                className="fraud-ratio-fraud"
                style={{
                  width: `${
                    total
                      ? (
                          analytics.fraud_transactions /
                          total
                        ) * 100
                      : 0
                  }%`,
                }}
              />

            </div>

          </div>

        </section>

      </div>

      {/* Recent Transactions */}

      <section className="analytics-panel recent-analytics">

        <div className="panel-heading">
          <div>
            <h2>Recent Risk Activity</h2>

            <p>
              Latest transactions analyzed by the system
            </p>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="empty-state">
            No transaction activity available.
          </div>
        ) : (
          <div className="analytics-activity-list">

            {transactions
              .slice(0, 10)
              .map((transaction, index) => (
                <div
                  className="analytics-activity-item"
                  key={
                    transaction.timestamp
                      ? `${transaction.timestamp}-${index}`
                      : index
                  }
                >

                  <div className="activity-main">

                    <strong>
                      {transaction.is_fraud
                        ? "Fraud Detected"
                        : "Transaction Analyzed"}
                    </strong>

                    <span>
                      {transaction.timestamp
                        ? new Date(
                            transaction.timestamp
                          ).toLocaleString()
                        : "Unknown time"}
                    </span>

                  </div>

                  <div className="activity-right">

                    <span
                      className={`activity-risk ${
                        transaction.risk_level.toLowerCase()
                      }`}
                    >
                      {transaction.risk_level}
                    </span>

                    <span className="activity-score">
                      {Number(
                        transaction.risk_score
                      ).toFixed(2)}
                      /100
                    </span>

                  </div>

                </div>
              ))}

          </div>
        )}

      </section>

    </div>
  );
}

export default Analytics;