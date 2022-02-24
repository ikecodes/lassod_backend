const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      unique: true,
    },
    location: {
      type: String,
      required: [true, 'A product must have a location'],
    },
    photo: {
      type: 'String',
      required: [true, 'A product must have a photo'],
    },
    public_id: {
      type: 'String',
      required: [true, 'A product must have a public id'],
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
        _id: mongoose.Types.ObjectId(),
        name: String,
        Amount: Number,
      },
    ],
  },
  { timestamps: true }
);

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;
