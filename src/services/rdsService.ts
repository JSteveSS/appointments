import { db } from '../utils/db';
import { AppointmentRecord } from '../models/appointmentRequest';

export class RdsService {
  async saveAppointmentToRDS(appointment: AppointmentRecord): Promise<void> {
    const query = `
      INSERT INTO appointments 
        (appointment_id, insured_id, schedule_id, country_iso, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      appointment.appointmentId,
      appointment.insuredId,
      appointment.scheduleId,
      appointment.countryISO,
      'completed',
      appointment.createdAt,
      appointment.updatedAt
    ];

    try {
      await db.query(query, params);
      console.log(`Appointment guardado en RDS: ${appointment.appointmentId}`);
    } catch (error: any) {
      console.error('Error guardando en RDS:', error);
      throw new Error(`Error al guardar en RDS: ${error.message}`);
    }
  }

  async getAppointmentByIdFromRDS(appointmentId: string): Promise<any> {
    const query = 'SELECT * FROM appointments WHERE appointment_id = ?';
    const [rows] = await db.query(query, [appointmentId]);
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  }
}