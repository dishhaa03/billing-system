import React from 'react';
import { useParams } from 'react-router-dom';

const UserDetail = () => {
  const { userId } = useParams(); // Get userId from the URL
  return (
    <div style={{ padding: '20px' }}>
      <h1>User Detail Page</h1>
      <p>Showing details for <strong>User ID: </strong>{userId}</p>
    </div>
  );
};

export default UserDetail;
