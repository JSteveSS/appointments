export interface AppointmentRequest {
  insuredId: string;
  scheduleId: number;
  countryISO: 'PE' | 'CL';
}

export interface AppointmentRecord extends AppointmentRequest {
  appointmentId: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleDetails {
  scheduleId: number;
  centerId: number;
  specialtyId: number;
  medicId: number;
  scheduledAt: string;
}