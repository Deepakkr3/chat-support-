import { Router } from "express";
import {
  createTicket,
  getTicketById,
  updateTicket,
  deleteTicket,
  getTickets,
  getTicketByUserId,
  getAllActiveTickets,
} from "../controllers/ticketController";

const router = Router();

router.get("/tickets", getTickets);
router.post("/tickets", createTicket);
router.get("/tickets/:id", getTicketById);
router.put("/tickets/:id", updateTicket);
router.delete("/tickets/:id", deleteTicket);
router.get("/tickets/user/:userId", getTicketByUserId);
router.get("/tickets-active", getAllActiveTickets);

export default router;
