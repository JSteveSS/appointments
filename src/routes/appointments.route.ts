import { Router } from 'express';
import { createAppointment, getAppointmentsByInsured } from '../controllers/appointments.controller';

const router = Router();

router.post('/', createAppointment);
router.get('/:insuredId', getAppointmentsByInsured);

export default router;