/***
 * this file is the main entry point for the server
 * it creates a server and listens on a port
 * @author {Deepak kumar} <deepak.kumar@suhora.com>
 */

import http from "http";
import { Server, Socket } from "socket.io";
import app from "./app";
import * as MessageService from "./services/messageService";
import * as TickerService from "./services/ticketService";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
interface MSG {
  message: string;
  ticketId: string;
  userId: string;
}
const baseUploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir, { recursive: true });
  console.log(`Default upload directory created at ${baseUploadDir}`);
}
io.on("connection", (socket: Socket) => {
  //for testing
  socket.emit("prev","helo how are you");
  console.log("User connected:", socket.id);
  // Support personnel joins global support room
  socket.on("joinSupportRoom", async () => {
    socket.join("support-room");
    console.log(`Support agent ${socket.id} joined the support room.`);
    try {
      const activeTickets = await TickerService.getAllActiveTickets();
      console.log("Active tickets:", activeTickets,"--");
      if (Array.isArray(activeTickets) && activeTickets.length > 0) {
        activeTickets.forEach((ticket: any) => {
          socket.join(ticket._id);
          console.log(`Support agent ${socket.id} joined room ${ticket._id}`);
        });
      } else {
        console.log("No active tickets available.");
        socket.emit("no-active-tickets", { message: "No active tickets to join..." });
      }
    } catch (error: any) {
      console.error("Error joining active ticket rooms:", error);
    }
  });
  // Support agent manually joins a specific ticket room
  socket.on("joinTicket", async (ticketId: string) => {
    try {
      const ticket = await TickerService.getTicketById(ticketId);
      if (ticket) {
        socket.join(ticketId);
        console.log(`Socket ${socket.id} joined room ${ticketId}`);

        // Fetch and emit all previous messages for the ticket
        const previousMessages = await MessageService.getMessagesByTicketId(ticketId);
        socket.emit("previous-messages", previousMessages);
      } else {
        console.log(`Room ${ticketId} does not exist.`);
      }
    } catch (error: any) {
      console.error("Error joining ticket:", error);
    }
  });
  // Handling message emission from all the users
  socket.on("message", async (data: MSG) => {
    const { message, ticketId, userId } = data;
    console.log(`Message received in room ${ticketId} from user ${userId}: ${message}`);

    // Emit the message to the specific room (ticketId) based on the joined room
    io.to(ticketId).emit("input-message", { userId, message });
    io.to(ticketId).emit("hyy1","hello")

    // Save the message in the database
    const ticket = await TickerService.getTicketById(ticketId);
    // const previousMessages = await MessageService.getMessagesByTicketId(ticketId);
    // socket.emit("previous-messages-user", previousMessages);
    if (ticket && message) {
      const newMessageToSave = { ticketId, userId, message, createdAt: new Date() };
      const newMessage = await MessageService.createMessage(newMessageToSave);

      console.log("Message saved to database.", newMessage);
    } else {
      console.error("Ticket not found, message not saved.");
    }
  });
  // Notify support room when a message is sent (excluding duplicating input-message)
  socket.on("message", async (data: MSG) => {
    const { ticketId, userId, message } = data;
    // Emit the message notification to the global support room without duplicating in the ticket room
    io.to("support-room").emit("support-message", { ticketId, userId, message });
  });
});
const PORT = process.env.SERVER_PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
