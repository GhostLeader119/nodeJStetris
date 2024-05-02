const readline = require('readline');

// Initialize game variables
const width = 20;
const height = 10;
let snake = [{ x: 5, y: 5 }];
let direction = 'right';
let food = { x: 10, y: 5 };
let score = 0;
let gameOver = false;

// Function to draw game board
function drawBoard() {
  let board = '';
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
        board += '#';
      } else if (snake.some(segment => segment.x === x && segment.y === y)) {
        board += 'O';
      } else if (food.x === x && food.y === y) {
        board += '@';
      } else {
        board += ' ';
      }
    }
    board += '\n';
  }
  console.clear();
  console.log(board);
  console.log('Score:', score);
}

// Function to update game state
function update() {
  if (!gameOver) {
    // Move snake
    const head = { ...snake[0] };
    switch (direction) {
      case 'up':
        head.y--;
        break;
      case 'down':
        head.y++;
        break;
      case 'left':
        head.x--;
        break;
      case 'right':
        head.x++;
        break;
    }
    snake.unshift(head);

    // Check collision with walls or itself
    if (
      head.x === 0 ||
      head.x === width - 1 ||
      head.y === 0 ||
      head.y === height - 1 ||
      snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      gameOver = true;
      console.log('Game Over! Your score:', score);
      process.exit();
    }

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
      score++;
      // Generate new food
      food = {
        x: Math.floor(Math.random() * (width - 2)) + 1,
        y: Math.floor(Math.random() * (height - 2)) + 1
      };
    } else {
      // Remove tail segment
      snake.pop();
    }

    // Draw game board
    drawBoard();

    // Schedule next update
    setTimeout(update, 150);
  }
}

// Listen for player input
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  switch (key.name) {
    case 'up':
      if (direction !== 'down') direction = 'up';
      break;
    case 'down':
      if (direction !== 'up') direction = 'down';
      break;
    case 'left':
      if (direction !== 'right') direction = 'left';
      break;
    case 'right':
      if (direction !== 'left') direction = 'right';
      break;
    case 'q':
    case 'escape':
      gameOver = true;
      console.log('Game Over! Your score:', score);
      process.exit();
  }
});

// Start game
console.log('Use arrow keys to control the snake. Press Q or Esc to quit.');
drawBoard();
update();
