const express = require('express');
const router = express.Router();

const userController = require('../controller/user');

router.post('/requestOtp', userController.requestOtp);

router.post('/checkOtp', userController.checkOtp);

router.post('/login', userController.login);

router.post('/signUp', userController.signUp);

router.get('/', (req, res, next) => {
    return res.status(200).json({
        msg: 'connect ok'
    });
});

module.exports = router;