console.log("hello from script.js !");

// -----------------
// State
// -----------------

const DIFFICULTY = ["easy", "medium", "hard"];
const COUNTDWN = [60000, 3000, 15000]; //ms
const SPAWN_SPEED = [2, 2, 2];
const DISPLAYED_DURATION = [5000, 3000, 1500];

export function initialState(difficulty) {
  const diffIndex = DIFFICULTY.findIndex((d) => d === difficulty);

  if (diffIndex === -1) throw new Error("Unknown Difficulty");

  return {
    score: 0,
    displayedItem: [],
    countdown: COUNTDWN[diffIndex],
    spawnSpeed: SPAWN_SPEED[diffIndex],
    displayTime: DISPLAYED_DURATION[diffIndex],
  };
}

// -----------------
// Items
// -----------------
const itemState = {
  position: [0, 0], // random x,y
  scoreMutation: "", // +1 | +5 | -2
  type: "", // egg(choco|gold|cracked) | chicken
};

// -----------------
// Game Loop
// -----------------

window.onload = function (e) {
  const gameFrame = document.getElementById("game-frame");
  const hud = document.getElementById("hud");
  const btnStop = document.getElementById("btn-stop");
  const btnReset = document.getElementById("btn-reset");
  const diffSelect = document.getElementById("diff-select");
  const timer = document.getElementById("timer");
  const score = document.getElementById("score");

  gameFrame.addEventListener("click", (e) => {
    const target = e.target;
    console.log({ target });
  });

  // onclick start loop game - requestAnimationFrame https://stackoverflow.com/questions/38709923/why-is-requestanimationframe-better-than-setinterval-or-settimeout

  console.log("hello from onload !");
};
