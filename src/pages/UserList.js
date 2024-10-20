import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserList.css';

const UserList = () => {
  const navigate = useNavigate();

  const users = [
    { id: 1, name: 'Alice Johnson', contact: '123-456-7890', totalPurchase: 1200, pendingAmount: 200 },
    { id: 2, name: 'Bob Smith', contact: '987-654-3210', totalPurchase: 850, pendingAmount: 50 },
    { id: 3, name: 'Charlie Brown', contact: '555-123-4567', totalPurchase: 500, pendingAmount: 0 },
  ];

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`); // Navigate to dynamic route
  };

  return (
    <div className="user-list-container">
      <h2>Users</h2>
      <div className="user-stack">
        {users.map((user) => (
          <div 
            key={user.id} 
            className="user-card" 
            onClick={() => handleUserClick(user.id)}
          >
            <div className="user-info">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Contact:</strong> {user.contact}</p>
              <p className="purchase"><strong>Total Purchase:</strong> ${user.totalPurchase.toFixed(2)}</p>
              <p className="pending"><strong>Pending Amount:</strong> ${user.pendingAmount.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
