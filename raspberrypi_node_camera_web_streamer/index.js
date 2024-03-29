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
    width: 1500,
    height: 1500,
    fps: 25,
    encoding: "JPEG",
    quality: 7, // lower is faster, less quality
  },
  "/stream.mjpg",
  false
);

app.get("/api/true-or-false", (req, res) => {
  if (isMoving) {
    res.send({ value: true });
  } else {
    res.send({ value: false });
  }
});

app.get("/api/absVal", (req, res) => {
    val = pir.readSync();
    console.log(val);
    res.send({ value: val });
});

app.get("/api/temp", (req, res) => {
  const temp = fs.readFileSync("/sys/class/thermal/thermal_zone0/temp");
  const temp_c = temp / 1000;
  res.send({ temperature: temp_c });
});

app.use(express.static(__dirname + "/public"));
app.listen(port, () =>
  console.log(
    `Example app listening on port ${port}! In your web browser, navigate to http://localhost:3000`
  )
);
