const { attendanceModel } = require("../models/attendanceModel");
const { departmentModel } = require("../models/departmentModel");
const { entityModel } = require("../models/entityModel");
const { userModel } = require("../models/userModel");

const MODEL_MAP = {
  attendance: attendanceModel,
  notes: entityModel,
  pyq: entityModel,
  departments: departmentModel,
  users: userModel,
};

exports.deleteCollection = async (request, response) => {
  try {
    const { entity, entityId } = request.query;

    const Model = MODEL_MAP[entity];
    if (!Model) {
      return response.status(400).json({
        message: `Invalid entity type: ${entity}`,
      });
    }

    // Find and update the entity
    const existingEntity = await Model.findOne({ entityId });
    if (!existingEntity) {
      return response.status(404).json({
        message: "No such entity found. Please check the entity ID.",
      });
    }

    const updatedEntity = await Model.findOneAndDelete({ entityId });

    return response.status(200).json({
      message: "Entity deleted successfully",
    });
  } catch (error) {
    console.error("Error updating collections:", error);
    return response.status(500).json({
      message: "An error occurred while updating the entity.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
