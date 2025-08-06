import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helperRoutes from './routes/helper.routes';


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/helpers', helperRoutes);

export default app;
