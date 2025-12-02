const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    entity: {
      type: String,
      required: true,
    },
    entityId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    leaveDate: {
      type: Date,
      required: true,
    },
    leavePerDay: [
      {
        time: { type: String, required: true },
        reason: { type: String },
      },
    ],
    totalLeavePerDay: {
      type: Number,
    },
  },
  { timestamps: true, strict: false }
);

const attendanceModel = mongoose.model("attendance", attendanceSchema);

module.exports = {
  attendanceModel,
};
