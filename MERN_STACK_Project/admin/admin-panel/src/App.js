import AdminDashboard from './pages/AdminDashboard';
import Products from "./pages/Products";
import AdminOrders from "./pages/AdminOrders";
import Users from "./pages/Users";
import AdminLogin from "./components/AdminLogin";
import AdminViewUser from "./pages/AdminViewUser";  // Single user details
import {BrowserRouter, Routes, Route} from "react-router-dom";
import "./styles.css"; 


function App() {

  return (
    <div >
      <BrowserRouter >
        <Routes>
          <Route path="/" element ={<AdminLogin/>} />
          <Route path="/dashboard" element ={<AdminDashboard/>} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<AdminViewUser />} />  {/* Route with ID */}
      
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
