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
class Environment {
  constructor({ position, size, health = 100 }) {
    this.position = position;
    this.width = size.width;
    this.height = size.height;
    this.health = health;
  }

  draw() {
    c.fillStyle = "lightBlue";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

//  declaring all the blocks
const blocks = [];

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
blocks[8] = new Environment({
  position: { x: -20, y: 0 },
  size: { width: 20, height: canvas.height },
  health: 1000000,
});
//  right boundary
blocks[9] = new Environment({
  position: { x: canvas.width, y: 0 },
  size: { width: 20, height: canvas.height },
  health: 1000000,
});
//  Top cover
blocks[10] = new Environment({
  position: { x: 0, y: -20 },
  size: { width: canvas.width, height: 20 },
  health: 1000000,
});
//  base
blocks[11] = new Environment({
  position: { x: -20, y: 556 },
  size: { width: canvas.width + 20, height: 20 },
  health: 1000000,
});

blocks.forEach((b) => {
  b.isDeployed = true;
});

for (let i = 0; i < 8; i++) blocks[i].isDeployed = false;
// blocks[0].isDeployed = false;

defenseBlockBtn.onclick = () => {
  defenseBlockSetup = true;
  inventoryScr.close();
  inventoryScr.style.display = "none";
};

function setBlocks() {}
