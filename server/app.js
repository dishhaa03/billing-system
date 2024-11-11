import express from 'express';
import cors from 'cors';


const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    // origin: 'http://localhost:3000',
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true, limit: "16kb"}))


app.get('/', (req, res)=>{
    res.send("Server running at port 5000");
})

import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import billRoutes from './routes/billRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
app.use('/api/users', userRoutes);
app.use('/', userRoutes);
app.use(productRoutes);
app.use(billRoutes);
app.use(paymentRoutes);


export { app }
