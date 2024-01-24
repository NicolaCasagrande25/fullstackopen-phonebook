const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'User name required'],
  },
  number: {
    type: String,
    minLength: 8,
    required: [true, 'User phone number required'],
    validate: {
      validator: (v) => {
        return /^\d{2,3}-\d*$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number! A valid phone number should be in the form 09-1234556 or 040-22334455!`
    }
  },
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)