import express from 'express';
import dotenv from 'dotenv';
import appointmentRouter from './routes/appointments.route';

dotenv.config();
const app = express();

app.use(express.json());
app.use('/appointments', appointmentRouter);

app.listen(3000, () => console.log('Server running on port 3000'));
