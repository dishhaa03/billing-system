import { User } from '../model/user.model.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
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
