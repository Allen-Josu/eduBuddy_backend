const mongoose = require("mongoose");


const subjectSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true,
  },
  subjectCode: {
    type: String,
    required: true,
  },
});

const departmentSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    entity: {
      type: String,
      required: true,
    },
    entityId: {
      type: String,
      required: true,
      unique: true,
    },
    subjects: {
      type: [subjectSchema],
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, strict: false }
);

const departmentModel = mongoose.model("departments", departmentSchema);

module.exports = {
  departmentModel,
};
