import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import Products from "../Products/Products";
import Category from "../Category/Category";
import User from "../User/User";
import Dashboard from "./Dashboard";
import { Button } from "react-bootstrap";
import "../../styles/styleHome.css";
import Orders from "../Order/Order";

function Home() {
  // lấy dữ liệu selectedComponent tu localStorage
  const selectedComponentFromStorage = localStorage.getItem("selectedComponent");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState(selectedComponentFromStorage||'Dashboard'); 

  useEffect(() => {
    const sidebarToggle = document.body.querySelector("#sidebarToggle");
    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", (event) => {
        event.preventDefault();
        document.body.classList.toggle("sb-sidenav-toggled");
        localStorage.setItem(
          "sb|sidebar-toggle",
          document.body.classList.contains("sb-sidenav-toggled")
        );
      });
    }
  });

  // Lấy dữ liệu từ localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("selectedComponent");
    window.location.reload();
  };

  // Function để chọn component để render khi click vào mục trong sidebar
  const handleSidebarItemClick = (componentName) => {
    // lưu tên component vào localStorage
    localStorage.setItem("selectedComponent", componentName);
    setSelectedComponent(componentName);
  };

  // Function để render component dựa trên tên
  const renderSelectedComponent = () => {
    switch(selectedComponent) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Category':
        return <Category />;
      case 'Products':
        return <Products />;
      case 'User':
        return <User />;
      case 'Orders':
        return <Orders />;
      default:
        return null;
    }
  };

  return (
    <div className={`d-flex ${isSidebarOpen ? "toggled" : ""}`} id="wrapper">
      {/* Sidebar */}
      <div className="border-end bg-white" id="sidebar-wrapper">
        <div className="sidebar-heading border-bottom bg-light">Web admin</div>
        <div className="list-group list-group-flush">
          <button
            className="list-group-item list-group-item-action list-group-item-light p-3"
            onClick={() => handleSidebarItemClick('Dashboard')}
          >
            Dashboard
          </button>
          <button
            className="list-group-item list-group-item-action list-group-item-light p-3"
            onClick={() => handleSidebarItemClick('Category')}
          >
            Categories
          </button>
          <button
            className="list-group-item list-group-item-action list-group-item-light p-3"
            onClick={() => handleSidebarItemClick('Products')}
          >
            Products
          </button>
          <button
            className="list-group-item list-group-item-action list-group-item-light p-3"
            onClick={() => handleSidebarItemClick('User')}
          >
            Users
          </button>
          <button
            className="list-group-item list-group-item-action list-group-item-light p-3"
            onClick={() => handleSidebarItemClick('Orders')}
          >
            Orders
          </button>
        </div>
      </div>
      {/* Page content wrapper */}
      <div id="page-content-wrapper">
        {/* Top navigation */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
          <div className="container-fluid">
            <Button
              variant="primary"
              onClick={toggleSidebar}
              id="sidebarToggle"
            >
              Toggle Menu
            </Button>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ms-auto mt-2 mt-lg-0">
                
               
                <li className="nav-item dropdown">
                  <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                      {user.name}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>
                        Information
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={handleLogout}
                      >
                        Log Out
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* Page content */}
        <div className="container-fluid">{renderSelectedComponent()}</div>
      </div>
    </div>
  );
}

export default Home;
