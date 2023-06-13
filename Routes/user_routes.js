const express = require("express");
User_controller = require(`./../Controllers/UserControllers`);
Auth_Controller = require(`./../Controllers/AuthControllers`);

const router = express.Router();

router
  .route("/")
  .get(Auth_Controller.protect, User_controller.get_users)
  .post(User_controller.create_user);

router
  .route("/:id")
  .get(User_controller.get_user)
  .patch(User_controller.update_user)
  .delete(User_controller.delete_user);

module.exports = router;
