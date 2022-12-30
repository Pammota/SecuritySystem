const Gpio = require("onoff").Gpio;

const pir = new Gpio(21, "in", "both");

let activating = 0;

pir.watch(function(err, value) {
  if (err) exit();
  //let blinkInterval = setInterval(blinkLED, 250);

  console.log(`Intruder nr. ${activating++} detected, value ${value}`);

  setTimeout(endBlink, 2000);

  function endBlink() {

    //included when we are working with sensors
    //pir.unexport();
    //process.exit();
  }
});

function blinkLED() {
  console.log("Blinked");
}