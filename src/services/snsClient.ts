import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { AppointmentRecord } from '../models/appointmentRequest';

const snsClient = new SNSClient({});

export const publishToSNS = async (appointment: AppointmentRecord): Promise<void> => {
  const command = new PublishCommand({
    TopicArn: process.env.SNS_TOPIC_ARN!,
    Message: JSON.stringify(appointment),
    MessageAttributes: {
      countryISO: {
        DataType: 'String',
        StringValue: appointment.countryISO
      }
    }
  });

  await snsClient.send(command);
  console.log(`Mensaje enviado a SNS para país: ${appointment.countryISO}`);
};