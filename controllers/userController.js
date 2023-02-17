const User = require('./../models/userModel')
const Game = require('../models/gameModel')
const Player = require('../models/playerModel')

const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const factory = require('./handlerFactory')

const filterObj = (obj, ...allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el]
  })
  return newObj
}

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    return next(new AppError('No user found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  })
})

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    )
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email', 'games', 'active')

  // 3) Update user document
  let updatedUser = ''
  if (req.body.addingGame) {
    updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { games: req.body.games },
      },
      { new: true, runValidators: true }
    )
  }
  if (req.body.deletingGame) {
    updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $pull: { games: req.body.games },
      },
      { new: true, runValidators: true }
    )
  }
  if (!req.body.addingGame && !req.body.deletingGame) {
    updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    })

    const deleteGameEndPleyers = catchAsync(async (game) => {
      await Game.findByIdAndDelete(game._id)
      await Player.deleteMany({ gameId: game._id })
    })

    if (req.body.active === false && updatedUser.games) {
      updatedUser.games.forEach((game) => {
        deleteGameEndPleyers(game)
      })
    }
    if (req.body.active === false && updatedUser.players) {
      updatedUser.players.forEach((player) => {
        console.log('2')
        deleteItem(player, Player)
      })
    }
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })

  res.status(204).json({
    status: 'success',
    data: null,
  })
})

exports.getAllUsers = factory.getAll(User)
exports.updateUser = factory.updateOne(User)
exports.getUser = factory.getOne(User)
exports.getAllUsers = factory.getAll(User)
exports.deleteUser = factory.deleteOne(User)
