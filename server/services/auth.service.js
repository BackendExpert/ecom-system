const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/user.model")
const Role = require("../models/role.model")
const UserOTP = require("../models/userlog.model")

const logUserAction = require("../utils/others/logUserAction")
const tokenCreator = require("../utils/tokens/generateToken")
const {
    RegistationResDTO
} = require("../dtos/auth.dto")

const PASSWORD_SULT = 10

class AuthService {
    static async registation(username, email, password) {
        const existUser = await User.findOne({ email: email })

        if (existUser) {
            throw new Error("User Already Exist")
        }

        const hashPass = await bcrypt.hash(password, PASSWORD_SULT)

        const getstdrole = await Role.findOne({ name: 'buyer' })

        const newUser = new User({
            username: username,
            email: email,
            password: hashPass,
            role: getstdrole._id,
        })

        const resultcreateuser = await newUser.save()

        if (req) {
            const metadata = {
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent'],
                timestamp: new Date(),
            };
            await logUserAction(req, "register", `${email} registered`, metadata, resultcreateuser._id);
        }

        const checkotp = await UserOTP.findOne({ email });
        if (checkotp) {
            throw new Error("User already requested OTP, please wait and try again later");
        }
        function generateOTP(length = 8) {
            return crypto
                .randomBytes(length)
                .toString("base64")
                .replace(/[^a-zA-Z0-9]/g, "")
                .slice(0, length);
        }

        const otp = generateOTP();

        await sendEmail({
            to: email,
            subject: "Welcome to Student Note Management System 🎓 | Verify Your Email",
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08);">
                        
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 25px; text-align: center;">
                            <h1 style="color: #fff; margin: 0; font-size: 26px; font-weight: 700;">Welcome to Student Note Management System</h1>
                        </div>

                        <!-- Body -->
                        <div style="padding: 35px; color: #333;">
                            <h2 style="font-size: 22px; margin-bottom: 10px; color: #1e3a8a;">Hello ${username},</h2>

                            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #374151;">
                                We’re excited to have you on board! 🎉<br/>
                                You’ve successfully registered for the <strong>Student Note Management System</strong> — a smart way to manage your academic notes and materials.
                            </p>

                            <p style="font-size: 16px; color: #374151;">
                                Before you get started, please verify your email using the One-Time Passcode (OTP) below:
                            </p>

                            <!-- OTP Box -->
                            <div style="font-size: 30px; font-weight: 700; letter-spacing: 5px; color: #1d4ed8; background: #eff6ff; padding: 18px; text-align: center; border-radius: 10px; margin: 30px 0;">
                                ${otp}
                            </div>

                            <p style="font-size: 15px; color: #6b7280;">
                                ⏳ This code is valid for <strong>10 minutes</strong>. Please don’t share it with anyone — we care about your security.
                            </p>

                            <p style="font-size: 15px; color: #6b7280;">
                                If you didn’t register for this account, simply ignore this message.
                            </p>

                            <!-- Divider -->
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;"/>

                        </div>

                        <!-- Footer -->
                        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 13px; color: #9ca3af;">
                            <p style="margin: 5px 0;">© ${new Date().getFullYear()} Student Note Management System</p>
                            <p style="margin: 0;">All Rights Reserved</p>
                        </div>
                    </div>
                </div>
            `,
        });


        const hashotp = await bcrypt.hash(otp, 10);
        const createotprecode = new UserOTP({
            email,
            otp: hashotp,
            createdAt: new Date(),
        });

        const resultcreateotp = await createotprecode.save();

        if (!resultcreateotp) {
            throw new Error("Error saving OTP");
        }

        const token = tokenCreator({ email, otp }, "15m");

        return RegistationResDTO(token)
    }
}

module.exports = AuthService