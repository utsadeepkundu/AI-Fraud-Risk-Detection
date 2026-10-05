# NovaRisk — AI Fraud & Risk Detection Platform

NovaRisk is a full-stack AI-powered fraud detection and transaction risk analysis platform designed to identify potentially fraudulent transactions, calculate transaction risk, and provide explainable insights using Machine Learning and SHAP.

The platform combines a React frontend, FastAPI backend, MongoDB Atlas, XGBoost, SHAP explainability, JWT authentication, transaction history, alerts, and analytics into a single web application.

---

## 🚀 Features

### 🔐 Authentication
- User registration
- Secure password hashing using Argon2
- JWT-based authentication
- Protected API routes
- Automatic token validation
- Login/logout functionality

### 🤖 AI Fraud Detection
- XGBoost-based fraud classification
- Fraud probability prediction
- Risk score generation
- Risk levels:
  - LOW
  - MEDIUM
  - HIGH
- Fraud / non-fraud classification

### 🔎 Explainable AI
NovaRisk uses SHAP (SHapley Additive exPlanations) to identify the most influential model features behind a prediction.

The system provides:
- Top contributing features
- Positive and negative feature influence
- Human-readable risk factors

### 📊 Dashboard
The dashboard provides:
- Total transactions
- Fraud transactions
- Fraud rate
- High/medium/low risk distribution
- Average risk score
- Recent high-risk transactions

### 🧾 Transaction History
- Stores analyzed transactions in MongoDB Atlas
- Displays previous predictions
- Shows fraud probability and risk level
- Supports clearing transaction history

### 🚨 Fraud Alerts
- Displays high-risk transactions
- Highlights potentially fraudulent activity
- Provides transaction-level risk information

### 📈 Analytics
- Risk distribution
- Fraud statistics
- Average risk score
- Recent high-risk activity

### 🌐 Modern Web Interface
- Responsive React interface
- Sidebar navigation
- Protected dashboard routes
- Transaction analysis interface
- Login and registration pages

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │       User           │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   React + Vite       │
                         │     Frontend         │
                         └──────────┬───────────┘
                                    │
                              HTTP / REST API
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   FastAPI Backend    │
                         │                      │
                         │ Authentication       │
                         │ Fraud Prediction     │
                         │ History              │
                         │ Alerts               │
                         │ Analytics            │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
            │   XGBoost    │ │     SHAP     │ │   MongoDB    │
            │    Model     │ │ Explainability│ │    Atlas     │
            └──────────────┘ └──────────────┘ └──────────────┘


     AI-Fraud-Risk-Detection/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── auth.py
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.py
│   │   │   └── prediction.py
│   │   │
│   │   ├── services/
│   │   │   └── fraud_service.py
│   │   │
│   │   └── models/
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   ├── main.jsx
│   │   │
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Overview.jsx
│   │   │   ├── Analyze.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── Alerts.jsx
│   │   │   └── Analytics.jsx
│   │   │
│   │   └── data/
│   │       └── sampleTransactions.json
│   │
│   ├── package.json
│   └── .env
│
├── ml/
│   ├── data/
│   │   └── raw/
│   │       └── creditcard.csv
│   │
│   ├── notebooks/
│   │   ├── 01_eda.ipynb
│   │   ├── 02_preprocessing.ipynb
│   │   ├── 03_baseline_model.ipynb
│   │   ├── 04_shap_explainability.ipynb
│   │   └── 05_save_model.ipynb
│   │
│   ├── models/
│   │   ├── fraud_xgboost.joblib
│   │   ├── fraud_scaler.joblib
│   │   └── model_metadata.json
│   │
│   └── training/
│
├── .gitignore
└── README.md

NovaRisk currently uses the Credit Card Fraud Detection dataset for model development.
Dataset
Total transactions: 284,807
Fraud transactions: 492
Normal transactions: 284,315

The dataset contains:
Time
V1 - V28
Amount
Class

Where:
- V1–V28 are anonymized PCA-transformed features.
- Amount represents the transaction amount.
- Class is the target:
  - 0 = Normal
  - 1 = Fraud
🔬 ML Pipeline
The machine learning workflow consists of:
Raw Dataset
     │
     ▼
Exploratory Data Analysis
     │
     ▼
Train / Validation / Test Split
     │
     ▼
Feature Scaling
     │
     ▼
