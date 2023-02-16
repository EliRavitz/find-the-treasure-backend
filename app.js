const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cors = require('cors')

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const userRouter = require('./routes/userRoutes')
const gameRouter = require('./routes/gameRoutes')
const playerRouter = require('./routes/playerRoutes')

const app = express()

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

app.use(
  cors({
    origin: 'https://rad-beignet-2af5da.netlify.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers - good to prevent cross-site scripting attacks
app.use(helmet({ crossOriginResourcePolicy: false }))

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Limit requests from same API
const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
})
app.use('/api', limiter)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }))

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['games', 'numberStations'],
  })
)

// 2) ROUTES
app.use('/api/v1/users', userRouter)
app.use('/api/v1/games', gameRouter)
app.use('/api/v1/players', playerRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app
