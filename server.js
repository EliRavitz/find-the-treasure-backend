const mongoose = require('mongoose')
const dotenv = require('dotenv')

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
  console.log(err.name, err.message)
  console.log(err)
  process.exit(1)
})

dotenv.config({ path: './config.env' })
const app = require('./app')

const DB = process.env.DATABASE

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection successful! 😀')
  })

const port = process.env.PORT || 5000
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`)
})

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')
  console.log(err.name, err.message, err)
  server.close(() => {
    process.exit(1)
  })
})

// const mongoose = require('mongoose')
// const dotenv = require('dotenv')

// process.on('uncaughtException', (err) => {
//   console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
//   console.log(err.name, err.message)
//   console.log(err)
//   process.exit(1)
// })

// dotenv.config({ path: './config.env' })
// const app = require('./app')

// const DB = process.env.DATABASE

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(DB, {
//       useNewUrlParser: true,
//       useCreateIndex: true,
//       useFindAndModify: false,
//       useUnifiedTopology: true,
//     })
//   } catch (error) {
//     console.log(error)
//     process.exit(1)
//   }
// }
// const port = process.env.PORT || 5000

// let server
// connectDB()
//   .then(() => {
//     console.log('DB connection successful! 😀')
//   })
//   .then(() => {
//     server = app.listen(port, () => {
//       console.log(`App running on port ${port}...`)
//     })
//   })

// process.on('unhandledRejection', (err) => {
//   console.log('UNHANDLED REJECTION! 💥 Shutting down...')
//   console.log(err.name, err.message, err)
//   server.close(() => {
//     process.exit(1)
//   })
// })
