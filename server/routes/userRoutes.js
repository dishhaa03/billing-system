import express from 'express';
import { getAllUsers, addUser, getUserInList, getBillsByUserId } from '../controllers/userController.js';

const router = express.Router();

// Route to fetch all users
// router.get('/', (req, res)=>{
//     res.send("Server running at port 5000");
// })
router.get('/', getAllUsers);

// Route to add a new user
router.post('/', addUser);

router.get('/api/users-list', getUserInList);
router.get('/api/user/:userId', getBillsByUserId);

export default router;
