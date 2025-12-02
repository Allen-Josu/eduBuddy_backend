const { entityModel } = require("../models/entityModel");

exports.newEntity = async (request, response) => {
  const { url, entity } = request.body;

  if (!["notes", "pyq"].includes(entity)) {
    return response.status(400).json({ message: "No such Entity Found" });
  }
  try {
    const exitingData = await entityModel.find({ url });

    if (exitingData.length > 0) {
      return response.status(400).json({
        message: "A user has been uploaded data with the same URL.",
      });
    }

    const newData = new entityModel(request.body);

    await newData.save();

    return response
      .status(200)
      .json({ message: "Data has been uploaded Successfully" });
  } catch (error) {
    console.log(error);
  }
};

exports.getEntity = async (request, response) => {
  const { entity, entityType, entityId } = request.query;

  if (!["notes", "pyq"].includes(entity)) {
    return response.status(400).json({ message: "No such Entity Found." });
  }

  try {
    if (entityType === "all") {
      const [entityData, totalCount] = await Promise.all([
        entityModel.find({ entity }),
        entityModel.countDocuments({ entity }),
      ]);

      return response.status(200).json({ results: entityData, totalCount });
    } else {
      const [entityData, totalCount] = await Promise.all([
        entityModel.find({ entity, entityId }),
        entityModel.countDocuments({ entity, entityId }),
      ]);

      return response.status(200).json({ results: entityData, totalCount });
    }
  } catch (error) {
    return response
      .status(500)
      .json({ message: "An error has occurred.", error });
  }
};

exports.updateEntity = async (request, response) => {
  const { entityId } = request.body;
};
