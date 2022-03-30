"use strict";

const canvas = document.querySelector("canvas");
let c = canvas.getContext("2d");

canvas.width = 1366;
canvas.height = 768;

const groundY = 500;
const gravity = 0.5;

let speed = 2;
let backgroundSpeed = speed / 5;

const obstacleArr = [];
const groundArr = [];
const backgroundArr = [];
const playerImage = [];
const sawImages = [];
const firecampImages = [];
const obstaclesImages = [];
let currentImage = 0;
let isAdding = true;

let isPlaying = false;

const startMenu = document.querySelector("#startMenu");
const restart = document.querySelector("#restartMenu");
const playerScore = document.querySelector("#score");
const currentScore = document.querySelector("#currentScore");
const totalScore = document.querySelector("#highScore");

//Audios
const jumpAudio = new Audio("./audio/jump.mp3");
const fireDeathAudio = new Audio("./audio/death-fire.mp3");
const grindDeathAudio = new Audio("./audio/death-grind.mp3");
const themeSong = new Audio("./audio/theme.mp3");
themeSong.loop = true;

let distance = 0;

let distanceTravel = 0;
let totalDistance = 0;
let highScore = 0;

function addImages() {
  for (let i = 1; i <= 7; i++) {
    playerImage.push(requestimage(`./img/pig/${i}.png`));
  }
  sawImages.push(requestimage("./img/saw/1.png"));
  sawImages.push(requestimage("./img/saw/2.png"));
  firecampImages.push(requestimage("./img/firecamp/1.png"));
  firecampImages.push(requestimage("./img/firecamp/2.png"));

  obstaclesImages.push(sawImages);
  obstaclesImages.push(firecampImages);
}
addImages();

class Player {
  constructor() {
    this.height = 100;
    this.width = 150;
    this.position = {
      x: 300,
      y: groundY - this.height,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.isJumping = false;
    this.image = playerImage[0];
    this.isDead = false;
  }

  draw() {
    c.fillStyle = "rgba(0, 0, 0, 0)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
    c.drawImage(this.image, this.position.x, this.position.y);
  }

  update() {
    if (this.isDead) return;

    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y < groundY) {
      this.velocity.y += gravity;
    } else {
      this.velocity.y = 0;
      this.isJumping = false;
    }

    obstacleArr.forEach((obs) => {
      if (
        this.position.x + this.width > obs.position.x &&
        this.position.x < obs.position.x + obs.width &&
        this.position.y + this.height >= obs.position.y
      ) {
        switch (obs.name) {
          case "Fire":
            fireDeathAudio.play();
            break;
          case "Saw":
            grindDeathAudio.play();
            break;
        }
        themeSong.pause();
        themeSong.currentTime = 0;
        this.isDead = true;
        isPlaying = false;
        restart.classList.toggle("hidden");
        obstacleArr.length = 0;
        playerScore.textContent = `Distance travelled: ${totalDistance} meters`;
        speed = 2;
        if (totalDistance > highScore) {
          highScore = totalDistance;
          totalScore.textContent = `High Score: ${highScore} meters`;
        }
        return;
      }
    });
    this.draw();
  }
}

class Ground {
  constructor({ x }) {
    this.position = {
      x,
      y: groundY - 80,
    };
    this.image = requestimage("./img/Ground.png");
    this.width = this.image.width;
    this.height = this.image.height;
  }

  draw() {
    c.fillStyle = "rgba(0,0,0,0";
    c.fillRect(this.position.x, this.position.y + 80, this.width, this.height);
    c.drawImage(this.image, this.position.x, this.position.y);
  }

  update() {
    this.position.x -= speed;
    this.draw();
  }
}

class Obstacle {
  constructor({ imagesArray, obsName }) {
    this.position = {
      x: canvas.width,
      y: groundY - 70,
    };
    this.imagesArray = imagesArray;
    this.frame = 0;
    this.image = imagesArray[this.frame];
    this.width = this.image.width;
    this.height = this.image.height;
    this.name = obsName;
  }
  nextFrame() {
    this.frame === 0 ? (this.frame = 1) : (this.frame = 0);
    this.image = this.imagesArray[this.frame];
  }
  draw() {
    c.fillStyle = "rgba(0,0,0,0";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
    c.drawImage(this.image, this.position.x, this.position.y);
  }
  update() {
    this.position.x -= speed;
    this.draw();
  }
}

class Background {
  constructor({ x }) {
    this.position = {
      x,
      y: 0,
    };
    this.image = requestimage("./img/Background.png");
    this.width = this.image.width;
    this.height = this.image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }

  update() {
    this.position.x -= backgroundSpeed;
    this.draw();
  }
}

groundArr.push(new Ground({ x: 0 }));
backgroundArr.push(new Background({ x: 0 }));

const player = new Player();

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    if (!isPlaying) {
      themeSong.play();
      startMenu.classList.add("hidden");
      restart.classList.add("hidden");
      isPlaying = true;
      speed = 6;
      player.isDead = false;
      totalDistance = 0;
      return;
    }
    if (!player.isJumping) {
      player.isJumping = true;
      player.velocity.y -= 15;
      jumpAudio.play();
    }
  }
});

window.addEventListener("mousedown", () => {
  if (!isPlaying) {
    themeSong.play();
    startMenu.classList.add("hidden");
    restart.classList.add("hidden");
    isPlaying = true;
    speed = 6;
    player.isDead = false;
    totalDistance = 0;
    return;
  }
  if (!player.isJumping) {
    player.isJumping = true;
    player.velocity.y -= 15;
    jumpAudio.play();
  }
});

function requestimage(imageSource) {
  const image = new Image();
  image.src = imageSource;
  return image;
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

function updateBackground() {
  backgroundArr.forEach((background, index) => {
    if (background.position.x + background.width < -background.width * 2) {
      backgroundArr.splice(index, 1);
    }
    background.update();
  });

  const lastElem = backgroundArr[backgroundArr.length - 1];
  if (lastElem.position.x + lastElem.width <= canvas.width) {
    backgroundArr.push(
      new Background({
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
  if ((chance < 0.03 && distance > 200) || distance >= 1000) {
    distance = 0;
    const random = Math.trunc(Math.random() * obstaclesImages.length);

    obstacleArr.push(
      new Obstacle({
        imagesArray: obstaclesImages[random],
        obsName: `${random === 0 ? "Saw" : "Fire"}`,
      })
    );
  }
}

function increaseSpeed() {
  if (!isPlaying) return;
  distanceTravel++;
  if (distanceTravel >= 500) {
    speed += 0.3;
    distanceTravel = 0;
  }
}

function animatePlayer() {
  if (player.isJumping) return;
  player.image = playerImage[currentImage];
  if (isAdding) {
    currentImage++;
  } else {
    currentImage--;
  }
  if (currentImage >= 6) {
    isAdding = false;
  } else if (currentImage <= 0) {
    isAdding = true;
  }
}

function animateSaw() {
  obstacleArr.forEach((obs) => {
    obs.nextFrame();
  });
}

setInterval(animatePlayer, 50);
setInterval(animateSaw, 150);
setInterval(function () {
  if (!isPlaying) return;
  totalDistance += Math.round(speed / 6);
  currentScore.textContent = `${totalDistance} meters`;
}, 1000);

function animate() {
  requestAnimationFrame(animate);
  increaseSpeed();
  updateBackground();
  updateGround();
  updateObs();
  spawnObs();
  player.update();
}

animate();
