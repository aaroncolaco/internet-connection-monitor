'use strict'
const ping = require('ping');
const fs = require('fs');
const moment = require('moment');

const hosts = ['google.com', 'yahoo.com'];

const timeInterval = 1000 * 30;

let internetDownFlag = false;

const checkInternet = () => {
  hosts.map(host => {
    ping.sys.probe(host, (isActive) => {

      if (isActive && internetDownFlag) {
        // append timestamp on current line to show internet is back
        addTimestamp(' --> ');
        internetDownFlag = false;
      } else if (!isActive && !internetDownFlag) {
        // if net wasn't already down, add timestamp on new line
        addTimestamp("/n");
        internetDownFlag = true;
      };
    });
  });
};

const addTimestamp = specialChar => {
  fs.appendFile('./downtime.txt', specialChar + getDate(), err => {
    if (err) {
      console.error(err);
    };
  });
};

const getDate = () => {
  const date = moment().format('ddd MMM Do, h:mm a');

  return date;
};

// method repeats a given function at every given time-interval
checkInternet();
setInterval(checkInternet, timeInterval);