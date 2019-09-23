"use strict";
const chalk = require('chalk');
const express = require('express');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const compression = require('compression');
const helmet = require('helmet');
const http = require('http');

const app = express();

var server = http.createServer(app);
app.set('port', 3000);

let passport   = require('passport');
let session    = require('express-session');
let bodyParser = require('body-parser');

app.use(helmet());
app.use(compression());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Passport config
app.use(session({ secret: 'skoltech5iw',resave: true, saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());

let users = {};

//Static files
app.use(express.static('public'));

app.use(flash());

//Set handlebars
app.set('views', './views')
app.engine('hbs', exphbs({
    extname: '.hbs',
    defaultLayout: "",
    layoutsDir: "",
}));
app.set('view engine', '.hbs');

//Core router
const coreRouter = require('./v1/core');
app.use('/', coreRouter);

//Auth router
const authRouter = require('./v1/auth');
app.use('/', authRouter);

//Database init
//Models
var models = require("./models");
 
//Sync Database
models.sequelize.sync().then(function() {
    console.log('Database was initializated successfully')
}).catch(function(err) {
    console.log(err, "Something went wrong with database initialization!")
});

//load passport strategies
require('./config/passport/passport.js')(passport, models.user);

//server init
app.listen(app.get('port'), () => {
    console.log(chalk.yellow(`Server alive on port: ${app.get('port')}\nServer PID: ${process.pid}\nUse "kill [pid]" to terminate server!`));
  });
  
  //exit code
  process.on('SIGTERM', function () {
    server.close(() => {
      sequelize.close();
      console.log(chalk.red('Server gracefully stopped!'));
    });
    setTimeout( function () {
      console.error("Could not close connections in time, forcefully shutting down");
      process.exit(1);
     }, 30*1000);
  });