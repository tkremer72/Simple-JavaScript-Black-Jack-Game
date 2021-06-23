import { cardTemplate } from './templates';
import { wait } from './utils';

import {
  dealerEl, playerEl, buttonsEl, updateLabel, status, render, addCard
} from './elements';

import {
  createDeck, pop, countHand, dealInitialHand, flipCardDown, flipCardUp
} from './cards';

//Generate the cards in the deck
const deck = createDeck();

//Get and display the dealers hand
const dealerHand = new Set();
dealInitialHand(dealerHand, deck);
flipCardDown([ ...dealerHand ][0]);

//Get and display the players hand
const playerHand = new Set();
dealInitialHand(playerHand, deck);

//Show the dealer and the players hand
render(dealerEl, dealerHand);
render(playerEl, playerHand);

//Dealer takes his turn after player takes their turn
function* dealerPlay() {
  dealerEl.querySelector('.card').classList.add("flipped");
  // keep hitting until you at least tie
  while( countHand(dealerHand) < countHand(playerHand) ) {
    addCard(dealerEl, dealerHand, pop(deck));
    yield;
  }
  // if tied but less than 17, hit again for the win
  if ( countHand(dealerHand) === countHand(playerHand) ) {
    if (countHand(dealerHand) < 17) {
      addCard(dealerEl, dealerHand, pop(deck));
      yield;
    }
  }
}
//Function to set the delay so we can see the dealer play
function dealerTurn(callback) {
  wait(dealerPlay(), 1000, callback);
}
//Player draws cards
function hit() {
  addCard(playerEl, playerHand, pop(deck));
  updateLabel(playerEl, playerHand);
  const score = countHand(playerHand);
  if (score > 21) {
    buttonsEl.classList.add('hidden');
    status('Bust!');
  } else if (score === 21) {
    stay();
  }
}
//Player stays his/her hand
function stay() {
  buttonsEl.classList.add('hidden');
  dealerEl.querySelector('.score').classList.remove('hidden');
  dealerTurn(() => {
    updateLabel(dealerEl, dealerHand);
    const dealerScore = countHand(dealerHand);
    const playerScore = countHand(playerHand);
    if (dealerScore > 21 || dealerScore < playerScore) {
      status('You win!');
    } else if (dealerScore === playerScore) {
      status('Tie Game.');
    } else {
      status('Dealer wins!');
    }
  });
}
//Restart the game, or in this case reload the page
function restartGame() {
  window.location.reload();
}
//Get the various elements and listen for click events and call functions to action
document.querySelector('.hit-me').addEventListener('click', hit);
document.querySelector('.stay').addEventListener('click', stay);
document.querySelector('.restart').addEventListener('click', restartGame);
