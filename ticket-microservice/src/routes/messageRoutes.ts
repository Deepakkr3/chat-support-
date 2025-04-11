
import { createMessage, getMessagesByTicketId, getMessages ,uploadFile} from "../controllers/messageController";
import { Router } from "express";
import upload from "../middlewares/upload"; 
const router = Router();
router.post("/messages", createMessage);
router.get("/messages", getMessages);
router.get("/messages/ticket/:ticketId", getMessagesByTicketId);
//change 
router.post("/messages/upload/:ticketId/user/:userId",upload.single('file'), uploadFile)
export default router;
