const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    entity: {
      required: true,
      type: String,
    },
    username: {
      required: true,
      type: String,
    },
    entityId: {
      required: true,
      type: String,
    },
    password: {
      required: true,
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
    },
  },
  { timestamps: true, strict: false }
);

const userModel = mongoose.model("users", userSchema);

module.exports = {
  userModel,
};
