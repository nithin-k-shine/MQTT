const express = require('express');
Auth_Controller = require(`./../Controllers/AuthControllers`);

const router = express.Router();

router
    .route('/login')
    .get(Auth_Controller.login);

router
    .route('/logout')
    .post(Auth_Controller.logout);

router
.route('/signup')
.post(Auth_Controller.signup)


module.exports = router;