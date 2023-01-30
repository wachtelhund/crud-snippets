import mongoose from 'mongoose'
import { User } from './user.js'

const schema = new mongoose.Schema({
  user: {
    type: String,
    required: 'User is required'
  },
  title: {
    type: String,
    required: 'Title is required'
  },
  code: {
    type: String,
    required: 'Code is required'
  },
  language: {
    type: String,
    required: 'Language is required'
  }
}, { timestamps: true })

export const Snippet = mongoose.model('Snippet', schema)
