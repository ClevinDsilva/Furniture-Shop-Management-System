import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from "./pages/ProductDetail";
import OrderDetails from './pages/OrderDetails';
import UserDetails from "./components/UserDetails";
import PaymentPage from "./components/PaymentPage";
import SuccessPage from "./components/SuccessPage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import VerifyOTP from "./components/VerifyOTP";
import Cart from './pages/Cart';
import Profile from "./pages/Profile";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Chatbot from "./components/Chatbot";
import "./styles.css"; 



function App() {

  return (
    <div >
      <BrowserRouter >
        <Routes>
          <Route path="/" element ={<Home/>} />
          <Route path="/register" element ={<Register/>} />
          <Route path="/login" element ={<Login/>} />
          <Route path="/home" element ={<Home/>} /> 
          <Route path="/forgot-password" element ={<ForgotPassword/>} />
          <Route path="/reset-password" element ={<ResetPassword/>} />
          <Route path="/verify-otp" element ={<VerifyOTP/>} />
          <Route path="/orders" element ={<OrderDetails/>} />
          <Route path="/products" element ={<Products/>} />
          <Route path="/product/:id" element={<ProductDetail />} />

          <Route path="/cart" element ={<Cart/>} />
          <Route path="/profile" element={<Profile />} />
        
          <Route path="/user-details" element={<UserDetails />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/success" element={<SuccessPage />} />
        
        <Route path="/Chatbot" element={<Chatbot/>}/>

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
