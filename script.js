const canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");

canvas.width = 1366;
canvas.height = 768;

const groundY = 500;
const gravity = 0.5;

let speed = 5;
let backgroundSpeed = speed / 5;

const obstacleArr = [];
const groundArr = [];

let isPlaying = false;

const startMenu = document.querySelector("#startMenu");
const startBtn = document.querySelector("#startBtn");

let distance = 0;

class Player {
  constructor() {
    this.height = 50;
    this.position = {
      x: 300,
      y: groundY - this.height,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 30;
    this.isJumping = false;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y < groundY) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
      this.isJumping = false;
    }

    this.draw();
  }
}

class Ground {
  constructor({ x }) {
    this.position = {
      x,
      y: groundY,
    };
    this.width = 100;
    this.height = 100;
    this.color = "green";
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.position.x -= speed;
    this.draw();
  }
}

class Obstacle {
  constructor({ x, y, width, height }) {
    this.position = {
      x,
      y,
    };
    this.width = width;
    this.height = height;
  }
  draw() {
    c.fillStyle = "pink";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.position.x -= speed;
    this.draw();
  }
}

groundArr.push(new Ground({ x: 0 }));

const player = new Player();

window.addEventListener("keydown", (event) => {
  if (!isPlaying) return;
  if (event.code === "Space") {
    if (!player.isJumping) {
      player.isJumping = true;
      player.velocity.y -= 10;
    }
  }
});

startBtn.addEventListener("mousedown", () => {
  startMenu.classList.add("hidden");
  isPlaying = true;
});

function requestimage(imageSource) {
  const image = new Image();
  image.src = imageSource;
  return image;
}

function updateBackground() {
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
}

function updateGround() {
  groundArr.forEach((ground, index) => {
    if (ground.position.x + ground.width < -ground.width * 2) {
      groundArr.splice(index, 1);
    }
    ground.update();
  });

  const lastElem = groundArr[groundArr.length - 1];
  if (lastElem.position.x + lastElem.width <= canvas.width) {
    groundArr.push(
      new Ground({
        x: lastElem.position.x + lastElem.width,
      })
    );
  }
}

function updateObs() {
  obstacleArr.forEach((obstacle, index) => {
    if (obstacle.position.x + obstacle.width < -obstacle.width * 2) {
      obstacleArr.splice(index, 1);
    }
    obstacle.update();
  });
}

function spawnObs() {
  if (!isPlaying) return;
  distance++;
  const chance = Math.random();
  console.log(distance);
  if ((chance < 0.03 && distance > 50) || distance >= 200) {
    distance = 0;
    obstacleArr.push(
      new Obstacle({
        x: canvas.width,
        y: groundY - 100,
        width: 100,
        height: 100,
      })
    );
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  updateBackground();
  updateGround();
  updateObs();
  spawnObs();
  player.update();
}

animate();
