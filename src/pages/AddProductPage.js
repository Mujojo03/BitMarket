"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Package, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ImageUpload from "../components/ImageUpload";
import { ProductAPI } from "../api/product";

const AddProductPage = () => {

  const [productImages, setProductImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQty: "",
    categoryId: "",
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    ProductAPI.listCategories()
      .then(setCategories)
      .catch((err) =>
        console.error("Failed to fetch categories:", err.message || err)
      );
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (productImages.length === 0) {
      alert("Please upload at least one product image");
      return;
    }
    if (!formData.name || !formData.categoryId || !formData.price) {
      alert("Name, category and price are required");
      return;
    }

    const price_sats = Math.round(Number(formData.price) * 1000);
    const stock_quantity = parseInt(formData.stockQty || "0", 10);

    if (isNaN(price_sats) || price_sats <= 0) {
      alert("Enter a valid price");
      return;
    }
    if (isNaN(stock_quantity) || stock_quantity <= 0) {
      alert("Enter a valid stock quantity");
      return;
    }

    /* TEMP: placeholder image URL until real upload is implemented */
    const img_url =
      "https://www.freepik.com/free-photos-vectors/new-item";

    const payload = {
      category_id: Number(formData.categoryId),
      name: formData.name,
      description: formData.description,
      price_sats,
      img_url,
      stock_quantity,
    };

    console.log("🚀 Payload being sent to backend:", payload);

    try {
      await ProductAPI.create(payload, localStorage.getItem("token"));
      navigate("/seller-dashboard", { replace: true });
    } catch (err) {
      console.error("❌ Error submitting product:", err.message || err);
      alert(err.message || "Failed to create product");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* header */}
          <div className="flex items-center mb-8 animate-fade-in-up">
            <Link
              to="/"
              className="flex items-center text-[#FF8C1A] hover:text-[#FF8C1A]/80 transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#00264D] mb-2">
                Add New Product
              </h1>
              <p className="text-gray-600">
                Create a new listing for your marketplace
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* images ---------------------------------------------------- */}
              <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up">
                <h3 className="text-xl font-semibold text-[#00264D] mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Product Images
                </h3>
                <ImageUpload onImagesChange={setProductImages} maxImages={5} />
              </div>

              {/* product details ----------------------------------------- */}
              <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up delay-200">
                <h3 className="text-xl font-semibold text-[#00264D] mb-6">
                  Product Details
                </h3>

                <div className="space-y-6">
                  {/* name */}
                  <div>
                    <label className="block text-sm font-medium text-[#00264D] mb-2">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter product name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C1A] focus:border-transparent"
                      required
                    />
                  </div>

                  {/* description */}
                  <div>
                    <label className="block text-sm font-medium text-[#00264D] mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe your product..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C1A] focus:border-transparent"
                    />
                  </div>

                  {/* price */}
                  <div>
                    <label className="block text-sm font-medium text-[#00264D] mb-2">
                      Price (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C1A] focus:border-transparent"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Lightning equivalent: ~
                      {formData.price
                        ? (
                            Number.parseFloat(formData.price) * 1000
                          ).toLocaleString()
                        : "0"}{" "}
                      sats
                    </p>
                  </div>

                  {/* stock qty */}
                  <div>
                    <label className="block text-sm font-medium text-[#00264D] mb-2">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={formData.stockQty}
                      onChange={(e) =>
                        setFormData({ ...formData, stockQty: e.target.value })
                      }
                      placeholder="0"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C1A] focus:border-transparent"
                      required
                    />
                  </div>

                  {/* category */}
                  <div>
                    <label className="block text-sm font-medium text-[#00264D] mb-2">
                      Category
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          categoryId: e.target.value,
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C1A] focus:border-transparent"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* submit */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] text-white py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Create Product Listing
                  </button>
                  <Link
                    to="/seller-dashboard"
                    className="w-full block text-center mt-4 bg-white border border-[#FF8C1A] text-[#FF8C1A] py-4 rounded-lg font-semibold hover:bg-[#FF8C1A] hover:text-white transition-all duration-300 transform hover:scale-105"
                  >
                    Go to Seller Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProductPage;