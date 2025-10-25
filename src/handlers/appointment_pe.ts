import { SQSHandler, SQSRecord } from 'aws-lambda';
import { RdsService } from '../services/rdsService';
import { publishToEventBridge } from '../services/eventBrigdeClient';
import { AppointmentRecord } from '../models/appointmentRequest';

const rdsService = new RdsService();

export const handler: SQSHandler = async (event) => {
  console.log(`🇵🇪 Lambda PE: Procesando ${event.Records.length} mensajes`);

  const failedMessageIds: string[] = [];

  for (const record of event.Records) {
    try {
      const snsMessage = JSON.parse(record.body);
      const appointment: AppointmentRecord = JSON.parse(snsMessage.Message);

      console.log(`Procesando appointment PE: ${appointment.appointmentId}`);

      if (appointment.countryISO !== 'PE') {
        console.warn(`Mensaje no es de PE, ignorando: ${appointment.countryISO}`);
        continue;
      }

      await rdsService.saveAppointmentToRDS(appointment);
      console.log(`Guardado en RDS PE: ${appointment.appointmentId}`);

      await publishToEventBridge(appointment);
      console.log(`Confirmación enviada a EventBridge: ${appointment.appointmentId}`);

    } catch (error: any) {
      console.error(`Error procesando mensaje PE:`, error);
      failedMessageIds.push(record.messageId);
    }
  }

  if (failedMessageIds.length > 0) {
    return {
      batchItemFailures: failedMessageIds.map(id => ({ itemIdentifier: id }))
    };
  }
};