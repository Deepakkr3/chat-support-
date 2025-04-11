/***
 * for validation of message creation
 * @author: {Deepak Kumar} <deepak.kumar@suhora.com>
 */
import { string, z } from "zod";
const messageSchema = z.union([
  z.string().max(10, 'Message must be less than 100 characters'),
  z.any(),
]);
// Message creation schema
export const createMessageSchema = z.object({
  ticketId: z.string().min(1, "Ticket ID is required"), 
  userId: z.string().min(1, "user id required"),
  message: string().max(100).optional(),
  createdAt: z.date().optional(),
});




