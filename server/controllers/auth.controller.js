const AuthService = require("../services/auth.service");

const {
    ErrorResDTO,
    RegistationDTO,
    EmailVerifyDTO
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
    }
};

module.exports = AuthController;