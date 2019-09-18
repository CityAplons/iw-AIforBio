const bcrypt = require('bcrypt');

const password = '1235';
console.log(bcrypt.hashSync(password, bcrypt.genSaltSync(8), null));