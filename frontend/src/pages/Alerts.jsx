import { useEffect, useState } from "react";
import api from "../api";



function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/alerts");

      setAlerts(response.data);
    } catch (err) {
      console.error("Failed to load fraud alerts:", err);

      setError(
        "Unable to load fraud alerts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  return (
    <div className="page">

      <div className="page-heading">
        <div>
          <h1>Fraud Alerts</h1>

          <p className="page-subtitle">
            High-risk transactions requiring attention
          </p>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={loadAlerts}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Alert summary */}

      <div className="alerts-summary">

        <div className="alert-summary-card">
          <span>Active Alerts</span>

          <strong>
            {alerts.length}
          </strong>
        </div>

        <div className="alert-summary-card danger">
          <span>High Risk</span>

          <strong>
            {alerts.length}
          </strong>
        </div>

      </div>

      {/* Alerts */}

      <section className="alerts-panel">

        {loading && (
          <div className="table-state">
            Loading fraud alerts...
          </div>
        )}

        {!loading && error && (
          <div className="page-error">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          alerts.length === 0 && (
            <div className="empty-alerts">
              <div className="empty-alert-icon">
                ✓
              </div>

              <h2>No Active Fraud Alerts</h2>

              <p>
                No high-risk transactions have been detected.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          alerts.length > 0 && (
            <div className="alert-list">

              {alerts.map((alert, index) => (
                <div
                  className="alert-card"
                  key={
                    alert.timestamp
                      ? `${alert.timestamp}-${index}`
                      : index
                  }
                >

                  <div className="alert-main">

                    <div className="alert-title-row">

                      <span className="alert-badge">
                        HIGH RISK
                      </span>

                      <span className="alert-time">
                        {alert.timestamp
                          ? new Date(
                              alert.timestamp
                            ).toLocaleString()
                          : "Unknown time"}
                      </span>

                    </div>

                    <h2>
                      Potential Fraud Detected
                    </h2>

                    <p>
                      This transaction exceeded the
                      configured fraud-detection threshold.
                    </p>

                  </div>

                  <div className="alert-metrics">

                    <div>
                      <span>Fraud Probability</span>

                      <strong>
                        {(
                          alert.fraud_probability * 100
                        ).toFixed(4)}
                        %
                      </strong>
                    </div>

                    <div>
                      <span>Risk Score</span>

                      <strong>
                        {Number(
                          alert.risk_score
                        ).toFixed(2)}
                        /100
                      </strong>
                    </div>

                    <div>
                      <span>Decision</span>

                      <strong className="alert-decision">
                        FRAUD
                      </strong>
                    </div>

                  </div>

                  <div className="alert-factors">

                    <h3>
                      Top Risk Factors
                    </h3>

                    <div className="alert-factor-list">

                      {alert.top_factors?.map(
                        (factor) => (
                          <div
                            className="alert-factor"
                            key={factor.feature}
                          >
                            <span>
                              {factor.feature}
                            </span>

                            <strong>
                              {factor.impact > 0
                                ? "+"
                                : ""}
                              {Number(
                                factor.impact
                              ).toFixed(4)}
                            </strong>
                          </div>
                        )
                      )}

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

      </section>

    </div>
  );
}

export default Alerts;