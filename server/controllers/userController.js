import { User } from '../model/user.model.js';
import { Bill } from '../model/bill.model.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ updatedAt: -1 });
    // console.log(users);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserInList = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default values if not provided

  try {
    const users = await User.find()
      .sort({ updatedAt: -1 }) // Sort by the latest update
      .skip((page - 1) * limit) // Skip users for previous pages
      .limit(parseInt(limit)); // Limit the result to 10 users

    const totalUsers = await User.countDocuments(); // Get the total user count

    res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getBillsByUserId = async (req, res) => {
  const { userId } = req.params; 

  try {
    const bills = await Bill.find({ user: userId })
    .populate('products payments')
    .sort({ updatedAt: -1 }); 
    res.status(200).json(bills); 
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ error: 'Failed to fetch bills.' });
  }
};

// Add a new user
export const addUser = async (req, res) => {
  const { name, contactNo } = req.body;
  try {
    const newUser = new User({
      name,
      contactNo,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add user' });
  }
};
