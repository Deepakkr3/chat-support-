import mongoose, { Document, Schema } from "mongoose";
import { string } from "zod";

export interface IMessage extends Document {
  ticketId: mongoose.Schema.Types.ObjectId;
  userId?: string; // Added userId to track which user sent the message
  message: string;
  createdAt: Date;
  fileUrl?: string;
}

const MessageSchema: Schema = new Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
  userId: { type: String },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
  fileUrl: String,
});

export default mongoose.model<IMessage>("Message", MessageSchema);
