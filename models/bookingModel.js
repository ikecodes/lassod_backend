const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      select: false,
    },
    firstname: {
      type: String,
      required: [true, 'Please tell us your first name!'],
    },
    lastname: {
      type: String,
      required: [true, 'Please tell us your last name!'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      lowercase: true,
    },
    hotel: {
      type: mongoose.Schema.ObjectId,
      ref: 'Hotel',
    },
    roomname: String,
    days: Number,
    amount: Number,
    fulldate: String,
    time: {
      type: String,
    },
  },
  { timestamps: true }
);

bookingSchema.pre(/^find/, function (next) {
  this.populate('hotel');
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
