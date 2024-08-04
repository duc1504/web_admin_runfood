import './App.css';
import {Route, Routes, BrowserRouter as Router, Navigate, Outlet} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from "./pages/Login";
import Products from "./pages/Products/Products";
import InsertProduct from './pages/Products/AddProductModal';
import Home from "./pages/Home/Home";
import UpImage from './pages/UpImage';
import { Analytics } from '@vercel/analytics/react';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  const PublicRoute = () => {
    if (user) {
      return <Navigate to="/"/>
    } 
    return <Outlet/>
  }

  const PrivateRoute = () => {
    if (!user) {
      return <Navigate to="/login"/>
    } 
    return <Outlet/>
  }

  return (
    <div className="App">
      <Router>
        <Analytics />
        <Routes>
          <Route element={<PublicRoute/>}>
            <Route path="/login" element={<Login/>} />
          </Route>
          <Route element={<PrivateRoute/>}>
            <Route path="/" element={<Home/>} />
            <Route path="/products" element={<Products/>} />
            <Route path="/insertproduct" element={<InsertProduct/>} />
            <Route path="/upimage" element={<UpImage/>} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
