const mongoose = require('mongoose')
const Schema = mongoose.Schema

require('./user.model')

const departmentSchema = new Schema({
    name:{
        type: String,
        required: true,
        minlength: [3, 'El nombre del departamento debe tener al menos 3 caracteres']
    },
    state:{
        type: String,
        enum: ['Activo', 'Baja', 'Bloqueado'],
        default: 'Activo'
    }
},{
    timestamps: true,
    toJSON:{
        virtuals: true,
        transform: (doc, res) => {
            res.id = doc.id
            delete res._id
            delete res.__v
            return res
        }
    }
})

departmentSchema.virtual('users', {
    ref: 'User',
    localField: '_id',
    foreignField: 'department',
    justOne: false
})

const Department = mongoose.model('Department', departmentSchema)

module.exports = Department