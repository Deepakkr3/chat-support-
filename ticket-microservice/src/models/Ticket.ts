import mongoose, { Document, Schema } from "mongoose";
import { text } from "stream/consumers";

export interface ITicket extends Document {
 // _id: string;
  title: string;
  description: string;
  status: "open" | "closed";
  createdAt: Date;
  messages: mongoose.Schema.Types.ObjectId[];
  userId: string;
  priority: "low" | "medium" | "high";
  userName: string;
}

const TicketSchema: Schema = new Schema({
 

  title: { type: String, required: false },

  description: { type:mongoose.Schema.Types.Mixed , required: true },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open"
  },
  userId: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
  priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
  userName: { type: String, required: true },
  orderId: { type: String, required: false },
  orderName: { type: String, required: false },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

export default mongoose.model<ITicket>("Ticket", TicketSchema);
