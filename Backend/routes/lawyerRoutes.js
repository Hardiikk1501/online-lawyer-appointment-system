import express from 'express';
import {
    getLawyerDashboard,
    GetLawyerProfile,
    getAppointmentRequests,
    updateAppointmentStatus,
    getProfile,
     updateProfile
  
} from '../controllers/lawyerController.js';
import { protect } from '../middleware/authMiddleware.js';
const LawyerRouter = express.Router();

// ✅ Get lawyer dashboard
LawyerRouter.get('/dashboard', protect, getLawyerDashboard);

LawyerRouter.get("/profile", protect, getProfile);

//get appointment requests which is send by client
LawyerRouter.get('/appointments', getAppointmentRequests);

//approve or reject appointment by lawyer
LawyerRouter.put('/status/:appointmentId', protect, updateAppointmentStatus);
//get and update lawyer profile
LawyerRouter.get("/profile", protect, getProfile);
LawyerRouter.put("/profile", protect, updateProfile);
//get lawyer profile
LawyerRouter.get('/:id', GetLawyerProfile);


export default LawyerRouter;
