const sharp = require('sharp')
const multer = require('multer')
const request = require('request')
const fs = require('fs')
const path = require('path')

const Player = require('../models/playerModel')
const factory = require('./handlerFactory')
const catchAsync = require('../utils/catchAsync')
const AppError = require('./../utils/appError')
const { setTimeout } = require('timers/promises')

exports.getAllPlayer = factory.getAll(Player)
exports.getPlayer = factory.getOne(Player)
exports.updatePlayer = factory.updateOne(Player)
exports.deletePlayer = factory.deleteOne(Player)

exports.getPlayerPhoto = catchAsync(async (req, res, next) => {
  const imagePath = path.join('public/img/users', req.params.imageName)

  fs.readFile(imagePath, (err, data) => {
    if (err) {
      return res.status(404).send('Image not found')
    }

    res.set('Content-Type', 'image/jpeg')
    res.send(data)
  })
})

exports.getAllGamePlayers = catchAsync(async (req, res, next) => {
  const players = await Player.find({ gameId: req.params.gameId })

  res.status(201).json({
    status: 'success',
    data: {
      data: players,
    },
  })
})
exports.deleteAllGamePlayers = catchAsync(async (req, res, next) => {
  const deletedPlayers = await Player.deleteMany({ gameId: req.params.gameId })

  res.status(204).json({
    status: 'success',
    data: null,
  })
})

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
})

exports.uploadPlayerPhoto = upload.single('photo')

exports.resizePlayerPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next()

  req.file.filename = `user-${req.body.userName}-${Date.now()}.jpeg`

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`)

  next()
})

exports.removeBackground = catchAsync(async (req, res, next) => {
  if (!req.file) return next()
  request.post(
    {
      url: 'https://clippingmagic.com/api/v1/images',
      formData: {
        image: fs.createReadStream(`public/img/users/${req.file.filename}`),
        format: 'result',
        test: 'true',
      },
      auth: {
        user: process.env.CLIPPING_MAGIC_USER,
        pass: process.env.CLIPPING_MAGIC_PASS,
      },
      followAllRedirects: true,
      encoding: null,
    },
    function (error, response, body) {
      if (error) {
        console.error('Request failed:', error)
      } else if (!response || response.statusCode != 200) {
        console.error(
          'Error:',
          response && response.statusCode,
          body.toString('utf8')
        )
      } else {
        let imageId = response.caseless.get('x-amz-meta-id')
        let imageSecret = response.caseless.get('x-amz-meta-secret')

        fs.writeFileSync(`public/img/users/${req.file.filename}`, body)
      }
    }
  )
  next()
})

exports.createPlayer = catchAsync(async (req, res, next) => {
  const player = new Player({
    userName: req.body.userName,
    photo: req.file ? req.file.filename : req.body.photo,
    character: req.body.character,
    status: req.body.status,
    LatLng: req.body.LatLng,
    gameId: req.body.gameId,
  })

  player.save().then((result) => {
    res.status(201).json({
      status: 'success',
      data: {
        data: result,
      },
    })
  })
})
