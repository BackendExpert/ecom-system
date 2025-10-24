const {
    ProductErrorResDTO,
    CreateBrandDTO,
    CreateProductTypeDTO,
    CreateTagDTO
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
                brandName,
                weburl
            } = req.body


            if (!req.file) {
                return res.status(400).json(ErrorResponseDTO("File is required"));
            }

            const uploadfile = req.file.filename;

            const createbranddto = CreateBrandDTO(token, brandName, uploadfile, weburl)

            const result = await ProductService.createBrand(
                createbranddto.token,
                createbranddto.brandName,
                createbranddto.file,
                createbranddto.weburl,
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
    },

    createProductTag: async (req, res) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                return res.status(401).json({ message: "Access denied. No token provided." });
            }
            const {
                ptName
            } = req.body

            const produttagdto = CreateTagDTO(token, ptName)

            const result = await ProductService.CreateProductTag(
                produttagdto.token,
                produttagdto.tagName,
                req
            )

            res.status(200).json(result)

        }
        catch (err) {
            return res.status(400).json(ProductErrorResDTO(err.message));
        }
    },

    createCategory: async(req, res) => {
        try{
            
        }
        catch(err){
            return res.status(400).json(ProductErrorResDTO(err.message));
        }
    }
};

module.exports = ProductController;