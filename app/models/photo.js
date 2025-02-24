// models/photo.js
const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  album: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',        // fait référence au modèle "Album"
    required: true
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'photos',
  versionKey: false
}).set('toJSON', {
    transform: (doc, ret) => {
      ret.id = ret._id
  
      delete ret._id
    }
});

module.exports = PhotoSchema;
