'use strict'
const ping = require('ping');
const fs = require('fs');
const moment = require('moment');

const hosts = ['google.com', 'yahoo.com'];

const timeInterval = 1000 * 60;

var internetDownFlag = false;

const checkInternet = () => {
  hosts.forEach((host) => {
    ping.sys.probe(host, (isAlive) => {

      if (isAlive && internetDownFlag) {
        // append timestamp to file to show internet is back
        appendTimestamp();
        internetDownFlag = false;
      } else if (!isAlive) {
        // if net wasn't already down, add timestamp on new line
        if (!internetDownFlag) {
          addNewTimestamp();
          internetDownFlag = true;
        };
      };
    });
  });
};

// append timestamp on current line
const appendTimestamp = () => {
  fs.appendFile('./downtime.txt', ' --> ' + getDate(), function(err) {
    if (err) {
      console.log(err);
    };
  });
}

// add timestamp on new line
const addNewTimestamp = () => {
  fs.appendFile('./downtime.txt', '\n' + getDate(), function(err) {
    if (err) {
      console.log(err);
    };
  });
}

const getDate = () => {
  let date = moment().format('ddd MMM Do, h:mm a');

  return date;
};

// method repeats a given function at every given time-interval
setInterval(function() {
  checkInternet();
}, timeInterval);