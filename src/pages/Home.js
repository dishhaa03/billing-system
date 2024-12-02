import React, { useState } from 'react';
import './Home.css';
import { FaTimes } from 'react-icons/fa'; // Cross icon for deleting bills

const Home = () => {
  // Dummy data for draft bills
  const [bills, setBills] = useState([
    { id: 1, customer: 'Alice Johnson', amount: 120.5 },
    { id: 2, customer: 'Bob Smith', amount: 300 },
    { id: 3, customer: 'Charlie Brown', amount: 99.9 },
  ]);

  // Function to remove a bill from the frontend
  const removeBill = (id) => {
    const updatedBills = bills.filter((bill) => bill.id !== id);
    console.log("I am here");
    setBills(updatedBills);
  };

  return (
    <div className="home-container">
      {/* Left Main Section */}
      <div className="main-section">
        <h1>Welcome to the Billing System</h1>
        <p>Manage your billing and track invoices efficiently.</p>
      </div>

      {/* Right Section: Draft Bills */}
      <div className="draft-bills-container">
        <h2>Draft Bills</h2>
        {bills.length === 0 ? (
          <p>No draft bills available.</p>
        ) : (
          <div className="bills-stack">
            {bills.map((bill) => (
              <div key={bill.id} className="bill-card">
                <div className="bill-info">
                  <p><strong>Bill ID:</strong> {bill.id}</p>
                  <p><strong>Customer:</strong> {bill.customer}</p>
                  <p><strong>Amount:</strong> ${bill.amount.toFixed(2)}</p>
                </div>
                <FaTimes 
                  className="remove-icon" 
                  onClick={() => removeBill(bill.id)} 
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
