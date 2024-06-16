class Gun {
  constructor({
    ammo,
    gunrate,
    velocity,
    blocks,
    damage,
    mag = 30,
    reloadTime = 3.5,
    name,
    player,
    spread,
    color = "gray",
  }) {
    this.bullets = [];
    this.ammo = ammo;
    this.mag = mag;
    this.magLimit = mag;
    this.gunrate = gunrate;
    this.isFiring = false;
    this.fireInterval = null;
    this.blocks = blocks;
    this.damage = damage;
    this.reloadTime = reloadTime;
    this.isReloading = false;
    this.name = name;
    this.velocity = velocity;
    this.player = player;
    this.lastFired = 0;
    this.spread = spread;
    this.width = 55;
    this.height = 20;
    this.recoilOffset = { x: 0, y: 0 };
    this.color = color;
  }

  // Method to add a new bullet to the array
  addBullet(bullet) {
    this.bullets.push(bullet);
  }

  // Method to remove a bullet from the array
  removeBullet(index) {
    const removedBullet = this.bullets.splice(index, 1)[0];
  }

  // Method to update and draw bullets
  shoot() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.update();

      // Check for collision with blocks and remove bullet if collision detected
      if (
        bullet.checkForCollision() ||
        bullet.position.y > canvas.height ||
        bullet.position.y < 0 ||
        bullet.position.x < 0 ||
        bullet.position.x > canvas.width ||
        bullet.checkForZombieCollision()
      ) {
        this.removeBullet(i);
      }
    }
  }

  fireBullet(player) {
    if (this.mag > 0) {
      // Add shake effect
      this.recoilOffset.x =
        (Math.random() - 0.5) * (this.spread / (Math.PI / 180)) * 5;
      this.recoilOffset.y =
        (Math.random() - 0.5) * (this.spread / (Math.PI / 180)) * 5;
      //  creating bullet
      const angle = theta;
      theta += randomIntFromRange(-1, 1) * this.spread;
      const bullet = new Bullet({
        position: {
          x:
            player.position.x + player.width / 2 + this.width * Math.cos(angle),
          y:
            player.position.y +
            player.height / 2 +
            this.width * Math.sin(angle),
        },
        velocity: this.velocity,
        theta: theta,
        collisionBlocks: this.blocks,
        zombies,
        damage: this.damage,
        player: this.player,
      });
      const soundClone = sounds[this.name].cloneNode();
      if (this.name === "M4A1") soundClone.volume = 0.15;
      else soundClone.volume = 0.5;
      soundClone.play();
      this.addBullet(bullet);
      this.mag--;
      //  updating meters and texts
      Bmeter.value = this.mag / 100;
      ammo.textContent = `${this.mag}/${this.ammo}`;
    }
    if (this.mag <= 0) {
      sounds["empty"].play();
      color = "red";
      ammo.style.color = color;
    }
  }

  draw() {
    c.save();
    c.translate(
      this.player.position.x + this.player.width / 2 + this.recoilOffset.x,
      this.player.position.y + this.player.height / 2 + this.recoilOffset.y
    );
    c.rotate(theta);
    c.fillStyle = this.color;
    c.fillRect(0, -this.height / 2, this.width, this.height);
    c.restore();
  }

  startFiring(player) {
    if (this.isFiring || this.isReloading) return;

    this.isFiring = true;
    const intervalTime = 60000 / this.gunrate;
    const currentTime = Date.now();
    if (currentTime - this.lastFired >= intervalTime) {
      this.fireBullet(player);
      this.lastFired = currentTime;
    }

    this.fireInterval = setInterval(() => {
      this.fireBullet(player);
    }, intervalTime);
  }

  stopFiring() {
    if (!this.isFiring) return;

    clearInterval(this.fireInterval);
    this.fireInterval = null;
    this.isFiring = false;
  }

  reload() {
    if (this.isReloading || this.isFiring) return; // Check if already reloading
    this.isReloading = true; // Set reloading flag
    ammo.textContent = `Reloading....`;
    //  setting color of the indicator
    if (this.ammo > 0) {
      color = "white";
      ammo.style.color = color;
    } else {
      color = "red";
      ammo.style.color = color;
    }
    const reqBullets = this.magLimit - this.mag;

    setTimeout(() => {
      if (this.ammo >= reqBullets) {
        this.mag += reqBullets;
        this.ammo -= reqBullets;
      } else {
        this.mag += this.ammo;
        this.ammo = 0;
      }
      Bmeter.value = this.mag / 100;
      ammo.textContent = `${this.mag}/${this.ammo}`;
      this.isReloading = false; // Reset reloading flag
    }, this.reloadTime * 1000);
  }
}

