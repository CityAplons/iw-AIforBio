const express = require('express');
let router = express.Router();
const db = require("../models");
const datatable = require(`sequelize-datatable`);

router.param('user_id', function (req, res, next, id) {
    db.User.findByPk(id)
      .then(user => {
        if (!user) res.sendStatus(404);
        else {
            req.user = user;
            return next();
        }
      })
});

router.get(`/:user_id/datasource`, (req, res) => {
    datatable(db.Data1, req.query, {
        where: {
            user_id: req.user.id,
        }
    })
      .then((result) => {
        // result is response for datatables
        res.send(JSON.stringify(result));
      });
});

module.exports = router;