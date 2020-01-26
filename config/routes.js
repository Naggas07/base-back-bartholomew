const express = require('express');
const router = express.Router();
const controller = require('../controllers/base.controller');
const userController = require('../controllers/user.controller')

router.get('/', controller.base);
router.post('/users', userController.create)
router.post(`/users/login`, userController.login)

module.exports = router;