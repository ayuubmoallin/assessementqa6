require('dotenv').config() 
const {ROLLBAR_TOKEN} = process.env;
const express = require("express");
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");


const app = express();

// Step-5 Rollbar
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
})
rollbar.log('Hello world!')

app.use(express.json());
app.use(express.static('public'));
const playerRecord = {
  wins: 0,
  losses: 0,
};


// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  try {
    rollbar.log("GET /api/robots");
    // bug-1 botsArr is not defined
    const botsArr = bots;
    res.status(200).send(botsArr);
  } catch (error) {
    console.error("ERROR GETTING BOTS", error);
    rollbar.error(`ERROR GETTING BOTS ${error}`);
    res.sendStatus(400);
    
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {
    rollbar.log("GET /api/robots/shuffled");
    let shuffled = shuffle(bots);
    res.status(200).send(shuffled);
  } catch (error) {
    console.error("ERROR GETTING SHUFFLED BOTS", error);
    rollbar.error(`ERROR GETTING SHUFFLED BOTS ${error}`);
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  try {
    rollbar.log("POST /api/duel");
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      res.status(200).send("You lost!");
    } else {
      playerRecord.wins += 1;
      res.status(200).send("You won!");
    }
  } catch (error) {
    console.log("ERROR DUELING", error);
    rollbar.error(`Error DUELING ${error}`);
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  try {
    rollbar.log("GET /api/player");
    if (req.headers['cache-control'] === 'max-age=0') {
      // Reset playerRecord
      playerRecord.wins = 0;
      playerRecord.losses = 0;
    }
    res.status(200).send(playerRecord);
  } catch (error) {
    console.log("ERROR GETTING PLAYER STATS", error);
    rollbar.error(`ERROR GETTING PLAYER STATS ${error}`);
    res.sendStatus(400);
  }
});

app.listen(8000, () => {
  console.log(`Listening on 8000`);
  rollbar.info('Server started')
});
