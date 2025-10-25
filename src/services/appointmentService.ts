import { v4 as uuidv4 } from 'uuid';
import { AppointmentRequest, AppointmentRecord } from '../models/appointmentRequest';
import { DynamoRepository } from '../repositories/dynamoRepository';
import { publishToSNS } from './snsClient';

export class AppointmentService {
  private dynamoRepo: DynamoRepository;

  constructor() {
    this.dynamoRepo = new DynamoRepository();
  }

  async createAppointment(request: AppointmentRequest): Promise<AppointmentRecord> {
    if (!/^\d{5}$/.test(request.insuredId)) {
      throw new Error('insuredId debe tener exactamente 5 dígitos');
    }

    if (!['PE', 'CL'].includes(request.countryISO)) {
      throw new Error('countryISO debe ser PE o CL');
    }

    const appointmentRecord: AppointmentRecord = {
      appointmentId: uuidv4(),
      insuredId: request.insuredId,
      scheduleId: request.scheduleId,
      countryISO: request.countryISO,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.dynamoRepo.saveAppointment(appointmentRecord);
    console.log(`Guardado en DynamoDB: ${appointmentRecord.appointmentId}`);

    await publishToSNS(appointmentRecord);
    console.log(`Enviado a SNS para procesamiento en ${appointmentRecord.countryISO}`);

    return appointmentRecord;
  }

  async getAppointmentsByInsured(insuredId: string): Promise<AppointmentRecord[]> {
    return await this.dynamoRepo.getAppointmentsByInsured(insuredId);
  }

  async updateAppointmentStatus(
    appointmentId: string,
    status: 'completed' | 'failed'
  ): Promise<void> {
    await this.dynamoRepo.updateAppointmentStatus(appointmentId, status);
    console.log(`Estado actualizado a ${status}: ${appointmentId}`);
  }
}