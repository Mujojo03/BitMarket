// src/services/cartService.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Replace with your actual backend URL

const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token'); // or however you're storing it
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

//for buy now endpoint
export const buyNow = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cart/buy_now`, {}, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to buy now' };
  }
};

//for checkout complete endpoint
export const checkoutComplete = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/cart/checkout_complete`, {}, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to complete checkout' };
  }
};

//for remove item from cart endpoint
export const removeItemFromCart = async (itemId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/cart/remove_item/${itemId}`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to remove item from cart' };
  }
};

//for update item quantity endpoint
export const updateItemQuantity = async (itemId: string, quantity: number) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/cart/update_item/${itemId}`, { quantity }, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to update item quantity' };
  }
};

//for calculate total price endpoint
export const calculateTotalPrice = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cart/total_price`, getAuthHeaders());
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to calculate total price' };
  }
};