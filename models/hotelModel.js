const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A hotel must have a name'],
      unique: true,
    },
    location: {
      type: String,
      required: [true, 'A hotel must have a location'],
    },
    photo: {
      type: 'String',
      required: [true, 'A hotel must have a photo'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    state: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a state'],
    },
    city: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a city'],
    },
    rooms: [
      {
        name: String,
        price: Number,
        image: String,
      },
    ],
  },
  { timestamps: true }
);

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
