import express from 'express';
import {
getDashboardStats,
getAllClients,
deleteClient,
getAllLawyers,
deleteLawyer,
getAllAppointments,
deleteAppointment,
getAdminReport,
exportCSV,
exportPDF,
getPendingLawyers ,
 approveLawyer ,
 rejectLawyer
} from '../controllers/adminController.js';

const adminRouter = express.Router();


//  Admin Dashboard Stats
adminRouter.get('/dashboard', getDashboardStats);
//  Get All Clients
adminRouter.get('/clients', getAllClients);
//  Delete a Client
adminRouter.delete('/clients/:id', deleteClient);
//  Get All Lawyers
adminRouter.get('/lawyers', getAllLawyers);
//  Delete a Lawyer
adminRouter.delete('/lawyers/:id', deleteLawyer);
//  Get All Appointments
adminRouter.get('/appointments',getAllAppointments);
//  Delete an Appointment
adminRouter.delete('/appointments/:id', deleteAppointment);

//reports
adminRouter.get("/report", (req, res, next) => {
  
  next();
}, getAdminReport);


// 📥 EXPORT APIs
adminRouter.get("/export/csv", exportCSV);
adminRouter.get("/export/pdf", exportPDF);


// Lawyer Approval
adminRouter.get("/lawyers/pending", getPendingLawyers);
adminRouter.post("/lawyers/:id/approve", approveLawyer);
adminRouter.post("/lawyers/:id/reject", rejectLawyer);

export default adminRouter;

