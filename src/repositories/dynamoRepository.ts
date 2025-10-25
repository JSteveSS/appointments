import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { AppointmentRecord } from '../models/appointmentRequest';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export class DynamoRepository {
  private tableName = process.env.DYNAMO_TABLE!;

  async saveAppointment(appointment: AppointmentRecord): Promise<void> {
    await docClient.send(new PutCommand({
      TableName: this.tableName,
      Item: appointment
    }));
  }

  async getAppointmentsByInsured(insuredId: string): Promise<AppointmentRecord[]> {
    const result = await docClient.send(new QueryCommand({
      TableName: this.tableName,
      IndexName: 'InsuredIdIndex',
      KeyConditionExpression: 'insuredId = :insuredId',
      ExpressionAttributeValues: {
        ':insuredId': insuredId
      },
      ScanIndexForward: false
    }));

    return (result.Items || []) as AppointmentRecord[];
  }

  async updateAppointmentStatus(
    appointmentId: string,
    status: 'pending' | 'completed' | 'failed'
  ): Promise<void> {
    await docClient.send(new UpdateCommand({
      TableName: this.tableName,
      Key: { appointmentId },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': status,
        ':updatedAt': new Date().toISOString()
      }
    }));
  }

  async getAppointmentById(appointmentId: string): Promise<AppointmentRecord | null> {
    const result = await docClient.send(new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: 'appointmentId = :appointmentId',
      ExpressionAttributeValues: {
        ':appointmentId': appointmentId
      }
    }));

    return result.Items?.[0] as AppointmentRecord || null;
  }
}