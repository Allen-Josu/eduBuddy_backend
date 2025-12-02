const { departmentModel } = require("../models/departmentModel");

exports.getDepartment = async (request, response) => {
    const { entity, entityId } = request.query;

    if (entity != "departments") {
        return response
            .status(400)
            .json({ message: "No such Department found" });
    }

    if (entityId) {
        try {
            const departmentData = await departmentModel.findOne({ entityId });
            return response
                .status(200)
                .json({ results: departmentData, totalCount: 1 });
        } catch (error) {
            return response
                .status(400)
                .json({ message: "An error has been occured", error: error });
        }
    } else {
        try {
            const [departmentData, totalCount] = await Promise.all([
                departmentModel.find({ entity }),
                departmentModel.countDocuments({ entity }),
            ]);
            return response
                .status(200)
                .json({ results: departmentData, totalCount });
        } catch (error) {
            return response
                .status(400)
                .json({ message: "An error has been occured", error: error });
        }
    }
};

exports.newDepartment = async (request, response) => {
    try {
        const newDepartment = new departmentModel(request.body);
        await newDepartment.save();

        return response
            .status(200)
            .json({ message: "Department has been added" });
    } catch (error) {
        return response
            .status(400)
            .json({ message: "An error has been occured", error: error });
    }
};
