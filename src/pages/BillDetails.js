import React from 'react';
import { useParams } from 'react-router-dom';

const BillDetails = () => {
  const { billid } = useParams(); // Extract bill ID from route

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bill Details</h1>
      <p>Displaying details for <strong>Bill ID:</strong> {billid}</p>
    </div>
  );
};

export default BillDetails;
