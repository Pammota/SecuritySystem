const express = require('express');
const app = express();

app.get('/api/true-or-false', (req, res) => {
  // Generate a random number between 0 and 1
  const randomNumber = Math.random();

  // If the random number is less than 0.5, send a response with a value of "true"
  if (randomNumber < 0.5) {
    res.send({ value: true });
  } else {
    // Otherwise, send a response with a value of "false"
    res.send({ value: false });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));