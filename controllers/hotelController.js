const Hotel = require('./../models/hotelModel');
const catchAsync = require('./../utils/catchAsync');
const ObjectId = require('mongodb').ObjectId;
const cloudinary = require('./../utils/cloudinary');

exports.create = catchAsync(async (req, res, next) => {
  //   const fileStr = req.body.photo;
  //   const { secure_url } = await cloudinary.uploader.upload(fileStr, {
  //     upload_preset: 'product_images',
  //   });

  const newHotel = await Hotel.create({
    name: req.body.name,
    location: req.body.location,
    photo: req.body.photo,
    description: req.body.description,
    state: req.body.state,
    city: req.body.city,
  });
  res.status(200).json({
    status: 'successfull',
    message: 'Hotel successfully create',
    newHotel,
  });
});
exports.getHotels = catchAsync(async (req, res, next) => {
  const hotels = await Hotel.find();
  res.status(200).json({
    status: 'successfull',
    hotels,
  });
});
exports.update = catchAsync(async (req, res, next) => {
  var objRooms = {
    _id: new ObjectId(),
    name: 'standard room',
    price: 9000,
    image:
      'https://media.hotels.ng/img/h1438118/swiss-international-beland-hotel-1438118-25.jpg',
  };
  const updatedHotel = await Hotel.findByIdAndUpdate(
    { _id: req.body.id },
    { $push: { rooms: objRooms } },
    {
      new: true,
      runValidators: false,
    }
  );
  res.status(200).json({
    status: 'successfull',
    message: 'Hotel successfully update',
    updatedHotel,
  });
});
