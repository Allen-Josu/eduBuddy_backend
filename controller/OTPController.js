const { OTPModel } = require("../models/otpModel");
const crypto = require("crypto");
const { sendMail } = require("../utils/email_send");

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

    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your One-Time Password</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, Helvetica, sans-serif; background-color:#f4f6f8;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; box-shadow:0 2px 10px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 24px; text-align:center; background:#0f172a; border-radius:8px 8px 0 0;">
              <h1 style="margin:0; color:#ffffff; font-size:22px;">STACC</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin-top:0; color:#111827;">Verify Your Email Address</h2>

              <p style="font-size:15px; color:#374151; line-height:1.6;">
                Thank you for choosing <strong>STACC</strong>.  
                Please use the One-Time Password (OTP) below to complete your verification:
              </p>

              <div style="margin: 30px 0; text-align:center;">
                <span style="display:inline-block; font-size:32px; letter-spacing:6px; font-weight:bold; color:#0f172a; background:#f1f5f9; padding:16px 24px; border-radius:6px;">
                  ${otp}
                </span>
              </div>

              <p style="font-size:14px; color:#374151;">
                This OTP is valid for <strong>10 minutes</strong>.  
                Please do not share this code with anyone.
              </p>

              <p style="font-size:14px; color:#6b7280; margin-top:24px;">
                If you did not request this verification, you can safely ignore this email.
              </p>

              <p style="font-size:14px; color:#374151; margin-top:32px;">
                Regards,<br />
                <strong>STACC Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 16px; text-align:center; font-size:12px; color:#9ca3af; background:#f9fafb; border-radius:0 0 8px 8px;">
              © ${new Date().getFullYear()} STACC. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const textBody = `Welcome to STACC! Your OTP is: ${otp}. This OTP is valid for 10 minutes. Please do not share this code with anyone.`;

    await sendMail(email, "Welcome to STACC", textBody, htmlBody);

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
        message: "Email and OTP are required",
      });
    }

    const otpRecord = await OTPModel.findOne({ email });

    if (!otpRecord) {
      return response.status(404).json({
        success: false,
        message: "OTP not found. Please request a new one.",
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      await OTPModel.deleteOne({ email });
      return response.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (otpRecord.otp !== otp) {
      return response.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    await OTPModel.deleteOne({ email });

    return response.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return response.status(500).json({
      success: false,
      message: "Failed to verify OTP. Please try again.",
    });
  }
};
