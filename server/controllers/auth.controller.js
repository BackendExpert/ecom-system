const AuthService = require("../services/auth.service");

const { 
    ErrorResDTO,
    RegistationDTO
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
    }
};

module.exports = AuthController;