/* IMPORTS */

let blackCardsFile = require('./blackCards.js');
let blackCards = blackCardsFile.blackCards;
let whiteCardsFile = require('./whiteCards.js');
let whiteCards = whiteCardsFile.whiteCards;

/* RUNNING THE GAME */

let csPrep41 = ['Matt', 'Anjanie', 'Spencer', 'Alura', 'Andy', 'Sushanth', 'Dylan', 'Nisa', 'Jared', 'Ayu', 'Charles', 'Raubern', 'Kseniia', 'Jinhee', 'David', 'Tina', 'Alex', 'Jae', 'Ryan'];
let players = []; // array to store player objects
let czar; // variable to store the name of the czar for each round
let blanks; // variable to store the number of blanks in each black card drawn
let blackCard; // variable to store black card drawn for each round
let chosenCards = []; // array to store cards chosen by players each round

// function to start a new round
function startRound() {
  chooseCzar(); // choose a card czar for the round
  drawBlackCard(); // draw a black card for the round
  chooseCards(); // players choose cards for the round
  czarChooseWinner(); // czar chooses a winner for the round
  anotherRoundOrEnd(); // play another round or end the game
}

// function to play the entire game
function game() {
  alert(`Welcome to Strings Against Humanity!\n`);
  ageCheck();
  createPlayers(); // declare players array
  initialDraw(); // draw 10 cards per player
  startRound(); // start the first round
}

/* LEGALESE AND AGE REQUIREMENT */

// function that displays user agreement
const legalese = () => {
  //prompts user with Legal Agreement
  let signed = prompt('Please read these Terms & Conditions carefully: \n\nThis game has been created for educational purposes only, and has no connection to Cards Against Humanity LLC. CS Prep Cohort 41 disclaims all liability for your experience playing this game, absent a finding of gross negligence. You also agree to bring your claim in arbitration and strictly on an individual basis. Do you agree to these Terms & Conditions? (yes/no)\n\n');
  // Handles 3 types of responses: yes, no, and nonsense
  if (signed.toLowerCase() === 'y' || signed.toLowerCase() === 'yes') {
    console.log('\nThank you for confirming. This game contains content that some viewers may find disturbing. Viewer discretion advised.\n');
    prompt(`Press Enter to begin the game `);
    console.clear();
  } else if (signed.toLowerCase() === 'n' || signed.toLowerCase() === 'no') {
    console.log('\nYou must agree in order to play.\n');
    legalese();
  } else {
    console.log('\nPlease respond either yes or no:\n');
    legalese();
  }
}

// function that checks to see if user is old enough to play
function ageCheck() {
  //prompts user for age
  let age = prompt('Please enter your age:');
  if (age < 21) {
    console.log('\nYou are too young to play a game with so much vulgarity.\n');
    ageCheck();
  } else if (age >= 21 && age < 120) {
    console.log('\nYou and your disturbing sense of humor are old enough to play. Enjoy!\n');
    prompt(`Press enter to continue `);
    console.clear();
    legalese();
  } else if (age >= 120) {
    console.log('\nYou must still be alive in order to play Strings Against Humanity.\n');
    ageCheck();
  } else if (typeof age !== 'number') {
    console.log('\nPlease enter a number, you idiot.\n');
    ageCheck();
  }
}

/* GAME SETUP:
PLAYERS */

// Player class to create player objects
class Player {
  constructor(name) {
    this.name = name;
    this.score = 0;
    this.hand = [];
  }
  incrementScore() {
    this.score++;
  }
}

// function to prompt user for number of players and create player objects
function createPlayers() {
  // prompt user to input number of players, n
  let numPlayersRegex = /^[2-6]{1}$/; // regular expression to validate user entry
  let n = prompt("How many players will be participating in tonight's tomfoolery?");
  while (!numPlayersRegex.test(n)) {
    n = prompt("\nNumber of players must be between 2 to 6, dingus!");
  }

  // loop through n players
  for (let i = 1; i <= n; i++) {
    let personIndex = Math.floor(Math.random() * csPrep41.length);
    let playerName = csPrep41[personIndex];
    csPrep41.splice(personIndex, 1);
    const newPlayer = new Player(playerName); // use Player constructor to create player
    players.push(newPlayer); // add new player to players array
  }
}

/* GAME SETUP:
DRAWING CARDS */

// function to draw a random card from the deck passed as an argument (white or black)
const drawRandomCard = (deck) => {
  const randomIndex = Math.floor(Math.random() * deck.length); // generate random index
  const randomCard = deck[randomIndex]; // draw random card
  return randomCard; // return random card
};

// function that draws white cards until a player has 10 white cards
function drawWhiteCards(hand) {
  // base case: if array length is 5, return the array
  if (hand.length === 5) return hand;

  // draw random white card, add it to hand, and remove it from deck
  const whiteCard = drawRandomCard(whiteCards);
  hand.push(whiteCard);
  whiteCards = whiteCards.filter((card) => card !== whiteCard);

  // recursive case: invoke function with updated hand array
  return drawWhiteCards(hand);
}

// function that draws cards for each player to start the game
function initialDraw() {
  alert(`\nRandomly choosing players from the class...\n`);

  // loop through players array
  for (let i = 0; i < players.length; i++) {
    alert(`Drawing cards for ${players[i].name}...`);
    players[i].hand = drawWhiteCards(players[i].hand); // draw cards for each player
  }
  prompt(`\nPress Enter to choose the czar for the first round `);
  console.clear();
}

/* GAMEPLAY:
ROUND */

