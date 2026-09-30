let player;
let enemies = []; // agora temos um array de inimigos
let tileSize = 40;
let cols, rows;

let playerSprite;
let enemySprite;

function preload() {
  playerSprite = loadImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUlOOU5WloZyDc_cF1rQYaAmcvkJ50uZreKQ&s"); 
  enemySprite = loadImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSK5voOtqKDEt7E4F7XzQBYjlhK0KPJUxZSqQ&s");
}

function setup() {
  createCanvas(400,400);
  cols = width / tileSize;
  rows = height / tileSize;

  player = new Character(1, 1, playerSprite);

  // adiciona vários inimigos ao array
  enemies.push(new Character(8, 5, enemySprite));
  enemies.push(new Character(5, 7, enemySprite));
  enemies.push(new Character(6, 5, enemySprite));
}

function draw() {
  background(220);
  drawGrid();

  player.show();

  // desenha e move todos os inimigos
  for (let enemy of enemies) {
    enemy.show();
    enemy.moveRandom();
  }

  checkCombat();
}

function drawGrid() {
  stroke(180);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      noFill();
      rect(i * tileSize, j * tileSize, tileSize, tileSize);
    }
  }
}

class Character {
  constructor(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.hp = 10;
    this.alive = true;
  }

  show() {
    if (!this.alive) return;
    image(this.sprite, this.x * tileSize, this.y * tileSize, tileSize, tileSize);
    fill(0);
    textAlign(CENTER);
    text("HP:" + this.hp, this.x * tileSize + tileSize / 2, this.y * tileSize - 5);
  }

  move(dx, dy) {
    let newX = this.x + dx;
    let newY = this.y + dy;
    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
      this.x = newX;
      this.y = newY;
    }
  }

  moveRandom() {
    if (!this.alive) return;
    if (frameCount % 30 === 0) {
      let dx = floor(random(-1, 2));
      let dy = floor(random(-1, 2));
      this.move(dx, dy);
    }
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.alive = false;
    }
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) player.move(-1, 0);
  if (keyCode === RIGHT_ARROW) player.move(1, 0);
  if (keyCode === UP_ARROW) player.move(0, -1);
  if (keyCode === DOWN_ARROW) player.move(0, 1);

  if (key === " ") {
    attack();
  }
}

function attack() {
  // atacar qualquer inimigo próximo
  for (let enemy of enemies) {
    if (enemy.alive && dist(player.x, player.y, enemy.x, enemy.y) <= 1.2) {
      enemy.takeDamage(3);
    }
  }
}

function checkCombat() {
  for (let enemy of enemies) {
    if (enemy.alive && dist(player.x, player.y, enemy.x, enemy.y) <= 1.2) {
      if (frameCount % 30 === 0) {
        player.takeDamage(2);
      }
    }
  }

  if (!player.alive) {
    fill(0);
    textAlign(CENTER);
    textSize(20);
    text("Você foi derrotado!", width / 2, height / 2);
    noLoop();
  }

  // mensagem se todos os inimigos morrerem
  if (enemies.every(e => !e.alive)) {
    fill(0);
    textAlign(CENTER);
    textSize(20);
    text("Todos os inimigos derrotados!", width / 2, height / 2);
  }
}
