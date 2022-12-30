const express = require("express");
const app = express();
const fs = require("fs");
const port = 3000;

const Gpio = require("onoff").Gpio;

const pir = new Gpio(21, "in", "both");

let activating = 0;
let isMoving = 0;

pir.watch(function (err, value) {
  if (err) exit();
  //let blinkInterval = setInterval(blinkLED, 250);

  console.log(`Intruder nr. ${activating++} detected, value ${value}`);
  isMoving = value;
});

// start capture
const videoStream = require("./videoStream");
videoStream.acceptConnections(
  app,
  {
    width: 3280 ,
    height: 2464,
    fps: 30,
    encoding: "JPEG",
    quality: 30, // lower is faster, less quality
  },
  "/stream.mjpg",
  true
);

app.get('/api/true-or-false', (req, res) => {

    // If the random number is less than 0.5, send a response with a value of "true"
    if ( isMoving ) {
      res.send({ value: true });
    } else {
      // Otherwise, send a response with a value of "false"
      res.send({ value: false });
    }
  });

app.use(express.static(__dirname + "/public"));
app.listen(port, () =>
  console.log(
    `Example app listening on port ${port}! In your web browser, navigate to http://localhost:3000`
  )
);
