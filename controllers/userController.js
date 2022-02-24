const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handleFactory.js');

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) cretae error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    next(
      new AppError(
        'this route is not for password update, please /updateMyPassword',
        400
      )
    );
  }
  //2) filter unwanted data
  const filterBody = filterObj(
    req.body,
    'name',
    'email',
    'depositAmount',
    'depositType',
    'tempDepositPlan',
    'paymentRequest',
    'confirmEmail'
  );
  // if (req.file) filterBody.photo = req.file.filename;
  //3) update user
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllUsers = catchAsync(async (req, res) => {
  try {
    const users = await User.find({ active: { $ne: false } });
    res.status(200).json({
      users,
    });
  } catch (error) {
    return next(new AppError('Can get users at the moment'), 500);
  }
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.body._id,
      { active: false },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      user,
    });
  } catch (error) {
    return next(new AppError('Could not delete user'), 500);
  }
});
//DO NOT UPDATE PASSWORD WITH THIS ROUTE
exports.updateUser = factory.updateOne(User);
// exports.deleteUser = factory.deleteOne(User);
// exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User, { path: 'investments' });
