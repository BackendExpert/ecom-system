exports.CreateBrandDTO = (token, brandName, logo, weburl) => ({ token, brandName, logo, weburl })
exports.CreateBrandResDTO = (message = "Brand Created Successfully") => ({ success: true, message })

exports.GetAllBrandsResDTO = (result, message = "All Brands Fetched Successfully") => ({ success: true, result, message })

exports.GetOneBrandDTO = (token, brandid) => ({ token, brandid })
exports.GetOneBrandResDTO = (result, message = "One Brand Fetched Successfully") => ({ success: true, result, message })

exports.CreateProductTypeDTO = (token, ptName) => ({ token, ptName })
exports.CreateProductTypeResDTO = (message = "Product Type Created Successfully") => ({ success: true, message })

exports.GetAllProductTypesResDTP = (result, message = "All Product Types Fetched Successfully") => ({ success: true, result, message })

exports.GetOneProductTypeDTO = (token, ptid) => ({ token, ptid })
exports.GetOneProductTypeResDTO = (result, message = "One Product Types Fetched Successfully") => ({ success: true, result, message })

exports.CreateTagDTO = (token, tagName) => ({ token, tagName })
exports.CreateTagResDTO = (message = "Product Tag Created Successfully") => ({ success: true, message })

exports.GetAllTagsResDTO = (result, message = "All Product Tags Fetched Successfully") => ({ success: true, result, message })

exports.GetOneTagDTO = (token, tagid) => ({ token, tagid })
exports.GetOneTagResDTO = (result, message = "One Product Tags Fetched Successfully") => ({ success: true, result, message })

exports.CreateCategoryDTO = (token, catName, catDesc) => ({ token, catName, catDesc })
exports.CreateCategoryResDTO = (message = "Product Category Created Successfully") => ({ success: true, message })

exports.GetAllCategoryResDTO = (result, message = "All Product Category Fetched Successfully") => ({ success: true, result, message })

exports.GetOneCategoryDTO = (token, catID) => ({ token, catID })
exports.GetOneCategoryResDTO = (result, message = "One Product Category Fetched Successfully") => ({ success: true, result, message })

exports.CreateProductDTO = (
    token,
    itemCode,
    productName,
    regularPrice,
    salePrice,
    size,
    stock,
    SKU,
    categoryid,
    tagsid,
    description,
    images,
    productTypeids,
    brandid,
    netWeight
) => ({
    token,
    itemCode,
    productName,
    regularPrice,
    salePrice,
    size,
    stock,
    SKU,
    categoryid,
    tagsid,
    description,
    images,
    productTypeids,
    brandid,
    netWeight
})

exports.CreateProductResDTO = (message = "Product Category Created Successfully") => ({ success: true, message })

exports.UpdateProductDTO = (
    token,
    itemCode,
    productName,
    regularPrice,
    salePrice,
    size,
    stock,
    SKU,
    categoryid,
    tagsid,
    description,
    images,
    productTypeids,
    brandid,
    netWeight
) => ({
    token,
    itemCode,
    productName,
    regularPrice,
    salePrice,
    size,
    stock,
    SKU,
    categoryid,
    tagsid,
    description,
    images,
    productTypeids,
    brandid,
    netWeight
})

exports.GetAllProductsResDTO = (result, message="All Products Fetched Successfully") => ({ success: true, result, message })

exports.GetOneProductDTO = (token, producutID) => ({ token, producutID })
exports.GetOneProductResDTO = (result, message="One Product Fetched Successfully") => ({ success: true, result, message })

exports.ProductErrorResDTO = (message = "Something went wrong") => ({ success: false, message })
