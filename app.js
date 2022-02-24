const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieparser = require('cookie-parser');

const User = require('./models/userModel');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const hotelRouter = require('./routes/hotelRoutes');

const app = express();

app.enable('trust proxy');

app.set('view ebgine', 'react');

// 1) GLOBAL MIDDLEWARES

////fix CORS error
app.use(cors());
app.options('*', cors());
//serving static files
app.use(express.static(path.join(__dirname, 'public')));

//http security headers
app.use(helmet());
//development logging
// app.use(morgan('dev'));

// limit requests for api
const limiter = rateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: 'too many requests from this IP, please try again later',
});
app.use('/api', limiter);

// body parser, reading data into the body (req.body)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieparser());

// data sanitization against NOSQL query injection
app.use(mongoSanitize());

// data sanitizatin against XSS
app.use(xss());

app.use(compression());

app.use('/api/v2/users', userRouter);
app.use('/api/v2/bookings', bookingRouter);
app.use('/api/v2/hotels', hotelRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
