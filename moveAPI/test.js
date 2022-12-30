const Gpio = require("onoff").Gpio;
const LED1 = new Gpio(2, "out");
const LED2 = new Gpio(4, "out");
const LED3 = new Gpio(17, "out");
let state = 2;

const pir = new Gpio(27, "in", "both");

pir.watch(function(err, value) {
  if (err) exit();
  let blinkInterval = setInterval(blinkLED, 250);

  console.log("Intruder detected");
  console.log("Pi Bot deployed successfully!");
  console.log("Guarding the raspberry pi 3...");

  setTimeout(endBlink, 15000);

  function endBlink() {
    clearInterval(blinkInterval);
    LED1.writeSync(0);
    LED1.unexport();
    LED2.writeSync(0);
    LED2.unexport();
    LED3.writeSync(0);
    LED3.unexport();

    //included when we are working with sensors
    pir.unexport();
    process.exit();
  }
});

function blinkLED() {
  if (state == 2) {
    if (LED1.readSync() === 0) {
      LED1.writeSync(1);
    } else {
      LED1.writeSync(0);
      state = 4;
    }
  } else if (state == 4) {
    if (LED2.readSync() === 0) {
      LED2.writeSync(1);
    } else {
      LED2.writeSync(0);
      state = 6;
    }
  } else {
    if (LED3.readSync() === 0) {
      LED3.writeSync(1);
    } else {
      LED3.writeSync(0);
      state = 2;
    }
  }
}