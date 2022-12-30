const Gpio = require("onoff").Gpio;
const LED1 = new Gpio(2, "out");

const pir = new Gpio(21, "in", "both");

const sensor = (err, value) => {
  if (err) exit();

  console.log("Intruder detected");

  setTimeout(endBlink, 10);

  function endBlink() {
    //included when we are working with sensors
    pir.unexport();
    process.exit();
  }
};


while (true) {
  setTimeout(pir.watch(sensor),200);
}