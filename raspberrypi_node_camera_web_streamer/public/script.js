function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

let lastAlertStat = false;

const play = () => {
  const audio = new Audio(
    "https://assets.mixkit.co/sfx/preview/mixkit-elevator-tone-2863.mp3"
  );
  // audio.muted = true;
  audio.play();
};

const alertSound = async () => {
  const alertron = async (time) => {
    await delay(time);
    play();
    await delay(time);
    play();
    await delay(time);
    play();
    await delay(time * 2);
  };

  await alertron(500);
  await alertron(500);
  await alertron(500);
};

// const isAlarmed = () => {
//   fetch("http://codepi.local:3000/api/true-or-false")
//     .then((response) => response.json())
//     .then((data) => console.log(data.value));
// };

const myPeriodicMethod = () => {
  console.log("before-----");
  // console.log("data.value:", data.value);
  console.log("lastAlertStat:", lastAlertStat);
  $.ajax({
    url: "http://codepi.local:3000/api/true-or-false",
    success: (data) => {
      if (data.value) {
        if (!lastAlertStat) {
          console.log("true------");
          lastAlertStat = true;
          alertSound();
          console.log("data.value:", data.value);
          console.log("lastAlertStat:", lastAlertStat);
        } else {
          lastAlertStat = false;
          console.log("false-------");
          console.log("data.value:", data.value);
          console.log("lastAlertStat:", lastAlertStat);
        }
      }
      // console.log(data.value);
    },
    complete: () => {
      // schedule the next request *only* when the current one is complete:
      setTimeout(myPeriodicMethod, 5000);
    },
  });
};

myPeriodicMethod();