Baseline Logistic Regression
     │
     ▼
XGBoost Model
     │
     ▼
Threshold Optimization
     │
     ▼
SHAP Explainability
     │
     ▼
Saved Model Artifacts

📊 Model Performance
The final XGBoost model achieved the following test performance at the selected validation-based threshold:
Metric	Score
Precision	0.9508
Recall	0.7838
F1 Score	0.8593
ROC-AUC	0.9684
PR-AUC	0.8436


Selected Classification Threshold
0.9264692

The threshold was selected using validation data rather than optimizing directly on the final test set.
🔎 SHAP Explainability
NovaRisk uses SHAP with an XGBoost TreeExplainer to provide model explanations.
The application identifies the most influential features contributing to a transaction's prediction.
Example response:
{
  "fraud_probability": 0.999945,
  "risk_score": 99.99,
  "risk_level": "HIGH",
  "is_fraud": true,
  "top_factors": [
    "...",
    "...",
    "..."
  ]
}

🖥️ Frontend
The frontend is built using:
- React
- Vite
- Axios
- React Router
Main pages
/login

Authentication page.
/

Overview dashboard.
/analyze

Transaction analysis.
/transactions

Transaction history.
/alerts

High-risk fraud alerts.
/analytics

Fraud and risk analytics.
⚙️ Backend
The backend is built using:
- Python
- FastAPI
- Uvicorn
- MongoDB
- PyMongo
- XGBoost
- SHAP
- Scikit-learn
- JWT
- Argon2 password hashing
🔗 API Endpoints
General
Health Check
GET /api/health

Checks backend and MongoDB connectivity.
Example response:
{
  "status": "healthy",
  "database": "connected"
}

Authentication
Register
POST /api/auth/register

Registers a new user.
Login
POST /api/auth/login

Authenticates a user and returns a JWT access token.
Current User
GET /api/auth/me

Returns the currently authenticated user.
Fraud Detection
Predict
POST /api/predict

Analyzes a transaction using the trained XGBoost fraud detection model.
Transaction History
GET /api/history

Returns previously analyzed transactions.
Clear Transaction History
DELETE /api/history

Deletes stored transaction history.
Analytics
GET /api/analytics

Returns dashboard fraud and risk statistics.
Fraud Alerts
GET /api/alerts

Returns high-risk transactions.
🔐 Environment Variables
Environment variables are stored locally in .env files and must never be committed to GitHub.
Backend .env
Create:
backend/.env

Example:
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/?appName=<app-name>
DATABASE_NAME=fraud_detection

JWT_SECRET_KEY=<your-secret-key>
ACCESS_TOKEN_EXPIRE_MINUTES=60

CORS_ORIGINS=http://localhost:5173

Replace the placeholder values with your actual configuration.
🎨 Frontend Environment
Create:
frontend/.env

For local development:
VITE_API_BASE_URL=http://127.0.0.1:8000

For production, this will be changed to the deployed Render backend URL.
Example:
VITE_API_BASE_URL=https://your-backend.onrender.com

🛠️ Local Development
1. Clone the repository
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd AI-Fraud-Risk-Detection

▶️ Backend Setup
Move into the backend directory:
cd backend

Create a virtual environment:
python -m venv venv

Activate it on Windows:
.\venv\Scripts\Activate.ps1

Install dependencies:
pip install -r requirements.txt

Start the FastAPI server:
python -m uvicorn app.main:app --reload --port 8000

Backend:
http://127.0.0.1:8000

Swagger documentation:
http://127.0.0.1:8000/docs

▶️ Frontend Setup
Open another terminal.
Move into:
cd frontend

Install dependencies:
npm install

Start the Vite development server:
npm run dev

The frontend will normally run at:
http://localhost:5173

🔑 Authentication Flow
NovaRisk uses JWT authentication.
User
 │
 ▼
Login / Register
 │
 ▼
FastAPI Authentication
 │
 ▼
JWT Access Token
 │
 ▼
Browser localStorage
 │
 ▼
Axios Authorization Header
 │
 ▼
Protected FastAPI Routes

Protected API requests use:
Authorization: Bearer <token>

🗄️ Database
NovaRisk uses MongoDB Atlas.
Main collections:
fraud_detection
│
├── users
└── transactions

