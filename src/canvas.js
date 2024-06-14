const gravity = 0.5;

//  initialize objects to be rendered
// spawnZombies(1);
const player = new Player({
  collisionBlocks: blocks,
  zombies,
});
// const zombie = new Zombie({
//   position: {x:10,y:100},
//   velocity: { x: 0, y: 0 },
//   collisionBlocks: blocks,
//   health: 300,
//   zombies,
//   speed: 0.15,
//   height: 120,
//   width: 60,
//   damage: 30,
//   attackFreq: 6000,
//   color: "gray",
// });
Hmeter.value = player.health / 100;
const platform = new Platform({
  position: { x: canvas.width / 2 - 75, y: 250 },
  width: 150,
});
//  creating guns
const M4A1 = new Gun({
  ammo: 60,
  gunrate: 360,
  blocks: blocks,
  damage: 14,
  mag: 30,
  name: "M4A1",
  velocity: 8,
  player: player,
  reloadTime: 3.1,
  spread: 2 * (Math.PI / 180),
});
const AWM = new Gun({
  ammo: 5,
  gunrate: 30,
  blocks: blocks,
  damage: 180,
  mag: 5,
  name: "AWM",
  velocity: 11,
  player: player,
  reloadTime: 3.6,
  spread: 0.5 * (Math.PI / 180),
});
const AKM = new Gun({
  ammo: 60,
  gunrate: 246,
  blocks: blocks,
  damage: 17.5,
  mag: 30,
  name: "AKM",
  velocity: 7,
  player: player,
  reloadTime: 2.35,
  spread: 1.5 * (Math.PI / 180),
});
const DEagle = new Gun({
  ammo: 28,
  gunrate: 82,
  blocks: blocks,
  damage: 32,
  mag: 7,
  name: "DEagle",
  velocity: 5,
  player: player,
  reloadTime: 2,
  spread: 1.2 * (Math.PI / 180),
});
const UZI = new Gun({
  ammo: 66,
  gunrate: 778,
  blocks: blocks,
  damage: 7.5,
  mag: 33,
  name: "UZI",
  velocity: 6,
  player: player,
  reloadTime: 1.6,
  spread: 2.5 * (Math.PI / 180),
});
guns.push(M4A1);
guns.push(AWM);
guns.push(AKM);
guns.push(DEagle);
guns.push(UZI);

const bulletTrack = new Bullet({
  position: {
    x: player.position.x + player.width / 2,
    y: player.position.y + player.height / 2,
  },
  velocity: 6,
  theta,
  collisionBlocks: blocks,
  player: player,
});

currentGun = UZI;
changeGun(UZI);
const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};
const mouse = {
  x: undefined,
  y: undefined,
};

function changeGun(gun) {
  if (currentGun.isFiring || currentGun.isReloading) return;

  //  update the current gun
  currentGun = gun;
  gunIcon.innerHTML = gunSvg[currentGun.name];
  const factor = currentGun.magLimit / 100;

  //  updating the meter and texts
  Bmeter.low = 0.24 * factor;
  Bmeter.high = 0.6 * factor;
  Bmeter.optimum = 0.9 * factor;
  Bmeter.max = factor;
  Bmeter.value = currentGun.mag / 100;
  gunText.textContent = currentGun.name;
  ammo.textContent = `${currentGun.mag}/${currentGun.ammo}`;

  //  updating the text color
  if (currentGun.ammo > 0) {
    if (currentGun.mag > 0) color = "white";
    else color = "red";
  } else {
    if (currentGun.mag > 0) color = "white";
    else color = "red";
  }
  ammo.style.color = color;

  //  updating the bullet track
  bulletTrack.velocity = currentGun.velocity;
}

function animate() {
  if (gamePaused) return;
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  for (let i = 0; i < zombies.length; i++) {
    zombies[i].update();
    zombies[i].detectPlayerCollision(player);
  }
  // zombie.update();
  // zombie.detectPlayerCollision(player);
  player.zombies = zombies;
  platform.draw();
  theta = calculateAngle(player);
  currentGun.draw();
  const trajectoryPoints = bulletTrack.calculateTrajectoryPoints(
    {
      x:
        player.position.x +
        player.width / 2 +
        currentGun.width * Math.cos(theta),
      y:
        player.position.y +
        player.height / 2 +
        currentGun.width * Math.sin(theta),
    },
    theta
  );
  Bullet.drawTrajectory(trajectoryPoints);

  guns.forEach((gun) => {
    if (gun.bullets.length > 0) gun.shoot();
  });
  for (let i = 0; i < blocks.length; i++) {
    blocks[i].draw();
  }

  //    player movements
  if (keys.right.pressed) {
    if (lastKey === "right") player.velocity.x = Pvelocity;
    else if (lastKey === "left") player.velocity.x = -Pvelocity;
  } else if (keys.left.pressed) {
    if (lastKey === "left") player.velocity.x = -Pvelocity;
    else if (lastKey === "right") player.velocity.x = Pvelocity;
  } else player.velocity.x = 0;

  //    platform collision detection
  if (
    player.position.y + player.height <= platform.position.y &&
    player.position.y + player.height + player.velocity.y >=
      platform.position.y &&
    player.position.x + player.width >= platform.position.x &&
    player.position.x <= platform.position.x + platform.width
  ) {
    player.velocity.y = 0;
    player.grounded = true;
  }
}

