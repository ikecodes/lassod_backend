const express = require('express');
const hotelController = require('./../controllers/hotelController');

const router = express.Router();

router
  .route('/')
  .get(hotelController.getHotels)
  .post(hotelController.create)
  .patch(hotelController.update);
module.exports = router;
