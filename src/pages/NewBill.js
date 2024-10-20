import React, { useState } from 'react';
import './NewBill.css'; // Import your CSS file

const NewBill = () => {
  const [billId] = useState(Date.now().toString()); // Unique bill ID
  const [customerName, setCustomerName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [items, setItems] = useState([{ item: '', quantity: '', quantityType: '', sellingPrice: '', discountPercentage: '', discountedPrice: '', totalPrice: '' }]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Function to add a new item row
  const addItem = () => {
    setItems([...items, { item: '', quantity: '', quantityType: '', sellingPrice: '', discountPercentage: '', discountedPrice: '', totalPrice: '' }]);
  };

  // Function to handle changes in item fields
  const handleItemChange = (index, event) => {
    const newItems = [...items];
    const { name, value } = event.target;

    // Update field based on input
    newItems[index][name] = value;

    // Calculate discounted price and total price
    const sellingPrice = parseFloat(newItems[index].sellingPrice) || 0;
    const discountPercentage = parseFloat(newItems[index].discountPercentage) || 0;

    // Calculate discounted price
    const discountedPrice = sellingPrice - (sellingPrice * (discountPercentage / 100));
    newItems[index].discountedPrice = discountedPrice.toFixed(2);
    
    // Calculate total price
    const quantity = parseFloat(newItems[index].quantity) || 0;
    newItems[index].totalPrice = (quantity * discountedPrice).toFixed(2);

    setItems(newItems);
    calculateTotalAmount(); // Recalculate total amount for the bill
  };

  // Function to calculate total amount of the bill
  const calculateTotalAmount = () => {
    const total = items.reduce((acc, item) => acc + (parseFloat(item.totalPrice) || 0), 0);
    setTotalAmount(total.toFixed(2));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission logic here (e.g., saving to backend)
    console.log({
      billId,
      customerName,
      contactNo,
      items,
      totalAmount,
    });
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
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
            />
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
        </div>
        </div>


        <div className="item-list">
          <h3>Items</h3>
          <div className="item-header">
            <div>Item</div>
            <div>Qty</div>
            <div>Unit</div>
            <div>Selling Price</div>
            <div>Discount %</div>
            <div>Discounted Price</div>
            <div>Total Price</div>
          </div>
          {items.map((item, index) => (
            <div key={index} className="item-row">
              <input type="text" name="item" placeholder="Item" value={item.item} onChange={(e) => handleItemChange(index, e)} required />
              <input type="number" name="quantity" placeholder="Qty" value={item.quantity} onChange={(e) => handleItemChange(index, e)} required />
              <select 
                name="quantityType" 
                value={item.quantityType} 
                onChange={(e) => handleItemChange(index, e)}
                >
                <option value="" disabled>Select unit</option>
                <option value="pc">pc</option>
                <option value="meter">meter</option>
                </select>
              <input type="number" name="sellingPrice" placeholder="Selling Price" value={item.sellingPrice} onChange={(e) => handleItemChange(index, e)} required />
              <input type="number" name="discountPercentage" placeholder="Discount %" value={item.discountPercentage} onChange={(e) => handleItemChange(index, e)} />
              <input type="text" name="discountedPrice" placeholder="Discounted Price" value={item.discountedPrice} readOnly />
              <input type="text" name="totalPrice" placeholder="Total Price" value={item.totalPrice} readOnly />
            </div>
          ))}
          <button type="button" onClick={addItem} className="add-item-button">Add Item</button>
        </div>

        <h3>Total Amount: ₹{totalAmount}</h3>

        <div className="payment-buttons">
          <button type="submit">Pay Online</button>
          <button type="button">Cash Payment</button>
        </div>
      </form>
    </div>
  );
};

export default NewBill;
