import { Request, Response } from 'express';
import * as appointmentService from '../services/appointment.service';

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const result = await appointmentService.createAppointment(req.body);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ 
      message: 'Error al crear la cita', 
      error: error.message 
    });
  }
};

export const getAppointmentsByInsured = async (req: Request, res: Response) => {
  try {
    const { insuredId } = req.params;
    
    if (!insuredId) {
      return res.status(400).json({ message: 'insuredId es requerido' });
    }
    
    const appointments = await appointmentService.getAppointmentsByInsured(insuredId);
    res.status(200).json(appointments);
  } catch (error: any) {
    console.error('Error getting appointments:', error);
    res.status(500).json({ 
      message: 'Error al obtener las citas', 
      error: error.message 
    });
  }
};