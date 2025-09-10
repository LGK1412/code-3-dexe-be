const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    model_name: {
        type: String,
        unique: true
    },
    description: [
        {
            type: {
                name: String,
                infor: String
            }
        }
    ],
    image_url: {
        type: [String],
    },
    menh_main: {
        type: String
    },
    menh_good: {
        type: [String]
    },
    menh_bad: {
        type: [String]
    },
    huong_good: {
        type: [String]
    },
    huong_bad: {
        type: [String]
    },
    color_main: {
        type: String
    },
    color_good: {
        type: [String]
    },
    color_bad: {
        type: [String]
    },
    isHide: {
        type: Boolean,
        default: false
    },
    inStock: {
        type: Boolean,
        default: false
    },
    quantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    sellQuantity: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    shortDescription: {
        type: String
    },
    style: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'style',
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("products", productSchema)