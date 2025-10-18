const AuthService = require("../services/auth.service");

const {
    ErrorResDTO,
    RegistationDTO,
    EmailVerifyDTO,
    LoginDTO,
    ForgetPasswordDTO,
    VerifyOTPDTO,
    UpdatePasswordDTO
} = require("../dtos/auth.dto");


const AuthController = {
    registation: async (req, res) => {
        try {
            const {
                username,
                email,
                password
            } = req.body

            const regdto = RegistationDTO(username, email, password)

            const result = await AuthService.registation(
                regdto.username,
                regdto.email,
                regdto.password,
                req
            )

            res.status(200).json(result)

        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    },

    verifyEmail: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                return res.status(401).json({ message: "Access denied. No token provided." });
            }
            const { otp } = req.body

            const verfiydto = EmailVerifyDTO(token, otp)

            const result = await AuthService.verifyEmail(
                verfiydto.token,
                verfiydto.otp,
                req
            )

            res.status(200).json(result)
        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    },

    login: async (req, res) => {
        try {
            const {
                email,
                password
            } = req.body

            const logindto = LoginDTO(email, password)

            const result = await AuthService.login(
                logindto.email,
                logindto.password,
                req
            )

            res.status(200).json(result)
        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    },

    logout: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                return res.status(401).json({ message: "Access denied. No token provided." });
            }
            const result = await AuthService.logout(token, req)
            res.status(200).json(result)
        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    },

    forgetpassword: async (req, res) => {
        try {
            const { email } = req.body

            const forgetpassdto = ForgetPasswordDTO(
                email
            )

            const result = await AuthService.ForgetPassword(
                forgetpassdto.email
            )

            res.status(200).json(result)
        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    },

    verifyotp: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                return res.status(401).json({ message: "Access denied. No token provided." });
            }

            const { otp } = req.body

            const otpcheckdto = VerifyOTPDTO(token, otp)

            const result = await AuthService.CheckandVerifyOTP(
                otpcheckdto.token,
                otpcheckdto.otp,
                req
            )
            res.status(200).json(result)
        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    },

    updatePassword: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                return res.status(401).json({ message: "Access denied. No token provided." });
            }

            const { newpassword } = req.body

            const passwordDto = UpdatePasswordDTO(token, newpassword)


            const result = await AuthService.UpdatePassword(
                passwordDto.token,
                passwordDto.newpassword,
                req
            )
            res.status(200).json(result)

        }
        catch (err) {
            return res.status(400).json(ErrorResDTO(err.message));
        }
    }
};

module.exports = AuthController;