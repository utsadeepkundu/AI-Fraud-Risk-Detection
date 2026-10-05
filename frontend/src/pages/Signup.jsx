import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/api/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        "Unable to create your account. Please try again.";

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
          <div className="login-eyebrow">JOIN NOVARISK</div>

          <h1>
            Start
            <br />
            protecting
            <br />
            <span>every transaction.</span>
          </h1>

          <p>
            Create your NovaRisk account to access AI-powered fraud analysis,
            transaction monitoring, risk analytics and explainable insights.
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
                <span>Alerts, analytics and transaction history</span>
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
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            <div>
              <h2>Create your account</h2>
              <p>Set up your NovaRisk analyst account</p>
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
              <label htmlFor="name">Full name</label>

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
                  <path d="M20 21a8 8 0 0 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  autoComplete="name"
                  disabled={loading}
                />
              </div>
            </div>

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
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="confirmPassword">Confirm password</label>

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
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
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
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <span className="login-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>Already registered?</span>
          </div>

          <button
            type="button"
            className="signup-back-button"
            onClick={() => navigate("/login")}
            disabled={loading}
          >
            Back to Sign In
          </button>
        </section>
      </main>

      <footer className="login-footer">
        © 2026 NovaRisk · AI Fraud & Risk Detection
      </footer>
    </div>
  );
}

export default Signup;