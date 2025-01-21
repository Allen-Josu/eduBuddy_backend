const { attendanceModel, entityModel, departmentModel, userModel } = require("../models");

// Map entity names to their corresponding models
const MODEL_MAP = {
    attendance: attendanceModel,
    notes: entityModel,
    pyq: entityModel,
    departments: departmentModel,
    user: userModel,
};

exports.updateCollections = async (request, response) => {
    try {
        const { entity, entityId, attributesToUpdate } = request.body;

        // Validate required fields
        if (!entity || !entityId || !attributesToUpdate) {
            return response.status(400).json({
                message:
                    "Missing required fields: entity, entityId, or attributesToUpdate",
            });
        }

        // Get the appropriate model
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

        const updatedEntity = await Model.findOneAndUpdate(
            { entityId },
            { $set: attributesToUpdate },
            { new: true },
        );

        return response.status(200).json({
            message: "Entity updated successfully",
            data: updatedEntity,
        });
    } catch (error) {
        console.error("Error updating collections:", error);
        return response.status(500).json({
            message: "An error occurred while updating the entity.",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};
