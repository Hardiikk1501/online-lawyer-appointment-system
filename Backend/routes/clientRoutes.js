import express from 'express';  
import{
  getLawyers,
  sendAppointmentRequest,
  getClientProfile,
  getClientAppointments,
  cancelAppointment,
  updateClientProfile
} from '../controllers/clientController.js';
import { protect } from '../middleware/authMiddleware.js';
const clientRouter = express.Router();

clientRouter.get('/lawyers', getLawyers);
clientRouter.get('/profile', protect, getClientProfile);
clientRouter.get('/appointments', protect, getClientAppointments);  
clientRouter.post('/create-appointment', protect, sendAppointmentRequest);
clientRouter.delete('/appointments/cancel/:id', protect, cancelAppointment);
clientRouter.put('/profile', protect, updateClientProfile);
export default clientRouter;