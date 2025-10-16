import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import cors from "cors";

import authRoutes from "./Routes/auth.js";
import studentRoutes from "./Routes/students.js";

dotenv.config();

const app = express();
const DBURI = process.env.MONGODB_URI;

console.log(DBURI);

mongoose
  .connect(DBURI, {
    dbName: "Student_management",
  })
  .then(() => console.log("MongoDB connected succesfully...!"))
  .catch((err) => console.log(err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

const port = process.env.PORT || 2231;

app.listen(port, console.log("Server is running ", port));
