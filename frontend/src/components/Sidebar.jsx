import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside className="sidebar">

      <div className="sidebar-brand">
        <div className="brand-icon">
          NR
        </div>

        <div>
          <h2>NovaRisk</h2>
          <span>Fraud Intelligence</span>
        </div>
      </div>

      <nav className="sidebar-nav">

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/analyze"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span>Analyze Transaction</span>
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span>Transactions</span>
        </NavLink>

        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span>Fraud Alerts</span>
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span>Analytics</span>
        </NavLink>

      </nav>

      <div className="sidebar-user">

        <div className="sidebar-user-info">
          <strong>
            {user?.name || "Analyst"}
          </strong>

          <span>
            {user?.role || "analyst"}
          </span>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;