const guns = [];

class Cannon extends Gun {
  constructor({
    x,
    y,
    width,
    height,
    ammo,
    gunrate,
    velocity,
    blocks,
    damage,
    reloadTime,
    name,
    player,
    spread,
    direction,
    angle,
    alpha,
    offset,
    color,
  }) {
    super({
      ammo,
      gunrate,
      velocity,
      blocks,
      damage,
      reloadTime,
      name,
      player,
      spread,
      color,
    });
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.direction = direction;
    this.angle = angle;
    this.alpha = alpha;
    this.offset = offset;
    this.interval;
    this.color = color;
  }

  // Override the fireBullet method to use the fixed position and calculated angle
  fireBullet() {
    if (this.ammo > 0) {
      const cannonBall1 = new Bullet({
        position: {
          x: this.x + this.width * Math.cos(this.alpha) - this.offset.x,
          y: this.y + this.width * Math.sin(this.alpha),
        },
        velocity: this.velocity,
        theta: this.alpha,
        collisionBlocks: this.blocks,
        zombies,
        damage: this.damage,
        player: this.player,
        radius: 12,
        color: "gray",
      });
      const cannonBall2 = new Bullet({
        position: {
          x: this.x + this.width * Math.cos(this.alpha) - this.offset.x,
          y: this.y + this.width * Math.sin(this.alpha),
        },
        velocity: this.velocity,
        theta: this.alpha + 0.05,
        collisionBlocks: this.blocks,
        zombies,
        damage: this.damage,
        player: this.player,
        radius: 12,
        color: "gray",
      });
      const cannonBall3 = new Bullet({
        position: {
          x: this.x + this.width * Math.cos(this.alpha) - 20,
          y: this.y + this.width * Math.sin(this.alpha),
        },
        velocity: this.velocity,
        theta: this.alpha - 0.05,
        collisionBlocks: this.blocks,
        zombies,
        damage: this.damage,
        player: this.player,
        radius: 12,
        color: "gray",
      });
      cannonBall1.isCannon = true;
      cannonBall2.isCannon = true;
      cannonBall3.isCannon = true;
      playSound("cannon", 0.5);
      this.addBullet(cannonBall1);
      this.addBullet(cannonBall2);
      this.addBullet(cannonBall3);
      this.ammo -= 3;
    }
  }

  startFiring() {
    const intervalTime = 60000 / this.gunrate;

    this.interval = setInterval(() => {
      this.fireBullet();
    }, intervalTime);
  }

  stopFiring() {
    clearInterval(this.interval);
  }

  draw() {
    c.save();
    c.translate(this.x, this.y);
    c.rotate(this.angle);
    c.fillStyle = this.color;
    c.fillRect(0, -this.height / 2, this.width, this.height);
    c.restore();
  }
}

function startCannonFire(interval = 10000) {
  cannonLeft.startFiring();
  cannonInterval = setTimeout(() => {
    cannonRight.startFiring();
  }, interval);
}

function stopCannonFire() {
  clearInterval(cannonInterval);
  cannonLeft.stopFiring();
  cannonRight.stopFiring();
}
