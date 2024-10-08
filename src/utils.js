const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1224;
canvas.height = 576;

const max = 60,
  speed = 3,
  size = 20;
let collisionDetected,
  theta,
  currentUser,
  lastKey = "right",
  gamePaused = false,
  gameOver = false,
  defenseBlockSetup = false,
  mineSetup = false,
  trapSetup = false,
  inventoryOpen = false,
  preparationPhase = true,
  gameStarted = false,
  timeSpent = 0,
  preparationTime = 10,
  time,
  spawnInterval = 6000,
  time2,
  fuel = 100,
  zombieInterval = null,
  cannonInterval = null,
  color = "white",
  currentGun,
  damagePUTimeout = null,
  PUmsgTimeout = null,
  duration = 300,
  speedDur = 0,
  blockInd = 0,
  mineInd = 0,
  trapInd = 0,
  scrollOffset = 0,
  damageDur = 0,
  Pvelocity = 2,
  zombieCount = 0,
  totalZombies = 0,
  zombies = [],
  particles = [],
  sorroundings = [];

const Hmeter = document.getElementById("Hmeter"),
  Bmeter = document.getElementById("Bmeter"),
  myForm = document.getElementById("myForm"),
  nameInput = document.getElementById("nameInput"),
  Fmeter = document.getElementById("Fmeter"),
  timer = document.getElementById("timer"),
  timer2 = document.getElementById("timer2"),
  timer3 = document.getElementById("timer3"),
  pauseScr = document.getElementById("pauseScr"),
  msg = document.getElementById("msg"),
  restartBtn = document.getElementById("restartBtn"),
  startBtn = document.getElementById("startBtn"),
  ammo = document.getElementById("ammo"),
  gunText = document.getElementById("gun"),
  powerUpScr = document.getElementById("powerUpScr"),
  inventoryScr = document.getElementById("inventoryScr"),
  shop = document.getElementById("shop"),
  PUdesc = document.getElementById("PUdesc"),
  score = document.getElementById("score"),
  gunIcon = document.getElementById("gunIcon"),
  defenseBlockBtn = document.getElementById("defenseBlock"),
  mineBtn = document.getElementById("mineBtn"),
  trapBtn = document.getElementById("trapBtn"),
  PUmsg = document.getElementById("PUmsg"),
  gunStatsDiv = document.getElementById("gunStats"),
  instructionsDiv = document.getElementById("instructions"),
  viewGunStatsLink = document.getElementById("viewGunStats"),
  backToInstrcutionsLink = document.getElementById("backToInstructions");

window.onload = () => {
  pauseScr.style.display = "flex";
  myForm.style.display = "block";
  gameStarted = false;
  console.log(preparationPhase);
  restartBtn.style.display = "none";
  powerUpScr.style.display = "none";
  inventoryScr.style.display = "none";
};
const mouse = {
  x: undefined,
  y: undefined,
};

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
  const x = randomIntFromRange(1, 5) % 2 == 0 ? -500 : 1740;
  const y = 300;
  return { x, y };
}

// Function to populate the zombies array with 'n' zombies
function spawnZombies(interval) {
  if (gamePaused || duration <= 0) return;

  zombieCount++;
  totalZombies++;
  if (zombieCount > 0) HordeSoundOn();
  if (totalZombies % 8 === 0) {
    setTimeout(() => {
      const position = getRandomPosition();
      const zombie = new JumpingZombie({
        position: position,
        velocity: { x: 0, y: 0 },
        collisionBlocks: blocks,
        zombies,
        health: 300,
        speed: 0.55,
        height: 75,
        width: 35,
        damage: 15,
        attackFreq: 2000,
        color: "green",
        sprite: {
          IdleRZ: {
            imageSrc: "./assets/ZombieWomanRight/Idle.png",
            framesMax: 5,
            id: "IdleZ",
          },
          WalkR: {
            imageSrc: "./assets/ZombieWomanRight/Walk.png",
            framesMax: 7,
            id: "WalkR",
          },
          WalkL: {
            imageSrc: "./assets/ZombieWomanLeft/Run.png",
            framesMax: 7,
            id: "WalkR",
          },
          Attack_1: {
            imageSrc: "./assets/ZombieWomanRight/Attack_1.png",
            framesMax: 4,
            id: "Attack_1",
          },
          Attack_1L: {
            imageSrc: "./assets/ZombieWomanLeft/Attack_1.png",
            framesMax: 4,
            id: "Attack_1",
          },
          Attack_2: {
            imageSrc: "./assets/ZombieWomanRight/Attack_2.png",
            framesMax: 4,
            id: "Attack_2",
          },
          Attack_2L: {
            imageSrc: "./assets/ZombieWomanLeft/Attack_2.png",
            framesMax: 4,
            id: "Attack_2",
          },
          Attack_3: {
            imageSrc: "./assets/ZombieWomanRight/Attack_3.png",
            framesMax: 4,
            id: "Attack_3",
          },
          Attack_3L: {
            imageSrc: "./assets/ZombieWomanLeft/Attack_3.png",
            framesMax: 4,
            id: "Attack_3",
          },
          HurtZ: {
            imageSrc: "./assets/ZombieWomanRight/Hurt.png",
            framesMax: 3,
            id: "HurtZ",
          },
          DeadZ: {
            imageSrc: "./assets/ZombieWomanRight/Dead.png",
            framesMax: 5,
            id: "DeadZ",
          },
          Jump: {
            imageSrc: "./assets/ZombieWomanRight/Jump.png",
            framesMax: 6,
            id: "Jump",
          },
          JumpL: {
            imageSrc: "./assets/ZombieWomanLeft/Jump.png",
            framesMax: 6,
            id: "Jump",
          },
        },
        framesHold: 15,
        offset: { x: 65, y: 76 },
        scale: { width: 4.2, height: 2 },
      });
      zombie.loadSprite();
      zombie.switchSprite("IdleRZ");
      zombies.push(zombie);
      sorroundings.push(zombie);
    }, interval);
  } else if (totalZombies % 11 === 0) {
    setTimeout(() => {
      const position = getRandomPosition();
      const zombie = new Zombie({
        position: position,
        velocity: { x: 0, y: 0 },
        collisionBlocks: blocks,
        health: 900,
        zombies,
        speed: 0.35,
        height: 120,
        width: 60,
        damage: 60,
        attackFreq: 6500,
        color: "gray",
        sprite: {
          IdleRZ: {
            imageSrc: "./assets/WildZombieRight/Idle.png",
            framesMax: 9,
            id: "IdleZ",
          },
          WalkR: {
            imageSrc: "./assets/WildZombieRight/Walk.png",
            framesMax: 10,
            id: "WalkR",
          },
          WalkL: {
            imageSrc: "./assets/WildZombieLeft/Walk.png",
            framesMax: 10,
            id: "WalkR",
          },
          Attack_1: {
            imageSrc: "./assets/WildZombieRight/Attack_1.png",
            framesMax: 4,
            id: "Attack_1",
          },
          Attack_1L: {
            imageSrc: "./assets/WildZombieLeft/Attack_1.png",
            framesMax: 4,
            id: "Attack_1",
          },
          Attack_2: {
            imageSrc: "./assets/WildZombieRight/Attack_2.png",
            framesMax: 4,
            id: "Attack_2",
          },
          Attack_2L: {
            imageSrc: "./assets/WildZombieLeft/Attack_2.png",
            framesMax: 4,
            id: "Attack_2",
          },
          Attack_3: {
            imageSrc: "./assets/WildZombieRight/Attack_3.png",
            framesMax: 4,
            id: "Attack_3",
          },
          Attack_3L: {
            imageSrc: "./assets/WildZombieLeft/Attack_3.png",
            framesMax: 4,
            id: "Attack_3",
          },
          HurtZ: {
            imageSrc: "./assets/WildZombieRight/Hurt.png",
            framesMax: 5,
            id: "HurtZ",
          },
          DeadZ: {
            imageSrc: "./assets/WildZombieRight/Dead.png",
            framesMax: 5,
            id: "DeadZ",
          },
        },
        framesHold: 15,
        offset: { x: 105, y: 122 },
        scale: { width: 4.2, height: 2 },
      });
      zombie.loadSprite();
      zombie.switchSprite("IdleRZ");
      zombies.push(zombie);
      sorroundings.push(zombie);
    }, interval);
  } else {
    setTimeout(() => {
      const position = getRandomPosition();
      const zombie = new Zombie({
        position: position,
        velocity: { x: 0, y: 0 },
        collisionBlocks: blocks,
        zombies,
        health: 210,
        speed: 0.38,
        damage: 10,
        attackFreq: 3000,
        color: "red",
        framesHold: 13,
        offset: { x: 65, y: 76 },
        scale: { width: 4.2, height: 2 },
        sprite: {
          IdleRZ: {
            imageSrc: "./assets/ZombieManRight/Idle.png",
            framesMax: 8,
            id: "IdleZ",
          },
          WalkR: {
            imageSrc: "./assets/ZombieManRight/Walk.png",
            framesMax: 8,
            id: "WalkR",
          },
          WalkL: {
            imageSrc: "./assets/ZombieManLeft/Walk.png",
            framesMax: 8,
            id: "WalkR",
          },
          Attack_1: {
            imageSrc: "./assets/ZombieManRight/Attack_1.png",
            framesMax: 5,
            id: "Attack_1",
          },
          Attack_1L: {
            imageSrc: "./assets/ZombieManLeft/Attack_1.png",
            framesMax: 5,
            id: "Attack_1",
          },
          Attack_2: {
            imageSrc: "./assets/ZombieManRight/Attack_2.png",
            framesMax: 4,
            id: "Attack_2",
          },
          Attack_2L: {
            imageSrc: "./assets/ZombieManLeft/Attack_2.png",
            framesMax: 4,
            id: "Attack_2",
          },
          Attack_3: {
            imageSrc: "./assets/ZombieManRight/Attack_3.png",
            framesMax: 5,
            id: "Attack_3",
          },
          Attack_3L: {
            imageSrc: "./assets/ZombieManLeft/Attack_3.png",
            framesMax: 5,
            id: "Attack_3",
          },
          HurtZ: {
            imageSrc: "./assets/ZombieManRight/Hurt.png",
            framesMax: 3,
            id: "HurtZ",
          },
          DeadZ: {
            imageSrc: "./assets/ZombieManRight/Dead.png",
            framesMax: 5,
            id: "DeadZ",
          },
        },
      });
      zombie.loadSprite();
      zombie.switchSprite("IdleRZ");
      zombies.push(zombie);
      sorroundings.push(zombie);
    }, interval);
  }
  if (zombieCount < 2) HordeSoundOff();
}

