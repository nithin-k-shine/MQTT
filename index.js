const mqtt = require('mqtt');
const payload = require('./Model/payload_model');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// Connection variables
let broker_host = '10.158.251.71';
let broker_port = 1883;
//let client_id = 'ys_client';

mongoose.connect(process.env.DATABASE,{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
    });

// Publish variables
let pub_topic = '/test/version1/publish/';
let message = {name:"Nithin",age:"20",surname:"Shine"};
let pub_options = {qos: 0, retain: false};

// Subscribe variables
let sub_topic = '/test/version1/publish/';
let sub_options = {qos: 0};


const connection_options = {
    port: broker_port,
    host: broker_host,
    //clientId: client_id,
    reconnectPeriod: 1000 // Try reconnecting in 5 seconds if connection is lost
};

const client = mqtt.connect(connection_options);

client.on('message', function (topic, message) {
    json_message = JSON.parse(message.toString());
    console.log("Received message " + message.toString() + " on topic: " + topic.toString());
    console.log(json_message);
    const newdata = payload.create({
        name: json_message.name,
        age: json_message.age,
        surname: json_message.surname
    });
    console.log("Data send to MongoDB")
})

client.on('connect', async function () {
    console.log('Connection successful');
    client.subscribe(sub_topic, sub_options, function (err) {
        if (err) {
            console.log("An error occurred while subscribing")
        } else {
            console.log("Subscribed successfully to " + sub_topic.toString())
        }
    });

    while (client.connected) {
        client.publish(pub_topic, JSON.stringify(message), pub_options, function (err) {
            if (err) {
                console.log("An error occurred during publish")
            } else {
                console.log("Published successfully to " + pub_topic.toString())
            }
        });

        // Delay of 5 seconds
        //await new Promise(resolve => setTimeout(resolve, 5000));
        await new Promise(resolve => setInterval(resolve, 5000));
    }
})

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