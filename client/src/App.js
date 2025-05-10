import './App.css';
import HomePage from './Components/HomePage/homePage';
import SellerPage from './Components/SellerPage/sellerDashboard';
import CartPage from './Components/CartPage/cartSidebar';
import ResetPassword from './Components/ResetPassword/resetPassword';
import Purchase from './Components/CartPage/purchase';
import BuyerLogin from './Components/CartPage/buyerLogin';
import SellerLogin from './Components/SellerPage/sellerLogin';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sell" element={<SellerPage />} />
        <Route path="/seller-login" element={<SellerLogin />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/buyer-login" element={<BuyerLogin />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
}

export default App;