const express = require("express");
payload_controller = require(`./../Controllers/PayloadController`);
Auth_Controller = require(`./../Controllers/AuthControllers`);

const router = express.Router();

router.route("/").post(payload_controller.send);

module.exports = router;
