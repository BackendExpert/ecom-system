exports.CreateBrandDTO = (token, brandName) => ({ token, brandName })
exports.CreateBrandResDTO = (message="Brand Created Successfully") => ({ success: true, message })

exports.GetAllBrandsResDTO = (result, message="All Brands Fetched Successfully") => ({ success: true, result, message })

exports.GetOneBrandDTO = (token, brandid) => ({ token, brandid })
exports.GetOneBrandResDTO = (result, message="One Brand Fetched Successfully") => ({ success: true, result, message})

exports.CreateProductTypeDTO = (token, ptName ) => ({ token, ptName })
exports.CreateProductTypeResDTO = (message="Product Type Created Successfully") => ({ success: true, message })

exports.GetAllProductTypesResDTP = (result, message="All Product Types Fetched Successfully") => ({ success: true, result, message })

exports.GetOneProductTypeDTO = (token, ptid) => ({ token, ptid})
exports.GetOneProductTypeResDTO = (result, message="One Product Types Fetched Successfully") => ({ success: true, result, message })

exports.CreateTagDTO = (token, tagName) => ({ token, tagName })
exports.CreateTagResDTO = (message="Product Tag Created Successfully") => ({ success: true, message })

exports.GetAllTagsResDTO = (result, message="All Product Tags Fetched Successfully") => ({ success: true, result, message })

exports.GetOneTagDTO = (token, tagid) => ({ token, tagid })
exports.GetOneTagResDTO = (result, message="One Product Tags Fetched Successfully") => ({ success: true, result, message })

exports.CreateCategoryDTO = (token, catName, catDesc) => ({ token, catName, catDesc })
exports.CreateCategoryResDTO = (result, message="Product Category Created Successfully") => ({ success: true, message })

