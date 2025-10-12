import express from "express";
import {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} from "../Controllers/studentController.js";
import { protect } from "../Middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect); // All student routes are protected

router.route("/").post(createStudent).get(getStudents);

router.route("/:id").get(getStudent).put(updateStudent).delete(deleteStudent);

export default router;
