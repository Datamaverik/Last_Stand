class Bullet {
  constructor({
    position,
    velocity,
    damage = 10,
    theta,
    gravity = 0.08,
    collisionBlocks,
    radius = 5,
    zombies,
    player,
    color = "yellow",
  }) {
    this.position = position;
    this.velocity = velocity;
    this.theta = theta;
    this.damage = damage;
    this.dx = this.velocity * Math.cos(this.theta) * 1.2;
    this.dy = this.velocity * Math.sin(this.theta);
    this.gravity = gravity;
    this.collisionBlocks = collisionBlocks;
    this.zombies = zombies;
    this.radius = radius;
    this.player = player;
    this.color = color;
    this.isCannon = false;
  }

  draw() {
    c.beginPath();
    c.fillStyle = this.color;
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();

    this.position.x += this.dx;
    this.applyGravity();
    this.checkForCollision();
  }

  checkForCollision() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (bulletCollision({ bul: this, obj: collisionBlock })) {
        collisionBlock.health -= this.damage;
        if (collisionBlock.health < 0) this.collisionBlocks.splice(i, 1);
        if (this.isCannon) playSound("cannonHit", 0.2);
        return true;
      }
    }
    return false;
  }
  checkForZombieCollision() {
    for (let i = 0; i < this.zombies.length; i++) {
      const zombie = this.zombies[i];

      if (bulletCollision({ bul: this, obj: zombie })) {
        if (zombie.health > 0) zombie.health -= this.damage;
        if (zombie.health <= 0) {
          this.zombies.splice(i, 1);
          zombieCount--;
        }
        if (zombieCount < 2) HordeSoundOff();
        this.player.score += this.damage;
        score.textContent = `Score:💰${this.player.score}`;
        if (this.isCannon) playSound("cannonHit", 0.2);
        return true;
      }
    }
    return false;
  }

  applyGravity() {
    this.position.y += this.dy;
    this.dy += this.gravity;
  }

  calculateTrajectoryPoints(startPos, angle, steps = 80) {
    const points = [];
    let x = startPos.x;
    let y = startPos.y;
    let dx = this.velocity * Math.cos(angle) * 1.2;
    let dy = this.velocity * Math.sin(angle);

    for (let i = 0; i < steps; i++) {
      x += dx;
      y += dy;
      dy += this.gravity;

      points.push({ x, y });
    }

    return points;
  }

  static drawTrajectory(points) {
    points.forEach((point) => {
      c.beginPath();
      c.fillStyle = "white";
      c.arc(point.x, point.y, 2, 0, Math.PI * 2);
      c.fill();
      c.closePath();
    });
  }
}

class Particle {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.xs = dx;
    this.ys = dy;
    this.life = 0;
  }
}

class Mine {
  constructor({
    position,
    range = { width: 100, height: 150 },
    blastDuration = 400,
  }) {
    this.position = position;
    this.damageBox = {
      position: { x: this.position.x - 30, y: this.position.y - 140 },
      width: 100,
      height: 150,
    };
    this.range = range;
    this.blastDuration = blastDuration;
    this.isBlasting = false;
    this.blastStartTime = 0;
    this.velocity = { x: 0, y: 0 };
    this.gravity = 0.5;
    this.isGrounded = false;
    this.width = 40;
    this.height = 10;
    this.isDeployed = false;
  }

  draw() {
    c.fillStyle = "darkGreen";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    this.damageBox.position.x = this.position.x - 30;
    this.damageBox.position.y = this.position.y - 140;
    // c.strokeStyle = "white";
    // c.strokeRect(
    //   this.damageBox.position.x,
    //   this.damageBox.position.y,
    //   this.damageBox.width,
    //   this.damageBox.height
    // );
  }

  update() {
    this.draw();
    if (this.isBlasting) {
      this.blast();
    }
    if (!this.isGrounded) {
      this.position.y += this.velocity.y;
      this.velocity.y += this.gravity;
      this.checkForCollision();
    }
  }

  explode() {
    this.isBlasting = true;
    this.blastStartTime = Date.now();
  }

  blast() {
    if (Date.now() - this.blastStartTime > this.blastDuration) {
      this.isBlasting = false;
      const ind = mines.indexOf(this);
      mines.splice(ind, 1);
      return;
    }

    for (let i = 0; i < 10; i++) {
      const p = new Particle(
        this.position.x,
        this.position.y,
        (Math.random() * 2.5 * speed - speed) / 2,
        -Math.random() * speed * 1.2
      );
      particles.push(p);
    }
  }

  checkForCollision() {
    for (const boundary of boundaries) {
      if (collision({ obj1: this, obj2: boundary })) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          this.position.y = boundary.position.y - this.height - 0.1;
          this.isGrounded = true;
          break;
        }
      }
    }
  }
}

const mines = [];

mines[0] = new Mine({
  position: { x: -100, y: -100 },
  range: 100,
});
mines[1] = new Mine({
  position: { x: -100, y: -100 },
  range: 100,
});
mines[2] = new Mine({
  position: { x: -100, y: -100 },
  range: 100,
});

mineBtn.onclick = () => {
  mineSetup = true;
  defenseBlockSetup = false;
  inventoryScr.close();
  inventoryScr.style.display = "none";
  inventoryOpen = false;
};
