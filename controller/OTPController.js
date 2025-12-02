const { OTPModel } = require("../models/otpModel");
const crypto = require("crypto");

exports.newOTP = async (request, response) => {
  try {
    const { email } = request.body;

    if (!email) {
      return response.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const existingOTP = await OTPModel.findOne({ email });

    if (existingOTP) {
      await OTPModel.updateOne(
        { email },
        {
          otp,
          expiresAt,
          createdAt: new Date(),
        }
      );
    } else {
      await OTPModel.create({
        email,
        otp,
        expiresAt,
        createdAt: new Date(),
      });
    }

    // send otp
    console.log(`OTP for ${email}: ${otp}`);

    return response.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error generating OTP:", error);
    return response.status(500).json({
      success: false,
      message: "Failed to generate OTP. Please try again.",
    });
  }
};



exports.verifyOTP = async (request, response) => {
  try {
    const { email, otp } = request.body;

    if (!email || !otp) {
      return response.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    const otpRecord = await OTPModel.findOne({ email });

    if (!otpRecord) {
      return response.status(404).json({
        success: false,
        message: "OTP not found. Please request a new one."
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      await OTPModel.deleteOne({ email }); 
      return response.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one."
      });
    }

    if (otpRecord.otp !== otp) {
      return response.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again."
      });
    }

    await OTPModel.deleteOne({ email });

    return response.status(200).json({
      success: true,
      message: "OTP verified successfully"
    });

  } catch (error) {
    console.error("Error verifying OTP:", error);
    return response.status(500).json({
      success: false,
      message: "Failed to verify OTP. Please try again."
    });
  }
};