import React, { useState, useEffect } from 'react';
import $ from 'jquery';

const API_BASE_URL = 'http://localhost:5000';

const ProductManager = ({ jwtToken }) => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_sats: '',
    img_url: '',
    stock_quantity: '',
    category_id: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    $.ajax({
      url: `${API_BASE_URL}/products`,
      headers: { Authorization: `Bearer ${jwtToken}` },
      success: (data) => setProducts(data),
      error: () => setMessage('❌ Failed to fetch products'),
    });
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price_sats: product.price_sats?.toString() || '',
      img_url: product.img_url || '',
      stock_quantity: product.stock_quantity?.toString() || '',
      category_id: product.category_id?.toString() || '',
    });
    setEditingProduct(product.id);
    setMessage('');
  };

  const handleDelete = (id) => {
    $.ajax({
      url: `${API_BASE_URL}/products/${id}/delete`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwtToken}` },
      success: () => {
        setMessage('✅ Product deleted');
        fetchProducts();
      },
      error: () => setMessage('❌ Failed to delete product'),
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      price_sats: formData.price_sats ? Number(formData.price_sats) : null,
      stock_quantity: formData.stock_quantity ? Number(formData.stock_quantity) : null,
      category_id: formData.category_id ? Number(formData.category_id) : null,
    };

    const url = editingProduct ? `${API_BASE_URL}/products/${editingProduct}/edit` : `${API_BASE_URL}/products/create`;
    const method = editingProduct ? 'PATCH' : 'POST';

    $.ajax({
      url,
      method,
      contentType: 'application/json',
      headers: { Authorization: `Bearer ${jwtToken}` },
      data: JSON.stringify(payload),
      success: () => {
        setMessage(`✅ Product ${editingProduct ? 'updated' : 'created'} successfully!`);
        setFormData({
          name: '',
          description: '',
          price_sats: '',
          img_url: '',
          stock_quantity: '',
          category_id: '',
        });
        setEditingProduct(null);
        fetchProducts();
      },
      error: (xhr) =>
        setMessage(`❌ ${xhr.responseJSON?.message || 'Error'}`),
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Product Manager</h2>

      {message && <div className="text-sm text-red-600">{message}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded space-y-4">
        <input
          className="w-full border p-2"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          className="w-full border p-2"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          className="w-full border p-2"
          name="price_sats"
          placeholder="Price (sats)"
          value={formData.price_sats}
          onChange={handleChange}
          type="number"
          min="0"
        />
        <input
          className="w-full border p-2"
          name="img_url"
          placeholder="Image URL"
          value={formData.img_url}
          onChange={handleChange}
        />
        <input
          className="w-full border p-2"
          name="stock_quantity"
          placeholder="Stock Quantity"
          value={formData.stock_quantity}
          onChange={handleChange}
          type="number"
          min="0"
        />
        <input
          className="w-full border p-2"
          name="category_id"
          placeholder="Category ID"
          value={formData.category_id}
          onChange={handleChange}
          type="number"
          min="0"
        />
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded" type="submit">
          {editingProduct ? 'Update' : 'Create'} Product
        </button>
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-2">All Products</h3>
        {products.length ? (
          <ul className="space-y-2">
            {products.map((prod) => (
              <li
                key={prod.id}
                className="border p-3 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">{prod.name}</p>
                  <p className="text-sm text-gray-600">{prod.description}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(prod)}
                    className="text-blue-500"
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id)}
                    className="text-red-500"
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No products yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProductManager;
