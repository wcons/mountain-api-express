const mongoose = require('mongoose')

const mountainSchema = new mongoose.Schema({
  peak: {
    type: String,
    required: true
  },
  height: {
    type: String,
    required: true
  },
  lat: {
    type: String,
    required: true
  },
  long: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Mountain', mountainSchema)
