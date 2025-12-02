const express = require("express");
const { getEntity, newEntity } = require("../controller/entityController");
const {
  getAttendance,
  newAttendance,
} = require("../controller/attendanceController");
const {
  getDepartment,
  newDepartment,
} = require("../controller/departmentController");
const { newUser, getUser, login } = require("../controller/userController");
const { updateCollections } = require("../controller/updateCollection");
const { deleteCollection } = require("../controller/deleteCollections");
const { newOTP, verifyOTP } = require("../controller/OTPController");

const router = express.Router();

router.get("/newEntity", getEntity);
router.post("/newEntity", newEntity);

router.post("/users", newUser);
router.get("/users", getUser);
router.post("/users/login", login);

router.get("/departments", getDepartment);
router.post("/departments", newDepartment);

router.get("/attendance", getAttendance);
router.post("/attendance", newAttendance);

router.patch("/update-entity", updateCollections);
router.delete("/delete-entity", deleteCollection);

router.post("/send-otp", newOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;
