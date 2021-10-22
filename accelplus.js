const gameConfig = {
  isLoading: true,
  trafficDensity: 50,
  trafficVelocity: 0.7
};

const utils = {
  randomNumber: (min, max) => {

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  },
  isColliding: (obj1, obj2) => {

    if (obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y) {
       return true;
   }
  }
};

const assets = {
  road: new Image(),
  traffic: new Image()
};

console.info('Loading...');
assets.road.src = './assets/road.png';
assets.traffic.src = './assets/traffic.png';

const loadingCheck = () => {

  if (assets.road.complete && assets.traffic.complete) {

    console.info('Loading Complete!');
    gameConfig.isLoading = false;
  }
};

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

const sizeConfig = {
  car: {
    w: 0,
    h: 0
  },
  road: {
    w: 0,
    h: 0
  }
};

const road = {
  roadMovement: 0,
  roadVelocity: 1.8,
  draw: () => {

    road.roadMovement += road.roadVelocity;
    c.drawImage(assets.road, 0, 0, 840, 650,
      0, road.roadMovement - sizeConfig.road.h, sizeConfig.road.w, sizeConfig.road.h);
    c.drawImage(assets.road, 0, 0, 840, 650,
      0, road.roadMovement, sizeConfig.road.w, sizeConfig.road.h);
    c.drawImage(assets.road, 0, 0, 840, 650,
      0, road.roadMovement + sizeConfig.road.h, sizeConfig.road.w, sizeConfig.road.h);
    (road.roadMovement + sizeConfig.road.h > canvas.height) && (road.roadMovement = 0);
  }
};

const imagePositions = {
  cars: [{
      x: 125,
      y: 440
    },
    {
      x: 5,
      y: 0
    },
    {
      x: 125,
      y: 0
    },
    {
      x: 245,
      y: 0
    },
    {
      x: 357,
      y: 0
    },
    {
      x: 5,
      y: 220
    },
    {
      x: 125,
      y: 220
    },
    {
      x: 245,
      y: 220
    },
    {
      x: 357,
      y: 220
    },
    {
      x: 5,
      y: 440
    },
    {
      x: 245,
      y: 440
    },
    {
      x: 357,
      y: 440
    }
  ]
};

const vehicle = {
  x: 50,
  y: 200,
  width: 0,
  height: 0,
  type: 'car',
  image: imagePositions.cars[0],
  isPlayer: false
};

const player = {
  dx: 0,
  dy: 0
}

let traffic = [];
const initialize = () => {

  window.innerWidth > 400 ? canvas.width = 400 : canvas.width = window.innerWidth - 5;
  window.innerHeight > 800 ? canvas.height = 800 : canvas.height = window.innerHeight - 5;

  sizeConfig.car.w = canvas.width * 0.08;
  sizeConfig.car.h = (canvas.height * 0.08);
  sizeConfig.road.w = canvas.width;
  sizeConfig.road.h = canvas.height * 0.5;

  traffic = [];
  while (traffic.length < gameConfig.trafficDensity) {

    vehicle.x = utils.randomNumber(sizeConfig.road.w * 0.17, sizeConfig.road.w * 0.68 + sizeConfig.car.w);
    vehicle.y = utils.randomNumber(-(gameConfig.trafficDensity * 100), 100);
    vehicle.image = imagePositions.cars[utils.randomNumber(0, imagePositions.cars.length)];
    vehicle.width = sizeConfig.car.w;
    vehicle.height = sizeConfig.car.h;

    let colliding = false;
    traffic.forEach((trafficVehicle) => {
      
      if (utils.isColliding(trafficVehicle, vehicle)) {
        colliding = true;
        return;
      }
    });

    if (!colliding) {

      traffic.push({
        ...vehicle
      });
    }
  }

  vehicle.image = imagePositions.cars[0],
  vehicle.x = canvas.width / 2 - sizeConfig.car.w;
  vehicle.y = canvas.height - sizeConfig.car.h * 2;
  vehicle.width = sizeConfig.car.w;
  vehicle.height = sizeConfig.car.h;
  vehicle.isPlayer = true;
  vehicle.type = 'car';
  traffic.push(vehicle);
}

initialize();

const drawTraffic = () => {

  traffic.forEach((vehicle) => {

    (vehicle.isPlayer) && (vehicle.y += player.dy) && (vehicle.x += player.dx);

    (!vehicle.isPlayer) && (vehicle.y += gameConfig.trafficVelocity);
    c.drawImage(assets.traffic, vehicle.image.x, vehicle.image.y, 105, 227,
      vehicle.x, vehicle.y, sizeConfig[vehicle.type].w, sizeConfig[vehicle.type].h);
  });
};

function Car(x, y) {

  this.x = x || (Math.random() * (innerWidth));
  this.y = y || (Math.random() * (innerHeight));
  this.dx = dx || (Math.random() * 4);
  this.dy = dy || (Math.random() * 4);
  this.colour = colour || `#${Math.floor(Math.random()*16777215).toString(16)}`;
  this.gravity = Math.random();
  this.friction = 0.9;

  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.strokeStyle = this.colour;
    c.stroke();
    c.fillStyle = this.colour;
    c.fill();
    c.closePath();
  };

  this.update = function () {

    this.draw();

    if (this.y + this.radius + this.dy > canvas.height) {
      this.dy = -this.dy * this.friction;
    } else {
      this.dy += this.gravity;
    }

    if (this.x + this.radius + this.dx > canvas.width ||
      this.x - this.radius < 0) {
      this.dx = -this.dx;
    }

    if (canvas.height - (this.radius * 2) > this.y - this.radius) {
      this.x += this.dx;
    }

    this.y += this.dy;
  }
};

const animate = () => {

  requestAnimationFrame(animate);
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);

  c.font = "30px Arial";
  c.fillText("Loading...", 50, 50);

  if (!gameConfig.isLoading) {
    road.draw();
    drawTraffic(vehicle);
  } else {
    loadingCheck();
  }
};

animate();

// Events Listeners
window.addEventListener('resize', () => {
  initialize();
});

window.addEventListener("keydown", event => {

  (event.code === 'ArrowUp') && (player.dy -= 2);
  (event.code === 'ArrowDown') && (player.dy += 2);
  (event.code === 'ArrowLeft') && (player.dx -= 2);
  (event.code === 'ArrowRight') && (player.dx += 2);
});

window.addEventListener("keyup", event => {

  player.dy = 0;
  player.dx = 0;
});




// ---------------------
// const image = document.getElementById('source');

// image.addEventListener('load', e => {
//   ctx.drawImage(image, 33, 71, 104, 124, 21, 20, 87, 104);
// });














const numberOfCircles = 99;

const mouse = {
  x: null,
  y: null
}

window.addEventListener('mousemove', (event) => {

  mouse.x = event.x;
  mouse.y = event.y;
});





//const mouseCircle = new Circle(1, 1, 50, 0, 0, 'black');
// mouseCircle.update = () => {

//   mouseCircle.x = mouse.x;
//   mouseCircle.y = mouse.y;
//   mouseCircle.draw();
// }

let circles = [];

const init = () => {
  circles = [];
  for (let i = 0; i < numberOfCircles; i++) {
    circles.push(new Circle());
  }
};





addEventListener('click', () => {
  road.roadVelocity += 0.1;
});