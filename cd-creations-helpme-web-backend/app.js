const express = require('express');
const cors = require('cors');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http'); // Import 'http' module
const socketIO = require('socket.io');

const sequelize = require('./config/database');
const syncModels = require('./config/syncModels');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const subsRouter = require('./routes/subscription');
const driverRouter = require('./routes/driver');
const deliveryRouter = require('./routes/delivery');
const orderRouter = require('./routes/order');
const taxiRouter = require('./routes/taxi');
const socketHandler = require('./socketHandler');

const app = express();
const server = http.createServer(app); // Create HTTP server instance
const io = socketHandler(server);// Initialize Socket.IO with server instance

// Pass io instance to routes
app.set('io', io);

// Sequelize initialization
sequelize.authenticate()
    .then(() => {
      console.log('Connection to the database has been established successfully.');
      return syncModels(); // Sync Sequelize models with the database
    })
    .then(() => {
      // Middleware to parse JSON data
      app.use(express.json());

      // CORS Middleware
      app.use(cors());

      // Pass sequelize instance to routes
      app.use(function(req, res, next) {
        req.sequelize = sequelize;
        next();
      });

      // view engine setup
      app.set('views', path.join(__dirname, 'views'));
      app.set('view engine', 'jade');

      app.use(logger('dev'));
      app.use(express.urlencoded({ extended: false }));
      app.use(cookieParser());
      app.use(express.static(path.join(__dirname, 'public')));

      app.use('/', indexRouter);
      app.use('/users', usersRouter);
      app.use('/subs', subsRouter);
      app.use('/driver', driverRouter);
      app.use('/delivery', deliveryRouter);
      app.use('/order', orderRouter);
      app.use('/taxi', taxiRouter);

      // catch 404 and forward to error handler
      app.use(function(req, res, next) {
        next(createError(404));
      });

      // error handler
      app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
      });
    })
    .catch((error) => {
      console.error('Unable to connect to the database:', error);
    });

module.exports = { app, server, io }; // Export both Express app and HTTP server
