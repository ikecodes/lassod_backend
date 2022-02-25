const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
exports.create = catchAsync(async (req, res, next) => {
  const newBooking = await Booking.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    hotel: req.body.hotel,
    roomname: req.body.roomname,
    days: req.body.days,
    amount: req.body.amount,
    fulldate: req.body.fulldate,
  });
  res.status(200).json({
    status: 'successfull',
    message: 'Booking successfull',
    newBooking,
  });
});