// function that randomly chooses czar from the class
function chooseCzar() {
  const randomIndex = Math.floor(Math.random() * csPrep41.length);
  czar = csPrep41[randomIndex];
  csPrep41.splice(randomIndex, 1); // remove person from array so they cannot be czar again
  alert(`${czar}, you are the czar for this round!\n`);
  
  // prompt user to exit the function when ready
  prompt(`Press Enter to continue `);
  console.clear();
}

// function that draws a random black card and removes it from deck
function drawBlackCard() {
  blackCard = drawRandomCard(blackCards);
  blackCards = blackCards.filter((card) => card !== blackCard); // remove card from array
  alert(`Your card czar ${czar} has chosen the card for the round:\n\n`, blackCard);

  // check if there are 0, 1, or 2 blanks in the black card
  blackCard.match(/______/g) === null
    ? (blanks = 0)
    : (blanks = blackCard.match(/______/g).length);

  // prompt user to exit the function when ready
  prompt(`\nPress Enter to choose white cards for the round `);
  console.clear();
}

// function that displays a player's hand
function displayHand(hand, name) {
  // create string to display each player's current hand
  let displayString = `\n${name}, Here are your current cards:\n\n`;
  for (let i = 0; i < hand.length; i++) {
    displayString += `${i}: ${hand[i]}\n`;
  }
  alert(displayString);
}

function chooseCards() {
  // loop through players array
  for (const player of players) {
    // display the black card
    alert(`Black card: ${blackCard}`);
    // display the player's hand
    displayHand(player.hand, player.name);

    let cardIndexRegex = /^[0-4]{1}$/; // regular expression to check valid index

    // prompt player to choose a card by index
    let firstCardIndex = prompt(`Pick a card by index to fill the (first) blank `);
    while (!cardIndexRegex.test(firstCardIndex)) {
      firstCardIndex = prompt(`\nThe index has to be between 0 and 4, ya goofball!`);
    }
    let firstCard = player.hand[firstCardIndex];
    const playerChoice = [firstCard];

    // if there are two blanks in the black card, have the player choose a second card
    let secondCard;
    if (blanks === 2) {
      let secondCardIndex = prompt(`\nPick a card by index to fill the second blank `);
      while (secondCardIndex === firstCardIndex || !cardIndexRegex.test(secondCardIndex)) {
        if (secondCardIndex === firstCardIndex) {
          secondCardIndex = prompt(`\nYour second card must be different from your first card `);
        }
        if (!cardIndexRegex.test(secondCardIndex)) {
          secondCardIndex = prompt(`\nThe index has to be between 0 and 4, ya goofball!`);
        }
      }
      secondCard = player.hand[secondCardIndex];
      playerChoice.push(secondCard);
    }
    
    // Remove chosen card(s) from the player's hand
    player.hand = player.hand.filter(card => card !== firstCard && card !== secondCard);
    player.hand = drawWhiteCards(player.hand); // draw cards to replenish player hand
    chosenCards.push(playerChoice); // push card(s) chosen by player to array

    prompt(`\nPress Enter to let the next player choose a card `);
    console.clear();
  }
}

// function to display score
function displayScore() {
  let scoreString = `\nThe score is now:\n\n`;
  players.forEach((player) => {
    scoreString += `${player.name}: ${player.score}\n`;
  });
  alert(scoreString);
  prompt(`Press Enter to move on to the next round or end the game `);
  console.clear();
}

// function that displays chosen cards to the czar to judge
function czarChooseWinner() {
  let choicesString = `Ok Czar ${czar}, the black card drawn was: ${blackCard}\n\n`;
  for (let i = 0; i < chosenCards.length; i++) {
    chosenCards[i].length === 2
      ? (choicesString += `${i}: ${chosenCards[i][0]} | ${chosenCards[i][1]}\n`)
      : (choicesString += `${i}: ${chosenCards[i][0]}\n`);
  }
  alert(choicesString);

  let czarFavoriteIndex = prompt(`\nCzar ${czar}, choose your favorite submission by index:\n\n`);
  while (czarFavoriteIndex === "" || Number(czarFavoriteIndex) < 0 || Number(czarFavoriteIndex) > players.length - 1 || Number.isNaN(Number(czarFavoriteIndex))) {
    czarFavoriteIndex = prompt(`Uh...${czar}, you gotta pick an index from 0 to ${players.length - 1} `);
  }

  prompt(`Press Enter to continue `);
  console.clear();

  alert(`${czar} chose ${players[czarFavoriteIndex].name}'s card!`);

  players[czarFavoriteIndex].incrementScore(); // increment score of player with czar's favorite card

  displayScore(); // display current score
  chosenCards = []; // reset chosen cards to an empty array
}

/* GAMEPLAY:
ANOTHER ROUND OR END GAME */

// function that displays winner
function displayWinner() {
  // reduce players array to determine top score
  let topScore = players.reduce((top, current) => {
    return current.score > top ? current.score : top;
  }, 0);

  let winner = [];
  // loop through players array to determine who achieved top score
  players.forEach((player) => {
    if (player.score === topScore) winner.push(player.name);
  });
  
  let winnerString = winner[0];
  winner.forEach((person, index) => {
    if (index !== 0) winnerString += `, ${person} `;
  });

  if (winner.length > 1) {
    alert(`It's a tie! ${winnerString}: fight to determine the winner`);
  } else {
    alert(`Congratulations, ${winner[0]}! You won Strings Against Humanity!`);
  }
}

// function that allows the user to play another round or end the game
function anotherRoundOrEnd() {
  let answer = prompt(`Do you want to play another round? (yes/no)`);
  if (answer === 'yes') {
    console.clear();
    startRound();
  } else {
    console.clear();
    displayWinner();
  }
}

game();
