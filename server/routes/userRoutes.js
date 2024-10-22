import express from 'express';
import { getAllUsers, addUser } from '../controllers/userController.js';

const router = express.Router();

// Route to fetch all users
// router.get('/', (req, res)=>{
//     res.send("Server running at port 5000");
// })
router.get('/', getAllUsers);

// Route to add a new user
router.post('/', addUser);

export default router;
