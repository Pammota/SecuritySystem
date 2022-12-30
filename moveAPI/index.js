const express = require('express');
const app = express();

const Gpio = require("onoff").Gpio;

const pir = new Gpio(21, "in", "both");

let activating = 0;
let isMoving = 0;

pir.watch(function(err, value) {
  if (err) exit();
  //let blinkInterval = setInterval(blinkLED, 250);

  console.log(`Intruder nr. ${activating++} detected, value ${value}`);
  isMoving = value;
});

app.get('/api/true-or-false', (req, res) => {

  // If the random number is less than 0.5, send a response with a value of "true"
  if ( isMoving ) {
    res.send({ value: true });
  } else {
    // Otherwise, send a response with a value of "false"
    res.send({ value: false });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));