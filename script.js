console.log("hello from script.js !");

// -----------------
// CONSTANTES
// -----------------

const DIFFICULTY = ["easy", "medium", "hard"];
const COUNTDOWN = [45, 30, 15]; // sec
const SPAWN_COUNT = [3, 2, 1]; // nb d'oeufs par vague
const SPAWN_INTERVAL = [3, 2, 1]; // vague toutes les N secondes
const TICK = 1000; //ms
const DISPLAYED_DURATION = [5, 3, 1]; // durée de vie en ticks

// -----------------
// Events
// -----------------
const EVENT = {
  GAME_OVER: "game-over",
  ITEM_CLICKED: "item-clicked",
};

window.onload = function (e) {
  // -----------------
  // HTML ELEMENTS
  // -----------------
  const GameElement = document.getElementById("game");
  const gameMenu = document.getElementById("game-menu");
  const gameFrame = document.getElementById("game-frame");
  const btnStart = document.getElementById("btn-start");
  const btnStop = document.getElementById("btn-stop");
  const hud = document.getElementById("hud");
  const timerDisplay = document.getElementById("timer");
  const scoreDisplay = document.getElementById("score");
  const gameOverScreen = document.getElementById("game-over");
  const finalScore = document.getElementById("final-score");
  const btnReplay = document.getElementById("btn-replay");
  const DiffRadio = document.querySelectorAll("input[name='difficulty']");

  let Game;
  initGame();

  // -----------------
  // Game LifeCycle
  // -----------------
  function initGame() {
    Game = initGameObject();
    initDisplay(Game.state);
    return Game;
  }
  function initGameObject() {
    const difficulty = getDifficulty();
    const diffIndex = DIFFICULTY.findIndex((d) => d === difficulty);

    if (diffIndex === -1) throw new Error("Unknown Difficulty");

    return {
      element: GameElement,
      config: {
        difficulty,
        spawnCount: SPAWN_COUNT[diffIndex],
        spawnInterval: SPAWN_INTERVAL[diffIndex],
        itemlifetime: DISPLAYED_DURATION[diffIndex],
      },
      state: {
        score: 0,
        displayedItems: [],
        catchedItems: [],
        countdown: COUNTDOWN[diffIndex],
      },
    };
  }

  function startGame() {
    // nettoyer une éventuelle boucle précédante
    clearTimeout(Game.timeoutRef);
    hideGameOver();
    // lancer le jeu
    runloop();
  }

  function runloop() {
    const isTimeOut = Game.state.countdown <= 0;
    if (isTimeOut) return gameOver();

    CleanupOutdatedItems();
    console.log(Game.state.displayedItems);

    // spawn une vague de N oeufs toutes les spawnInterval secondes
    const isSpawnTick = Game.state.countdown % Game.config.spawnInterval === 0;
    if (isSpawnTick) {
      for (let i = 0; i < Game.config.spawnCount; i++) {
        spawnRandomItem();
      }
    }

    UpdateTimer();

    //continue loop
    Game.timeoutRef = setTimeout(runloop, TICK);
  }

  function CleanupOutdatedItems() {
    Game.state.displayedItems
      .map((item) => {
        item.lifetime -= 1;
        return item;
      })
      .forEach((item) => (item.lifetime < 1 ? item.remove() : null));
  }

  function stopGame() {
    stopLoop();
    cleanUpAllItems();
  }
  function gameOver() {
    stopGame();
    showGameOver();
    document.dispatchEvent(new CustomEvent(EVENT.GAME_OVER));
  }
  function showGameOver() {
    finalScore.textContent = `Score: ${Game.state.score}`;
    gameOverScreen.style.display = "flex";
    timerDisplay.style.display = "none";
    hud.style.display = "none";
  }
  function hideGameOver() {
    gameOverScreen.style.display = "none";
    timerDisplay.style.display = "";
    hud.style.display = "";
  }
  function stopLoop() {
    clearTimeout(Game.timeoutRef);
  }
  function cleanUpAllItems() {
    gameFrame.querySelectorAll(".game-item").forEach((item) => item.remove());
  }

  function initDisplay({ score, countdown }) {
    timerDisplay.innerText = countdown;
    scoreDisplay.textContent = `Score: ${score}`;
  }

  // -----------------
  // Timer
  // -----------------
  function UpdateTimer() {
    timerDisplay.innerText = Game.state.countdown -= 1;
  }
  // -----------------
  // Difficulties
  // -----------------
  function getDifficulty() {
    return document.querySelector('input[name="difficulty"]:checked').value;
  }

  // -----------------
  // Items
  // -----------------
  function spawnItem(element, x, y) {
    //item lifecycle
    element.lifetime = Game.config.itemlifetime;

    element.addEventListener("click", () => {
      element.dispatchEvent(
        new CustomEvent(EVENT.ITEM_CLICKED, { bubbles: true }),
      );
    });
    Game.state.displayedItems.push(element);

    // display
    element.style.position = "absolute";
    element.style.left = x + "%";
    element.style.top = y + "%";

    // to the DOM
    gameFrame.appendChild(element);
  }

  function spawnRandomItem() {
    const [x, y] = getRandomPosition();
    const spawners = [spawnChocoEgg, spawnGoldEgg, spawnRadioEgg];
    spawners[Math.floor(Math.random() * spawners.length)](x, y);
  }
  // -----------------
  // Egg
  // -----------------
  const EggTemplate = document.getElementById("egg-template");

  function spawnChocoEgg(x, y) {
    let egg = EggTemplate.content.cloneNode(true).firstElementChild;
    egg.lifetime = Game.state.displayedItems.push(egg);
    egg.dispatchEvent("itemClicked");
    egg.style.position = "absolute";
    egg.style.left = x + "%";
    egg.style.top = y + "%";
    gameFrame.appendChild(egg);
  }

  function spawnEgg(type, reward, x, y) {
    let egg = EggTemplate.content.cloneNode(true).firstElementChild;
    egg.reward = reward;
    egg.classList.add(type);
    spawnItem(egg, x, y);
  }
  function spawnChocoEgg(x, y) {
    spawnEgg("choco", 1, x, y);
  }
  function spawnGoldEgg(x, y) {
    spawnEgg("gold", 5, x, y);
  }
  function spawnRadioEgg(x, y) {
    spawnEgg("radio", -2, x, y);
  }
  // -----------------
  // Items - chicken
  // -----------------

  // ---------
  // utils
  // ---------
  function getRandomPosition() {
    return [gameFrame.offsetWidth, gameFrame.offsetHeight].map(
      (value) => Math.random(value) * 100,
    );
  }

  // ---------
  // Ui Handling
  // ---------
  function ShowMenu() {
    gameMenu.style.display = "flex";
  }
  function HideMenu() {
    gameMenu.style.display = "none";
  }
  function blurBg() {
    document.body.classList.add("blured");
  }
  function unblurBg() {
    document.body.classList.remove("blured");
  }
  // ---------
  // Events Handling
  // ---------
  Game.element.addEventListener(EVENT.ITEM_CLICKED, ({ target }) => {
    Game.state.score += target.reward;
    scoreDisplay.textContent = `Score: ${Game.state.score}`;
    Game.catchedItems += target.type;
    target.remove();
  });

  DiffRadio.forEach((btn) => btn.addEventListener("click", initGame));

  btnStart.addEventListener("click", () => {
    HideMenu();
    startGame();
    blurBg();
    btnStart.style.display = "none";
    btnStop.style.display = "block";
  });
  btnStop.addEventListener("click", () => {
    ShowMenu();
    stopGame();
    unblurBg();
    btnStop.style.display = "none";
    btnStart.style.display = "";
  });
  btnReplay.addEventListener("click", () => {
    hideGameOver();
    initGame();
    startGame();
  });
};;
