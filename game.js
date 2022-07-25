const canvas = /** @type {HTMLCanvasElement} */ (
  document.getElementById("canvas")
);
const ctx = canvas.getContext("2d");

let rightPressed = false;
let leftPressed = false;
let tiles = [{ x: 0, y: canvas.height }];
let tileH = 10;
let tileL = 100;
let ball = { x: 50, y: 15, r: 10 };
let score = 0;
let life = 3;
let heart = [
  { x: 530, y: 23 },
  { x: 560, y: 23 },
  { x: 590, y: 23 },
];
let healthpickuparr = [{ x: 0, y: 0 }];
// console.log(canvas.width)
main();

function addnewtile() {
  const lasttile = tiles[tiles.length - 1];
  tiles.push({ x: randomx(), y: lasttile.y + 100 });
}

function drawtile() {
  ctx.fillStyle = "brown";
  ctx.fillRect(0, 0, canvas.width, 8);
  tiles.forEach((tile) => {
    ctx.fillStyle = "red";
    ctx.fillRect(tile.x, tile.y, tileL, tileH);
    // if (tiles.indexOf(tile)%10==0 ){
    //   drawHeart(tile.x + tileL/2,tile.y-20,15,15,"black")
    //   console.log(tile.y-ball.r)
    //   console.log(ball.y)
    //   if(ball.x==tile.x +tileL/2 && ball.y == tile.y-ball.r){
    //     console.log(life)
    //     if(life<3){
    //       life++
    //       console.log(life)
    //     }

    //   }
    //   // healthpickuparr.push({x:tile.x + tileL/2,y:tile.y-20})
    //   // console.log("entered healthpickup")
    //   // healthpickuparr.forEach(health => {
    //   //   drawHeart(health.x,health.y,15,15,"black")

    //   // });
    // }
  });
}

function drawball() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
}

function moveBall1() {
  if (rightPressed && ball.x + ball.r <= canvas.width) {
    ball.x += 4;
  }
  if (leftPressed && ball.x - ball.r >= 0) {
    ball.x -= 4;
  }
}

function main() {
  interval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tiles.forEach((tile) => {
      tile.y -= 1;
    });
    heart.forEach((element) => {
      drawHeart(element.x, element.y, 25, 25, "purple");
    });

    drawball();
    addnewtile();
    drawtile();
    moveBall();
    moveBall1();
    // addnewpickup()/
    // healthpickup()
    closestTile = tiles.find(
      (tile) =>
        Math.sqrt(
          Math.pow(tile.y - ball.y, 2) + Math.pow(tile.x + 50 - ball.x, 2)
        ) <
        50 + ball.r
    );

    if (closestTile) {
      moveball2(closestTile);
    } else {
      ball.y += 4;
    }
    checkgameover();
  }, 15);
}

function randomx() {
  return Math.floor(Math.random() * 425 + 1);
}

function moveBall() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      rightPressed = true;
    }
    if (e.key === "ArrowLeft") {
      leftPressed = true;
    }
  });
  document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") {
      rightPressed = false;
    }
    if (e.key === "ArrowLeft") {
      leftPressed = false;
    }
  });
}

function moveball2(closestTile) {
  if (
    ball.x <= closestTile.x + tileL &&
    ball.x >= closestTile.x &&
    closestTile.y - ball.y < 20
  ) {
    ball.y = closestTile.y - ball.r;
  } else {
    ball.y += 3;
    score++;
  }
}

function checkgameover() {
  if (ball.y - ball.r < 8 || ball.y > canvas.height) {
    life--;
    heart.pop();
    clearInterval(interval);
    restart();
  }

  if (life == 0) {
    clearInterval(interval);
    savehighscore(score);
    heart.pop();
    alert("gameover score: " + score);
  }
}

function restart() {
  tiles = [{ x: 0, y: canvas.height }];
  tileH = 10;
  tileL = 100;
  ball = { x: 50, y: 15, r: 10 };
  main();
}

function savehighscore(score) {
  const highscores = JSON.parse(localStorage.getItem("highscores")) || [];
  const recentscore = {
    recentscore: score,
  };
  highscores.push(recentscore);
  highscores.sort((a, b) => b.score - a.score);
  highscores.splice(10);
  localStorage.setItem("highscore", JSON.stringify(highscores));
  console.log(highscores);
}

function drawHeart(fromx, fromy, lw, hlen, color) {
  var x = fromx;
  var y = fromy;
  var width = lw;
  var height = hlen;

  ctx.save();
  ctx.beginPath();
  var topCurveHeight = height * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  // top left curve
  ctx.bezierCurveTo(x, y, x - width / 2, y, x - width / 2, y + topCurveHeight);

  // bottom left curve
  ctx.bezierCurveTo(
    x - width / 2,
    y + (height + topCurveHeight) / 2,
    x,
    y + (height + topCurveHeight) / 2,
    x,
    y + height
  );

  // bottom right curve
  ctx.bezierCurveTo(
    x,
    y + (height + topCurveHeight) / 2,
    x + width / 2,
    y + (height + topCurveHeight) / 2,
    x + width / 2,
    y + topCurveHeight
  );

  // top right curve
  ctx.bezierCurveTo(x + width / 2, y, x, y, x, y + topCurveHeight);

  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

// function healthpickup(){
//   console.log("entered healthpickup")
// healthpickuparr.forEach(health => {
//   drawHeart(health.x,health.y,15,15,"black")

// });

//   }
