import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserList.css';

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // State to hold user data
  const [loading, setLoading] = useState(true); // Loading indicator
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users'); // Adjust the route if necessary
        console.log("Response is", response);
        console.log("Response data is", response.data);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`); // Navigate to dynamic route
  };

  if (loading) return <p>Loading users...</p>; // Show loading message
  if (error) return <p>{error}</p>; // Show error message

  return (
    <div className="user-list-container">
      <h2>Users</h2>
      <div className="user-stack">
        {users.map((user) => (
          <div 
            key={user.id} 
            className="user-card" 
            onClick={() => handleUserClick(user._id)}
          >
            <div className="user-info">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Contact:</strong> {user.contactNo}</p>
              <p className="purchase"><strong>Total Purchase:</strong> ${user.totalPurchaseAmount.toFixed(2)}</p>
              <p className="pending"><strong>Pending Amount:</strong> ${user.totalPendingAmount.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
