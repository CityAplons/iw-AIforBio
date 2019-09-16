"use strict";
const chalk = require('chalk');
const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const fs = require('fs');

const app = express();
var server = http.createServer(app);
app.set('port', 80);
/*
let passport   = require('passport');
let session    = require('express-session');
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Passport config
app.use(session({ secret: 'tusurNikMikh',resave: true, saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());

//Static files
app.use(express.static('public'));

//Set handlebars
app.set('views', './views')
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

let users = {};
*/
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