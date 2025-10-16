import Student from "../Models/Student.js";

// Create student

const createStudent = async (req, res) => {
  try {
    const { name, email, batchYear, course, subjects } = req.body;

    // Use .save() to ensure pre("save") hook runs
    const student = new Student({ name, email, batchYear, course, subjects });
    await student.save(); // triggers pre("save") middleware

    res.status(201).json(student);
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .json({ message: "Student with this email already exists" });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single student
const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update student

const updateStudent = async (req, res) => {
  try {
    const { name, email, batchYear, course, subjects } = req.body;

    let totalMarks = 0;
    let average = 0;
    let grade = "";

    if (subjects && subjects.length > 0) {
      totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0);
      average = totalMarks / subjects.length;

      if (average >= 90) grade = "A+";
      else if (average >= 80) grade = "A";
      else if (average >= 70) grade = "B";
      else if (average >= 60) grade = "C";
      else if (average >= 50) grade = "D";
      else grade = "F";
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, email, batchYear, course, subjects, totalMarks, average, grade },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createStudent, getStudents, getStudent, updateStudent, deleteStudent };
