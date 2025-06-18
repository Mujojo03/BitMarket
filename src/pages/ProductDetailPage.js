"use client";

import { useParams, useLocation, Link } from "react-router-dom";
import { Zap, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";

/**
 * --- How data gets here ---
 * 1. Marketplace <Link … state={{ product }}> pushes the product object.
 * 2. Fallback: if user refreshes, pull it from localStorage (quick demo technique).
 */
const ProductDetailPage = () => {
  const { id } = useParams();                 // product id in /product/:id
  const location = useLocation();
  const product =
    location.state?.product ||
    JSON.parse(localStorage.getItem("product_" + id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Product not found 🤔</p>
      </div>
    );
  }

  // keep a copy in case user refreshes
  localStorage.setItem("product_" + id, JSON.stringify(product));

  return (
    <>
      <Navbar />
      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-10">
          {/* Image */}
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="rounded-2xl w-full h-auto object-cover shadow-lg"
          />

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold text-[#00264D] mb-4">
              {product.name}
            </h1>

            {/* Price block */}
            <div className="text-2xl font-bold text-[#FF8C1A] mb-6">
              ${product.price.usd} &nbsp;
              <span className="text-lg text-gray-600">
                / {product.price.sats.toLocaleString()} sats
              </span>
            </div>

            <p className="text-gray-700 mb-8">
              Sold by <strong>{product.seller}</strong>
            </p>

            {/* Add‑to‑cart button */}
            <button
              onClick={() => alert("Added to cart 🛒 (demo)")}
              className="w-full bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] text-white py-4 rounded-lg font-semibold hover:shadow-xl transition"
            >
              Add to Cart
            </button>

            {/* Back link */}
            <Link
              to="/marketplace"
              className="mt-6 inline-flex items-center text-[#00264D] hover:underline"
            >
              <ArrowRight className="w-4 h-4 rotate-180 mr-1" /> Back to
              marketplace
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;