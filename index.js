import "./style.scss";
import _ from "lodash";

const MAX_NO_OF_CARDS = 30;
const ALL_CARDS = _.range(1, MAX_NO_OF_CARDS + 1);
const DIFFICULTIES = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
};
const CARD_COUNTS_FOR_DIFFICULTY = {
  [DIFFICULTIES.EASY]: 12,
  [DIFFICULTIES.MEDIUM]: 20,
  [DIFFICULTIES.HARD]: 30,
};

const cardsContainer = document.getElementById("game");
const turnsDom = document.getElementById("turns");
const restartDom = document.getElementById("restart");
const difficultiesDomButtons = document.querySelectorAll(".difficulty-button");
let hasFlippedCard = false;
let unflipInterval = null;
let turns = 0;
let lockBoard = false;
let firstCard, secondCard;
let difficulty  = DIFFICULTIES.EASY;

const getCards = (count) => {
  const subset = _.slice(_.sortBy(ALL_CARDS, Math.random), 0, count);
  return _.sortBy([...subset, ...subset], Math.random);
};

const incrementTurns = () => {
  turns += 1;
  turnsDom.innerHTML = turns;
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  if(isMatch) {
    disableCards()
  } else {
    unflipInterval = setTimeout(resetFlips, 1500);
  }
}

function disableCards() {
  firstCard.removeEventListener('click', onFlipClick);
  secondCard.removeEventListener('click', onFlipClick);
  firstCard.classList.add("disabled");
  secondCard.classList.add("disabled");
  resetFlips();
}

function resetFlips() {
  if(firstCard) {
    firstCard.classList.remove('flip');
  }
  if(secondCard) {
    secondCard.classList.remove('flip');
  }
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function onFlipClick() {
  if(secondCard) {
    resetFlips();
    clearInterval(unflipInterval);
  }
  if (this === firstCard) return;
  this.classList.add('flip');
  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }
  secondCard = this;
  incrementTurns();
  checkForMatch();
}


const restartGame = () => {
  resetFlips();
  const count = CARD_COUNTS_FOR_DIFFICULTY[difficulty];
  const newCards = getCards(count);
  turns = 0;
  turnsDom.innerHTML = "0";
  cardsContainer.innerHTML = _.join(_.map(newCards, c => `<div class="memory-card" data-framework="${c}">
      <div class="front-face">
        <img src="/images/${c}.webp" alt="" />
      </div>
      <div class="back-face">
        <img src="images/flower.webp" alt="" />
      </div>
    </div>`), "");
  const cards = document.querySelectorAll('.memory-card');
  cards.forEach(card => card.addEventListener('click', onFlipClick));
}

function changeDifficulty() {
  difficulty = this.dataset.difficulty;
  cardsContainer.className = difficulty;
  difficultiesDomButtons.forEach(b => { b.classList.remove("selected"); })
  document.querySelector(`.difficulty-button[data-difficulty="${difficulty}"]`).classList.add("selected");
  restartGame();

}

difficultiesDomButtons.forEach(card => card.addEventListener('click', changeDifficulty));

restartDom.addEventListener("click", restartGame);

restartGame();