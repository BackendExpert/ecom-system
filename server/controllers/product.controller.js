const {
    ProductErrorResDTO,
    CreateBrandDTO,
    CreateProductTypeDTO
} = require("../dtos/product.dto");
const ProductService = require("../services/product.service");


const ProductController = {
    createBrand: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                return res.status(401).json({ message: "Access denied. No token provided." });
            }

            const {
                brandName
            } = req.body

            const createbranddto = CreateBrandDTO(token, brandName)

            const result = await ProductService.createBrand(
                createbranddto.token,
                createbranddto.brandName,
                req
            )

            res.status(200).json(result)
        }
        catch (err) {
            return res.status(400).json(ProductErrorResDTO(err.message));
        }
    },

    createProductType: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                return res.status(401).json({ message: "Access denied. No token provided." });
            }

            const {
                ptName
            } = req.body

            const createptdto = CreateProductTypeDTO(token, ptName)

            const result = await ProductService.CreateProductType(
                createptdto.token,
                createptdto.ptName,
                req
            )

            res.status(200).json(result)

        }
        catch (err) {
            return res.status(400).json(ProductErrorResDTO(err.message));
        }
    }
};

module.exports = ProductController;