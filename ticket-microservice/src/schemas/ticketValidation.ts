import { z } from "zod";
export const createTicketSchema = z.object({
  title: z.string().max(100).optional(),
  description: z.string().min(1, "Description is required").max(100, "Description should be less than 500 characters"),
  status: z.enum(["open", "closed"]).optional().default("open"),
  userId: z.string().min(1, "User ID is required"), 
  createdAt: z.date().optional(),
  messages: z.array(z.any().optional()).optional(), 
  priority:z.string().optional(),
  orderId:z.string().optional(),
  orderName:z.string().optional(),
});

//Ticket update schema (for updating status or messages)
export const updateTicketSchema = z.object({
  status: z.enum(["open", "closed"]),
  messages: z.array(z.string().optional()).optional(), 
});

 