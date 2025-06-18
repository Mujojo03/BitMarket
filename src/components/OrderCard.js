import { Truck, Package, CheckCircle, XCircle } from 'lucide-react';

const statusIcons = {
  pending: <Package className="w-5 h-5 text-yellow-500" />,
  processing: <Truck className="w-5 h-5 text-blue-500" />,
  shipped: <Truck className="w-5 h-5 text-indigo-500" />,
  delivered: <CheckCircle className="w-5 h-5 text-green-500" />,
  cancelled: <XCircle className="w-5 h-5 text-red-500" />
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function OrderCard({ order }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      <div className="p-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#00264D]">
              Order #{order.id}
            </h3>
            <p className="text-gray-500 text-sm">
              {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-sm ${statusColors[order.status]}`}>
            <div className="flex items-center">
              {statusIcons[order.status]}
              <span className="ml-1">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="font-medium text-gray-900 mb-2">Products</h4>
          {/* Placeholder - Add real products later */}
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
            <div className="ml-4">
              <p>Product Name</p>
              <p>Quantity: 1</p>
              <p>Price: $XX.XX</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-lg font-semibold">$XX.XX</p>
          </div>
          <button className="px-4 py-2 bg-[#FF8C1A] text-white rounded-md text-sm font-medium hover:bg-[#FF9E3A]">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}