class Player {
  constructor({ collisionBlocks, zombies = [], boundaries, mines,platforms }) {
    this.position = {
      x: canvas.width / 2,
      y: 200,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 40;
    this.height = 90;
    this.collisionBlocks = collisionBlocks;
    this.boundaries = boundaries;
    this.mines = mines;
    this.platforms = platforms;
    this.jumpStrength = 13;
    this.gravity = 0.5;
    this.zombies = zombies;
    this.health = 100;
    this.grounded = false;
    this.lastInjured = 0;
    this.score = 0;

    this.jetpackActive = false;
    this.maxFuel = 100;
    this.fuelUsage = 0.05;
    this.refuelRate = 0.002;
    this.jetpackGravity = 0.01;
  }

  draw() {
    c.fillStyle = "pink";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    //  Jetpack logic
    //  jumpSt = 13
    if (this instanceof Player && !(this instanceof Zombie)) {
      if (this.jetpackActive && fuel > 0) {
        fuel -= this.fuelUsage;
        this.gravity = this.jetpackGravity;
        this.jumpStrength = 3;
      } else {
        this.gravity = 0.5;
        this.jumpStrength = 13;
        this.jetpackActive = false;
        jetpackSoundOff();
      }

      //  refuel logic
      if (!this.jetpackActive && fuel < this.maxFuel) fuel += this.refuelRate;
      Fmeter.value = fuel / 100;
    }

    this.draw();

    this.position.x += this.velocity.x;
    //  order matters
    this.checkForHorizontalCollision();
    this.applyGravity();
    this.checkForVerticalCollision();
  }

  toggleJetpack() {
    if (fuel > 0) {
      if (this.jetpackActive) {
        this.jetpackActive = false;
        jetpackSoundOff();
      } else {
        if (fuel > 20) {
          this.jetpackActive = true;
          jetpackSoundOn();
        }
      }
    }
  }

  checkForHorizontalCollision() {
    //  horizontal collision with blocks;
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (collision({ obj1: this, obj2: collisionBlock })) {
        //  Call the attack method of zombie to damage the block
        if (this instanceof Zombie) {
          if (this.attack(collisionBlock, 5000 - 100 * this.zombies.length)) {
            this.collisionBlocks.splice(i, 1);
          }
        }
        //  Call the jump method of jumping zombie
        if (this instanceof JumpingZombie) {
          this.jump();
        }

        if (this.velocity.x > 0) {
          this.velocity.x = 0;
          this.position.x = collisionBlock.position.x - 0.1 - this.width;
          break;
        }
        if (this.velocity.x < 0) {
          this.velocity.x = 0;
          this.position.x =
            collisionBlock.position.x + collisionBlock.width + 0.1;
          break;
        }
      }
    }
    //  horizontal collision with boundaries;
    for (let i = 0; i < this.boundaries.length; i++) {
      const boundary = this.boundaries[i];

      if (collision({ obj1: this, obj2: boundary })) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;
          this.position.x = boundary.position.x - 0.1 - this.width;
          break;
        }
        if (this.velocity.x < 0) {
          this.velocity.x = 0;
          this.position.x = boundary.position.x + boundary.width + 0.1;
          break;
        }
      }
    }
    //  horizontal collision with mines;
    for (let i = 0; i < this.mines.length; i++) {
      const mine = this.mines[i];

      if (
        this.position.x + this.width / 2 <=
          mine.position.x + 2.5 + mine.width / 2 &&
        this.position.x + this.width / 2 >=
          mine.position.x - 2.5 + mine.width / 2 &&
        this instanceof Zombie
      ) {
        mine.explode();
      }
    }
    //  horizontal collision with damageBox;
    for (let i = 0; i < this.mines.length; i++) {
      const damageBox = this.mines[i].damageBox;

      if (
        collision({ obj1: this, obj2: damageBox }) &&
        this instanceof Zombie
      ) {
        if (this.mines[i].isBlasting) {
          this.health -= 1.2;
          if (this.health <= 0) {
            const ind = this.zombies.indexOf(this);
            const ind2 = sorroundings.indexOf(zombies.splice(ind, 1));
            sorroundings.splice(ind2, 1);
            zombieCount--;
            return;
          }
        }
      }
    }
    //  horizontal collision with zombies;
    for (let i = 0; i < this.zombies.length; i++) {
      const zombie = this.zombies[i];
      if (this === zombie) continue;

      if (collision({ obj1: this, obj2: zombie })) {
        //  Call the jump method of jumping zombie
        if (this instanceof JumpingZombie) {
          this.jump();
        }
        if (this.velocity.x > 0) {
          this.velocity.x = 0;
          this.position.x = zombie.position.x - 0.1 - this.width;
          break;
        }
        if (this.velocity.x < 0) {
          this.velocity.x = 0;
          this.position.x = zombie.position.x + zombie.width + 0.1;
          break;
        }
      }
    }
  }

  applyGravity() {
    this.position.y += this.velocity.y;
    this.velocity.y += this.gravity;
  }

  checkForVerticalCollision() {
    //  vertical collision with block
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (collision({ obj1: this, obj2: collisionBlock })) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          this.position.y = collisionBlock.position.y - this.height - 0.1;
          this.grounded = true;
          break;
        }
        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height + 0.1;
          break;
        }
      }
    }
    //  vertical collision with boundaries
    // for (let i = 0; i < this.boundaries.length; i++) {
    //   const boundary = this.boundaries[i];

    //   if (collision({ obj1: this, obj2: boundary })) {
    //     if (this.velocity.y > 0) {
    //       this.velocity.y = 0;
    //       this.position.y = boundary.position.y - this.height - 0.1;
    //       this.grounded = true;
    //       break;
    //     }
    //     if (this.velocity.y < 0) {
    //       this.velocity.y = 0;
    //       this.position.y = boundary.position.y + boundary.height + 0.1;
    //       break;
    //     }
    //   }
    // }
    for (let i = 0; i < this.platforms.length; i++) {
      const platform = this.platforms[i];

      if (collision({ obj1: this, obj2: platform })) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          this.position.y = platform.position.y - this.height - 0.1;
          this.grounded = true;
          break;
        }
        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          this.position.y = platform.position.y + platform.height + 0.1;
          break;
        }
      }
    }
    //  vertical collision with zombies
    for (let i = 0; i < this.zombies.length; i++) {
      const zombie = this.zombies[i];
      if (this === zombie) continue;

      if (collision({ obj1: this, obj2: zombie })) {
        //  player falls on top of zombies (so he'll recive periodic damage)
        if (this.velocity.y > 0.5) {
          this.velocity.y = 0;
          this.position.y = zombie.position.y - this.height - 0.1;
          this.grounded = true;

          const currentTime = Date.now();
          if (
            currentTime - this.lastInjured >= 2000 &&
            !(this instanceof Zombie)
          ) {
            // console.log("health rem: " + this.health);
            this.health -= 10;
            if (randomIntFromRange(1, 10) % 2 === 0) playSound("Hurt", 0.5);
            else playSound("Hurt2", 0.5);
            if (this instanceof Player) {
              Hmeter.value = this.health / 100;
              if (this.health <= 0)
                GameOver("YOU LOSE!!! You were ran over by zombies");
            }
            this.lastInjured = currentTime;
          }
          break;
        }
        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          this.position.y = zombie.position.y + zombie.height + 0.1;
          break;
        }
      }
    }
  }
}

