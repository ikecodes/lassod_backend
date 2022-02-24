const Hotel = require('./../models/hotelModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handleFactory.js');
const cloudinary = require('./../utils/cloudinary');

exports.create = catchAsync(async (req, res, next) => {
  const fileStr = req.body.photo;
  const { secure_url, public_id } = await cloudinary.uploader.upload(fileStr, {
    upload_preset: 'product_images',
  });
  // await cloudinary.uploader.destroy(user.cloudinary_id);
  const newHotel = await Hotel.create({
    name: req.body.name,
    location: req.body.location,
    photo: secure_url,
    public_id: public_id,
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
