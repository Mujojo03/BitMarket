import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MarketplacePage from "./pages/MarketplacePage";
import AboutPage from "./pages/AboutPage";
import OrdersPage from "./pages/OrdersPage";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import Terms from "./pages/auth/TermsPage";
import Privacy from "./pages/auth/PrivacyPage";
import CartPage from "./pages/CartPage";
import AddProductPage from "./pages/AddProductPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import ProductDetailPage from "./pages/ProductDetailPage";
import SellerDashboard from "./pages/SellerDashboard";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/terms" element={<Terms />} />
        <Route path="/auth/privacy" element={<Privacy />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
      </Routes>
    </div>
  );
}

export default App;