const mongoose = require('mongoose')

const mangaSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 300,
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  image: {
    type: String
  },
  categories: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "categories",
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
    index: true
  },
  isDelete:{
    type: Boolean,
    default: false
  },
  view: {
    type: Number,
    default:0
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('mangas', mangaSchema)
