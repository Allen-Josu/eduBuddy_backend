const mongoose = require("mongoose");


const entitySchema = new mongoose.Schema(
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
    course: {
      type: String,
      required: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    subjectCode: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value);
        },
        message: "Invalid URL",
      },
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    department: {
      type: String,
    },
  },
  { timestamps: true, strict: false }
);

const entityModel = mongoose.model("entity", entitySchema);

module.exports = {
  entityModel,
};
