
// Game elements
let canvas = document.querySelector('#gameCanvas');
let ctx = canvas.getContext('2d');
let startButton = document.querySelector('#startGame');
let scoreElement = document.querySelector('#score');
let livesElement = document.querySelector('#lives');
let gameMenu = document.querySelector('#gameMenu');
let gameArea = document.querySelector('#gameArea');

// Game variables
let gameInterval = null;
let asteroids = [];
let bullets = [];
let player = { x: canvas.width / 2, y: canvas.height / 2, radius: 20 };
let score = 0;
let lives = 3;
let playerSpeed = 5;
let bulletSpeed = 7;
let asteroidSpeed = 2;
let shooting = false;

// Sounds
let fireSound = new Audio('fire.mp3');
let hitSound = new Audio('hit.mp3');

// Start game function
startButton.addEventListener('click', function() {
  // Hide menu and show game area
  gameMenu.style.display = 'none';
  gameArea.style.display = 'block';

  // Reset game variables
  score = 0;
  lives = 3;
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
  asteroids = [];
  bullets = [];

  // Start game loop
  gameInterval = setInterval(gameLoop, 1000 / 60);

  // Setup event listeners
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
});

// Game loop
function gameLoop() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move player
  if (player.up && player.y - player.radius > 0) player.y -= playerSpeed;
  if (player.down && player.y + player.radius < canvas.height) player.y += playerSpeed;
  if (player.left && player.x - player.radius > 0) player.x -= playerSpeed;
  if (player.right && player.x + player.radius < canvas.width) player.x += playerSpeed;

  // Spawn new asteroid
  if (Math.random() < 0.02) {
    let x = Math.random() * canvas.width;
    let y = Math.random() < 0.5 ? -20 : canvas.height + 20;
    let radius = Math.random() * 15 + 10;
    asteroids.push({ x: x, y: y, radius: radius });
  }

  // Update and draw asteroids
  for (let i = 0; i < asteroids.length; i++) {
    let a = asteroids[i];
    a.y += asteroidSpeed;

    ctx.beginPath();
    ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();

    // Collision with player
    if (distanceBetween(a, player) < a.radius + player.radius) {
      lives--;
      hitSound.play();
      asteroids.splice(i, 1);
      i--;
      if (lives === 0) endGame();
    }
  }

  // Update and draw bullets
  for (let i = 0; i < bullets.length; i++) {
    let b = bullets[i];
    b.y -= bulletSpeed;

    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#f00';
    ctx.fill();

    // Collision with asteroids
    for (let j = 0; j < asteroids.length; j++) {
      let a = asteroids[j];
      if (distanceBetween(a, b) < a.radius + b.radius) {
        score++;
        bullets.splice(i, 1);
        i--;
        asteroids.splice(j, 1);
        break;
      }
    }
  }

  // Fire bullets
  if (shooting && Math.random() < 0.1) {
    bullets.push({ x: player.x, y: player.y, radius: 5 });
    fireSound.play();
  }

  // Draw player
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#00f';
  ctx.fill();

  // Update score and lives display
  scoreElement.textContent = 'Score: ' + score;
  livesElement.textContent = 'Lives: ' + lives;
}

// End game
function endGame() {
    clearInterval(gameInterval);
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    
    // Show game over popup
    let gameOverPopup = document.createElement('div');
    gameOverPopup.style.position = 'absolute';
    gameOverPopup.style.top = '50%';
    gameOverPopup.style.left = '50%';
    gameOverPopup.style.transform = 'translate(-50%, -50%)';
    gameOverPopup.style.padding = '20px';
    gameOverPopup.style.backgroundColor = 'white';
    gameOverPopup.style.textAlign = 'center';
    gameOverPopup.innerHTML = `
      <h1>Game Over</h1>
      <p>Your score: ${score}</p>
      <button id="restartGame">Restart Game</button>
    `;
    document.body.appendChild(gameOverPopup);
  
// Restart game button
    document.querySelector('#restartGame').addEventListener('click', function() {
    gameOverPopup.remove();
    gameMenu.style.display = 'flex';
    gameArea.style.display = 'none';
  });
  }

// Handle keydown
function handleKeyDown(e) {
  if (e.code === 'ArrowUp') player.up = true;
  if (e.code === 'ArrowDown') player.down = true;
  if (e.code === 'ArrowLeft') player.left = true;
  if (e.code === 'ArrowRight') player.right = true;
  if (e.code === 'Space') shooting = true;
}

// Handle keyup
function handleKeyUp(e) {
  if (e.code === 'ArrowUp') player.up = false;
  if (e.code === 'ArrowDown') player.down = false;
  if (e.code === 'ArrowLeft') player.left = false;
  if (e.code === 'ArrowRight') player.right = false;
  if (e.code === 'Space') shooting = false;
}

// Distance between two points
function distanceBetween(a, b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}
