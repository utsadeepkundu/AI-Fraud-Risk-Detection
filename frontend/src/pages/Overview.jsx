import { useEffect, useState } from "react";
import api from "../api";



function Overview() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    try {
      const response = await api.get("/api/analytics");

      setAnalytics(response.data);
    } catch (err) {
      console.error("Failed to load overview:", err);
      setError("Unable to load dashboard data.");
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
        <h1>Overview</h1>
        <p className="page-subtitle">
          Loading fraud intelligence...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>Overview</h1>
        <div className="page-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="page">

      <div className="page-heading">
        <div>
          <h1>Overview</h1>
          <p className="page-subtitle">
            Real-time fraud and risk monitoring
          </p>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          System Operational
        </div>
      </div>

      {/* KPI CARDS */}

      <div className="overview-grid">

        <div className="overview-card">
          <div className="overview-card-label">
            Total Transactions
          </div>

          <div className="overview-card-value">
            {analytics.total_transactions}
          </div>

          <div className="overview-card-meta">
            Analyzed transactions
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-card-label">
            Fraud Detected
          </div>

          <div className="overview-card-value danger">
            {analytics.fraud_transactions}
          </div>

          <div className="overview-card-meta">
            Confirmed by model threshold
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-card-label">
            Fraud Rate
          </div>

          <div className="overview-card-value">
            {analytics.fraud_rate}%
          </div>

          <div className="overview-card-meta">
            Across analyzed transactions
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-card-label">
            Average Risk Score
          </div>

          <div className="overview-card-value">
            {analytics.average_risk_score}
          </div>

          <div className="overview-card-meta">
            Out of 100
          </div>
        </div>

      </div>

      {/* SECOND ROW */}

      <div className="overview-two-column">

        {/* RISK DISTRIBUTION */}

        <section className="overview-panel">

          <div className="panel-heading">
            <div>
              <h2>Risk Distribution</h2>
              <p>
                Current transaction risk levels
              </p>
            </div>
          </div>

          <div className="distribution-list">

            <div className="distribution-item">
              <div className="distribution-label">
                <span>High Risk</span>
                <strong>
                  {analytics.risk_distribution.high}
                </strong>
              </div>

              <div className="distribution-track">
                <div
                  className="distribution-fill high"
                  style={{
                    width: `${
                      analytics.total_transactions
                        ? (
                            analytics.risk_distribution.high /
                            analytics.total_transactions
                          ) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="distribution-item">
              <div className="distribution-label">
                <span>Medium Risk</span>
                <strong>
                  {analytics.risk_distribution.medium}
                </strong>
              </div>

              <div className="distribution-track">
                <div
                  className="distribution-fill medium"
                  style={{
                    width: `${
                      analytics.total_transactions
                        ? (
                            analytics.risk_distribution.medium /
                            analytics.total_transactions
                          ) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="distribution-item">
              <div className="distribution-label">
                <span>Low Risk</span>
                <strong>
                  {analytics.risk_distribution.low}
                </strong>
              </div>

              <div className="distribution-track">
                <div
                  className="distribution-fill low"
                  style={{
                    width: `${
                      analytics.total_transactions
                        ? (
                            analytics.risk_distribution.low /
                            analytics.total_transactions
                          ) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

          </div>

        </section>

        {/* SYSTEM SUMMARY */}

        <section className="overview-panel">

          <div className="panel-heading">
            <div>
              <h2>System Summary</h2>
              <p>
                Current monitoring status
              </p>
            </div>
          </div>

          <div className="summary-list">

            <div className="summary-item">
              <span>ML Engine</span>
              <strong className="summary-ok">
                ACTIVE
              </strong>
            </div>

            <div className="summary-item">
              <span>SHAP Explainability</span>
              <strong className="summary-ok">
                ACTIVE
              </strong>
            </div>

            <div className="summary-item">
              <span>MongoDB</span>
              <strong className="summary-ok">
                CONNECTED
              </strong>
            </div>

            <div className="summary-item">
              <span>API</span>
              <strong className="summary-ok">
                ONLINE
              </strong>
            </div>

          </div>

        </section>

      </div>

      {/* RECENT HIGH RISK */}

      <section className="overview-panel recent-panel">

        <div className="panel-heading">
          <div>
            <h2>Recent High-Risk Transactions</h2>
            <p>
              Latest transactions classified as high risk
            </p>
          </div>
        </div>

        {analytics.recent_high_risk.length === 0 ? (
          <div className="empty-state">
            No high-risk transactions detected.
          </div>
        ) : (
          <div className="recent-list">

            {analytics.recent_high_risk.map(
              (transaction, index) => (
                <div
                  className="recent-item"
                  key={`${transaction.timestamp}-${index}`}
                >
                  <div>
                    <strong>High Risk Transaction</strong>

                    <span>
                      {transaction.timestamp
                        ? new Date(
                            transaction.timestamp
                          ).toLocaleString()
                        : "Unknown time"}
                    </span>
                  </div>

                  <div className="recent-values">

                    <span className="recent-score">
                      Score{" "}
                      {Number(
                        transaction.risk_score
                      ).toFixed(2)}
                    </span>

                    <span className="recent-probability">
                      {(
                        transaction.fraud_probability * 100
                      ).toFixed(2)}
                      %
                    </span>

                  </div>
                </div>
              )
            )}

          </div>
        )}

      </section>

    </div>
  );
}

export default Overview;