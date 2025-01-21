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
        course: {
            type: String,
        },
        department: {
            type: String,
        },
        studentId: {
            type: String,
        },
        role: {
            type: String,
        },
        likedEntities: [
            {
                type: {
                    entityId: { type: String, required: true },
                    entity: { type: String, required: true },
                },
            },
        ],
    },
    { timestamps: true },
);

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
        userId: {
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
    { timestamps: true },
);

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
    {
        timestamps: true,
    },
);

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
        studentId: {
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
    {
        timestamps: true,
    },
);

const userModel = mongoose.model("users", userSchema);
const entityModel = mongoose.model("entity", entitySchema);
const departmentModel = mongoose.model("departments", departmentSchema);
const attendanceModel = mongoose.model("attendance", attendanceSchema);

module.exports = { userModel, entityModel, departmentModel, attendanceModel };
