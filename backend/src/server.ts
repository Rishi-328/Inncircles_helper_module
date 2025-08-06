import app from './app';
import {connectDB} from './config/db';
import dotenv from 'dotenv';
dotenv.config();

connectDB().then(() => {
    const PORT = process.env.PORT;
    app.listen(PORT,() => {
        console.log(`Server is running on port ${PORT}`);
    })
})
