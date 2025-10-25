// import { db } from '../utils/db';
// import { Appointment } from '../models/appointmentRequest';
// import { ResultSetHeader } from 'mysql2';

// export async function createAppointment(appointment: Appointment) {
//   const [result] = await db.execute<ResultSetHeader>(
//     `INSERT INTO appointments 
//     (appointment_id, schedule_id, insured_id, center_id, specialty_id, medic_id, scheduled_at, country_iso)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//     [
//       appointment.appointment_id,
//       appointment.schedule_id,
//       appointment.insured_id,
//       appointment.center_id,
//       appointment.specialty_id,
//       appointment.medic_id,
//       appointment.scheduled_at,
//       appointment.country_iso
//     ]
//   );

//   return { id: result.insertId, ...appointment };
// }

// export async function getAppointmentsByInsured(insuredId: string) {
//   const [rows] = await db.execute(
//     'SELECT * FROM appointments WHERE insured_id = ?',
//     [insuredId]
//   );
//   return rows;
// }