const User = require("../Model/payload_model");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.send = async (req, res) => {
  try {
    const newObjectId = new ObjectID();
    const newPayload = await Payloads.create({
      _id: newObjectId,
      name: req.body.name,
      surname: req.body.surname,
      age: req.body.age,
    });
    const token = createtoken(newPayload._id);
    res.status(201).json({
      status: "success",
      token,
      data: {
        User: newPayload,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "errorm",
      message: err.message,
    });
  }
};
