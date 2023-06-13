const express = require("express");
const app = express();
const mqtt = require("mqtt");
const payload = require("./Model/payload_model");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const { v4: uuidv4 } = require("uuid");
const ObjectID = require("mongodb").ObjectId;
const user_router = require("./Routes/user_routes");
const payload_router = require("./Routes/payload_routes");
const auth_router = require("./Routes/Auth_routes");
var request = require("request");
var cookies = require("cookie-parser");

app.use(cookies());
app.use(express.json());

//Routes
app.use("/", auth_router);
app.use("/users", user_router);
app.use("/payload", payload_router);

// Connection variables
let broker_host = "10.158.251.71";
let broker_port = 1883;
//let client_id = 'ys_client';

// Publish variables
let pub_topic = "/test/version1/publish/";
let message = { name: "Nithin", age: "20", surname: "Shine" };
let pub_options = { qos: 0, retain: false };

// Subscribe variables
let sub_topic = "/test/version1/publish/";
let sub_options = { qos: 0 };

const connection_options = {
  port: broker_port,
  host: broker_host,
  //clientId: client_id,
  reconnectPeriod: 1000, // Try reconnecting in 5 seconds if connection is lost
};

const client = mqtt.connect(connection_options);

client.on("message", async function (topic, message) {
  json_message = JSON.parse(message.toString());
  console.log(
    "Received message " + message.toString() + " on topic: " + topic.toString()
  );
  //const newId = uuidv4();
  const newObjectId = new ObjectID();
  const newdata = {
    _id: newObjectId,
    name: json_message.name,
    age: json_message.age,
    surname: json_message.surname,
  };
  request.post("http://127.0.0.1:3000/payload", newdata);
  console.log(newdata);
  console.log("Data send to MongoDB");
});

//Establishing connection - Subscribing and Publishing
client.on("connect", async function () {
  console.log("Connection successful");
  client.subscribe(sub_topic, sub_options, function (err) {
    if (err) {
      console.log("An error occurred while subscribing");
    } else {
      console.log("Subscribed successfully to " + sub_topic.toString());
    }
  });

  while (client.connected) {
    client.publish(
      pub_topic,
      JSON.stringify(message),
      pub_options,
      function (err) {
        if (err) {
          console.log("An error occurred during publish");
        } else {
          console.log("Published successfully to " + pub_topic.toString());
        }
      }
    );

    // Delay of 5 seconds
    //await new Promise(resolve => setTimeout(resolve, 5000));
    await new Promise((resolve) => setInterval(resolve, 5000));
  }
});

// Handle errors
client.on("error", function (error) {
  console.log("Error occurred: " + error);
});

// Notify reconnection
client.on("reconnect", function () {
  console.log("Reconnection starting");
});

// Notify offline status
client.on("offline", function () {
  console.log("Currently offline. Please check internet!");
});

module.exports = app;
