import mysql from 'mysql2/promise';

export class RdsRepository {
  private connectionConfig = {
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE,
  };

  async insertAppointment(payload: any, country: string) {
    const connection = await mysql.createConnection(this.connectionConfig);
    try {
      const query = `
        INSERT INTO appointments (appointment_id, insured_id, schedule_id, country, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const params = [
        payload.appointmentId,
        payload.insuredId,
        payload.scheduleId,
        country,
        'completed',
        new Date().toISOString(),
      ];

      await connection.execute(query, params);
    } finally {
      await connection.end();
    }
  }
}
