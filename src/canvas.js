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
const gun = new Gun({
  ammo: 60,
  gunrate: 360,
  blocks: blocks,
  damage: 10,
  mag: 30,
});
Bmeter.max = gun.mag / 100;
Bmeter.value = gun.mag / 100;
ammo.textContent = `${gun.mag}/${gun.ammo}`;
const bulletTrack = new Bullet({
  position: {
    x: player.position.x + player.width / 2,
    y: player.position.y + player.height / 2,
  },
  velocity: 6,
  theta,
  collisionBlocks: blocks,
});

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
    theta,
    6, // bullet velocity
    0.08 // bullet gravity
  );
  Bullet.drawTrajectory(trajectoryPoints);

  gun.shoot();
  for (let i = 0; i < blocks.length; i++) {
    blocks[i].draw();
  }

  //    player movements
  if (keys.right.pressed) player.velocity.x = 5;
  else if (keys.left.pressed) player.velocity.x = -5;
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
        pauseScr.close();
        pauseScr.style.display = "none";
      } else {
        msg.textContent = 'Press "Esc" to resume';
        gamePaused = true;
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
      gun.reload();
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
  gun.startFiring(player);
});

addEventListener("mouseup", () => {
  gun.stopFiring();
});
