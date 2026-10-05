import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/api/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        "Unable to sign in. Please check your credentials.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background-shape login-shape-one"></div>
      <div className="login-background-shape login-shape-two"></div>

      <header className="login-header">
        <div className="login-brand">
          <div className="login-brand-mark">N</div>

          <div>
            <div className="login-brand-name">NovaRisk</div>
            <div className="login-brand-subtitle">
              AI Fraud Intelligence Platform
            </div>
          </div>
        </div>

        <div className="login-security-badge">
          <span className="login-security-dot"></span>
          Secure Access
        </div>
      </header>

      <main className="login-main">
        <section className="login-info">
          <div className="login-eyebrow">AI-POWERED RISK DETECTION</div>

          <h1>
            Detect risk.
            <br />
            Protect every
            <br />
            <span>transaction.</span>
          </h1>

          <p>
            Sign in to access intelligent fraud analysis, risk scoring,
            transaction monitoring and explainable AI insights.
          </p>

          <div className="login-feature-list">
            <div className="login-feature-item">
              <div className="login-feature-icon">✓</div>
              <div>
                <strong>AI-powered detection</strong>
                <span>XGBoost fraud classification</span>
              </div>
            </div>

            <div className="login-feature-item">
              <div className="login-feature-icon">✓</div>
              <div>
                <strong>Explainable predictions</strong>
                <span>SHAP-powered risk factors</span>
              </div>
            </div>

            <div className="login-feature-item">
              <div className="login-feature-icon">✓</div>
              <div>
                <strong>Real-time monitoring</strong>
                <span>Alerts, analytics and history</span>
              </div>
            </div>
          </div>
        </section>

        <section className="login-card">
          <div className="login-card-top">
            <div className="login-lock-icon">
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
            </div>

            <div>
              <h2>Welcome back</h2>
              <p>Sign in to your NovaRisk account</p>
            </div>
          </div>

          {error && (
            <div className="login-error">
              <span className="login-error-icon">!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-field">
              <label htmlFor="email">Email address</label>

              <div className="login-input-wrapper">
                <svg
                  className="login-input-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>

              <div className="login-input-wrapper">
                <svg
                  className="login-input-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span className="login-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>Protected access</span>
          </div>

          <div className="login-trust">
            <div className="login-trust-item">
              <span>●</span>
              JWT Authentication
            </div>

            <div className="login-trust-item">
              <span>●</span>
              Secure API
            </div>

            <div className="login-trust-item">
              <span>●</span>
              MongoDB Atlas
            </div>
          </div>
        </section>
      </main>

      <footer className="login-footer">
        © 2026 NovaRisk · AI Fraud & Risk Detection
      </footer>
    </div>
  );
}

export default Login;