const express = require('express')
const playerController = require('../controllers/playerController')
const authController = require('../controllers/authController')

const router = express.Router()

router
  .get(
    '/gamePlayers/:gameId',
    authController.protect,
    authController.restrictTo('game admin'),
    playerController.getAllGamePlayers
  )
  .delete(
    '/gamePlayers/:gameId',
    authController.protect,
    authController.restrictTo('game admin'),
    playerController.deleteAllGamePlayers
  )

//  it also needs to be protected but because it also reaches the players' page and I haven't forwarded them through authController in the meantime So for now it's not protected.
router.get('/photo/:imageName', playerController.getPlayerPhoto)
router
  .route('/')
  .get(playerController.getAllPlayer)
  .post(
    playerController.uploadPlayerPhoto,
    playerController.resizePlayerPhoto,
    playerController.removeBackground,
    playerController.createPlayer
  )

router.use(authController.protect, authController.restrictTo('game admin'))
router
  .route('/:id')
  .get(playerController.getPlayer)
  .patch(playerController.updatePlayer)
  .delete(playerController.deletePlayer)

module.exports = router
