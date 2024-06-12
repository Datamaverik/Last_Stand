class Player {
  constructor({ collisionBlocks, zombies = [] }) {
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
    this.jumpStrength = 13;
    this.gravity = 0.5;
    this.zombies = zombies;
    this.health = 100;
    this.grounded = false;
    this.lastInjured = 0;
  }

  draw() {
    c.fillStyle = "pink";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();

    this.position.x += this.velocity.x;
    //  order matters
    this.checkForHorizontalCollision();
    this.applyGravity();
    this.checkForVerticalCollision();
  }

  checkForHorizontalCollision() {
    //  horizontal collision with blocks;
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      if (collision({ obj1: this, obj2: collisionBlock })) {
        //  Call the attack method of zombie to damage the block
        if (this instanceof Zombie) {
          if (this.attack(collisionBlock, 5000)) {
            console.log("done");
            this.collisionBlocks.splice(i, 1);
          }
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
    //  horizontal collision with zombies;
    for (let i = 0; i < this.zombies.length; i++) {
      const zombie = this.zombies[i];
      if (this === zombie) continue;

      if (collision({ obj1: this, obj2: zombie })) {
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
            console.log("health rem: " + this.health);
            this.health -= 10;
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
    velocity,
    health = 100,
    height = 80,
    width = 40,
    gravity = 0.5,
    collisionBlocks,
  }) {
    super({ collisionBlocks, zombies });

    this.position = position;
    this.velocity = velocity;
    this.health = health;
    this.width = width;
    this.height = height;
    this.gravity = gravity;
    this.lastAttackTime = 0;
  }

  draw() {
    c.fillStyle = "brown";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  attack(player, attackRate) {
    const currentTime = Date.now();
    if (currentTime - this.lastAttackTime >= attackRate) {
      player.health -= 10;
      if (player instanceof Player) Hmeter.value = player.health / 100;
      if (player.health <= 0) return true;
      this.lastAttackTime = currentTime;
    }
    return false;
  }

  detectPlayerCollision(player) {
    if (collision({ obj1: this, obj2: player })) {
      if (this.attack(player, 2000)) {
        GameOver("YOU LOSE!!! You were ran over by zombies");
        setTimeout(() => {
          window.location.reload();
        }, 3000);
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
        this.velocity.x = 0.3;
      } else if (factor < 0) {
        this.velocity.x = -0.3;
      }
    }
  }
}
