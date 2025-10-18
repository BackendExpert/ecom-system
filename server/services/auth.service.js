const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const User = require("../models/user.model")
const Role = require("../models/role.model")
const UserOTP = require("../models/userotp.model")

// const logUserAction = require("../utils/others/logUserAction")
const logUserAction = require('../utils/others/logUserAction')

const tokenCreator = require("../utils/tokens/generateToken")
const sendEmail = require("../utils/email/emailTransporter")
const {
    RegistationResDTO,
    EmailVerifyResDTO,
    LoginResDTO,
    LogoutResDTO
} = require("../dtos/auth.dto")

const PASSWORD_SULT = 10
const FRONTEND_URL = 'http://localhost:5173/login'

class AuthService {
    static async registation(username, email, password, req) {
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
            subject: "Welcome to MyMart 🛒 | Verify Your Email to Start Shopping",
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f7fdf4; padding: 40px 0;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 35px rgba(0,0,0,0.08);">
                        
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #84cc16, #65a30d); padding: 25px; text-align: center;">
                            <h1 style="color: #fff; margin: 0; font-size: 28px; font-weight: 800;">Welcome to MyMart</h1>
                            <p style="color: #ecfccb; margin: 6px 0 0; font-size: 15px;">Your smart shopping partner 🛍️</p>
                        </div>

                        <!-- Body -->
                        <div style="padding: 35px; color: #333;">
                            <h2 style="font-size: 22px; margin-bottom: 12px; color: #365314;">Hey ${username},</h2>

                            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #4b5563;">
                                🎉 Great to have you with us! You’ve successfully joined <strong>MyMart</strong> — where shopping meets simplicity and savings.
                            </p>

                            <p style="font-size: 16px; color: #4b5563;">
                                Before you start exploring amazing deals and exclusive offers, please verify your email using the One-Time Passcode (OTP) below:
                            </p>

                            <!-- OTP Box -->
                            <div style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #3f6212; background: #ecfccb; padding: 18px; text-align: center; border-radius: 12px; margin: 35px 0;">
                                ${otp}
                            </div>

                            <p style="font-size: 15px; color: #6b7280;">
                                ⏳ This code is valid for <strong>10 minutes</strong>. Keep it safe — never share it with anyone.
                            </p>

                            <p style="font-size: 15px; color: #6b7280;">
                                Didn’t sign up for a MyMart account? Just ignore this message and no action will be taken.
                            </p>

                            <!-- Divider -->
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;"/>

                            <p style="font-size: 15px; color: #475569;">
                                💚 Once verified, you can explore the latest arrivals, trending products, and exclusive offers curated just for you!
                            </p>
                        </div>

                        <!-- Footer -->
                        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 13px; color: #9ca3af;">
                            <p style="margin: 5px 0;">© ${new Date().getFullYear()} MyMart Shopping Site</p>
                            <p style="margin: 0;">Your trusted online marketplace 🌿</p>
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

    static async verifyEmail(token, otpInput, req) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                throw new Error("Token expired. Please request a new one.");
            }
            throw new Error("Invalid token.");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        const checkotprecode = await UserOTP.findOne({ email: decoded.email });
        if (!checkotprecode) throw new Error("OTP Record Not found");

        const otpcheck = await bcrypt.compare(otpInput, checkotprecode.otp);
        if (!otpcheck) {
            const metadata = {
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent'],
                timestamp: new Date(),
            };
            await logUserAction(req, "Wrong_otp", `${user.email} Adding Wrong OTP when verifing Account`, metadata, user._id);

            throw new Error("OTP does not match");
        }

        const updateuser = await User.findOneAndUpdate(
            { email: decoded.email },
            { $set: { isEmailVerified: true } },
            { new: true }
        );

