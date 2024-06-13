const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1224;
canvas.height = 576;

let collisionDetected,
  theta,
  gamePaused = false,
  time,
  time2,
  zombieInterval = null,
  color = "white",
  currentGun,
  lastGun,
  speedPUTimeout = null,
  damagePUTimeout = null,
  duration = 300,
  speedDur = 0,
  damageDur = 0,
  Pvelocity = 3.8,
  zombies = [];

const Hmeter = document.getElementById("Hmeter"),
  Bmeter = document.getElementById("Bmeter"),
  timer = document.getElementById("timer"),
  timer2 = document.getElementById("timer2"),
  timer3 = document.getElementById("timer3"),
  pauseScr = document.getElementById("pauseScr"),
  msg = document.getElementById("msg"),
  restartBtn = document.getElementById("restartBtn"),
  ammo = document.getElementById("ammo"),
  gunText = document.getElementById("gun"),
  powerUpScr = document.getElementById("powerUpScr"),
  shop = document.getElementById("shop"),
  PUdesc = document.getElementById("PUdesc"),
  score = document.getElementById("score"),
  PUmsg = document.getElementById("PUmsg");

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
  const x = randomIntFromRange(1, 5) % 2 == 0 ? 10 : 1180;
  const y = 400;
  return { x, y };
}

// Function to populate the zombies array with 'n' zombies
function spawnZombies(interval) {
  if (gamePaused || duration <= 0) return;

  setTimeout(() => {
    const position = getRandomPosition();
    const zombie = new Zombie({
      position: position,
      velocity: { x: 0, y: 0 },
      collisionBlocks: blocks,
      zombies,
    });
    zombies.push(zombie);
  }, interval);
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
  clearTimeout(zombieInterval);
}

function decreaseTimer() {
  if (duration > 0 && !gamePaused) {
    time = setTimeout(decreaseTimer, 1000);
    duration--;
    if (speedDur > 0) {
      speedDur--;
      timer2.classList.remove("timer-hide");
      timer2.classList.add("timer-show");
      timer2.textContent = formatTimer(speedDur);
    } else {
      timer2.classList.remove("timer-show");
      timer2.classList.add("timer-hide");
      speedPUTimeout = null;
    }
    if (damageDur > 0) {
      damageDur--;
      timer3.classList.remove("timer-hide");
      timer3.classList.add("timer-show");
      timer3.textContent = formatTimer(damageDur);
    } else {
      timer3.classList.remove("timer-show");
      timer3.classList.add("timer-hide");
      damagePUTimeout = null;
    }
    timer.textContent = formatTimer(duration);
  } else if (duration <= 0) GameOver("Time's Up, YOU WIN!!");
}

function startGame() {
  zombieInterval = setInterval(() => {
    spawnZombies(5000); // Spawn a zombie every 5 seconds
  }, 5000);
  gamePaused = false;
  decreaseTimer();
}

restartBtn.onclick = () => {
  window.location.reload();
};

window.onload = () => {
  pauseScr.style.display = "none";
  powerUpScr.style.display = "none";
  PUmsg.style.display = "none";
  startGame();
};

function usePowerUp() {
  //  updating health meter,ammo meter, score, etc
  Hmeter.value = player.health / 100;
  score.textContent = `Score:💰${player.score}`;
  powerUpScr.close();
  powerUpScr.style.display = "none";
  Bmeter.value = currentGun.mag / 100;
  ammo.textContent = `${currentGun.mag}/${currentGun.ammo}`;
  gamePaused = false;
  animate();
  decreaseTimer();
}

function updatePUmsg(msg,color) {
  PUmsg.style.color = color;
  PUmsg.style.display = "block";
  PUmsg.textContent = msg;
  setTimeout(() => {
    PUmsg.style.color = "white";
    PUmsg.style.display = "none";
    PUmsg.textContent = "";
  }, 1500);
}
