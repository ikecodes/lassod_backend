const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION 😁');
  process.exit(1);
});

const app = require('./app');
///git test
const localDB = 'mongodb://localhost:27017/lassad';
const DB =
  'mongodb+srv://frank:2evaahpe84z9vRPD@cluster0.ege29.mongodb.net/cryton2?retryWrites=true';

mongoose
  .connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('successfully connected to database 😁');
  });

const port = 5000;

const server = app.listen(process.env.PORT || port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION 😁');
  server.close(() => {
    process.exit(1);
  });
});

/////////////////SIGTERM
process.on('SIGTERM', () => {
  console.log('👋🏾 SIGTERM recieved shutting down gracefully');
  server.close(() => {
    console.log('process terminated 🔥');
  });
});