class Zombie extends Player {
  constructor({
    position,
    speed,
    velocity,
    health = 70,
    height = 80,
    width = 40,
    gravity = 0.5,
    collisionBlocks,
    attackFreq = 2000,
    damage,
    color,
  }) {
    super({ collisionBlocks, zombies, boundaries, mines,platforms });

    this.position = position;
    this.velocity = velocity;
    this.health = health;
    this.width = width;
    this.height = height;
    this.gravity = gravity;
    this.lastAttackTime = 0;
    this.damage = damage;
    this.attackFreq = attackFreq;
    this.speed = speed;
    this.color = color;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  attack(player, attackRate) {
    const currentTime = Date.now();
    if (currentTime - this.lastAttackTime >= attackRate) {
      if (player instanceof Player) {
        if (randomIntFromRange(1, 10) % 2 === 0) playSound("Hurt", 0.5);
        else playSound("Hurt2", 0.5);
      }
      playZAttack(0.5);
      player.health -= this.damage + 0.25 * zombies.length;
      if (player instanceof Player) Hmeter.value = player.health / 100;
      if (player.health <= 0) {
        if (player instanceof Environment) {
          cannonLeft.ammo -= 6;
          cannonRight.ammo -= 6;
        }
        return true;
      }
      this.lastAttackTime = currentTime;
    }
    return false;
  }

  detectPlayerCollision(player) {
    if (collision({ obj1: this, obj2: player })) {
      if (this.attack(player, this.attackFreq)) {
        GameOver("YOU LOSE!!! You were ran over by zombies");
      }
      if (this.velocity.y > 0.5) {
        // Zombie falls on top of the player
        this.velocity.y = 0;
        this.position.y = player.position.y - this.height - 0.1;
      } else if (this.velocity.x > 0) {
        this.velocity.x = 0;
        this.position.x = player.position.x - 0.1 - this.width;
      } else if (this.velocity.x < 0) {
        this.velocity.x = 0;
        this.position.x = player.position.x + player.width + 0.1;
      }
    } else {
      const factor = player.position.x - this.position.x;
      if (factor > 0) {
        this.velocity.x = this.speed;
      } else if (factor < 0) {
        this.velocity.x = -this.speed;
      }
    }
  }
}

class JumpingZombie extends Zombie {
  constructor({
    position,
    velocity,
    health = 70,
    height = 80,
    width = 40,
    gravity = 0.5,
    collisionBlocks,
    attackFreq = 2000,
    jumpStrength = 15,
    damage,
    speed,
  }) {
    super({
      position,
      velocity,
      health,
      height,
      width,
      gravity,
      collisionBlocks,
      attackFreq,
      color,
      speed,
      damage,
    });
    this.jumpStrength = jumpStrength;
  }

  draw() {
    c.fillStyle = "green";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  jump() {
    if (this.grounded) {
      this.velocity.y = -this.jumpStrength;
      this.grounded = false;
    }
  }
}
