// src/pages/BillDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './NewBill.css';
import './BillDetails.css';

const BillDetails = () => {
  const { billid } = useParams(); // Extract bill ID from the route
  const [bill, setBill] = useState(null); // Store fetched bill data
  const [items, setItems] = useState([]); // Manage items state
  const [payments, setPayments] = useState([]); 
  const [newPaymentIds, setNewPaymentIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOnlinePayment, setShowOnlinePayment] = useState(false);
  const [showCashPayment, setShowCashPayment] = useState(false);

  const [onlinePaymentAmount, setOnlinePaymentAmount] = useState(0);
  const [cashPaymentAmount, setCashPaymentAmount] = useState(0);
   
  const [totalAmount, setTotalAmount] = useState(0);
  const [payableAmount, setPayableAmount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);


  // Fetch Bill Data
  useEffect(() => {
    const fetchBill = async () => {
      try {
        // console.log('billid from frontend:', billid);
        const response = await axios.get(`http://localhost:5000/api/bills/${billid}`);
        const billData = response.data;
        console.log('Bill Data:', billData);
        setBill(billData);
        setItems(billData.products); // Initialize items from bill data
        setPayments(billData.payments);
        setTotalAmount(billData.totalAmount);
        setPayableAmount(billData.totalPayableAmount);
        setPendingAmount(billData.pendingAmount);
        // setOnlinePaymentAmount(billData.pendingAmount);
        // setCashPaymentAmount(billData.pendingAmount);
      } catch (error) {
        console.error('Error fetching bill:', error);
        setError('Failed to fetch bill details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [billid]);


  const isCleared = bill?.isCleared; // Check if the bill is cleared

  // Handle Item Changes
  const handleItemChange = (index, event) => {
    const newItems = [...items];
    const { name, value } = event.target;

    // Update field based on input
    newItems[index][name] = value;

    const sellingPrice = parseFloat(newItems[index].sellingPrice) || 0;
    const discountPercentage = parseFloat(newItems[index].discountPercentage) || 0;

    const discountedPrice = sellingPrice - (sellingPrice * (discountPercentage / 100));
    newItems[index].discountedPrice = discountedPrice.toFixed(2);
    
    const quantity = parseFloat(newItems[index].quantity) || 0;
    newItems[index].totalPrice = (quantity * discountedPrice).toFixed(2);

    setItems(newItems);
    calculateTotalAmount(); // Recalculate total amount for the bill
  };

  // Add a New Item
  const addItem = () => {
    setItems([...items, { itemName: '', quantity: 0, sellingPrice: 0, discountPercentage: 0, totalPrice: 0}]);
  };

  // Delete the Last 
  const deleteItem = () => {
    setItems(items.slice(0, -1));
  };
  useEffect(()=>{
    const totalPaid = payments.reduce((acc, payment) => acc + (parseFloat(payment.amount) || 0), 0);
    const pending = payableAmount - totalPaid;
    setPendingAmount(pending);
    setCashPaymentAmount(pending);
    setOnlinePaymentAmount(pending);
  }, [payableAmount, payments]);

  useEffect(()=>{
    setPayableAmount(totalAmount);
  }, [totalAmount]);

  const calculateTotalAmount = () => {
    const total = items.reduce((acc, item) => acc + (parseFloat(item.totalPrice) || 0), 0);
    setTotalAmount(total.toFixed(2));
  };

  const handleShowOnlinePayment = () =>{
    setShowOnlinePayment(!showCashPayment);
    setShowCashPayment(false);
  };
  const handleShowCashPayment = () =>{
    setShowCashPayment(!showCashPayment);
    setShowOnlinePayment(false);
  };
  const handleAddPayment = async(amount, isCash, qrDetails = "")=>{
    const newPayment = {
      billId: billid,
      amount,
      isCash,
      status: "SUCCESS", // Assuming successful for now
      qrDetails,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/payments", newPayment);
      console.log("Payment Response:", response);

      if (response.status === 201) {
        const paymentId = response.data._id;

        // Update both payments and paymentIds state
        setPayments([...payments, newPayment]); // Add payment object
        setNewPaymentIds([...newPaymentIds, paymentId]); // Store the new payment ID

        alert(`Payment of ₹${amount} added successfully!`);
      } else {
        throw new Error("Failed to save payment.");
      }
    } catch (error) {
      console.error("Error adding payment:", error);
      alert("Error occurred while adding the payment.");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const updatedBillData = {
        products: items, // Array of product objects
        newPaymentIds,
        totalAmount: parseFloat(totalAmount),
        totalPayableAmount: parseFloat(payableAmount),
      };
  
      const response = await axios.put(`http://localhost:5000/api/bills/${billid}`, updatedBillData);
      console.log("Updated Bill:", response.data);
  
      alert("Bill updated successfully!");
    } catch (error) {
      console.error("Error updating bill:", error);
      alert("Failed to update the bill.");
    }
  };
  

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Add leading 0 if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  if (loading) return <p>Loading bill details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bill-details-container">
      <h2>Bill Details</h2>
      <p><strong>Invoice No:</strong> {bill._id}</p>
      <p><strong>Bill Date:</strong> {formatDate(bill.billDate)}</p>

      <form onSubmit={handleSubmit}>
      <div className="form-group form-row"> {/* Added form-row class */}
        <div className="form-field"> {/* Wrap name input in a div */}
        <label>Name:</label>
        <input
          type="text"
          value={bill.user?.name || ''}
          readOnly={isCleared}
        />
        </div>
        <div className="form-field"> {/* Wrap contact number input in a div */}
        <label>Contact No:</label>
        <input
          type="text"
          value={bill.user?.contactNo || ''}
          readOnly={isCleared}
        />
        </div>
        </div>

      {/* Items List */}
      <div className="item-list">
        <h3>Items</h3>
        <div className="item-header">
          <div>Item</div>
          <div>Qty</div>
          <div>Selling Price</div>
          <div>Discount %</div>
          <div>Discounted Price</div>
          <div>Total Price</div>
        </div>
        {items.map((item, index) => (
          <div key={index} className="item-row">
            <input
              type="text"
              name="itemName"
              value={item.itemName}
              onChange={(e) => handleItemChange(index, e)}
              readOnly={isCleared}
            />
            <input
              type="number"
              name="quantity"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, e)}
              readOnly={isCleared}
            />
            <input
              type="number"
              name="sellingPrice"
              value={item.sellingPrice}
              onChange={(e) => handleItemChange(index, e)}
              readOnly={isCleared}
            />
            <input
              type="number"
              name="discountPercentage"
              value={item.discountPercentage}
              onChange={(e) => handleItemChange(index, e)}
              readOnly={isCleared}
            />
            <input
              type="text"
              value={(item.sellingPrice - (item.sellingPrice * item.discountPercentage) / 100).toFixed(2)}
              readOnly
            />
            <input
              type="text"
              value={(item.totalPrice)}
              readOnly
            />
          </div>
        ))}
        {!isCleared && (
          <div className="item-buttons">
            <button type="button" className='add-item-button' onClick={addItem}>Add Item</button>
            <button type="button" className='delete-item-button' onClick={deleteItem}>Delete Item</button>
          </div>
        )}
      </div>

      {/* Total and Payable Amount */}
      <h3>Total Amount: ₹{totalAmount}</h3>
      <h3>
        Total Payable Amount: ₹
        <input
          type="number"
          value={payableAmount}
          onChange={(e) =>{
            setPayableAmount(e.target.value);
          }}
          readOnly={isCleared}
        />
      </h3>

      {/* Payments Section */}
      <div className="payments-section">
        {bill.payments.map((payment, index) => (
          <div key={index} className="payment-row">
            <strong>Date: </strong>{formatDate(payment.date)}
            <span>₹{payment.amount}</span>
          </div>
        ))}
      </div>

      {/* Current Pending Amount */}
      <h3>Current Pending Amount: ₹{pendingAmount}</h3>

      {/* Action Buttons
      <div className="payment-buttons">
        {!isCleared && (
          <>
            <button type="button">Add Payment</button>
            <button type="submit">Save Changes</button>
          </>
        )}
      </div> */}

      <div className="payment-buttons">
          <button type="button" onClick={handleShowOnlinePayment}>Pay Online</button>
          <button type="button" onClick={handleShowCashPayment}>Cash Payment</button>
        </div>
        {/* Online Payment Section */}
        {showOnlinePayment && (
          <div className="online-payment">
            <h3>Online Payment</h3>
            <input
              type="number"
              value={onlinePaymentAmount}
              onChange={(e) => setOnlinePaymentAmount(e.target.value)}
            />
            <button type="button"
              onClick={() => handleAddPayment(onlinePaymentAmount, false, "QR12345")}
            >
              Generate QR
            </button>
          </div>
        )}

        {/* Cash Payment Section */}
        {showCashPayment && (
          <div className="cash-payment">
            <h3>Cash Payment</h3>
            <input
              type="number"
              value={cashPaymentAmount}
              onChange={(e) => setCashPaymentAmount(e.target.value)}
            />
            <button type="button"
              onClick={() => handleAddPayment(cashPaymentAmount, true)}
            >
              Paid Cash
            </button>
          </div>
        )}

        <div className="payment-buttons">
          <button type="submit">Save Bill</button>
        </div>

        </form>
    </div>
  );
};

export default BillDetails;
