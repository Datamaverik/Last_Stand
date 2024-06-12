const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1224;
canvas.height = 576;

let collisionDetected,
  theta,
  gamePaused = false,
  time,
  duration = 120,
  zombies = [];

const Hmeter = document.getElementById("Hmeter"),
  Bmeter = document.getElementById("Bmeter"),
  timer = document.getElementById("timer"),
  pauseScr = document.getElementById("pauseScr"),
  msg = document.getElementById("msg"),
  restartBtn = document.getElementById("restartBtn"),
  ammo = document.getElementById("ammo");

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1;
  const yDist = y2 - y1;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function collision({ obj1, obj2 }) {
  return (
    obj1.position.y + obj1.height >= obj2.position.y &&
    obj1.position.y <= obj2.position.y + obj2.height &&
    obj1.position.x <= obj2.position.x + obj2.width &&
    obj1.position.x + obj1.width >= obj2.position.x
  );
}

function bulletCollision({ bul, obj }) {
  return (
    bul.position.x + bul.radius >= obj.position.x &&
    bul.position.x <= obj.position.x + obj.width + bul.radius &&
    bul.position.y + bul.radius >= obj.position.y &&
    bul.position.y <= bul.radius + obj.position.y + obj.height
  );
}

function calculateAngle() {
  const position = player.position;
  const Y = mouse.y - position.y;
  const X = mouse.x - position.x;
  return Math.atan2(Y, X);
}

// Function to generate random positions within canvas boundaries
function getRandomPosition() {
  // const x = Math.random() * (canvas.width - 40);
  // const y = Math.random() * (canvas.height - 90);
  const x = randomIntFromRange(1, 5) % 2 == 0 ? 10 : 1180;
  const y = 400;
  return { x, y };
}

// Function to populate the zombies array with 'n' zombies
function spawnZombies(n) {
  for (let i = 0; i < n; i++) {
    setTimeout(() => {
      const position = getRandomPosition();
      const zombie = new Zombie({
        position: position,
        velocity: { x: 0, y: 0 },
        collisionBlocks: blocks,
        zombies,
      });
      zombies.push(zombie);
    }, 5000 * i);
  }
}

function formatTimer(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

function GameOver(text) {
  msg.textContent = text;
  gamePaused = true;
  pauseScr.style.display = "flex";
  pauseScr.showModal();
}

function decreaseTimer() {
  if (duration > 0 && !gamePaused) {
    time = setTimeout(decreaseTimer, 1000);
    duration--;
    timer.textContent = formatTimer(duration);
  } else if (duration <= 0) GameOver("Time's Up, YOU WIN!!");
}

restartBtn.onclick = () => {
  window.location.reload();
};

window.onload = () => {
  pauseScr.style.display = "none";
  decreaseTimer();
};
