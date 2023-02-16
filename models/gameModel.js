const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
  name: {
    type: String,

    required: [true, 'A game must have a name'],
    trim: true,
    maxlength: [20, 'A gmae name must have less or equal then 20 characters'],
    minlength: [3, 'A gmae name must have more or equal then 3 characters'],
  },
  stations: Array,
  gameInProgress: {
    type: Boolean,
    default: false,
  },
})

const Game = mongoose.model('Game', gameSchema)

module.exports = Game
