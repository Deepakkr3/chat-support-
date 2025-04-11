/**
 * 
 * this is the main file of the application
 * it will connect to the database and start the server
 * @author {Deepak kumar} <deepak.kumar@suhora.com>
 *  */ 

import express from "express";
import ticketRoutes from "./routes/ticketRoutes";
import messageRoutes from "./routes/messageRoutes";
import { connectDB } from "./config/dbConfig";
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const API_CONFIG=process.env.API_CONFIG||'/api/v1'
connectDB();
  // Routes
  app.use(`${API_CONFIG}` ,ticketRoutes);
app.use(`${API_CONFIG}`, messageRoutes);
const staticDir:string=path.join(__dirname, '../uploads');
 app.use("/uploads",express.static(staticDir))

export default app;
