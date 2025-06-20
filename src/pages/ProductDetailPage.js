// src/pages/ProductDetailPage.js
import { useParams, useNavigate } from "react-router-dom";   // ⬅️ added useNavigate
import { useEffect, useState } from "react";
import { Zap, Star, MapPin, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();          // ⬅️ for redirect
  const [product, setProduct] = useState(null);

  /* -------------------- fetch product from localStorage -------------------- */
  useEffect(() => {
    const storedProducts =
      JSON.parse(localStorage.getItem("satsoko-products")) || [];
    const found = storedProducts.find((p) => p.id === parseInt(id));
    setProduct(found);
  }, [id]);

  /* --------------------------- add‑to‑cart logic --------------------------- */
  const addToCart = () => {
    if (!product) return;

    const storedCart = JSON.parse(localStorage.getItem("satsoko-cart")) || [];
    const existing = storedCart.find((item) => item.id === product.id);

    let updatedCart;
    if (existing) {
      updatedCart = storedCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...storedCart, { ...product, quantity: 1 }];
    }

    localStorage.setItem("satsoko-cart", JSON.stringify(updatedCart));
    navigate("/cart"); // 🚀 go see the cart
  };

  /* ------------------------------ not found ------------------------------- */
  if (!product) {
    return (
      <>
        <Navbar />
        <div className="pt-32 text-center text-gray-500">Product not found.</div>
      </>
    );
  }


  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
            {/* image */}
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full md:w-1/2 h-96 object-cover rounded-lg"
            />

            {/* details */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-[#00264D] mb-2">
                {product.name}
              </h2>

              <div className="flex items-center mb-4 space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-gray-700">{product.rating} stars</span>
                {product.verified && (
                  <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                )}
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-6">
                <MapPin className="w-4 h-4 mr-1" />
                {product.location}
              </div>

              <div className="text-3xl font-bold text-[#FF8C1A] mb-6">
                ${product.price.usd}
              </div>

              {/* buttons */}
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                <button
                  onClick={addToCart}
                  className="flex-1 bg-[#00264D] text-white px-6 py-3 rounded-lg hover:bg-[#001f3a] transition"
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => alert('Lightning checkout coming soon! ⚡')}
                  className="flex-1 bg-[#FF8C1A] text-white px-6 py-3 rounded-lg hover:shadow-md transition"
                >
                  Buy with ⚡ Lightning
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;