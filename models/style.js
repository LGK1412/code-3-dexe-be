const mongoose = require('mongoose')

const styleSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    isHide: {
        type: Boolean
    },
    description: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("style", styleSchema)