/***
 * this file contains all business logic related to tickets
 * @author: {Deepak Kumar} <deepak.kumar@suhora.com>
 */
import { count } from "console";
import Ticket, { ITicket } from "../models/Ticket";
import { io } from "./../server";
/***
 * this function is used to get all tickets based on user id
 */
export const getTicketByUserId = async (userId: String) => {
  const tickets = await Ticket.find({ userId }).populate("messages").sort({ createdAt: -1 });

  return tickets;
};
/**
 * this function is used to create a ticket
 */
export const createTicket = async (data: ITicket) => {
  const ticketresponce = await Ticket.create(data);
  const numberOfTicket = await Ticket.find().countDocuments();
  console.log(ticketresponce);

  io.emit("newTicketNotification", {
    count: numberOfTicket,
    ticketId: ticketresponce._id,
    title: ticketresponce.title,
    description: ticketresponce.description,
    status: ticketresponce.status,
    createdAt: ticketresponce.createdAt,
    name: "xcffff",
  });
  return ticketresponce;
};
/**
 * @returns all active tickets
 */
export const getAllActiveTickets = async () => {
  const tickets = await Ticket.find({ status: { $ne: "closed" } })
    .populate("messages")
    .sort({ createdAt: -1 });
  // console.log("Active tickets", tickets, "+++++");

  if (tickets.length == 0 || tickets == null) {
    return [];
  }
  return tickets;
};
/**
 * @returns all tickets
 */
export const getTickets = async () => {
  const tickets= await Ticket.find().populate("messages").sort({ createdAt: -1 });
  if(tickets.length == 0) {
    return [];
  }
  else{
    return tickets;
  }
};
/**
 * @param ticket id
 * @returns ticket
 */
export const getTicketById = async (id: string) => {
  const tickets= await Ticket.findById(id).populate("messages");
  if(!tickets) {
    return [];
  }
  else{
    return tickets;
  }
};
export const updateTicket = async (id: string, data: Partial<ITicket>) => {
  return await Ticket.findByIdAndUpdate(id, data, { new: true });
};
export const deleteTicket = async (id: string) => {
  return await Ticket.findByIdAndDelete({ _id: id });
};
