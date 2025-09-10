const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    isHide: {
        type: Boolean,
        default: false
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    }],
}, {
    timestamps: true
})

module.exports = mongoose.model("group", groupSchema)