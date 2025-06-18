import React, { useState } from "react";
import { FaHome, FaBox, FaUsers, FaExchangeAlt, FaTools } from "react-icons/fa";
import "../styles.css";
import "./Sidebar.css";

const Sidebar = ({ onSelect }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
        ☰
      </button>
      <ul>
        <li onClick={() => onSelect("dashboard")}>
          <FaHome /> {!collapsed && "Dashboard"}
        </li>
        <li onClick={() => onSelect("products")}>
          <FaBox /> {!collapsed && "Manage Products"}
        </li>
        <li onClick={() => onSelect("customers")}>
          <FaUsers /> {!collapsed && "View Customers"}
        </li>
        <li onClick={() => onSelect("requests")}>
          <FaExchangeAlt /> {!collapsed && "Manage Requests"}
        </li>
        <li onClick={() => onSelect("repair")}>
          <FaTools /> {!collapsed && "Repair Services"}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
