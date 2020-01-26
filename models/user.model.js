const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_WORK_FACTOR = 10

const userSchema = new Schema({
    user: { 
        type: String,
        required: true,
        uppercase: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        minlength: [3, 'El nombre necesita al menos 3 caracteres']
    },
    lastName:{
        type: String,
        required: true,
        minlength: [3, 'Los apellidos necesitan al menos 3 caracteres']
    },
    password:{
        type: String,
        required: [true, 'la constraseña es requerida'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        match: EMAIL_PATTERN
    },
    avatar:{
        type: String
    },
    rol:{
        type: String,
        enum: ['Admin', 'User'],
        default: 'User',
        required: true
    },
    state: {
        type: String,
        required: true,
        enum: ['Activo', 'Bloqueado', 'Baja'],
        default: 'Activo'
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, res) => {
            res.id = doc._id
            delete res._id
            delete res.__v
            delete res.password
            return res
        }
    }
})


userSchema.pre('save', function (next) {
    const user = this;
  
    if (user.isModified('password')) {
      bcrypt.genSalt(SALT_WORK_FACTOR)
        .then(salt => {
          return bcrypt.hash(user.password, salt)
            .then(hash => {
              user.password = hash;
              next()
            })
        })
        .catch(error => next(error))
    } else {
      next()
    }
  })

  userSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password)
  }

  const User = mongoose.model('User', userSchema)

  module.exports = User