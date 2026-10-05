import { useState } from "react";
import api from "../api";

import samples from "../data/sampleTransactions.json";


const FEATURES = [
  "Time",
  ...Array.from({ length: 28 }, (_, i) => `V${i + 1}`),
  "Amount",
];

const createEmptyData = () =>
  Object.fromEntries(
    FEATURES.map((feature) => [feature, 0])
  );

function Analyze() {
  const [formData, setFormData] = useState(createEmptyData());
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const loadSample = (type) => {
    setFormData({
      ...samples[type],
    });

    setResult(null);
    setError("");
  };

  const clearForm = () => {
    setFormData(createEmptyData());
    setResult(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
     const response = await api.post(
  "/api/predict",
  formData
);
      

      setResult(response.data);
    } catch (err) {
      console.error("Prediction error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to connect to the fraud detection API."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">

      <div className="page-heading">
        <div>
          <h1>Analyze Transaction</h1>
          <p className="page-subtitle">
            Analyze a transaction using XGBoost and SHAP explainability.
          </p>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          ML Engine Online
        </div>
      </div>

      <div className="analyze-layout">

        {/* Transaction Form */}

        <section className="card">

          <h2>Transaction Analysis</h2>

          <p className="subtitle">
            Enter the transaction features to calculate fraud risk.
          </p>

          <div className="sample-actions">

            <button
              type="button"
              className="sample normal-sample"
              onClick={() => loadSample("normal")}
            >
              Load Normal Sample
            </button>

            <button
              type="button"
              className="sample fraud-sample"
              onClick={() => loadSample("fraud")}
            >
              Load Fraud Sample
            </button>

            <button
              type="button"
              className="sample clear-sample"
              onClick={clearForm}
            >
              Clear
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {FEATURES.map((feature) => (
                <div
                  className="field"
                  key={feature}
                >
                  <label htmlFor={`feature-${feature}`}>
                    {feature}
                  </label>

                  <input
                    id={`feature-${feature}`}
                    type="number"
                    step="any"
                    name={feature}
                    value={formData[feature]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}

            </div>

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Analyzing..."
                : "Analyze Transaction"}
            </button>

          </form>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

        </section>

        {/* Result */}

        {result && (
          <section className="card result-card">

            <h2>Risk Analysis</h2>

            <div
              className={`risk ${
                result.risk_level.toLowerCase()
              }`}
            >
              {result.risk_level}
            </div>

            <div className="metrics">

              <div>
                <span>Fraud Probability</span>

                <strong>
                  {(result.fraud_probability * 100).toFixed(4)}%
                </strong>
              </div>

              <div>
                <span>Risk Score</span>

                <strong>
                  {result.risk_score.toFixed(2)} / 100
                </strong>
              </div>

              <div>
                <span>Fraud Detected</span>

                <strong>
                  {result.is_fraud ? "YES" : "NO"}
                </strong>
              </div>

            </div>

            <h3>Top Risk Factors</h3>

            <div className="factors">

              {result.top_factors.map((factor) => (
                <div
                  className="factor"
                  key={factor.feature}
                >
                  <span>
                    {factor.feature}
                  </span>

                  <strong>
                    {factor.impact > 0 ? "+" : ""}
                    {factor.impact.toFixed(4)}
                  </strong>
                </div>
              ))}

            </div>

          </section>
        )}

      </div>

    </div>
  );
}

export default Analyze;