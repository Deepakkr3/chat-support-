
/***
 * this file contains all business logic related to messages
 * @author: {Deepak Kumar} <deepak.kumar@suhora.com>
 */
import Message, { IMessage } from "../models/Message";
import Ticket from "../models/Ticket";
//create message service
export const createMessage = async (data: {
  ticketId: string;
  message?: string;
  createdAt: Date;
  fileUrl?: string;
}) => {
  const ticket = await Ticket.findById(data.ticketId);
  if (!ticket) {
    console.log("Ticket not found"); 
    return []; 
  }
  const message = await Message.create(data);
  await Ticket.findByIdAndUpdate(data.ticketId, {
    $push: { messages: message._id },
  });
  return message;
};
//get message by ticket id
export const getMessagesByTicketId = async (ticketId: string) => {
  return await Message.find({ ticketId }).sort({ createdAt: 1 });
};
