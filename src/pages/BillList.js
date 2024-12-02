// src/pages/BillsList.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BillList.css';

const BillsList = () => {
  const [bills, setBills] = useState([]); // State to store fetched bills
  const [loading, setLoading] = useState(true); // Loading indicator
  const [error, setError] = useState(null); // Error handling

  const navigate = useNavigate();

  // Fetch bills from backend on component mount
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bills'); // API call to fetch bills
        setBills(response.data); // Store the fetched bills in state
      } catch (err) {
        console.error('Error fetching bills:', err);
        setError('Failed to fetch bills.');
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  const handleBillClick = (billId) => {
    navigate(`/bills/${billId}`); // Navigate to the bill detail page
  };

  if (loading) return <p>Loading bills...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bills-list-container">
      <h2>Bills</h2>
      <div className="bill-stack">
        {bills.map((bill) => (
          <div
            key={bill._id}
            className="bill-card"
            onClick={() => handleBillClick(bill._id)}
          >
            <div className="bill-info">
              <p><strong>Bill ID:</strong> {bill._id}</p>
              <p><strong>Date:</strong> {new Date(bill.billDate).toLocaleDateString()}</p>
              <p><strong>User:</strong> {bill.user?.name || 'Unknown User'}</p>
              <p className="bill-amount">
                <strong>Total Amount:</strong> ₹{bill.totalPayableAmount.toFixed(2)}
              </p>
              <p className="bill-amount">
                <strong>Pending Amount:</strong> ₹{bill.pendingAmount.toFixed(2)}
              </p>
              <p>
                <strong>Status:</strong> {bill.isCleared ? 'Cleared' : 'Pending'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillsList;
