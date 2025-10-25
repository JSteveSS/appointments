import { APIGatewayProxyHandler, SQSHandler, SQSRecord } from 'aws-lambda';
import { AppointmentService } from '../services/appointmentService';
import { AppointmentRequest } from '../models/appointmentRequest';

const appointmentService = new AppointmentService();

export const handler: APIGatewayProxyHandler = async (event: any) => {
  try {
    const method = event.requestContext?.http?.method || event.httpMethod;
    
    console.log('Request recibido:', {
      method,
      path: event.path,
      body: event.body
    });

    if (method === 'POST') {
      const body: AppointmentRequest = JSON.parse(event.body || '{}');
      
      if (!body.insuredId || !body.scheduleId || !body.countryISO) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'Faltan campos requeridos: insuredId, scheduleId, countryISO'
          })
        };
      }

      const result = await appointmentService.createAppointment(body);
      
      return {
        statusCode: 201,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Cita creada exitosamente',
          data: result
        })
      };
    }

    if (method === 'GET') {
      const insuredId = event.pathParameters?.insuredId;
      
      if (!insuredId) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'insuredId es requerido' })
        };
      }

      const appointments = await appointmentService.getAppointmentsByInsured(insuredId);
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insuredId,
          count: appointments.length,
          appointments
        })
      };
    }

    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Método no permitido' })
    };

  } catch (error: any) {
    console.error('Error:', error);
    
    return {
      statusCode: error.message.includes('debe') ? 400 : 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message || 'Error interno del servidor',
        error: error.stack
      })
    };
  }
};

const appointmentServiceForSQS = new AppointmentService();

export const handleResponse: SQSHandler = async (event) => {
  console.log(`Procesando ${event.Records.length} confirmaciones`);

  for (const record of event.Records) {
    try {
      const eventBridgeMessage = JSON.parse(record.body);
      const detail = eventBridgeMessage.detail;

      console.log('Confirmación recibida:', detail);

      await appointmentServiceForSQS.updateAppointmentStatus(
        detail.appointmentId,
        'completed'
      );

      console.log(`Status actualizado a completed: ${detail.appointmentId}`);

    } catch (error) {
      console.error('Error procesando confirmación:', error);
      throw error;
    }
  }
};