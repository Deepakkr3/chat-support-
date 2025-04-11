import { Request, Response } from "express";
import * as MessageService from "../services/messageService";
import Message from "../models/Message";
import { createMessageSchema } from "../schemas/messageValidation";
import { io } from "../server";
import url from "url";
interface MulterRequest extends Request {
  file: Express.Multer.File;
}
export const createMessage = async (req: Request, res: Response) => {
  const validationResult = createMessageSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ "success":false,"message":"unprocessable entity",errors:validationResult.error });
  }
  try {
    const message = await MessageService.createMessage(req.body);
    res.status(201).json({ message });
  } catch (error: any) {
    res.status(500).json({ message: "message not saved", error: error.message });
  }
};
export const getMessagesByTicketId = async (req: Request, res: Response) => {
  try {
    const messages = await MessageService.getMessagesByTicketId(req.params.ticketId);
    if (messages.length == 0) {
      res.status(404).json({ message: "No messages found for this ticketId" });
      return;
    }
    res.status(200).json({ length: messages.length, messages });
  } catch (error: any) {
    res.status(500).json({ error: error });
  }
};
export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    if (messages.length == 0) {
      res.status(404).json({ message: "No messages found" });
      return;
    }
    res.status(200).json({ length: messages.length, messages });
  } catch (error: any) {
    res.status(500).json({ error: error });
  }
};
export const uploadFile = async (req: Request, res: Response) => {
  const ticketId = req.params.ticketId;
  const userId = req.params.userId;
  //resolve proxy based path
  const proxyBasePath: string | undefined = req.get("x-base-url");
  let pathName: string;
  if (proxyBasePath) {
      pathName = proxyBasePath;
  } else {
      pathName = ``;
  }
   //url resolve 
   const reqUrl=req.url;
   const responseUrl = url.format({ protocol: req.protocol, host: req.get("host") })
   const responceUrlFinal=responseUrl+pathName
   console.log("url",reqUrl)
console.log("responseUrl",responceUrlFinal)
  // Check if a file is uploaded
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const fileUrl = `${responceUrlFinal}/uploads/${ticketId}/${req.file.filename}`;
  try {
    // Save the file URL and other message details in the database
    const messageData = {
      ticketId: ticketId,
      message: "",
      createdAt: new Date(),
      fileUrl,
      userId,
      // Attach file URL
    };
    io.to(ticketId).emit("input-message", {
      userId,
      message: "File uploaded",
      fileUrl,
      ticketId,
    });
    io.to("support-room").emit("support-message", {
      ticketId,
      userId,
      message: "File uploaded",
      fileUrl,
    });
    const message = await MessageService.createMessage(messageData);
    console.log("file uploaded")
    console.log(messageData)
    return res.status(201).json({ message });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
