"use strict";
const express = require('express');
const axios = require('axios').default;
let router = express.Router();
const addr = "http://localhost:5000";

let coreController = require('./controllers/coreController.js');
router.get('/', coreController.home);
router.get('/about', coreController.about);
router.get('/services', coreController.services);
router.post('/analysis', (req, res) => {
    if(req.user){
        axios.post(`${addr}/sendData`, {
            secret: 'SKOLTECH',
            sequence: req.body.sequence.toUpperCase(),
            position: req.body.position,
            wildtype: req.body.sequence[req.body.position-1].toUpperCase(),
            mutation: req.body.mutation.toUpperCase(),
            ph: req.body.ph,
            temp: req.body.temp,
          })
        .then(function (response) {
            res.status(200).send(JSON.stringify({answer: response.data, data: req.body}));
          })
        .catch(function (error) {
            res.status(200).send(JSON.stringify({"error": error.message}));
        });
    }
});
router.get('/ping', (req,res)=>{
  axios.get(`${addr}/ping`)
  .then(function (response) {
    if(response.data.answer == "pong"){
      res.status(200).send(response.data);    
    }
  })
  .catch(function (error) {
    res.status(200).send(JSON.stringify({"error": "No connection to server!"}));
  });
})

module.exports = router;