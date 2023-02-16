const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  photo: {
    type: Object,
    default: 'face_6.png',
  },

  character: Number,
  status: Number,
  LatLng: Array,
  gameId: String,
})

const Player = mongoose.model('Player', playerSchema)

module.exports = Player