Users
Stores:
- Name
- Email
- Password hash
- Role
Transactions
Stores:
- Transaction information
- Fraud probability
- Risk score
- Risk level
- Fraud classification
- SHAP factors
- Timestamp
☁️ Deployment
NovaRisk is designed to use a split deployment architecture.
                    GitHub
                      │
           ┌──────────┴──────────┐
           ▼                     ▼
        Render                 Vercel
        Backend                Frontend
           │                     │
           │                     │
        FastAPI              React/Vite
           │
           ▼
     MongoDB Atlas

Backend
The FastAPI backend will be deployed on Render.
The repository root is used as the service root because the ML model files are stored under:
ml/models/

Recommended Render configuration:
Root Directory:
[leave empty]

Build Command:
pip install -r backend/requirements.txt

Start Command:
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT

Required Render environment variables
MONGODB_URI=<your-mongodb-atlas-uri>
DATABASE_NAME=fraud_detection

JWT_SECRET_KEY=<your-secret-key>
ACCESS_TOKEN_EXPIRE_MINUTES=60

CORS_ORIGINS=https://your-frontend.vercel.app

🌐 Frontend Deployment
The React frontend will be deployed on Vercel.
Production environment variable:
VITE_API_BASE_URL=https://your-backend.onrender.com

The Vercel frontend communicates with the FastAPI backend through REST APIs.
🔒 Security
The following files and directories should never be committed:
.env
venv/
.venv/
node_modules/
__pycache__/

Secrets such as:
- MongoDB credentials
- JWT secret
- API keys
- Production environment variables
must be stored using environment variables.
Never expose database passwords or JWT secrets in source code or GitHub.
📌 Current Project Status
Completed
- [x] Dataset preparation
- [x] Exploratory Data Analysis
- [x] Data preprocessing
- [x] Logistic Regression baseline
- [x] XGBoost fraud detection model
- [x] Threshold optimization
- [x] SHAP explainability
- [x] Model serialization
- [x] FastAPI backend
- [x] MongoDB Atlas integration
- [x] JWT authentication
- [x] Password hashing
- [x] Protected API routes
- [x] React frontend
- [x] Login and registration
- [x] Overview dashboard
- [x] Transaction analysis
- [x] Transaction history
- [x] Fraud alerts
- [x] Analytics
- [x] Frontend/backend API integration
Deployment
- [ ] Push project to GitHub
- [ ] Deploy backend to Render
- [ ] Configure production environment variables
- [ ] Deploy frontend to Vercel
- [ ] Connect Vercel frontend to Render backend
- [ ] Configure production CORS
- [ ] Perform final production testing
⚠️ Current ML Input Limitation
The current ML model was trained using the public Credit Card Fraud Detection dataset.
Its input features include:
Time
V1 - V28
Amount

The V1–V28 features are anonymized PCA-derived features from the original dataset.
Therefore, they do not directly correspond to human-readable business concepts such as:
Merchant Category
Device Type
City
Payment Method
Account Age

The current version of NovaRisk therefore preserves the original model input structure for prediction accuracy and consistency with the trained model.
A future version may introduce a new model trained on business-readable transaction features to provide a more natural end-user transaction input experience.
🔮 Future Improvements
Possible future enhancements include:
- Real-time transaction streaming
- Business-readable fraud features
- User behavioral profiling
- Device fingerprinting
- Geolocation anomaly detection
- Velocity-based fraud detection
- Multiple ML model comparison
- Model monitoring
- Automated retraining
- Advanced anomaly detection
- Role-based access control
- Admin dashboard
- Exportable fraud reports
- Email/SMS fraud alerts
- Cloud-based logging and monitoring
- Docker/Kubernetes deployment
- CI/CD pipeline
🧰 Technology Stack
Frontend
- React
- Vite
- JavaScript
- Axios
- React Router
- CSS
Backend
- Python
- FastAPI
- Uvicorn
- PyMongo
- JWT
- Argon2
Machine Learning
- XGBoost
- Scikit-learn
- Pandas
- NumPy
- SHAP
- Joblib
Database
- MongoDB Atlas
Deployment
- GitHub
- Render
- Vercel
👨‍💻 Author
Utsadeep Kundu
B.Tech — Computer Science & Engineering
Artificial Intelligence & Machine Learning
📄 License
This project is intended for educational, academic, portfolio, and demonstration purposes.

### One small thing

Don't put your actual:

```text
MONGODB_URI
JWT_SECRET_KEY