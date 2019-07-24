const mongoose = require('mongoose')

const uploadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  tags: {
    type: String,
    required: false
  }

}, {
  timestamps: true
})

module.exports = mongoose.model('Upload', uploadSchema)
