const jwt = require("jsonwebtoken")
const logUserAction = require("../utils/others/logUserAction")

const User = require("../models/user.model")
const Brand = require("../models/brand.model");
const ProductType = require("../models/productType.model")
const Tag = require("../models/tag.model")
const Category = require('../models/category.model')

const {
    CreateBrandResDTO,
    CreateProductTypeResDTO,
    GetAllBrandsResDTO,
    GetAllProductTypesResDTP,
    CreateTagResDTO,
    CreateCategoryResDTO
} = require("../dtos/product.dto");

class ProductService {
    static async createBrand(token, brandName, logo, weburl, req) {
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

        const checkBrand = await Brand.findOne({ name: brandName })

        if (checkBrand) throw new Error("Brand Already Exist");

        const newBrand = new Brand({
            name: brandName,
            logo: logo,
            websiteUrl: weburl
        })

        const resultBrand = await newBrand.save()

        if (resultBrand) {
            if (req) {
                const metadata = {
                    ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                    userAgent: req.headers['user-agent'],
                    timestamp: new Date(),
                };
                await logUserAction(req, "brand_created", `${decoded.email} Create Brand`, metadata, user._id);
            }

            return CreateBrandResDTO()
        }
    }

    static async CreateProductType(token, ptName, req) {
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

        const checkproductType = await ProductType.findOne({ name: ptName })

        if (checkproductType) throw new Error("Product Type Already Exist");

        const newProductType = new ProductType({
            name: ptName
        })

        const resultcreateProductType = await newProductType.save()

        if (resultcreateProductType) {
            if (req) {
                const metadata = {
                    ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                    userAgent: req.headers['user-agent'],
                    timestamp: new Date(),
                };
                await logUserAction(req, "product_type-_create", `${decoded.email} Create product type`, metadata, user._id);
            }

            return CreateProductTypeResDTO()
        }
    }

    static async GetAllBrands() {
        const allbrands = await Brand.find()
        return GetAllBrandsResDTO()
    }

    static async GetAllProductTypes() {
        const allproducttype = await ProductType.find()
        return GetAllProductTypesResDTP()
    }

    static async CreateProductTag(token, name, req) {
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

        const checktag = await Tag.findOne({ name: name })
        if (checktag) throw new Error("Tag Already Exist");

        const newTag = new Tag({
            name: name,
        })

        const resultcreateTag = await newTag.save()

        if (resultcreateTag) {
            if (req) {
                const metadata = {
                    ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                    userAgent: req.headers['user-agent'],
                    timestamp: new Date(),
                };
                await logUserAction(req, "product_tag_create", `${decoded.email} Create product Tag`, metadata, user._id);
            }

            return CreateTagResDTO()
        }
    }

    static async CreateProductCategory(token, pcName, pcdesc, req) {
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

        const checktag = await Category.findOne({ name: pcName })
        if (checktag) throw new Error("Category Already Exist");

        const newCategory = new Category({
            name: pcName,
            description: pcdesc,
        })

        const resultCreateCategory = await newCategory.save()

        if (resultCreateCategory) {
            if (req) {
                const metadata = {
                    ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                    userAgent: req.headers['user-agent'],
                    timestamp: new Date(),
                };
                await logUserAction(req, "product_category_create", `${decoded.email} Created product Category`, metadata, user._id);
            }

            return CreateCategoryResDTO()
        }

    }

}

module.exports = ProductService