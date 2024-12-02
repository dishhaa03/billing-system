// src/pages/BillDetailsList.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BillList.css'; // Reusing your CSS styles

const BillDetailsList = () => {
  const { userId } = useParams(); // Extract userId from route params
  const [bills, setBills] = useState([]); // Store bills in state
  const [loading, setLoading] = useState(true); // Loading indicator
  const [error, setError] = useState(null); // Error state
  
  const navigate = useNavigate();
  // Fetch bills for the given user
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
        setBills(response.data); // Set the fetched bills in state
      } catch (error) {
        console.error('Error fetching bills:', error);
        setError('Failed to fetch bills.');
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchBills(); // Call the function
  }, [userId]); // Re-fetch if userId changes

  if (loading) return <p>Loading bills...</p>; // Show loading message
  if (error) return <p>{error}</p>; // Show error message

  return (
    <div className="bills-list-container">
      <h2>User's Bills</h2>
      <div className="bill-stack">
        {bills.length === 0 ? (
          <p>No bills found for this user.</p>
        ) : (
          bills.map((bill) => (
            <div 
              key={bill._id} 
              className="bill-card"
              onClick={() => navigate(`/bills/${bill._id}`)} // Action on click
            >
              <div className="bill-info">
                <p><strong>Bill ID:</strong> {bill._id}</p>
                <p><strong>Date:</strong> {new Date(bill.billDate).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> ${bill.totalPayableAmount.toFixed(2)}</p>
                <p><strong>Pending Amount:</strong> ${bill.pendingAmount.toFixed(2)}</p>
                <p><strong>Status:</strong> {bill.isCleared ? 'Cleared' : 'Pending'}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BillDetailsList;