animate();

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "d":
      keys.right.pressed = true;
      lastKey = "right";
      if (!player.jetpackActive) playRunSound();
      break;
    case "a":
      keys.left.pressed = true;
      lastKey = "left";
      if (!player.jetpackActive) playRunSound();
      break;
    case "w":
      if (player.grounded || player.jetpackActive) {
        if (!player.jetpackActive) {
          if (randomIntFromRange(1, 10) % 2 == 0) playSound("Jump", 0.5);
          else playSound("Jump2", 0.5);
        }
        player.velocity.y = -player.jumpStrength;
        player.grounded = false;
      }
      break;
    case "j":
      player.toggleJetpack();
      break;
    case "Escape":
      if (gamePaused) {
        playSound("pause");
        gamePaused = false;
        animate();
        decreaseTimer();
        powerUpScr.close();
        powerUpScr.style.display = "none";
        pauseScr.close();
        pauseScr.style.display = "none";
      } else {
        playSound("pause");
        msg.textContent = 'Press "Esc" to resume';
        gamePaused = true;
        powerUpScr.close();
        powerUpScr.style.display = "none";
        pauseScr.showModal();
        pauseScr.style.display = "flex";
      }
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "d":
      keys.right.pressed = false;
      if (!keys.left.pressed) stopRunSound();
      else lastKey = "left";
      break;
    case "a":
      keys.left.pressed = false;
      if (!keys.right.pressed) stopRunSound();
      else lastKey = "right";
      break;
    case "r":
      currentGun.reload();
      break;
    // case "w":
    //   if (player.jetpackActive) {
    //     console.log("stopped");
    //     player.velocity.y = 0;
    //   }
    //   break;
    case "1":
      changeGun(guns[0]);
      break;
    case "2":
      changeGun(guns[1]);
      break;
    case "3":
      changeGun(guns[2]);
      break;
    case "4":
      changeGun(guns[3]);
      break;
    case "5":
      changeGun(guns[4]);
      break;
  }
});

addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
  theta = calculateAngle();
});

addEventListener("mousedown", () => {
  if (gamePaused) return;
  currentGun.startFiring(player);
});

addEventListener("mouseup", () => {
  currentGun.stopFiring();
});

shop.addEventListener("click", () => {
  if (gamePaused) return;
  gamePaused = true;
  powerUpScr.showModal();
  powerUpScr.style.display = "flex";
});

closeBtn.onclick = () => {
  usePowerUp();
};

document.querySelectorAll(".powerUp").forEach((btn, i) => {
  btn.addEventListener("mouseenter", (e) => {
    PUdesc.textContent = btn.getAttribute("data-tooltip");
  });
  btn.addEventListener("click", (e) => {
    switch (i) {
      case 0:
        if (player.score < 1100) {
          updatePUmsg("Not enough credits!!", "red");
          return;
        }
        player.score -= 1100;
        if (player.health > 80) player.health = 100;
        else player.health += 20;
        usePowerUp();
        updatePUmsg("Health increased by 20HP", "green");
        break;
      case 1:
        if (player.score < 1250) {
          updatePUmsg("Not enough credits!!", "red");
          return;
        }
        player.score -= 1250;
        guns.forEach((gun) => {
          if (gun.name === currentGun.name) {
            console.log(gun.ammo);
            gun.ammo += gun.magLimit;
            console.log(gun.magLimit);
            return;
          }
        });
        usePowerUp();
        updatePUmsg("Ammo increased by 1 mag capacity", "green");
        break;
      case 2:
        if (player.score < 1000) {
          updatePUmsg("Not enough credits!!", "red");
          return;
        }
        player.score -= 1000;
        Pvelocity = 7.5;
        speedDur += 15;
        if (!speedPUTimeout) {
          speedPUTimeout = setTimeout(() => {
            Pvelocity = 3.8;
          }, speedDur * 1000);
        } else {
          clearTimeout(speedPUTimeout);
          speedPUTimeout = setTimeout(() => {
            Pvelocity = 3.8;
          }, speedDur * 1000);
        }
        usePowerUp();
        updatePUmsg("Speed boosted for 15s", "green");
        break;
      case 3:
        if (player.score < 1400) {
          updatePUmsg("Not enough credits!!", "red");
          return;
        }
        player.score -= 1400;
        damageDur += 15;
        if (!damagePUTimeout) {
          guns.forEach((gun) => {
            gun.damage *= 2;
          });
          damagePUTimeout = setTimeout(() => {
            guns.forEach((gun) => {
              gun.damage /= 2;
            });
          }, damageDur * 1000);
        } else {
          clearTimeout(damagePUTimeout);
          damagePUTimeout = setTimeout(() => {
            guns.forEach((gun) => {
              gun.damage /= 2;
            });
          }, damageDur * 1000);
        }
        usePowerUp();
        updatePUmsg("Damage is doubled for all guns for 15s", "green");
        break;
    }
  });
});
