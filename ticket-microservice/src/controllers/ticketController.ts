import { Request, Response } from "express";
import * as TicketService from "../services/ticketService";
import { createTicketSchema, updateTicketSchema } from "../schemas/ticketValidation";
import Message from "../models/Message";
import {z} from "zod";
export const createTicket = async (req: Request, res: Response) => {
  const validationResult = createTicketSchema.safeParse(req.body);
  console.log(validationResult);
  if (!validationResult.success) {
    return res.status(400).json({ "success":false,"message":"unprocessable entity",errors:validationResult.error });
  }
  try {
    const { orderId, orderName } = req.body;
    if(orderId || orderName){
      req.body.priority="high";
    }
    const ticket = await TicketService.createTicket(req.body);
    res.status(201).json(ticket);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.issues);
    }else{
      res.status(500).json({ error: error });
    } 
  }
};
export const getTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await TicketService.getTickets();
    if (tickets.length == 0) {
      return res.status(404).json({ message: "No tickets found" });
    }
    res.status(200).json({ length: tickets.length, tickets });
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};
export const getTicketById = async (req: Request, res: Response) => {
  try {
    const ticket = await TicketService.getTicketById(req.params.id);
    if (ticket) {
      res.status(200).json({ ticket });
    } else {
      return res.status(404).json({ message: "Ticket not found" });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};
export const updateTicket = async (req: Request, res: Response) => {
  const validationResult = updateTicketSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.message });
  }
  try {
    const findTicketById = await TicketService.getTicketById(req.params.id);
    if (!findTicketById) {
      res.status(404).json({ message: " ticket not found" });
      return;
    }
    const ticket = await TicketService.updateTicket(req.params.id, req.body);
    res.status(200).json({ message: "updated", ticket });
  } catch (error: any) {
    return res.status(500).json({ error: error });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
  const ticketId = req.params.id;
  if (!ticketId || ticketId == null) {
    res.send("plese enter vailid ticket id");
    return;
  }
  try {
    const ticket = await TicketService.deleteTicket(ticketId);
    if (ticket) {
      res.json({ status: "success", Message: "Ticket deleted successfully" });
    } else {
      res.json({ status: "failed", message: "Failed to delete ticket" });
    }
  } catch (error: any) {
    res.status(500).json({ ststus: "failed", error: error, x: "erre" });
  }
};
export const getTicketByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const tickets = await TicketService.getTicketByUserId(userId);
    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found for this user" });
    }
    return res.status(200).json({ length: tickets.length, tickets });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving tickets", error });
  }
};
export const getAllActiveTickets = async (req: Request, res: Response) => {
  const activeTickets = await TicketService.getAllActiveTickets();
  if (!activeTickets || activeTickets.length === 0) {
    return res.status(404).json({ message: "No active tickets found" });
  }
  return res.json({ length: activeTickets.length, activeTickets });
};
