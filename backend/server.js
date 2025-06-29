import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import cors from 'cors';

import authRoutes from './routes/auth.route.js'
import connectDB from './libs/mongodb.js';

const app = express()
const PORT = process.env.PORT;
app.use(cors(
    {origin: "http://localhost:5173",
    credentials: true, }
));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/auth', authRoutes)



app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB()
}) 