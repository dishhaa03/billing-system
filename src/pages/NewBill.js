import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NewBill.css'; 
import { useNavigate } from 'react-router-dom';

const NewBill = () => {
  const [billId] = useState(Date.now().toString()); // Unique bill ID
  const [customerName, setCustomerName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [users, setUsers] = useState([]);
  const [userid, setUserId] = useState(null);
  const [items, setItems] = useState([{ item: '', quantity: '',sellingPrice: '', discountPercentage: '', discountedPrice: '', totalPrice: '' }]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [payableAmount, setPayableAmount] = useState(0);
  const [isNewName, setIsNewName] = useState(false);
  const [payments, setPayments] = useState([]); // Store payment objects
  const [paymentIds, setPaymentIds] = useState([]); // Store payment IDs

  // For payments:
  const [showOnlinePayment, setShowOnlinePayment] = useState(false);
  const [showCashPayment, setShowCashPayment] = useState(false);

  const [onlinePaymentAmount, setOnlinePaymentAmount] = useState(payableAmount);
  const [cashPaymentAmount, setCashPaymentAmount] = useState(payableAmount);

  const navigate = useNavigate();

  // Function to add a new item row
  useEffect(() => {
    axios.get('http://localhost:5000/api/users', {
      proxy:{
        host: 'localhost',
        port: 5000
      }
    })
    .then((response) =>{
      setUsers(response.data);
    } )
    .catch((error) => console.error('Failed to fetch users', error));
  },[]);

  useEffect(() => {
    setPayableAmount(totalAmount); // Sync payable amount with total initially
  }, [totalAmount]);

  useEffect(()=>{
    setCashPaymentAmount(payableAmount);
    setOnlinePaymentAmount(payableAmount);
  }, [payableAmount]);

  const addItem = () => {
    setItems([...items, { item: '', quantity: '', sellingPrice: '', discountPercentage: '', discountedPrice: '', totalPrice: '' }]);
  };

  const deleteItem = ()=>{
    if (items.length === 0) {
      return;
    }
    // Remove the last item from the state
    setItems((prevItems) => prevItems.slice(0, -1));
  }

  const handleShowOnlinePayment = () =>{
    setShowOnlinePayment(!showCashPayment);
    setShowCashPayment(false);
  } 
  const handleShowCashPayment = () =>{
    setShowCashPayment(!showCashPayment);
    setShowOnlinePayment(false);
  } 

  const handleNameChange = (e) => {
    const inputName = e.target.value;
    setCustomerName(inputName);

    // Find the user matching the input
    const selectedUser = users.find((user) => user.name === inputName);
    setUserId(selectedUser?._id);
    if (selectedUser) {
      setContactNo(selectedUser.contactNo); // Autofill contact number
      setIsNewName(false);
    } else {
      setContactNo(''); // Clear contact number if no match
      setIsNewName(true);
    }
  };

  // Handle adding new user
  const handleAddUser = () => {
    axios.post('http://localhost:5000/api/users', { name: customerName, contactNo })
      .then((response) =>{
        setUsers([...users, response.data]);
        setUserId(response.data._id);
        alert('User added successfully');
        setIsNewName(false);
      })
      .catch((error) => console.error('Failed to add user', error));
  };

  // Function to handle changes in item fields
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

  const handleAddPayment = async (amount, isCash, qrDetails = "") => {
    const newPayment = {
      billId: null,
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
        setPaymentIds([...paymentIds, paymentId]); // Store the new payment ID

        alert(`Payment of ₹${amount} added successfully!`);
      } else {
        throw new Error("Failed to save payment.");
      }
    } catch (error) {
      console.error("Error adding payment:", error);
      alert("Error occurred while adding the payment.");
    }
  };

  // Function to calculate total amount of the bill
  const calculateTotalAmount = () => {
    const total = items.reduce((acc, item) => acc + (parseFloat(item.totalPrice) || 0), 0);
    setTotalAmount(total.toFixed(2));
  };

  const calculateTotalPaidAmount = () => {
    return payments.reduce((total, payment) => total + Number(payment.amount), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log({
      billId,
      customerName,
      contactNo,
      items,
      totalAmount,
      payableAmount,
      payments,
    });
  
    try {
      const totalPaidAmount = calculateTotalPaidAmount();
      const pendingAmount = payableAmount - totalPaidAmount;
      const isCleared = totalPaidAmount >= payableAmount;

      console.log(`Total Paid: ₹${totalPaidAmount}, Pending: ₹${pendingAmount}`);

      // Step 1: Send all items to the backend and receive product IDs
      const productPromises = items.map((item) =>
        axios.post('http://localhost:5000/api/products', {
          itemName: item.item,
          quantity: item.quantity,
          sellingPrice: item.sellingPrice,
          discountPercentage: item.discountPercentage || 0,
          discountedPrice: item.discountedPrice,
          totalPrice: item.totalPrice,
        })
      );
  
      const productResponses = await Promise.all(productPromises);
      const productIds = productResponses.map((res) => res.data._id);
  
      console.log('Product IDs:', productIds);
  
      // Step 2: Create the bill with the product IDs and payment information
      const billPayload = {
        user: userid, 
        products: productIds,
        totalAmount: parseFloat(totalAmount),
        totalPayableAmount: parseFloat(payableAmount),
        pendingAmount: pendingAmount, // Assuming no payments made yet
        payments: paymentIds, // Array of payment ids
        billDate: new Date().toISOString(),
        isPending: true, // Default as pending
        isCleared: isCleared, // Not cleared initially
      };
  
      const billResponse = await axios.post('http://localhost:5000/api/bills', billPayload);
  
      if (billResponse.status === 201) {
        const savedBill = billResponse.data;
        console.log("Bill saved successfully:", savedBill);
  
        // Step 3: Update products and payments with the bill ID
        const updatePayload = {
          billId: savedBill._id,
          productIds,
          paymentIds,
          userId: userid,
          totalAmount: parseFloat(payableAmount),
          pendingAmount: parseFloat(pendingAmount),
        };
  
        const updateResponse = await axios.post(
          "http://localhost:5000/api/bills/update-bill-ids",
          updatePayload
        );
  
        if (updateResponse.status === 200) {
          alert("Bill saved and references updated successfully!");
          navigate('/bills');
        } else {
          throw new Error("Failed to update product and payment references.");
        }
      } else {
        throw new Error("Failed to save bill.");
      }
    } catch (error) {
      console.log('Error saving bill:', error);
      alert('Error occurred while saving the bill.');
    }
  };

  return (
    <div className="new-bill-container">
      <form onSubmit={handleSubmit}>
        <div className="bill-header">
          <h2>Shagun Collection</h2>
          <p>Invoice No: {billId} Date: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bill-details">
        <h3>Details of Receiver</h3>
        <div className="form-group form-row"> {/* Added form-row class */}
            <div className="form-field"> {/* Wrap name input in a div */}
            <label>Name:</label>
            <input
                type="text"
                onChange={handleNameChange}
                list="user-suggestions"
                required
            />
            <datalist id="user-suggestions">
              {users.map((user) => (
                <option key={user._id} value={user.name} />
              ))}
            </datalist>
            </div>
            <div className="form-field"> {/* Wrap contact number input in a div */}
            <label>Contact No:</label>
            <input
                type="text"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                required
            />
            </div>
            <button className="add-item-button" type="button" onClick={handleAddUser} disabled={!isNewName}>Add Name</button>
        </div>
        </div>


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
              <input type="text" name="item" placeholder="Item" value={item.item} onChange={(e) => handleItemChange(index, e)} required />
              <input type="number" name="quantity" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, e)} required />
              <input type="number" name="sellingPrice" placeholder="Selling Price" value={item.sellingPrice} onChange={(e) => handleItemChange(index, e)} required />
              <input type="number" name="discountPercentage" placeholder="Discount %" value={item.discountPercentage} onChange={(e) => handleItemChange(index, e)} />
              <input type="text" name="discountedPrice" placeholder="Discounted Price" value={item.discountedPrice} readOnly />
              <input type="text" name="totalPrice" placeholder="Total Price" value={item.totalPrice} readOnly />
            </div>
          ))}
          <button type="button" onClick={deleteItem} className="delete-item-button">Delete Item</button>
          <button type="button" onClick={addItem} className="add-item-button">Add Item</button>
        </div>

        <h3>Total Amount: ₹{totalAmount}</h3>

        <h3>Total Payable Amount: ₹ <input
            type="number"
            value={payableAmount}
            onChange={(e) => setPayableAmount(e.target.value)}
            required
          />
        </h3>

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

export default NewBill;
