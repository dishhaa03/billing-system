// src/pages/BillsList.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BillList.css';

// Dummy data for now (to simulate backend response)
const bills = [
  { id: 1, date: '2024-10-15', user: 'Alice Johnson', amount: 500.25 },
  { id: 2, date: '2024-10-10', user: 'Bob Smith', amount: 1200.00 },
  { id: 3, date: '2024-10-18', user: 'Charlie Brown', amount: 750.75 },
];

// Sort bills by date (latest first)
bills.sort((a, b) => new Date(b.date) - new Date(a.date));

const BillsList = () => {
  const navigate = useNavigate();

  const handleBillClick = (billId) => {
    navigate(`/bills/${billId}`); // Navigate to dynamic bill route
  };

  return (
    <div className="bills-list-container">
      <h2>Bills</h2>
      <div className="bill-stack">
        {bills.map((bill) => (
          <div
            key={bill.id}
            className="bill-card"
            onClick={() => handleBillClick(bill.id)}
          >
            <div className="bill-info">
              <p><strong>Bill ID:</strong> {bill.id}</p>
              <p><strong>Date:</strong> {bill.date}</p>
              <p><strong>User:</strong> {bill.user}</p>
              <p className="bill-amount"><strong>Amount:</strong> ${bill.amount.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillsList;
