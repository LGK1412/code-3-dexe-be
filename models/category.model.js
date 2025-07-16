const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name:{
        type: String,
        unique: [true, "Tên thể loại phải độc nhất!"]
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("categories", categorySchema)