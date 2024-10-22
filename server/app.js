import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    // origin: 'http://localhost:3000',
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))


app.get('/', (req, res)=>{
    res.send("Server running at port 5000");
})

import userRoutes from './routes/userRoutes.js';
app.use('/api/users', userRoutes);
app.use(productRoutes);
app.use(billRoutes);


export { app }
