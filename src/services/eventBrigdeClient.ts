import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { AppointmentRecord } from '../models/appointmentRequest';

const eventBridgeClient = new EventBridgeClient({});

export const publishToEventBridge = async (
  appointment: AppointmentRecord
): Promise<void> => {
  const command = new PutEventsCommand({
    Entries: [
      {
        EventBusName: process.env.EVENT_BUS_NAME!,
        Source: 'appointment.completed',
        DetailType: 'AppointmentConfirmed',
        Detail: JSON.stringify({
          appointmentId: appointment.appointmentId,
          insuredId: appointment.insuredId,
          scheduleId: appointment.scheduleId,
          countryISO: appointment.countryISO,
          status: 'completed',
          completedAt: new Date().toISOString()
        })
      }
    ]
  });

  await eventBridgeClient.send(command);
  console.log(`Evento enviado a EventBridge para: ${appointment.appointmentId}`);
};