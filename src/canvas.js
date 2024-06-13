const gravity = 0.5;

//  initialize objects to be rendered
spawnZombies(1);
const player = new Player({
  collisionBlocks: blocks,
  zombies,
});
Hmeter.value = player.health / 100;
const platform = new Platform({
  position: { x: canvas.width / 2 - 75, y: 250 },
  width: 150,
});
const base = new Platform({
  position: { x: 0, y: 556 },
  width: canvas.width,
});
//  creating guns
const M416 = new Gun({
  ammo: 60,
  gunrate: 360,
  blocks: blocks,
  damage: 10,
  mag: 30,
  name: "M416",
  velocity: 8,
  player: player,
});
const AWM = new Gun({
  ammo: 5,
  gunrate: 20,
  blocks: blocks,
  damage: 110,
  mag: 5,
  name: "AWM",
  velocity: 10.5,
  player: player,
});
const AKM = new Gun({
  ammo: 60,
  gunrate: 260,
  blocks: blocks,
  damage: 15,
  mag: 30,
  name: "AKM",
  velocity: 7,
  player: player,
});
const DEagle = new Gun({
  ammo: 30,
  gunrate: 120,
  blocks: blocks,
  damage: 8,
  mag: 15,
  name: "DEagle",
  velocity: 5,
  player: player,
});
guns.push(M416);
guns.push(AWM);
guns.push(AKM);
guns.push(DEagle);

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

currentGun = DEagle;
changeGun(DEagle);
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
  player.zombies = zombies;
  platform.draw();
  base.draw();
  theta = calculateAngle(player);

  const trajectoryPoints = bulletTrack.calculateTrajectoryPoints(
    {
      x: player.position.x + player.width / 2,
      y: player.position.y + player.height / 2,
    },
    theta
  );
  Bullet.drawTrajectory(trajectoryPoints);

  currentGun.shoot();
  for (let i = 0; i < blocks.length; i++) {
    blocks[i].draw();
  }

  //    player movements
  if (keys.right.pressed) player.velocity.x = Pvelocity;
  else if (keys.left.pressed) player.velocity.x = -Pvelocity;
  else player.velocity.x = 0;

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
  if (
    player.position.y + player.height <= base.position.y &&
    player.position.y + player.height + player.velocity.y >= base.position.y &&
    player.position.x + player.width >= base.position.x &&
    player.position.x <= base.position.x + base.width
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
      break;
    case "a":
      keys.left.pressed = true;
      break;
    case "w":
      if (player.grounded) {
        player.velocity.y = -player.jumpStrength;
        player.grounded = false;
      }
      break;
    case "Escape":
      if (gamePaused) {
        gamePaused = false;
        animate();
        decreaseTimer();
        powerUpScr.close();
        powerUpScr.style.display = "none";
        pauseScr.close();
        pauseScr.style.display = "none";
      } else {
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
      break;
    case "a":
      keys.left.pressed = false;
      break;
    case "r":
      currentGun.reload();
      break;
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
          // PUmsg.style.color = "red";
          // PUmsg.style.display = "block";
          // PUmsg.textContent = "Not enough Credits!";
          // setTimeout(() => {
          //   PUmsg.style.color = "white";
          //   PUmsg.style.display = "none";
          //   PUmsg.textContent = "";
          // }, 1500);
          updatePUmsg("Not enough credits!!", "red");
          return;
        }
        player.score -= 1100;
        if (player.health > 80) player.health = 100;
        else player.health += 20;
        usePowerUp();
        break;
      case 1:
        if (player.score < 2250) {
          updatePUmsg("Not enough credits!!", "red");
          return;
        }
        player.score -= 2250;
        guns.forEach((gun) => {
          if (gun.name === currentGun.name) {
            console.log(gun.ammo);
            gun.ammo += gun.magLimit;
            console.log(gun.magLimit);
            return;
          }
        });
        usePowerUp();
        break;
      case 2:
        if (player.score < 1200) {
          updatePUmsg("Not enough credits!!", "red");
          return;
        }
        player.score -= 1200;
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
        break;
      case 3:
        if (player.score < 1600) {
          updatePUmsg("Not enough credits!!", "red");
          return;
        }
        player.score -= 1600;
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
        break;
    }
  });
});
