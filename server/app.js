import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoutes from './routes/user.route.js';
import courseRoutes from './routes/course.route.js';
import paymentRoutes from './routes/payment.route.js';
import libraryRoutes from './routes/library.route.js';
const app = express();
import errorMiddleware from './middlewares/error.middleware.js';
import miscRoutes from './routes/miscellaneous.route.js';

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials:true,
}));


app.use(cookieParser());

app.use(morgan('dev'));

app.use('/ping',(req,res)=>{
    res.send('pong');
});


//routes of 3 modules
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/courses',courseRoutes);
app.use('/api/v1/payments',paymentRoutes);
app.use('/api/v1/library',libraryRoutes);
app.use('/api/v1', miscRoutes);


app.all(/.*/,(req,res)=>{
   res.status(404).send('OOPS!! 404 page not found');
});

app.use(errorMiddleware);

export default app;
