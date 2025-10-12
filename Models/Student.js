// // models/Student.js
// import mongoose from "mongoose";

// const studentSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Please add student name"],
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, "Please add student email"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     course: {
//       type: String,
//       required: [true, "Please add course name"],
//       trim: true,
//     },
//     subjects: [
//       {
//         name: {
//           type: String,
//           required: true,
//           trim: true,
//         },
//         marks: {
//           type: Number,
//           required: true,
//           min: 0,
//           max: 100,
//         },
//       },
//     ],
//     totalMarks: {
//       type: Number,
//       default: 0,
//     },
//     average: {
//       type: Number,
//       default: 0,
//     },
//     grade: {
//       type: String,
//       trim: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Calculate total marks and average before saving
// // studentSchema.pre("save", function (next) {
// //   if (this.subjects && this.subjects.length > 0) {
// //     this.totalMarks = this.subjects.reduce(
// //       (total, subject) => total + subject.marks,
// //       0
// //     );
// //     this.average = this.totalMarks / this.subjects.length;

// //     // Calculate grade
// //     if (this.average >= 90) this.grade = "A+";
// //     else if (this.average >= 80) this.grade = "A";
// //     else if (this.average >= 70) this.grade = "B";
// //     else if (this.average >= 60) this.grade = "C";
// //     else if (this.average >= 50) this.grade = "D";
// //     else this.grade = "F";
// //   }
// //   next();
// // });

// studentSchema.pre("findOneAndUpdate", function (next) {
//   const update = this.getUpdate();
//   const subjects = update.subjects;

//   if (subjects && subjects.length > 0) {
//     const totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0);
//     const average = totalMarks / subjects.length;
//     let grade = "";

//     if (average >= 90) grade = "A+";
//     else if (average >= 80) grade = "A";
//     else if (average >= 70) grade = "B";
//     else if (average >= 60) grade = "C";
//     else if (average >= 50) grade = "D";
//     else grade = "F";

//     // push the computed fields into update query
//     this.setUpdate({ ...update, totalMarks, average, grade });
//   }
//   next();
// });

// export default mongoose.model("Student", studentSchema);
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
