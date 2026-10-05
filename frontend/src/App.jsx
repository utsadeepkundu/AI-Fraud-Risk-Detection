import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Signup from "./pages/Signup";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Overview from "./pages/Overview";
import Analyze from "./pages/Analyze";
import Transactions from "./pages/Transactions";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";

import "./App.css";

function DashboardLayout() {
  return (
    <div className="dashboard-app">
      <Sidebar />

      <main className="dashboard-content">
        <Routes>
          <Route
            path="/"
            element={<Overview />}
          />

          <Route
            path="/analyze"
            element={<Analyze />}
          />

          <Route
            path="/transactions"
            element={<Transactions />}
          />

          <Route
            path="/alerts"
            element={<Alerts />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public route */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Protected dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/*"
            element={<DashboardLayout />}
          />
        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;