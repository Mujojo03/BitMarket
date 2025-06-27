"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  RotateCcw,
  HelpCircle,
  ArrowRight,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";

/* -------------------------------------------------------------------
   STYLED MOCK DATA  — swap `thumb` URLs with your own product photos
-------------------------------------------------------------------- */
const MOCK_ORDERS = [
  {
    id: "ORD-001",
    status: "pending",
    date: "2025-06-27",
    total_usd: 45,
    thumb:
      "https://i.etsystatic.com/6171992/r/il/25e478/6423691903/il_fullxfull.6423691903_lz4x.jpg", // Kente Cloth
    items: [{ name: "Hand-woven Kente Cloth", qty: 1, price: 45 }],
  },
  {
    id: "ORD-002",
    status: "shipped",
    date: "2025-06-25",
    total_usd: 32,
    thumb:
      "https://5.imimg.com/data5/WHATSAPP/Default/2024/2/393429358/HX/RQ/EU/2943039/wooden-fine-carving-elephant-set-of-4-pcs-500x500.jpeg", // Sculpture
    items: [{ name: "Wooden Sculpture Set", qty: 1, price: 32 }],
  },
  {
    id: "ORD-003",
    status: "delivered",
    date: "2025-06-20",
    total_usd: 85,
    thumb:
      "https://dewerstone.com/cdn/shop/files/single-origin-speciality-peru-alta-montana-dawn-roasters-coffee-co-848230.jpg?v=1743545483&width=1080", // Coffee
    items: [{ name: "Organic Coffee Beans (3×)", qty: 3, price: 85 }],
  },
];

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: "all", label: "All Orders" },
    { id: "pending", label: "Pending" },
    { id: "processing", label: "Processing" },
    { id: "shipped", label: "Shipped" },
    { id: "delivered", label: "Delivered" },
    { id: "cancelled", label: "Cancelled" },
  ];

  /* Simulate fetch delay so spinner shows briefly */
  useEffect(() => {
    const t = setTimeout(() => {
      setOrders(MOCK_ORDERS);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  /* Helpers */
  const statusIcon = (s) => {
    switch (s) {
      case "pending":
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "shipped":
        return <Truck className="w-4 h-4 text-blue-500" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "cancelled":
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const statusColor = (s) => {
    switch (s) {
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const filtered =
    activeTab === "all"
      ? orders
      : orders.filter((o) => o.status === activeTab);

  const tabsWithCounts = tabs.map((t) => ({
    ...t,
    count:
      t.id === "all"
        ? orders.length
        : orders.filter((o) => o.status === t.id).length,
  }));

  /* ------------------------------------------------------------------ */
  /* Render                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-[#00264D] mb-2">
              My Orders
            </h1>
            <p className="text-gray-600">
              Track your purchases and manage your order history
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg mb-8">
            <div className="flex flex-wrap border-b border-gray-200">
              {tabsWithCounts.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-[#FF8C1A] border-b-2 border-[#FF8C1A]"
                      : "text-gray-600 hover:text-[#00264D]"
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="flex justify-center">
                <div className="animate-spin h-12 w-12 border-b-2 border-[#FF8C1A] rounded-full" />
              </div>
              <p className="mt-4 text-gray-600">Loading your orders…</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-[#00264D] mb-4">
                {activeTab === "all" ? "No orders yet" : `No ${activeTab} orders`}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {activeTab === "all"
                  ? "You haven't placed any orders yet. Start shopping to see your orders here."
                  : `You don't have any ${activeTab} orders at the moment.`}
              </p>
              <Link
                to="/marketplace"
                className="bg-gradient-to-r from-[#FF8C1A] to-[#FFB347] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 inline-flex items-center"
              >
                <Package className="w-5 h-5 mr-2" />
                Browse Marketplace
              </Link>
            </div>
          )}

          {/* Order list */}
          {!loading && filtered.length > 0 && (
            <div className="space-y-6">
              {filtered.map((o) => (
                <div
                  key={o.id}
                  className="bg-white rounded-xl shadow-lg p-6 flex flex-col sm:flex-row sm:items-center gap-6 hover:shadow-xl transition-shadow"
                >
                  {/* Thumbnail */}
                  <img
                    src={o.thumb}
                    alt="product thumbnail"
                    className="w-full sm:w-32 h-32 object-cover rounded-lg"
                  />

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between items-start sm:items-center gap-2">
                      <h4 className="font-semibold text-lg text-[#00264D]">
                        {o.items[0].name}
                        {o.items.length > 1 && (
                          <span className="text-gray-500 text-sm">
                            {" "}
                            +{o.items.length - 1} more
                          </span>
                        )}
                      </h4>

                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor(
                          o.status
                        )}`}
                      >
                        {statusIcon(o.status)}
                        <span className="ml-1 capitalize">{o.status}</span>
                      </div>
                    </div>

                    <p className="text-gray-500 text-sm mt-1">
                      Order&nbsp;ID:&nbsp;{o.id}
                    </p>
                    <p className="text-gray-400 text-xs">{o.date}</p>
                  </div>

                  {/* Total & CTA */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#FF8C1A] mb-2">
                      ${o.total_usd.toFixed(2)}
                    </p>
                    <Link
                      to="#"
                      className="inline-flex items-center text-sm text-[#00264D] hover:text-[#FF8C1A] font-medium"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
