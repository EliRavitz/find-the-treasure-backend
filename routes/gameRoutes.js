const express = require('express')
const gameController = require('../controllers/gameController')
const authController = require('../controllers/authController')

const router = express.Router()

router
  .route('/:id')
  .get(gameController.getGame)
  .patch(
    authController.protect,
    authController.restrictTo('game admin'),
    gameController.updateGame
  )
  .delete(
    authController.protect,
    authController.restrictTo('game admin'),
    gameController.deleteGame
  )

router.use(authController.protect)
router.use(authController.restrictTo('game admin'))

router
  .route('/')
  .get(authController.protect, gameController.getAllGames)
  .post(authController.protect, gameController.createGame)

module.exports = router
