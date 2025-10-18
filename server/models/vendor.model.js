const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    contactPerson: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    },
    websiteUrl: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Vendor", vendorSchema);