const Game = require('../models/gameModel')
const factory = require('./handlerFactory')

exports.getAllGames = factory.getAll(Game)
exports.getGame = factory.getOne(Game)
exports.updateGame = factory.updateOne(Game)
exports.deleteGame = factory.deleteOne(Game)
exports.createGame = factory.createOne(Game)
