class Platform {
  constructor({ position, width }) {
    this.position = position;
    this.width = width;
    this.height = 20;
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

blocks[2] = new Environment({
  position: { x: l, y: 416 },
  size: { width: 70, height: 70 },
});
blocks[3] = new Environment({
  position: { x: h, y: 416 },
  size: { width: 70, height: 70 },
});
blocks[4] = new Environment({
  position: { x: h + 77, y: 416 },
  size: { width: 70, height: 70 },
});
blocks[1] = new Environment({
  position: { x: l - 20, y: 486 },
  size: { width: 70, height: 70 },
});
blocks[0] = new Environment({
  position: { x: l - 97, y: 486 },
  size: { width: 70, height: 70 },
});
blocks[5] = new Environment({
  position: { x: h + 20, y: 486 },
  size: { width: 70, height: 70 },
});
blocks[6] = new Environment({
  position: { x: h + 97, y: 486 },
  size: { width: 70, height: 70 },
});
blocks[7] = new Environment({
  position: { x: -20, y: 0 },
  size: { width: 20, height: canvas.height },
});
blocks[8] = new Environment({
  position: { x: canvas.width, y: 0 },
  size: { width: 20, height: canvas.height },
});
blocks[9] = new Environment({
  position: { x: 0, y: -20 },
  size: { width: canvas.width, height: 20 },
});
blocks[10] = new Environment({
  position: { x: 0, y: 556 },
  size: { width: canvas.width, height: 20 },
  health: 1000000,
});
