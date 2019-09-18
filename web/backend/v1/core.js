let express = require('express');
let router = express.Router();

let coreController = require('./controllers/coreController.js');
router.get('/', coreController.home);
router.get('/about', coreController.about);
router.get('/services', coreController.services);

module.exports = router;