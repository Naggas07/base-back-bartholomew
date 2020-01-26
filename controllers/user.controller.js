const createError = require('http-errors');
const User = require('../models/user.model')

module.exports.create = (req, res, next) => {
    const user = new User({
        user: req.body.user,
        name: req.body.name,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email,
        avatar: req.body.avatar,
        rol: req.body.rol,
        state: req.body.state
    })

    user.save()
    .then(user => res.status(200).json(user))
    .catch(next)
}

module.exports.login = (req, res, next) => {
    const { user, password } = req.body

    User.findOne({user: user})
    .then(user => {
        user.checkPassword(password)
        .then(match => {
            (!match)? res.status(400).json({message: 'user invalid'}):
            res.json(user)
        })
    })
    .catch(next)
}