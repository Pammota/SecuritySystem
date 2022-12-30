function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const play = () => {
  const audio = new Audio(
    "https://assets.mixkit.co/sfx/preview/mixkit-elevator-tone-2863.mp3"
  );
  audio.play();
};

$("#buttonpress").click(async () => {
  const alertron = async (time) => {
    await delay(time);
    play();
    await delay(time);
    play();
    await delay(time);
    play();
    await delay(time*2);
  };

  await alertron(500);
  await alertron(500);
  await alertron(500);
});
