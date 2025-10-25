// import { db } from '../utils/db';
// import { Appointment } from '../models/appointments';
// import { v4 as uuidv4 } from 'uuid';

// export const createAppointment = async (data: Omit<Appointment, 'id' | 'appointment_id'>) => {
//   const appointment_id = uuidv4();
//   const [result] = await db.query(
//     `INSERT INTO appointments 
//       (appointment_id, schedule_id, insured_id, center_id, specialty_id, medic_id, scheduled_at, country_iso)
//      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//     [
//       appointment_id,
//       data.schedule_id,
//       data.insured_id,
//       data.center_id,
//       data.specialty_id,
//       data.medic_id,
//       data.scheduled_at,
//       data.country_iso,
//     ]
//   );
//   return { appointment_id, ...data };
// };

// export const getAppointmentsByInsured = async (insuredId: string) => {
//   const [rows] = await db.query(
//     `SELECT * FROM appointments WHERE appointment_id = ?`,
//     [insuredId]
//   );
//   return rows;
// };