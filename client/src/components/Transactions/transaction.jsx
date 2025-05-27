import React, { useEffect, useState } from 'react';
import $ from 'jquery';

const API_BASE = 'http://localhost:5000'; // update as needed

function authHeader() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [formData, setFormData] = useState({ description: '', amount: '' });
  const [newTxnData, setNewTxnData] = useState({ description: '', amount: '' });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Fetch all transactions on mount
  useEffect(() => {
    setError(null);
    $.ajax({
      url: `${API_BASE}/transactions`,
      method: 'GET',
      headers: authHeader(),
      success: (data) => setTransactions(data),
      error: (xhr) => setError(xhr.responseText || 'Failed to fetch transactions'),
    });
  }, []);

  // Handle new transaction form changes
  const handleNewChange = e => {
    setNewTxnData({ ...newTxnData, [e.target.name]: e.target.value });
  };

  // Submit new transaction
  const handleNewSubmit = e => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    $.ajax({
      url: `${API_BASE}/transactions`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      data: JSON.stringify(newTxnData),
      success: (created) => {
        setTransactions([...transactions, created]);
        setNewTxnData({ description: '', amount: '' });
        setMessage('Transaction created');
      },
      error: (xhr) => setError(xhr.responseText || 'Failed to create transaction'),
    });
  };

  // Select transaction for detail view
  const handleSelect = txn => {
    setSelectedTxn(txn);
    setFormData({ description: txn.description || '', amount: txn.amount || '' });
    setError(null);
    setMessage(null);
  };

  // Handle detail form changes
  const handleDetailChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update selected transaction
  const handleUpdate = () => {
    setError(null);
    setMessage(null);
    $.ajax({
      url: `${API_BASE}/transactions/${selectedTxn.id}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader(),
      },
      data: JSON.stringify(formData),
      success: (updated) => {
        setTransactions(txns =>
          txns.map(t => (t.id === updated.id ? updated : t))
        );
        setSelectedTxn(updated);
        setMessage('Transaction updated');
      },
      error: (xhr) => setError(xhr.responseText || 'Failed to update transaction'),
    });
  };

  // Delete selected transaction
  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    setError(null);
    setMessage(null);
    $.ajax({
      url: `${API_BASE}/transactions/${selectedTxn.id}`,
      method: 'DELETE',
      headers: authHeader(),
      success: () => {
        setTransactions(txns => txns.filter(t => t.id !== selectedTxn.id));
        setSelectedTxn(null);
        setMessage('Transaction deleted');
      },
      error: (xhr) => setError(xhr.responseText || 'Failed to delete transaction'),
    });
  };

  // Back to list from detail
  const handleBack = () => {
    setSelectedTxn(null);
    setError(null);
    setMessage(null);
  };

  return (
    <div>
      {!selectedTxn ? (
        <>
          <h2>Transactions</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {message && <p style={{ color: 'green' }}>{message}</p>}
          <ul>
            {transactions.map(txn => (
              <li key={txn.id}>
                <button onClick={() => handleSelect(txn)}>
                  {txn.description} - {txn.amount}
                </button>
              </li>
            ))}
          </ul>

          <h3>Create New Transaction</h3>
          <form onSubmit={handleNewSubmit}>
            <input
              name="description"
              placeholder="Description"
              value={newTxnData.description}
              onChange={handleNewChange}
              required
            />
            <input
              name="amount"
              placeholder="Amount"
              type="number"
              value={newTxnData.amount}
              onChange={handleNewChange}
              required
            />
            <button type="submit">Create</button>
          </form>
        </>
      ) : (
        <>
          <h2>Transaction Detail (ID: {selectedTxn.id})</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {message && <p style={{ color: 'green' }}>{message}</p>}
          <label>
            Description:
            <input name="description" value={formData.description} onChange={handleDetailChange} />
          </label>
          <br />
          <label>
            Amount:
            <input
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleDetailChange}
            />
          </label>
          <br />
          <button onClick={handleUpdate}>Update</button>{' '}
          <button onClick={handleDelete} style={{ color: 'red' }}>
            Delete
          </button>{' '}
          <button onClick={handleBack}>Back to list</button>
        </>
      )}
    </div>
  );
};

export default Transaction;
