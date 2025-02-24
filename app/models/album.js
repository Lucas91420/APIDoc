const mongoose = require('mongoose');

const Album = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: false
  },
  coverUrl: {
    type: String,
    required: false
  }
}, {
  collection: 'albums',     // Nom de la collection dans MongoDB
  minimize: false,
  versionKey: false
}).set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id

    delete ret._id
  }
});

module.exports = Album;
