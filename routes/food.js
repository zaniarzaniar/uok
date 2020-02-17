const express = require('express');
const router = express.Router();

const foodController = require('../controller/food');

router.post('/homeList', foodController.homeList);

router.post('/addFood', foodController.addFood);

router.post('/check', foodController.checkPolling);

module.exports = router;