        if (updateuser) {
            await UserOTP.findOneAndDelete({ email: decoded.email });
            if (req) {
                const metadata = {
                    ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                    userAgent: req.headers['user-agent'],
                    timestamp: new Date(),
                };
                await logUserAction(req, "account_verify", `${decoded.email} Accout Verified`, metadata, user._id);
            }
            return EmailVerifyResDTO()
        } else {
            throw new Error("Internal Server Error");
        }
    }

    static async login(email, password, req) {
        const user = await User.findOne({ email: email });

        if (!user) {
            throw new Error("User does not exist by given Email Address");
        }

        const checkpass = await bcrypt.compare(password, user.password);

        if (!checkpass) {
            const metadata = {
                ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                userAgent: req.headers["user-agent"],
                timestamp: new Date(),
            };
            await logUserAction(req, "wrong_password", `${email} login failed`, metadata, user._id);
            throw new Error("Given Password does not match. Please check your password.");
        }

        if (!user.isEmailVerified) {
            throw new Error("Your email is not verified.");
        }

        if (!user.isActive) {
            throw new Error("Your account is not active.");
        }

        const getuserrole = await Role.findById(user.role);

        const token = tokenCreator(
            {
                id: user._id,
                email: user.email,
                username: user.username,
                role: getuserrole?.name || "User",
            },
            "1d"
        );

        if (req) {
            const metadata = {
                ipAddress: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
                userAgent: req.headers["user-agent"],
                timestamp: new Date().toLocaleString(),
            };

            // ✅ Use `user` safely inside same scope
            await logUserAction(req, "login_success", `${user.email} Login Success`, metadata, user._id);

            // ✅ Define FRONTEND_URL or fallback
            const FRONTEND_URL = process.env.FRONTEND_URL;

            await sendEmail({
                to: user.email,
                subject: "🔐 Login Successful | MyMart Account Access",
                html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f7fdf4; padding: 40px 0;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 35px rgba(0,0,0,0.08);">
                        
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #84cc16, #4d7c0f); padding: 28px; text-align: center;">
                            <h1 style="color: #fff; margin: 0; font-size: 26px; font-weight: 800;">Login Successful ✅</h1>
                            <p style="color: #d9f99d; margin: 6px 0 0; font-size: 15px;">Welcome back to MyMart, ${user.username} 🌿</p>
                        </div>

                        <!-- Body -->
                        <div style="padding: 35px; color: #333;">
                            <p style="font-size: 17px; line-height: 1.7; color: #374151; margin-bottom: 22px;">
                                👋 Hey <strong>${user.username}</strong>, your login to <strong>MyMart</strong> was successful.  
                                If this was you — awesome! You can continue shopping seamlessly.
                            </p>

                            <!-- Meta Data Card -->
                            <div style="background: #ecfccb; border-left: 6px solid #84cc16; border-radius: 10px; padding: 18px 22px; margin: 25px 0;">
                                <h3 style="margin: 0 0 12px; font-size: 18px; color: #365314;">🔍 Login Details</h3>
                                <p style="margin: 4px 0; font-size: 15px; color: #4b5563;"><strong>📅 Time:</strong> ${metadata.timestamp}</p>
                                <p style="margin: 4px 0; font-size: 15px; color: #4b5563;"><strong>💻 Device:</strong> ${metadata.userAgent}</p>
                                <p style="margin: 4px 0; font-size: 15px; color: #4b5563;"><strong>🌐 IP Address:</strong> ${metadata.ipAddress}</p>
                            </div>

                            <p style="font-size: 15px; color: #6b7280; margin-top: 18px;">
                                ⚠️ If this login wasn’t you, we recommend 
                                <a href="${FRONTEND_URL}/reset-password" 
                                   style="color: #65a30d; text-decoration: none; font-weight: 600;">
                                   changing your password immediately
                                </a> to keep your account secure.
                            </p>

                            <!-- Divider -->
                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />

                            <p style="font-size: 15px; color: #475569;">
                                💚 Stay safe and enjoy a smooth shopping experience on <strong>MyMart</strong> — your trusted online marketplace.
                            </p>
                        </div>

                        <!-- Footer -->
                        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 13px; color: #9ca3af;">
                            <p style="margin: 5px 0;">© ${new Date().getFullYear()} MyMart Shopping Site</p>
                            <p style="margin: 0;">Empowering smarter shopping experiences 🛍️</p>
                        </div>
                    </div>
                </div>
            `,
            });
        }

        return LoginResDTO(token, user);
    }

    static async logout(token, req) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                throw new Error("Token expired. Please request a new one.");
            }
            throw new Error("Invalid token.");
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) throw new Error("User not found");

        const metadata = {
            ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            userAgent: req.headers['user-agent'],
            timestamp: new Date(),
        };

        await logUserAction(req, "logout", `User ${user.email} logged out`, metadata, user._id);

        return LogoutResDTO()
    }

}

module.exports = AuthService