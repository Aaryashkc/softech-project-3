import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js'
import websiteRoutes from './routes/website.route.js';
import dataRoutes from './routes/data.route.js';
import InquiryRoutes from './routes/inquiry.route.js';


import connectDB from './libs/mongodb.js';

const app = express()
const PORT = process.env.PORT || 5000;
app.use(cors(
    {origin: ["http://localhost:5173", "https://softech-project-3.vercel.app"],
    credentials: true, }
));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/auth', authRoutes)
app.use('/api/website', websiteRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/inquiry', InquiryRoutes);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB()
});