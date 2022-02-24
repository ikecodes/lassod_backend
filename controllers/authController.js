const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign(
    { id },
    'i-am-a-bad-ass-programmer-and-you-cant-hack-me-bitch',
    {
      expiresIn: 90 * 24 * 60 * 60 * 1000,
    }
  );
};
const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  user.password = undefined;
  res.status(statusCode).json({
    token,
    user,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (user)
    return next(
      new AppError(
        'email not available, please register with another email address',
        400
      )
    );

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    country: req.body.country,
    phone: req.body.phone,
    referToken: req.body.referalId,
  });

  newUser.createReferLink(newUser.email);
  newUser.createEmailConfirmToken();

  await newUser.save({
    validateBeforeSave: false,
  });

  res.status(200).json({
    message: 'Your account was successfully created, proceed to login',
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1)check if email and password exists
  if (!email || !password) {
    return next(new AppError('please provide email and password!', 400));
  }
  //2) check if user exists and password is correct
  const user = await User.findOne({ email, password });

  if (!user) {
    return next(new AppError('incorrect email or password!', 401));
  }
  if (user.active === false)
    return next(new AppError('This account has been deactivated'));
  //3)if everything is okay, send token to client
  createAndSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError(
        'You are not logged in! or token expired Please log in to get access.',
        401
      )
    );
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(
    token,
    'i-am-a-bad-ass-programmer-and-you-cant-hack-me-bitch'
  );
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles is an array ['admin', 'lead-guide']
    if (!roles.includes(req.user.role)) {
      return next(
        // 403 forbiden
        new AppError('you do no have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    await sendEmail({
      email: user.email,
      subject: 'your password reset token',
      name: user.name,
      token: resetToken,
      type: 'resetPassword',
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) get user based on token
  const user = await User.findOne({
    passwordResetToken: req.body.passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //2) set new password id token !expired and user still exists
  if (!user) {
    return next(new AppError('token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();

  res.status(200).json({
    message: 'success',
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (req.body.passwordCurrent !== user.password) {
    return next(new AppError('your current password is incorrect', 401));
  }
  //3)update password
  user.password = req.body.password;
  await user.save();
  //4) LOG THE USER IN
  createAndSendToken(user, 200, res);
});
