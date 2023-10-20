const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let snakeSpeed = 5; // Default snake speed
let growthRate = 1; // Default growth rate
let snakeHeadImage, snakeBodyImage;
document.getElementById('startGameButton').addEventListener('click', () => {
    document.getElementById('startPopup').style.display = 'none';
    initGame();
});


function loadImages(imagefiles) {
    var loadedimages = [];
    var loadcount = 0;
    var loadtotal = imagefiles.length;

    for (var i = 0; i < loadtotal; i++) {
        var image = new Image();
        image.onload = function () {
            loadcount++;
            if (loadcount == loadtotal) {
                initGame();
            }
        };
        image.src = imagefiles[i];
        loadedimages[i] = image;
    }
    return loadedimages;
}


function updateDifficulty() {
    const selectedDifficulty = difficultySelect.value;
    
    switch (selectedDifficulty) {
        case "easy":
            snakeSpeed = 5;
            growthRate = 1;
            break;
        case "medium":
            snakeSpeed = 8;
            growthRate = 2;
            break;
        case "hard":
            snakeSpeed = 12;
            growthRate = 3;
            break;
    }
    
    clearInterval(setIntervalId); // Clear the previous interval
    setIntervalId = setInterval(initGame, 1000 / snakeSpeed); // Set the new interval
}


// Event listener to update difficulty when the dropdown selection changes
const difficultySelect = document.getElementById('difficulty-select');
// function to remove the difficulty selector
function myFunction (){
    if (score === 0){
    difficultySelect.addEventListener('change', updateDifficulty);
    } else {
        difficultySelect.style.display ='none';
    }
    }

// Getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    // Passing a random 1 - 30 value as food position
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // Clearing the timer and reloading the page on game over
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
}

const changeDirection = e => {
    // Changing velocity value based on key press
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Calling changeDirection on each key click and passing key dataset value as an object
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));
function initializeGame() {
    snakeHeadImage = snakeImages[0];
    snakeBodyImage = snakeImages[1];
    updateFoodPosition();
    setIntervalId = setInterval(updateGame, 1000 / snakeSpeed);
}

const snakeImages = loadImages([
    "./assets/enemy-head.png",
    "./assets/enemy-snake-graphics.png"
]);

const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    myFunction();
    // Checking if the snake hit the food
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        for (let i = 0; i < growthRate; i++) {
            // Push the position of the food multiple times to simulate growth
            snakeBody.push([foodY, foodX]);
        }
       
        score++; // increment score
        
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    // Updating the snake's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;
    
    // Shifting forward the values of the elements in the snake body by one
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    
    }
    snakeBody[0] = [snakeX, snakeY]; // Setting first element of snake body to current snake position

    // Checking if the snake's head is out of the wall, if so setting gameOver to true
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return handleGameOver();
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // Adding a div for each part of the snake's body
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Checking if the snake head hit the body, if so set gameOver to true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            return handleGameOver();
        }
    }
    playBoard.innerHTML = html;
}
function paintPlayer(playerState, size) {
    const snake = playerState.snake;

    // Loop over every snake segment
    for (var i = 0; i < snake.length; i++) {
        var segment = snake[i];
        var segx = segment.x;
        var segy = segment.y;

        // Use different sprites for head and body segments
        if (i === 0) {
            ctx.drawImage(snakeHeadImage, segx * size, segy * size, size, size);
        } else {
            ctx.drawImage(snakeBodyImage, segx * size, segy * size, size, size);
        }
    }
}


updateFoodPosition();
setIntervalId = setInterval(initGame, 1000 / snakeSpeed); // Initial interval
document.addEventListener("keyup", changeDirection);

// Initialize the game with default parameters
updateDifficulty();