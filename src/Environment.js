class Platform {
  constructor({ position, width, height = 20 }) {
    this.position = position;
    this.width = width;
    this.height = height;
  }

  draw() {
    c.fillStyle = "lightBlue";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
class Boundary {
  constructor({ position, size }) {
    this.position = position;
    this.width = size.width;
    this.height = size.height;
  }

  draw() {
    c.fillStyle = "lightBlue";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Environment {
  constructor({ position, size, health = 100 }) {
    this.position = position;
    this.width = size.width;
    this.height = size.height;
    this.gravity = 0.5;
    this.velocity = { x: 0, y: 0 };
    this.isGrounded = false;
    this.isDeployed = false;
    this.health = health;
  }
  draw() {
    c.fillStyle = "lightBlue";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw();
    if (!this.isGrounded) {
      this.position.y += this.velocity.y;
      this.velocity.y += this.gravity;
      this.checkForCollision();
    }
  }
  checkForCollision() {
    for (const block of blocks) {
      if (block !== this && collision({ obj1: this, obj2: block })) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          this.position.y = block.position.y - this.height - 0.1;
          this.isGrounded = true;
          break;
        }
      }
    }
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

//  declaring all the blocks
const blocks = [];
const boundaries = [];

const l = canvas.width / 2 - 175;
const h = canvas.width / 2 + 175;

blocks[0] = new Environment({
  position: { x: -20, y: 0 },
  size: { width: 70, height: 70 },
});
blocks[1] = new Environment({
  position: { x: -20, y: 0 },
  size: { width: 70, height: 70 },
});
blocks[2] = new Environment({
  position: { x: -20, y: 0 },
  size: { width: 70, height: 70 },
});
blocks[3] = new Environment({
  position: { x: -20, y: 0 },
  size: { width: 70, height: 70 },
});
blocks[4] = new Environment({
  position: { x: -20, y: 0 },
  size: { width: 70, height: 70 },
});
blocks[5] = new Environment({
  position: { x: -20, y: 0 },
  size: { width: 70, height: 70 },
});
blocks[6] = new Environment({
  position: { x: -20, y: 0 },
  size: { width: 70, height: 70 },
});
blocks[7] = new Environment({
  position: { x: -20, y: 0 },
  size: { width: 70, height: 70 },
});

//  left boundary
boundaries[2] = new Boundary({
  position: { x: -2000, y: 0 },
  size: { width: 20, height: canvas.height - 1 },
  health: 1000000,
});
//  right boundary
boundaries[3] = new Boundary({
  position: { x: canvas.width + 2000, y: 0 },
  size: { width: 20, height: canvas.height - 1 },
  health: 1000000,
});
//  Top cover
boundaries[0] = new Boundary({
  position: { x: -20, y: -20 },
  size: { width: canvas.width + 40, height: 20 },
  health: 1000000,
});
//  base
boundaries[1] = new Boundary({
  position: { x: -2000, y: 556 },
  size: { width: canvas.width + 4000, height: 20 },
  health: 1000000,
});

sorroundings.push(boundaries[2]);
sorroundings.push(boundaries[3]);

blocks.forEach((b) => {
  b.isDeployed = false;
});

defenseBlockBtn.onclick = () => {
  playSound("click");
  defenseBlockSetup = true;
  mineSetup = false;
  trapSetup = false;
  inventoryScr.close();
  inventoryScr.style.display = "none";
  inventoryOpen = false;
};
