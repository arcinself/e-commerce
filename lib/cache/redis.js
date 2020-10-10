const redis = require('redis');
const logger = require("../logger/winston");
let client;

const connect = () => {
    return new Promise((resolve, reject) => {
        client = redis.createClient();
        client.on('connect', function(err, res){
            console.log("Successfully connected to redis.");
            return resolve(true);
        });
        client.on('error', function (err, res){
            logger.error("Error connecting to redis ",{err});
            return reject(new Error("Error while connecting to redis."));
        });
    });
}

const getValue = (key) => {
    return new Promise((resolve, reject) => {
        client.get(key, function(err, res){
            if (err) {
                logger.error("Error while getting value",{err});
                return reject(new Error('Error while getting the value.'));
            }
            else{
                console.log("Getting value successful.");
                return resolve(res);
            }
        });
    });
}

const setValue = (key, value) => {
    return new Promise((resolve, reject) => {
        client.set(key, value, function(err, res){
            if (err) {
                logger.error("Error while setting value",{err});
                return reject(new Error('Error while setting the value.'));
            }
            else{
                console.log("Setting value successful.");
                return resolve(res);
            }
        });
    });
}

module.exports = {
    connect,
    getValue,
    setValue
}