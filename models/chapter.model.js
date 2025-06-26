const mongoose = require('mongoose')

const chapterSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 150,
    },
    image: [
        {
            type: String,
            required: true
        }
    ],
    mangaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mangas',
        required: true,
        index: true
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('chapters', chapterSchema)
