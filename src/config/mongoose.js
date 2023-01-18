import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })
/**
 * Mongoose configuration.
 *
 * @author Hampus Nilsson
 * @version 1.0.0
 */

/**
 * Establishes a connection to a database.
 *
 * @returns {Promise} Resolves to this if connection succeeded.
 */
export const connectDB = async () => {
  const { connection } = mongoose

  connection.on('connected', () => console.log('MongoDB connection opened.'))
  connection.on('error', err => console.error(`MongoDB connection error occurred: ${err}`))
  connection.on('disconnected', () => console.log('MongoDB is disconnected.'))

  process.on('SIGINT', () => {
    connection.close(() => {
      console.log('MongoDB disconnected due to application termination.')
      process.exit(0)
    })
  })

  return mongoose.connect(process.env.DB_CONNECTION_STRING)
}
