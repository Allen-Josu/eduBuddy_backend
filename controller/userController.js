const { userModel } = require("../models/userModel");

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

exports.newUser = async (request, response) => {
    const { email, role, password } = request.body;
    try {
        if (role === "user") {
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return response
                    .status(400)
                    .json({ message: "User already exists" });
            }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Replace the plaintext password with hashed one
        request.body.password = hashedPassword;

        const newUser = new userModel(request.body);
        await newUser.save();

        return response
            .status(200)
            .json({ message: "User has been registered" });
    } catch (error) {
        return response
            .status(500)
            .json({ message: "An error has occurred", error });
    }
};


exports.getUser = async (request, response) => {
    const { email, password } = request.body;
    const { entityType, entity, entityId } = request.query;
    try {
        if (entityType == "all") {
            const [userData, totalCount] = await Promise.all([
                userModel.find({ entity }),
                userModel.countDocuments({ entity }),
            ]);
            return response
                .status(200)
                .json({ results: userData, totalCount: totalCount });
        }
        if (entityType == "single") {
            const userData = await userModel.findOne({ entityId });
            if (!userData) {
                return response
                    .status(400)
                    .json({ message: "Invalid credentials" });
            }

            return response
                .status(200)
                .json({ results: userData, totalCount: 1 });
        }
        const userData = await userModel.findOne({ email, password });

        if (!userData) {
            return response
                .status(400)
                .json({ message: "Invalid credentials" });
        }

        return response.status(200).json({ results: userData, totalCount: 1 });
    } catch (error) {
        return response
            .status(400)
            .json({ message: "An error has been occured", error: error });
    }
};

exports.login = async (request, response) => {
    const { email, password, username } = request.body;
    const { role } = request.query;

    try {
        if (role === "user") {
            const userData = await userModel.findOne({ email });

            if (!userData) {
                return response.status(401).json({ message: "Invalid credentials" });
            }

            // Compare provided password with hashed password
            const isMatch = await bcrypt.compare(password, userData.password);
            if (!isMatch) {
                return response.status(401).json({ message: "Invalid credentials" });
            }

            return response.status(200).json({
                message: "Login successful",
                results: userData,
                totalCount: 1,
            });

        } else if (role === "admin") {
            const adminData = await userModel.findOne({ email });

            if (!adminData) {
                return response.status(401).json({ message: "Invalid credentials" });
            }

            // Compare provided password with hashed password
            const isMatch = await bcrypt.compare(password, adminData.password);
            if (!isMatch) {
                return response.status(401).json({ message: "Invalid credentials" });
            }

            return response.status(200).json({
                message: "Login successful",
                results: adminData,
                totalCount: 1,
            });
        }

    } catch (error) {
        return response.status(500).json({ message: "An error has occurred", error: error.message });
    }
};
