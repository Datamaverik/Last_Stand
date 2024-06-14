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
  }) {
    this.bullets = [];
    this.ammo = ammo;
    this.mag = mag;
    this.magLimit = mag;
    this.roundsFired = 0;
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
      //  creating bullet
      const bullet = new Bullet({
        position: {
          x: player.position.x + player.width / 2,
          y: player.position.y + player.height / 2,
        },
        velocity: this.velocity,
        theta,
        collisionBlocks: this.blocks,
        zombies,
        damage: this.damage,
        player: this.player,
      });
      this.addBullet(bullet);
      this.mag--;
      this.roundsFired++;
      //  updating meters and texts
      Bmeter.value = this.mag / 100;
      ammo.textContent = `${this.mag}/${this.ammo}`;
    } if(this.mag<=0) {
      color = "red";
      ammo.style.color = color;
    }
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
    // console.log("Rounds fired: " + this.roundsFired);
    if (this.isReloading || this.isFiring) return; // Check if already reloading
    this.isReloading = true; // Set reloading flag
    ammo.textContent = `Reloading....`;
    if (this.ammo > 0) {
      color = "white";
      ammo.style.color = color;
    } else {
      color = "red";
      ammo.style.color = color;
    }

    setTimeout(() => {
      if (this.ammo >= this.roundsFired) {
        if (this.ammo + this.mag <= this.magLimit) {
          this.mag += this.ammo;
          this.ammo = 0;
        } else {
          this.mag += this.roundsFired;
          this.ammo -= this.roundsFired;
        }
      } else {
        this.mag += this.ammo;
        this.ammo = 0;
      }
      this.roundsFired = 0;
      Bmeter.value = this.mag / 100;
      ammo.textContent = `${this.mag}/${this.ammo}`;
      this.isReloading = false; // Reset reloading flag
    }, this.reloadTime * 1000);
  }
}

const guns = [];
