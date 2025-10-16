import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    course: { type: String, required: true, trim: true },
    batchYear: {
      type: String,
      required: true,
    },
    subjects: [
      {
        name: { type: String, required: true, trim: true },
        marks: { type: Number, required: true, min: 0, max: 100 },
      },
    ],
    totalMarks: { type: Number, default: 0 },
    average: { type: Number, default: 0 },
    grade: { type: String, trim: true },
  },
  { timestamps: true }
);

// 🔹 Calculate before saving (create)
studentSchema.pre("save", function (next) {
  if (this.subjects && this.subjects.length > 0) {
    this.totalMarks = this.subjects.reduce(
      (total, subject) => total + subject.marks,
      0
    );
    this.average = this.totalMarks / this.subjects.length;

    if (this.average >= 90) this.grade = "A+";
    else if (this.average >= 75) this.grade = "A";
    else if (this.average >= 65) this.grade = "B";
    else if (this.average >= 45) this.grade = "C";
    else if (this.average >= 35) this.grade = "D";
    else this.grade = "F";
  }
  next();
});

// 🔹 Recalculate before updating
studentSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  const subjects = update.subjects;

  if (subjects && subjects.length > 0) {
    const totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0);
    const average = totalMarks / subjects.length;
    let grade = "";

    if (average >= 90) grade = "A+";
    else if (average >= 75) grade = "A";
    else if (average >= 65) grade = "B";
    else if (average >= 45) grade = "C";
    else if (average >= 35) grade = "D";
    else grade = "F";

    this.setUpdate({ ...update, totalMarks, average, grade });
  }
  next();
});

export default mongoose.model("Student", studentSchema);