function formatTimer(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

function GameOver(text) {
  let users = JSON.parse(localStorage.getItem("userScores")) || [];
  const newScore = player.score;
  // Update the user's score
  users = users.map((user) => {
    if (user.username === currentUser) {
      user.score = newScore;
    }
    return user;
  });

  // Save the updated list back to localStorage
  localStorage.setItem("userScores", JSON.stringify(users));
  console.log(users);

  //  printing the leaderboards
  users.sort((a, b) => b.score - a.score);

  // Create the HTML table
  let tableHtml = `
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Username</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
  `;

  users.forEach((user, index) => {
    tableHtml += `
      <tr>
        <td>${index + 1}</td>
        <td>${user.username}</td>
        <td>${user.score}</td>
      </tr>
    `;
  });

  tableHtml += `
      </tbody>
    </table>
  `;

  // Append the table to the leaderboard container
  const leaderboardContainer = document.getElementById("leaderBoards");
  leaderboardContainer.innerHTML = tableHtml;

  gameOver = true;
  myForm.style.display = "none";
  nameInput.style.display = "none";
  stopCannonFire();
  msg.textContent = text;
  gamePaused = true;
  pauseScr.style.display = "flex";
  document.getElementById("instructions").style.display = "none";
  restartBtn.style.display = "block";
  startBtn.style.display = "none";
  pauseScr.showModal();
  clearTimeout(zombieInterval);
  HordeSoundOff();
}

function decreaseTimer() {
  if (duration > 0 && !gamePaused) {
    time = setTimeout(decreaseTimer, 1000);
    if (timeSpent === 180) {
      spawnInterval = 4000;
      clearInterval(zombieInterval);
      zombieInterval = setInterval(() => {
        spawnZombies(spawnInterval);
      }, spawnInterval);
      updatePUmsg(
        "DANGER!! Big Zombie horde incoming. Cannon ammo reloaded",
        "red"
      );
      cannonLeft.ammo += 18;
      cannonRight.ammo += 18;
      cannonLeft.gunrate = 11;
      cannonRight.gunrate = 11;
      stopCannonFire();
      startCannonFire(3000);
    }
    duration--;
    timeSpent = 300 - duration;
    if (timeSpent === preparationTime) {
      startGame();
    }
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
  console.log("Game started");
  myForm.style.display = "none";
  zombieInterval = setInterval(() => {
    spawnZombies(spawnInterval);
  }, spawnInterval);
  updatePUmsg("Preparation time ends!! ZOMBIES INCOMING!!!", "red");
  preparationPhase = false;
  defenseBlockSetup = false;
  mineSetup = false;
  trapSetup = false;
  startCannonFire();
  powerUpScr.close();
  powerUpScr.style.display = "none";

  gamePaused = false;
  preparationPhase = false;
}

restartBtn.onclick = () => {
  window.location.reload();
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

function updatePUmsg(msg, color) {
  PUmsg.style.color = color;
  PUmsg.classList.add("fade-in");
  PUmsg.classList.remove("fade-out");
  // PUmsg.style.display = "block";
  PUmsg.textContent = msg;
  if (!PUmsgTimeout) {
    PUmsgTimeout = setTimeout(() => {
      PUmsg.style.color = "white";
      // PUmsg.style.display = "none";
      PUmsg.classList.remove("fade-in");
      PUmsg.classList.add("fade-out");
      PUmsgTimeout = null;
    }, 5500);
  } else {
    clearTimeout(PUmsgTimeout);
    PUmsgTimeout = setTimeout(() => {
      PUmsg.style.color = "white";
      // PUmsg.style.display = "none";
      PUmsg.classList.remove("fade-in");
      PUmsg.classList.add("fade-out");
      PUmsgTimeout = null;
    }, 1500);
  }
}

const gunSvg = {
  AKM: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 38 100 125" ><path d="M93,42h-1v-4h-2.162l-1.055,4h-7.08l-2.323-2H71v-1h-0.885H59v-1h-4.849H53.18H52v1H33.865h-0.227l-1.024,1h-1.299  l-1.189,1.481c-1.375,0.456-4.235,1.111-5.896,1.063c-0.598-0.018-1.627-1.287-2.354-1.529C21.151,40.773,7,40.923,7,40.923v10.894  l23.335-6.972c0,0,2.298,0.484,2.056,1.695c-0.242,1.21-1.878,6.197-1.878,6.197s-0.236,1.55,0.636,1.937  c0.871,0.387,2.836,0.872,2.836,0.872s1.271-0.053,1.127-1.457C35.006,53.072,35.424,51,36.241,49h6.895  C43.563,49,44,48.565,44,48.137v-0.549c2,4.448,4.129,10.894,11.008,14.204c2.678-3.486,4.487-5.146,4.487-5.146  S52.427,52,51.993,46h3.37h0.732h1.979c0,0,0.081-0.223,0.323-0.724C58.5,45.067,58.958,45,59.532,45H71.5l0,0h6l0,0h4l0,0H93V42z   M42.72,48H38v-2h5v1.087C43,47.332,42.964,48,42.72,48z"/></svg>`,
  AWM: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="11 42 85 115" style="enable-background:new 0 0 100 100;" xml:space="preserve"><rect x="41.68" y="43.39" width="1.08" height="0.29"/><rect x="38.5" y="42.21" width="1.99" height="0.31"/><rect x="38.7" y="42.72" width="1.55" height="0.58"/><path d="M32.43,51.09c0,0.27,0.22,0.49,0.49,0.49c0.27,0,0.49-0.22,0.49-0.49c0-0.27-0.22-0.49-0.49-0.49  C32.65,50.61,32.43,50.83,32.43,51.09z"/><polygon points="35.02,48.48 34.91,48.28 34.68,48.28 34.57,48.48 34.68,48.67 34.91,48.67 "/><path d="M38.81,53.36c-0.17-0.34-0.52-0.56-0.91-0.56c-0.45,0-0.85,0.3-0.98,0.74c-0.01,0.04-0.05,0.07-0.09,0.08l-0.64,0.06v1.57  l5.92-0.65v-1.48c-0.02,0-0.04,0.01-0.06,0.01l-3.14,0.3C38.87,53.42,38.83,53.4,38.81,53.36z"/><rect x="88.34" y="47.56" width="1.66" height="1.33"/><path d="M86.72,47.25c-0.06,0-0.12,0.05-0.12,0.12v1.72c0,0.06,0.05,0.12,0.12,0.12h1.3c0.06,0,0.12-0.05,0.12-0.12v-1.72  c0-0.06-0.05-0.12-0.12-0.12H86.72z"/><path d="M86.4,47.53H46.04L45.8,48.1v0.45h13.35c0.27,0,0.5,0.15,0.63,0.36H86.4V47.53z"/><polygon points="50.4,46.2 50.4,43.11 46.32,43.11 43.72,43.73 43.72,45.52 46.29,46.2 "/><path d="M38.4,43.69c-0.02,0.04-0.03,0.08-0.03,0.12v1.6c0,0.05,0.01,0.1,0.03,0.14c0.05,0.1,0.15,0.16,0.27,0.16h1.6  c0.11,0,0.21-0.06,0.27-0.16c0.02-0.03,0.03-0.07,0.03-0.1c0-0.01,0-0.02,0-0.04v-1.6c0-0.04-0.01-0.08-0.03-0.12  c-0.04-0.09-0.12-0.16-0.22-0.17c-0.02,0-0.03,0-0.05,0h-1.6c-0.02,0-0.04,0-0.06,0.01C38.52,43.54,38.44,43.6,38.4,43.69z"/><path d="M40.79,45.45c0,0,0,0.01,0,0.01c0,0.01,0,0.02,0,0.03c0,0,0,0,0,0.01h2.72v-1.75h-2.72c0,0,0,0,0,0c0,0.01,0,0.01,0,0.02  c0,0,0,0.01,0,0.01c0,0.01,0,0.02,0,0.03v1.6C40.79,45.43,40.79,45.44,40.79,45.45z"/><path d="M36.2,46.12v-0.41h-1.08v1.39h7.64v-1.39h-1.08v0.41c0,0.06-0.05,0.1-0.1,0.1H36.3C36.24,46.23,36.2,46.18,36.2,46.12z"/><path d="M38.17,43.78C38.17,43.78,38.17,43.78,38.17,43.78c0-0.02,0-0.02,0-0.03c0,0,0,0,0,0h-3.94v1.75h3.94c0,0,0,0,0-0.01  c0-0.01,0-0.02,0-0.03c0,0,0-0.01,0-0.01c0-0.01,0-0.02,0-0.04v-1.6C38.17,43.8,38.17,43.79,38.17,43.78z"/><polygon points="33.59,43.56 33.59,45.71 34.02,45.53 34.02,43.72 "/><rect x="32.66" y="43.56" width="0.21" height="2.09"/><rect x="33.08" y="43.38" width="0.3" height="2.41"/><rect x="27.87" y="43.38" width="0.27" height="2.41"/><rect x="28.35" y="43.56" width="0.14" height="2.09"/><rect x="28.71" y="43.38" width="3.75" height="2.38"/><path d="M31.26,48.75c0.11-0.06,0.23-0.09,0.36-0.09h1.67v-1.13h-2.04V48.75z"/><path d="M33.5,48.66h0.83c0.06,0,0.1,0.05,0.1,0.1c0,0.16,0.1,0.29,0.25,0.34v-0.22h-0.07c-0.04,0-0.07-0.02-0.09-0.05l-0.17-0.3  c-0.02-0.03-0.02-0.07,0-0.1l0.17-0.3c0.02-0.03,0.05-0.05,0.09-0.05h0.35c0.04,0,0.07,0.02,0.09,0.05l0.17,0.3  c0.02,0.03,0.02,0.07,0,0.1l-0.17,0.3c-0.02,0.03-0.05,0.05-0.09,0.05H34.9v0.23c0.15-0.04,0.26-0.18,0.26-0.35  c0-0.06,0.05-0.1,0.1-0.1h1.06c0.18,0,0.32,0.14,0.32,0.33c0,0.03,0.01,0.06,0.03,0.08c0.02,0.02,0.05,0.03,0.08,0.03h5.44  c0.07,0,0.12-0.05,0.12-0.12v-0.11c0-0.18,0.15-0.33,0.33-0.33h2.93v-0.47c0-0.01,0-0.03,0.01-0.04l0.21-0.51h-0.66  c-0.06,0-0.1-0.05-0.1-0.1v-0.12H33.5V48.66z M36.85,47.92c0-0.13,0.11-0.24,0.24-0.24h4.79c0.13,0,0.24,0.11,0.24,0.24v0.58  c0,0.13-0.11,0.24-0.24,0.24h-4.79c-0.13,0-0.24-0.11-0.24-0.24V47.92z"/><path d="M13.32,56.83l-0.12-7.99c0-0.18-0.15-0.32-0.33-0.32h-2.53c-0.18,0-0.33,0.14-0.33,0.32v8.4  C11.24,56.84,12.51,56.68,13.32,56.83z"/><path d="M22.14,48.3h-7.6c-0.56,0-1.01,0.45-1.01,1.01v0.01h9.04v-0.6C22.57,48.49,22.38,48.3,22.14,48.3z"/><rect x="25.35" y="49.3" width="1.94" height="2.16"/><path d="M13.52,56.44h0.67c0.21,0,0.39-0.17,0.39-0.39v-0.04c0-0.16,0.06-0.31,0.18-0.43c0.12-0.11,0.27-0.17,0.43-0.17l0.73,0.01  c0.13,0,0.25-0.06,0.33-0.17l0.22-0.31c0.14-0.2,0.37-0.31,0.61-0.31l3.07,0.06c0.15,0,0.29,0.05,0.41,0.14l2.33,1.72  c0.39,0.29,0.86,0.45,1.34,0.48l0.76,0.04c0.22,0.01,0.45,0.05,0.66,0.12l1.56,0.49c0.24,0.07,0.49,0.11,0.74,0.11h1.25  c0.29,0,0.53-0.23,0.55-0.52c0.12-1.77,0.33-2.81,0.69-3.37c0.07-0.11,0.19-0.19,0.32-0.2c0.14-0.01,0.27,0.03,0.36,0.13l0.56,0.56  c0.1,0.1,0.22,0.15,0.36,0.15h2.05c0.13,0,0.26-0.05,0.36-0.15l0.66-0.66c0.12-0.12,0.27-0.19,0.44-0.21l1.19-0.11  c0.17-0.49,0.64-0.82,1.16-0.82c0.44,0,0.84,0.23,1.06,0.61l3.07-0.29c0.06-0.01,0.11-0.01,0.17-0.02s0.11-0.02,0.16-0.04l3.89-1.13  c0.18-0.05,0.37-0.08,0.56-0.08h12.85v-2.37c0-0.28-0.23-0.51-0.51-0.51H42.66c-0.07,0-0.12,0.05-0.12,0.12v0.11  c0,0.18-0.15,0.33-0.33,0.33h-5.44c-0.09,0-0.17-0.03-0.23-0.1c-0.06-0.06-0.1-0.14-0.1-0.23c0-0.07-0.05-0.12-0.11-0.12h-0.97  c-0.04,0.23-0.23,0.42-0.46,0.46v0.47c0,0.36-0.21,0.67-0.54,0.81l-0.77,0.32c0.01,0.05,0.02,0.11,0.02,0.17  c0,0.38-0.31,0.7-0.7,0.7c-0.38,0-0.7-0.31-0.7-0.7c0-0.38,0.31-0.7,0.7-0.7c0.25,0,0.47,0.13,0.59,0.34l0.77-0.32  c0.25-0.1,0.41-0.35,0.41-0.62v-0.48c-0.23-0.05-0.4-0.23-0.45-0.45h-2.62c-0.07,0-0.15,0.01-0.21,0.04  c-0.07,0.03-0.13,0.07-0.18,0.12l-0.28,0.28c-0.14,0.14-0.34,0.22-0.54,0.22H27.5v1.76c0.6,0.44,0.96,1.14,0.96,1.88  c0,1.29-1.05,2.33-2.33,2.33c-1.29,0-2.33-1.05-2.33-2.33c0-0.91,0.52-1.73,1.34-2.11v-1.54H13.41L13.52,56.44z M31.26,52.97  c0-0.51,0.42-0.93,0.93-0.93h0.04c-0.04,0.13-0.07,0.26-0.07,0.39c-0.03,0.41,0.13,0.82,0.4,1.11c0.13,0.14,0.28,0.26,0.44,0.37  l0.1-0.14c-0.26-0.21-0.49-0.49-0.57-0.82c-0.08-0.3-0.01-0.64,0.15-0.9l-0.01-0.01h1.19c0.51,0,0.93,0.42,0.93,0.93v0.17  c0,0.51-0.42,0.93-0.93,0.93h-1.66c-0.51,0-0.93-0.42-0.93-0.93V52.97z"/></svg>`,
  M4A1: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" version="1.1" style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision;image-rendering:optimizeQuality;" viewBox="0 0 317 110" x="0px" y="0px" fill-rule="evenodd" clip-rule="evenodd"><defs><style type="text/css">
   
    .fil0 
    
    
  </style></defs><g><path class="fil0" d="M167 15l0 12c0,2 -2,2 -2,0l0 -12c0,-1 2,-1 2,0zm148 1l-29 0c-1,0 -3,1 -3,2l0 0 -42 1 -3 4 45 0 0 0c0,1 2,3 3,3l29 0c1,0 2,-2 2,-3l0 -5c0,-1 -1,-2 -2,-2zm-84 -12l0 -4 -3 0 -12 19 0 6 21 0 3 -6 -9 0 0 -15zm-12 15l9 -15 1 0 0 15 -10 0zm-4 10l0 -16c0,-1 -2,0 -2,0l0 16c0,1 2,1 2,0zm-2 2l0 -19c0,-2 -5,-2 -5,0l0 19c0,1 5,2 5,0zm-5 0l0 -19c0,-2 -5,-2 -5,0l0 19c0,1 5,2 5,0zm-5 0l0 -19c0,-2 -5,-2 -5,0l0 19c0,1 5,2 5,0zm-5 0l0 -19c0,-2 -5,-2 -5,0l0 19c0,1 5,2 5,0zm-5 0l0 -19c0,-2 -5,-2 -5,0l0 19c0,1 5,2 5,0zm-5 0l0 -19c0,-2 -5,-2 -5,0l0 19c0,1 5,2 5,0zm-5 0l0 -19c0,-2 -5,-2 -5,0l0 19c0,1 5,2 5,0zm-5 0l0 -19c0,-2 -5,-2 -5,0l0 19c0,1 5,2 5,0zm-5 0l0 -19c0,-2 -5,-2 -5,0l0 19c0,1 5,2 5,0zm-20 -3l-42 0c-1,0 -1,2 0,2l42 0c1,0 1,-2 0,-2zm0 -6l-40 0 -2 6 42 0 0 -6zm-75 9l5 12 16 8 30 0 22 -9 2 -9 0 -3 -75 1zm72 -25l1 6 -49 0c-4,0 -4,-6 0,-6l1 0 47 0zm-51 38l2 -1 0 -2 2 -3c1,2 2,4 3,6l1 4 1 -5 -1 -5 -8 0 0 6zm31 8l16 36 21 -9 -16 -36 -21 9zm-31 -2l0 -12 26 0 5 11 -1 1 -30 0zm-2 2l-12 29 -15 -7 12 -29 15 7zm-96 -31l-1 15 57 0 0 0 19 -7 33 0 4 -8 40 0 0 -4 2 -3 -2 -12 -67 0 -7 12 -5 0 -4 8 -69 -1zm-1 17l0 3 1 15 51 -18 -52 0zm156 -26l7 0c1,0 1,1 1,2l0 15c0,1 0,1 -1,1l-8 0c0,0 -1,0 -1,-1l0 -8 0 0 0 -4 2 -3 0 -2z"/></g></svg>`,
  DEagle: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 29 150 125" style="enable-background:new 0 0 100 100;" xml:space="preserve"><g><path d="M93.1054688,34.2094727c0.0126953-0.0522461,0.0458984-0.1337891,0.0810547-0.2270508   c0.1240234-0.3276367,0.2192383-0.5966797,0.2192383-0.8295898c0-0.6738281-0.6694336-2.3232422-1.546875-2.3232422h-0.8095703   c0.0024414-0.0415039,0.003418-0.0830078,0.003418-0.1235352c0-0.7529297-0.8149414-1.4882813-1.2880859-1.4882813   c-0.3901367,0-2.8579102,1.2050781-2.8818359,1.2172852c-0.2250977,0.1123047-0.3833008,0.2680664-0.4873047,0.4296875h-0.1484375   c-0.1474609,0-0.2875977,0.0654297-0.3828125,0.1782227c-0.1396484,0.1665039-0.7416992,0.4921875-1.4995117,0.4921875h-1.9882813   c-0.1362305,0-0.2666016,0.0556641-0.3608398,0.1538086l-0.1347656,0.140625h-0.3989258   C81.4101563,31.6318359,81.222168,31.5,81.0117188,31.5H60.3056641c-0.1625977,0-0.3144531,0.0791016-0.4082031,0.2114258   l-0.1914063,0.2709961H59.328125l-0.0766602-0.1611328c-0.0825195-0.1748047-0.2583008-0.2861328-0.4516602-0.2861328h-2.3999023   c-1.0668945,0-2.1020508-0.5957031-2.1123047-0.6020508c-0.0771484-0.0449219-0.1767578-0.065918-0.2563477-0.0683594   l-11.1025391,0.0908203c-0.1508789-0.4277344-0.4853516-0.644043-0.9995117-0.644043   c-0.121582,0-12.4453125,0.0512695-12.6899414,0.0966797c-0.0605469,0.0112305-0.2514648,0.0766602-0.5273438,0.1806641   c-0.487793,0.184082-1.3037109,0.4921875-2.0966797,0.6977539c-0.8574219,0.2241211-1.6938477,0.2060547-2.0166016,0.1855469   c-0.3808594-0.3076172-1.5488281-1.2490234-1.8881836-1.5097656c-0.4492188-0.3452148-0.8339844-0.421875-1.2519531-0.4291992   c-0.2939453-0.2124023-0.4907227-0.2861328-0.5322266-0.300293c-0.0390625-0.0131836-0.0786133-0.0214844-0.1196289-0.0249023   c0,0-0.8623047-0.0727539-1.3359375-0.0727539c-0.1938477,0-0.3701172,0.1118164-0.4526367,0.2871094   c-0.2368164,0.5039063-0.2661133,1.6479492-0.2597656,2.3481445h-0.3466797c-0.5668945,0-0.8476563,0.1772461-1.1171875,0.4633789   c-0.2275391,0.2421875-1.972168,2.0751953-2.7182617,2.7958984c-0.8447266-0.0063477-1.4731445-0.1171875-1.8691406-0.3291016   c-0.6186523-0.3320313-1.1508789-0.3769531-1.5893555-0.3769531c-0.7226563,0-1.4057617,0.7231445-1.4057617,1.487793   c0,0.5668945,0.3510742,0.8310547,0.7578125,1.137207c0.1889648,0.1420898,0.4296875,0.3227539,0.7226563,0.5854492   c1.3510742,1.230957,1.855957,2.9082031,1.8979492,3.097168c-0.0200195,0.1591797-0.2890625,1.3520508-0.5883789,2.6054688   c-0.1635742,0.6845703-0.6206055,0.8369141-1.8847656,1.097168c-1.3237305,0.2724609-3.3789063,1.2797852-4.2641602,1.9648438   c-0.5102539,0.3945313-0.7021484,0.7905273-0.5703125,1.1772461c0.1977539,0.5791016,0.9638672,0.6240234,1.1938477,0.6240234   c0.5957031,0,1.0283203-0.0146484,1.5644531-0.0327148C9.3847656,48.0390625,10.5410156,48,13.1040039,48   c1.1606445,0,2.152832,0.4135742,2.949707,1.2294922c1.375,1.4082031,1.9560547,3.7861328,1.9262695,5.5395508   c-0.6499023,2.6875-2.8193359,8.4692383-3.7114258,10.1181641c-1.1142578,2.059082-1.715332,3.5576172-1.9482422,4.8579102   c-0.2880859,1.6074219,0.1191406,4.2231445,0.1235352,4.2495117c0.050293,0.3208008,0.1777344,0.5517578,0.2885742,0.6992188   c0.1035156,2.8300781,2.4682617,3.1870117,3.2041016,3.2285156c0.6445313,0.0371094,11.6484375,0.0834961,13.2988281,0.0834961   c1.6499023,0,2.9604492-0.2866211,4.0595703-0.5551758c1.3168945-0.3217773,1.7817383-1.5532227,1.7817383-1.8388672   c0-0.1333008,0-0.1689453-0.8354492-2.3842773l-0.2421875-0.6455078c-0.1318359-0.3637695-0.1699219-0.6386719-0.1162109-0.8413086   c0.1088867-0.4067383,2.3959961-11.9272461,2.4189453-12.043457c0.2749023-1.3818359,1.0019531-1.9165039,1.5639648-2.121582   c0.6767578-0.2480469,1.5107422,0.1005859,1.6044922,0.1411133c0.3774414,0.1650391,0.7680664,0.3359375,1.2119141,0.3359375   c0.1259766,0,1.3994141-0.0151367,2.9760742-0.0341797c2.5551758-0.0307617,5.9091797-0.0712891,6.4477539-0.0712891   c0.4458008,0,0.7773438-0.1411133,0.9858398-0.4189453c0.362793-0.484375,0.1987305-1.1889648,0-1.8691406   c-0.2568359-0.8764648-0.2744141-1.3691406-0.2041016-2.7275391c0.0688477-1.328125,0.8408203-3.4345703,2.7900391-5.0009766   c2.1259766-1.7075195,4.65625-2.065918,6.4047852-2.065918h28.7055664c1.3520508,0,2.4038086-1.6445313,2.4140625-1.6616211   c0.0546875-0.0888672,0.1826172-0.296875,1.1166992-2.9423828c0.1220703-0.3461914,1.1928711-3.4008789,1.1928711-4.0844727   c0-0.2539063-0.1166992-1.0761719-0.2817383-2.2099609C93.1674805,34.5327148,93.1020508,34.2094727,93.1054688,34.2094727z    M53.9091797,31.8657227c0.3525391,0.1850586,1.3798828,0.6694336,2.4907227,0.6694336h2.0834961l0.0766602,0.1611328   c0.0825195,0.1748047,0.2583008,0.2861328,0.4516602,0.2861328h0.953125c0.1625977,0,0.3144531-0.0791016,0.4082031-0.2114258   L60.5644531,32.5h20.0947266c0.0717773,0.1977539,0.2597656,0.3295898,0.4702148,0.3295898h0.9648438   c0.1362305,0,0.2666016-0.0556641,0.3608398-0.1538086l0.1347656-0.140625h1.7749023   c0.8745117,0,1.6552734-0.3144531,2.0834961-0.6704102h0.28125c0.1208496,0,0.2288818-0.039856,0.3148804-0.1049805h3.1965332   c0.0739746,0.041626,0.1547241,0.0698242,0.2415161,0.0698242L91.7714844,31.8125   c0.1958618,0.1087036,0.5641479,0.8197632,0.6224365,1.2319336H57.8334961c-2.3916016,0-3.6044922,0.2373047-3.6044922,0.7114258   c0,0.7319336,0.1669922,1.4199219,0.484375,1.9907227c0.2318726,0.4174805,0.616333,0.8737793,1.2250977,1.2119141h-3.4318848   c0.0275879-0.4443359,0.0769043-1.4161377,0.0769043-2.7084961c0-1.0720825-0.0656738-1.8804932-0.1203003-2.3724365   L53.9091797,31.8657227z M42.7675781,31.9569702l9.192749-0.0753174c0.0536499,0.4725952,0.1231689,1.2908325,0.1231689,2.3683472   c0,1.3079834-0.0509033,2.2865601-0.0774536,2.7084961h-7.3395386c-1.8989258,0-1.8989258-0.909668-1.8989258-1.2084961V31.9569702   z M44.6665039,37.4584961h13.4375h24.84375l0.2997437,2.2314453L63.4206543,39.604187l-14.4437866-0.0625l-3.6109619-0.015625   c-0.2962036-0.0046997-0.6123047,0.0050659-0.8922119-0.0115967c-0.2657471-0.0027466-0.5092163-0.1141357-0.7323608-0.2536621   c-0.4321899-0.319397-0.741272-0.8231201-0.9485474-1.3601685c-0.1807861-0.4629517-0.2993774-0.9542236-0.378418-1.4509277   C42.6582031,36.9949951,43.269043,37.4584961,44.6665039,37.4584961z M18.4116211,32.7705078h0.8588867   c0.1362305,0,0.2661133-0.0556641,0.3608398-0.1538086c0.0267944-0.0279541,0.0413208-0.0634155,0.06073-0.0961914H22.09375   c0.1381836,0,0.25-0.1118164,0.25-0.25v-0.0615234h1.5756226c0.0995483,0.0803223,0.171814,0.1386719,0.171936,0.1386719   c0.074707,0.0605469,0.1650391,0.0981445,0.2602539,0.1083984c0.0498047,0.0048828,1.2416992,0.1298828,2.5151367-0.2016602   c0.8442383-0.2192383,1.6918945-0.5390625,2.1982422-0.7299805c0.1835938-0.0693359,0.315918-0.1206055,0.309082-0.1269531   c0.411499-0.0255737,11.1343994-0.0825195,12.4599609-0.0857544l0.0135498,3.1234131   c-0.0372314,1.1835938,0.0604248,2.4838867,0.5395508,3.6292114c0.2312622,0.5754395,0.5686646,1.1463623,1.1139526,1.5431519   c0.2816162,0.1783447,0.6095581,0.317627,0.9523926,0.3204956c0.3203735,0.0150146,0.6072388,0.0019531,0.9124756,0.0042725   l3.6109619-0.015625l14.4437866-0.0625L83.25,39.7683105v4.1286621l-0.1303711,0.2490234H56.5   c-0.0037231,0-0.0058594,0.0037842-0.0095825,0.0039673c-0.2528687,0.0002441-2.1831055,0.0202637-5.1036987,0.0599976   c-0.0040894,0.000061-0.0064087,0.0042725-0.010437,0.0045166c-0.0054932-0.0003662-0.0110474-0.0045166-0.0164185-0.0045166   c-0.4038086,0-0.8217773,0-1.2597656,0.0058594v-0.3657227c0-0.1318359-0.1020508-0.2407227-0.2333984-0.2495117   c-0.3007813-0.0200195-0.6416016-0.0400391-0.9926758-0.0600586c-0.0007324-0.0001221-0.0012817,0.0007324-0.0020142,0.0006104   l0.000061-0.0006104c-2.0136719-0.0996094-4.5693359-0.0913086-4.5932617-0.090332   c-0.1376953,0.0004883-0.2490234,0.1123047-0.2490234,0.25v0.5824585l-4.8747559,0.0568237l1.8617554-8.6322632   l-2.3635864,8.6380615l-1.192749,0.013916l1.8595581-8.649231l-2.3612671,8.6550903l-1.2025146,0.0139771l1.8737793-8.6690674   l-2.3756714,8.6749268l-1.1928711,0.013916l1.87854-8.6888428l-2.3804932,8.6947021l-1.1980591,0.013916L34.25,35.7099609   l-2.3800659,8.7143555l-1.2127686,0.0141602l1.8928223-8.7285156l-2.385437,8.7342529l-1.2016602,0.0139771l1.8970947-8.74823   l-2.3908691,8.7539673l-1.1970825,0.0139771l2.7668457-12.3170166l-1.5751953,5.9403687   c0.324585-1.5967407,0.1518555-3.4816895-0.5736694-4.1212769C27.7299805,33.8299561,27.5300293,33.75,27.3099976,33.75   c-0.25,0-0.6099854,0-1.0499878,0.0100098c-0.5,0-1.0900269,0.0099487-1.7000122,0.0199585   c-0.5599976,0-1.1400146,0.0100098-1.6900024,0.0200195c-0.6199951,0-1.2199707,0.0100098-1.710022,0.0200195   c-0.5999756,0.0099487-1.0499878,0.0099487-1.2099609,0.0099487c-0.1400146,0-0.3200073,0.0300293-0.5100098,0.1000366   c-0.7200317,0.2299805-1.6599731,0.8999634-1.8900146,2.0200195c-0.2000122,0.9299927,0.1500244,1.8399658,0.7999878,2.4400024   v0.0099487l0.000061,0.000061c0.3500366,0.3200073,0.789978,0.5599365,1.289978,0.6799316   c0.0700073,0.0200195,0.1400146,0.0300293,0.2299805,0.0500488c0.4000244,0.0799561,0.9700317,0.1900024,1.6199951,0.3099976   C22,39.539978,22.5499878,39.6400146,23.0999756,39.7399902h0.000061c0.5599976,0.0999756,1.1199341,0.1900024,1.6199341,0.2799683   h0.000061c0.7000122,0.1200562,1.289978,0.2200317,1.6299438,0.2700195h0.000061   c0.1400146,0.0300293,0.2399902,0.039978,0.289978,0.0499878c0.4106445,0.0698853,1.1035767,0.0092773,1.5855713-1.3408813   l-1.4544067,5.4846191l-1.2092896,0.0140991l0.788147-4.2078247l-1.2637329,4.2133789l-1.2266235,0.0142822l0.8603516-4.4976807   l-1.340332,4.5032959l-1.2125244,0.0140991l0.9328613-4.7973633l-1.4168091,4.8030396l-1.2084961,0.0140381l1.0152588-5.1170654   l-1.5030518,5.1227417l-1.2055664,0.0140381l1.088623-5.4467773l-1.5796509,5.4525146l-1.2112427,0.0140991l1.2709351-6.1965942   l-1.7664185,6.2023926l-1.0371094,0.012085l2.6491699-11.8209229   C18.2451172,32.7782593,18.3068848,32.7705078,18.4116211,32.7705078z M11.862793,36.7919922   c-0.3232422-0.2895508-0.5859375-0.4873047-0.7919922-0.6425781c-0.1494141-0.1123047-0.3354492-0.2524414-0.3588867-0.3378906   c0-0.2260742,0.2456055-0.487793,0.4057617-0.487793c0.3925781,0,0.7163086,0.0429688,1.1166992,0.2578125   c0.5140381,0.2761841,1.2337646,0.4135742,2.1693726,0.4373779c-0.1782837,0.7553711-0.5064087,2.1511841-0.7618408,3.2661743   C13.2956543,38.5213623,12.7307129,37.5829468,11.862793,36.7919922z M12.887085,44.5058594   c0.2677612-0.2473145,0.4768677-0.5730591,0.5875244-1.0366211c0.4072266-1.706543,0.6137695-2.6479492,0.6137695-2.7988281   c0-0.0834351-0.0392456-0.2816162-0.1229858-0.5523071c0.2680664-1.1954956,0.75-3.2431641,0.9561768-4.1164551   c0.0714722-0.0219116,0.1392822-0.0541992,0.1951294-0.1061401c0.6557617-0.6088867,2.659668-2.7143555,2.90625-2.9760742   c0.057312-0.0608521,0.0942383-0.0979614,0.1500244-0.1202393l-3.1325684,11.821228l-2.1976318,0.0255737L12.887085,44.5058594z    M53.0517578,47.1513672c-2.2045898,1.7709961-3.0795898,4.1206055-3.1630859,5.7285156   c-0.0693359,1.347168-0.0668945,2.0014648,0.2431641,3.0600586c0.2197266,0.7509766,0.1835938,0.9438477,0.1694336,0.9790039   c-0.0004883,0-0.0458984,0.0283203-0.1953125,0.0283203c-0.5395508,0-3.8999023,0.0405273-6.4599609,0.0712891   c-1.5703125,0.019043-2.8383789,0.0341797-2.9638672,0.0341797c-0.21875,0-0.4526367-0.0952148-0.8115234-0.2519531   c-0.2119141-0.0932617-1.3242188-0.5371094-2.3476563-0.1645508c-0.6572266,0.2397461-1.8173828,0.9311523-2.2016602,2.8666992   c-0.5029297,2.534668-2.3100586,11.6103516-2.4042969,11.9799805c-0.1088867,0.4067383-0.0620117,0.8779297,0.1425781,1.440918   l0.2460938,0.6567383c0.2119141,0.5625,0.6279297,1.6655273,0.7504883,2.0297852   c-0.0805664,0.1938477-0.3525391,0.7109375-0.9985352,0.8686523c-1.0424805,0.2548828-2.2836914,0.5268555-3.8222656,0.5268555   c-1.777832,0-12.6430664-0.0473633-13.2421875-0.081543C15.1474609,76.8764648,13.7290039,76.4980469,13.7290039,74.5   c0-0.1362305-0.0717773-0.28125-0.1699219-0.3754883c-0.0039063-0.0039063-0.0976563-0.0957031-0.1279297-0.2861328   c-0.1079102-0.6831055-0.3408203-2.7192383-0.1264648-3.9169922c0.2133789-1.190918,0.7817383-2.5966797,1.84375-4.5585938   c0.9996338-1.8485107,3.0841675-7.5142212,3.760498-10.1923828l0.5710449,0.109375   c0.1323242,0.0263672,0.2573242-0.0566406,0.2890625-0.1845703c0.0205078-0.0805664,2.0371094-8.0839844,2.2519531-8.8051758   c0.1972656-0.6625977,0.7070313-0.6962891,0.8071289-0.6962891h2.203125c0.1113281,0,0.1787109,0.0058594,0.21875,0.0117188   v2.5004883c0,0.730957,0.9677734,1.003418,1.578125,1.003418h7.2783203   c0.0854492,0.3608398,0.1435547,1.4702148,0.1445313,1.7924805c-0.0546875,0.4936523-3.9455566,21.675354-4.1523438,22.8154297   c-0.2198486,1.2120361-0.7837524,1.5070801-0.8140869,1.5229492c-0.0513916-0.0026245-0.1016846-0.003418-0.1548462-0.008606   l-2.1973877-0.0697632c-1.4649658-0.039856-2.9298706-0.0378418-4.3948364-0.0574341   c-1.4649658,0.0209351-2.9298706,0.0171509-4.3948364,0.0582886l-2.1973877,0.0695801   C15.2371216,75.2825928,14.5182495,75.053894,13.8125,74.875c0.673584,0.2843018,1.3666992,0.5653687,2.1327515,0.6010132   l2.1973877,0.0695801c1.4649658,0.0411377,2.9298706,0.0373535,4.3948364,0.0582886   c1.4649658-0.0195923,2.9298706-0.0175781,4.3948364-0.0574341l2.1973877-0.0697632   c0.1606445,0.0023193,0.3400879-0.0148926,0.5150757-0.0551758l0.0056763,0.0020142   c0.0014038-0.0008545,0.0065918-0.00354,0.0085449-0.0045776c0.2038574-0.0487061,0.4006348-0.1311035,0.552124-0.2684326   C30.5102539,74.9145508,30.729126,74.6137695,30.9375,74.3125c-0.2495117,0.267334-0.505127,0.5368042-0.8028564,0.7297974   c-0.0239258,0.0164185-0.0491333,0.0245361-0.0733643,0.0386353c0.1897583-0.2335205,0.3999023-0.6195068,0.5275879-1.2669678   C30.6308594,73.6035156,34.75,51.2006836,34.75,50.921875c0-2.3125-0.3505859-2.3125-0.5-2.3125h-7.421875   c-0.4501953,0-1.078125-0.1914063-1.078125-0.503418v-2.559082c0-0.453125-0.4853516-0.453125-0.71875-0.453125h-2.203125   c-0.4487305,0-1.0546875,0.2758789-1.2866211,1.0537109c-0.199707,0.6699219-1.8598633,7.2504883-2.1992188,8.5966797   l-0.3668823-0.0701904c0.0068359-1.9525757-0.6585083-4.5578003-2.2063599-6.1427002   C15.7773438,47.5151367,14.5444336,47,13.1040039,47c-2.5800781,0-3.7456055,0.0395508-4.5966797,0.0678711   c-0.5327148,0.0185547-0.9633789,0.0566406-1.5556641,0.0317383c0.0043945-0.0029297,0.0087891-0.0063477,0.0131836-0.0097656   c0.7836914-0.6069336,2.6777344-1.5341797,3.8540039-1.7763672c0.5117188-0.1052856,1.006897-0.2137451,1.4367676-0.4033203   c0.0020752,0.0493774,0.0134277,0.0979004,0.0437012,0.1386719c0.046875,0.0634766,0.121582,0.1010742,0.2006836,0.1010742   c0.0009766,0,0.0019531,0,0.0029297,0l13.4703369-0.1568604c0.0039673,0.4235229,0.1659546,1.0501099,0.3208618,1.0501099   c0.243103,0,0.2196045,0.439209,0.2196045,1.121521c0,0.682373,0.8862915,0.9412231,1.6313477,0.9412231   c0.7451172,0,10.1411743-0.1098633,10.8313599-0.1098633c0.6902466,0,1.1765137-0.4940796,1.1765137-1.0430908   s-0.3843384-1.1137695-1.2470703-1.1137695s-6.9882202,0-7.6313477,0c-0.6431885,0-0.7059326-0.5881958-0.7059326-0.5881958   c0-0.1004639-2.0536499-0.2241211-3.4154053-0.2716675l17.1295166-0.1995239   c0.1370239-0.0014648,0.2455444-0.1134644,0.2459106-0.25h0.0011597v-0.5795898   c0.619873,0,2.2890625,0.0075684,3.8060303,0.0673218C48.1503296,44.3048706,48.0400391,44.6403809,48.0400391,45   c0,1.0200195,0.8300781,1.8500977,1.8500977,1.8500977S51.7402344,46.0200195,51.7402344,45   c0-0.1032715-0.0106201-0.1998901-0.026123-0.2943115c2.7520752-0.0370483,4.5646362-0.0557861,4.7858887-0.0557861   c0.5761719,0,1.2946777,0.1171875,2.019043,0.305481C56.8222656,45.1544189,54.8193359,45.730957,53.0517578,47.1513672z    M91.3754883,40.9277344c-0.8139648,2.3071289-0.9926758,2.6933594-1.0249023,2.7509766   c-0.1879883,0.3041992-0.9384766,1.1860352-1.5625,1.1860352H60.0825195c-0.0657959,0-0.1400146,0.0047607-0.2077637,0.0057373   c-0.2095947-0.0807495-0.416748-0.1553955-0.6343994-0.2244873h24.0306396c0.0932617,0,0.1782227-0.0517578,0.2216797-0.1342773   l0.2290039-0.4375C83.7402344,44.0385742,83.75,43.9990234,83.75,43.9584961l-0.0023804-4.1923218l8.0367432-0.03479   C91.6625366,40.098877,91.5292358,40.4919434,91.3754883,40.9277344z M91.7858887,39.7268677l-8.0383301-0.03479V39.675293   l-0.3330078-2.5c-0.005127-0.0383301-0.03125-0.0651855-0.0513916-0.0957031   c-0.0109863-0.0168457-0.0127563-0.0372925-0.0274048-0.0510254c-0.0450439-0.0424194-0.1032104-0.0700684-0.1692505-0.0700684   h-25.0625c-1.4238281,0-2.4174805-0.4892578-2.9536133-1.4545898c-0.2597656-0.4677734-0.4082031-1.0556641-0.4204102-1.6689453   c0.3452148-0.1630859,1.921875-0.2905273,3.1035156-0.2905273h34.4494019   c-0.0112305,0.0298462-0.0227661,0.0606689-0.0314331,0.0834961c-0.0869141,0.2299805-0.1396484,0.3686523-0.1396484,0.5131836   c0,0.074707,0.0146484,0.1831055,0.1289063,0.9692383c0.0947266,0.6513672,0.2709961,1.8647461,0.2709961,2.0644531   C92.507019,37.3602905,92.2688599,38.2695313,91.7858887,39.7268677z"/><path d="M15.666687,73.895813c0.75-0.083313,3.520813-0.5,6.416626-0.333313c2.895874,0.166626,5.291687,0.458313,5.9375,0.5625   c0.645874,0.104126,1.267395-0.1049805,1.416687-0.75c0.4841919-2.0917358,3.3631592-19.4523926,3.7657471-21.8841553   c0.0251465-0.1519775-0.0905762-0.2860718-0.2445068-0.2901001l-10.7404175-0.2789917   c-0.1160278-0.0029907-0.2174072,0.0662231-0.2488403,0.1779785c-0.3082275,1.0947876-1.9520264,6.8755493-3.5111694,11.2335815   c-1.729126,4.833313-3.604126,8.458313-3.604126,10.104187C14.854187,73.520813,14.916687,73.979126,15.666687,73.895813z"/><path d="M43.7597656,47.5097656c-0.3232422,0-0.6162109,0.0102539-0.8813477,0.0205078   c-0.2219238,0.0101318-0.4432983,0.0303955-0.6605225,0.0526123l-0.0001221-0.0008545   c-2.5704346,0.3328857-3.7507324,1.5332031-3.8318481,1.6185913c-0.000061,0.000061-0.0001221,0-0.0001831,0.000061   c-0.0001831,0.0001831-0.0020142,0.0020752-0.0022583,0.0023193c-0.0007935,0.0007935-0.0055542,0.0054321-0.0060425,0.0059814   l-0.0087891,0.0093994c-0.0132446,0.0132446-0.034729,0.0361938-0.0706177,0.0756836l-0.0094604,0.0101318l0.0001221,0.0006104   c-0.2846069,0.3151245-1.1187744,1.361145-1.1187744,2.8250732c0,1.8999023,1.2431641,4.1323242,3.5527344,4.5273438   c0.2338867,0.0356445,0.7099609,0.0473633,1.3007813,0.0473633c0.59375,0,1.3037109-0.012207,2.0019531-0.0234375   c0.6347656-0.0107422,1.2456055-0.0209961,1.7148438-0.0209961l0.4570313,0.0009766   c1.2954102,0.0024414,2.159668,0.0083008,2.6796875-0.3789063c0.6889648-0.4995117,0.7631836-0.9790039,0.7631836-1.1621094   l0.0004883-0.0698242c0.015625-1.5620117-0.0488281-4.3134766-0.6557617-5.1938477   C48.1318359,48.6376953,46.9077148,47.5097656,43.7597656,47.5097656z M49.1401367,55.1201172   c0,0.1708984-0.1464844,0.4599609-0.5595703,0.7592773c-0.3886719,0.2895508-1.2299805,0.2851563-2.3813477,0.2817383   l-0.4589844-0.0009766c-0.4716797,0-1.0854492,0.0102539-1.7231445,0.0209961   c-1.3081055,0.0214844-2.7919922,0.046875-3.215332-0.0175781c-2.2817383-0.3901367-3.1318359-2.6811523-3.1318359-4.0336914   c0-0.9456177,0.4136353-1.7109375,0.7253418-2.1536865c0.0254517,0.2139282,0.0508423,0.4686279,0.0651855,0.7850342   c0.0527344,1.1777344,0.0947266,2.1083984,0.6044922,3.2685547c0.4907227,1.1157227,1.5541992,2.0288086,2.4736328,2.1245117   c0.0141602,0.0014648,0.0283203,0.0024414,0.0424805,0.0024414c0.1259766,0,0.2358398-0.0610352,0.2993164-0.168457   C42.0766602,55.6572266,41.7148438,55,41.5585938,54.7749023c-0.4052734-0.5839844-0.6025391-2.2114258-0.5888672-3.1611328   c0.0234375-1.5644531,0.5810547-3.1337891,0.7514648-3.3422852c0.0300903-0.0354614,0.145813-0.1248779,0.5628662-0.1936035   c0.1935425-0.0192261,0.4050903-0.0384521,0.6153564-0.0480957c0.2568359-0.0097656,0.5439453-0.0200195,0.8603516-0.0200195   c3.0649414,0,4.0927734,1.1015625,4.8144531,2.1323242c0.3798828,0.5507813,0.5917969,2.3837891,0.5664063,4.9033203   L49.1401367,55.1201172z"/><path d="M49.8646851,47.0117798c-0.7179565,0-1.2999878,0.5819702-1.2999878,1.2999878   c0,0.7179565,0.5820313,1.2999878,1.2999878,1.2999878c0.7180176,0,1.3000488-0.5820313,1.3000488-1.2999878   C51.1647339,47.59375,50.5827026,47.0117798,49.8646851,47.0117798z"/><path d="M35.8666382,54.7210693c-0.5999146,0-1.0862427,0.4863281-1.0862427,1.0863037   c0,0.5999146,0.4863281,1.0862427,1.0862427,1.0862427c0.5999756,0,1.0863037-0.4863281,1.0863037-1.0862427   C36.9529419,55.2073975,36.4666138,54.7210693,35.8666382,54.7210693z"/></g></svg>`,
  UZI: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 6 200 155" x="0px" y="0px"><title>uzi</title><path d="M51.832,37.053l3.116-.126,3.4,3.349,1.3-.992-.432-.484A7.565,7.565,0,0,1,57.3,33.764h0l-5.466-.017Z"/><rect x="30.931" y="19.52" width="2.284" height="1.115"/><polygon points="81.63 16.427 81.63 26.336 85.794 26.336 85.794 24.648 95 24.648 95 18.999 85.794 18.999 85.794 16.427 81.63 16.427"/><rect x="39.148" y="66.732" width="11.606" height="27.229"/><path d="M80.514,27.452H14.861l7.359,7.374h6.7v-.009H30s3.848,1.511,3.513,5.078S30,50.329,30,54.346s.444,11.271,5.243,11.271H50.753V43.661H66.382a3.229,3.229,0,0,0,3.108-2.353l1.579-6.144a3.47,3.47,0,0,1,3.34-2.527h1.015l.289-2.663h4.8Zm-12.291,9.6L67.342,40.7a1,1,0,0,1-.959.725H51.588c-.6,0-.835-.553-.872-1.153l.037-7.644H61.509l3.382.005A3.469,3.469,0,0,1,68.223,37.053Z"/><polygon points="77.109 6.038 71.763 11.395 20.93 11.395 20.93 6.038 13.689 6.038 10.354 9.386 10.354 13.838 5 13.838 5 26.336 10.354 26.336 13.608 26.336 80.514 26.336 80.514 16.427 80.514 6.038 77.109 6.038"/></svg>`,
};

const sounds = {
  AWM: new Audio("./sounds/AWM2.mp3"),
  AWMr: new Audio("./sounds/AWMr.mp3"),
  AKM: new Audio("./sounds/AKM.mp3"),
  AKMr: new Audio("./sounds/AKMr.mp3"),
  UZI: new Audio("./sounds/UZI_Single.mp3"),
  UZIr: new Audio("./sounds/UZIr.mp3"),
  DEagle: new Audio("./sounds/DEagle.mp3"),
  DEagler: new Audio("./sounds/DEagler.mp3"),
  M4A1: new Audio("./sounds/M4A1.mp3"),
  M4A1r: new Audio("./sounds/M4A1r.mp3"),
  Run: new Audio("./sounds/Run.mp3"),
  Jump: new Audio("./sounds/Jump.mp3"),
  Jump2: new Audio("./sounds/Jump2.mp3"),
  gunChange: new Audio("./sounds/gunChange.mp3"),
  Hurt: new Audio("./sounds/Hurt.mp3"),
  Hurt2: new Audio("./sounds/Hurt2.mp3"),
  LandMine: new Audio("./sounds/LandMine.mp3"),
  DefenseBlock: new Audio("./sounds/DefenseBlock.mp3"),
  SpikeTrap: new Audio("./sounds/MineTrap.mp3"),
  pause: new Audio("./sounds/pause.wav"),
  shop: new Audio("./sounds/shop.wav"),
  cannon: new Audio("./sounds/cannon.wav"),
  cannonHit: new Audio("./sounds/cannonHit.wav"),
  empty: new Audio("./sounds/empty.wav"),
  Inventory: new Audio("./sounds/Inventory.wav"),
  click: new Audio("./sounds/click.wav"),
  MineExplosion: new Audio("./sounds/MineExplosion.wav"),
};

const Zsounds = [
  new Audio("./sounds/ZombieAttack1.mp3"),
  new Audio("./sounds/ZombieAttack2.mp3"),
  new Audio("./sounds/ZombieAttack3.mp3"),
  new Audio("./sounds/ZombieAttack4.mp3"),
  new Audio("./sounds/ZombieAttack5.mp3"),
  new Audio("./sounds/ZombieAttack6.mp3"),
  new Audio("./sounds/ZombieAttack7.mp3"),
];

function playZAttack(vol = 1) {
  const ind = randomIntFromRange(0, 6);
  const soundClone = Zsounds[ind].cloneNode();
  soundClone.volume = vol;
  soundClone.play();
}

function playSound(sound, vol = 1) {
  if (sounds[sound]) {
    const soundClone = sounds[sound].cloneNode();
    soundClone.volume = vol;
    soundClone.play();
  }
}

let isRunning = false;
const RunSound = new Audio("./sounds/Run.mp3");
RunSound.loop = true; // Make the sound loop
function playRunSound() {
  if (!isRunning) {
    RunSound.play();
    isRunning = true;
  }
}
function stopRunSound() {
  if (isRunning) {
    RunSound.pause();
    RunSound.currentTime = 0; // Reset the sound to the beginning
    isRunning = false;
  }
}

const jetpack = new Audio("./sounds/jetpack.mp3");
jetpack.loop = true; // Make the sound loop
function jetpackSoundOn() {
  jetpack.play();
}
function jetpackSoundOff() {
  jetpack.pause();
  jetpack.currentTime = 0;
}

const Zombie_Horde = new Audio("./sounds/Zombie_Horde.mp3");
Zombie_Horde.volume = 0.25;
Zombie_Horde.loop = true; // Make the sound loop
function HordeSoundOn() {
  Zombie_Horde.play();
}
function HordeSoundOff() {
  Zombie_Horde.pause();
  // Zombie_Horde.currentTime = 0;
}

function changeSprite() {
  if (
    keys.right.pressed &&
    !currentGun.isReloading &&
    !currentGun.isFiring &&
    !player.jetpackActive
  )
    player.switchSprite("RunR");
  else if (
    keys.left.pressed &&
    !currentGun.isReloading &&
    !currentGun.isFiring &&
    !player.jetpackActive
  )
    player.switchSprite("RunL");
  else if (!currentGun.isReloading && !currentGun.isFiring) {
    if (player.dir === "right") {
      player.switchSprite("IdleR");
    } else if (player.dir === "left") {
      player.switchSprite("IdleL");
    }
  }
}
