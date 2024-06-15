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
        if (this.isCannon) playSound("cannonHit",0.2);
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
        if (zombie.health <= 0) this.zombies.splice(i, 1);
        this.player.score += this.damage;
        score.textContent = `Score:💰${this.player.score}`;
        if (this.isCannon) playSound("cannonHit",0.2);
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
