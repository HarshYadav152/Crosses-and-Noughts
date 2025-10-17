
console.log("Welcome to Enhanced Tic Tac Toe");
console.warn("Developed by Harsh Yadav");

// Game state
let turn = 'X';
let gameOver = false;
let moveCount = 0;
let timerInterval = null;
let seconds = 0;
const MODAL_TRANSITION_MS = 400;

const scores = {
    X: 0,
    O: 0,
    draw: 0
};

// Player names
let playerX = 'Player X';
let playerO = 'Player O';

// DOM elements - initialized as null to avoid errors if DOM isn't ready
let boxes, boxtexts, info, resetBtn, newGameBtn, playerModal, gameOverModal,
    startGameBtn, playAgainBtn, closeModalBtn, playerXElement, playerOElement,
    playerXName, playerOName, scoreX, scoreO, scoreDraw, moveCountElement,
    timerElement, gameResult, winnerMessage, player1Input, player2Input,
    lineElement, celebrationImg;

// Function to initialize all DOM elements safely
function initDOMElements() {
    boxes = document.getElementsByClassName('box');
    boxtexts = document.getElementsByClassName('boxtext');
    info = document.getElementsByClassName('info')[0];
    resetBtn = document.getElementById('reset');
    newGameBtn = document.getElementById('new-game');
    playerModal = document.getElementById('player-modal');
    gameOverModal = document.getElementById('game-over-modal');
    startGameBtn = document.getElementById('start-game');
    playAgainBtn = document.getElementById('play-again');
    closeModalBtn = document.getElementById('close-modal');
    playerXElement = document.getElementById('player-x');
    playerOElement = document.getElementById('player-o');
    playerXName = document.getElementById('player-x-name');
    playerOName = document.getElementById('player-o-name');
    scoreX = document.getElementById('score-x');
    scoreO = document.getElementById('score-o');
    scoreDraw = document.getElementById('score-draw');
    moveCountElement = document.getElementById('move-count');
    timerElement = document.getElementById('timer');
    gameResult = document.getElementById('game-result');
    winnerMessage = document.getElementById('winner-message');
    player1Input = document.getElementById('player1');
    player2Input = document.getElementById('player2');
    lineElement = document.querySelector('.line');
    celebrationImg = document.querySelector('.imgbox img');
}

let audioContext;
let listenersAttached = false;

function initGame() {
    try {
        // Initialize DOM elements first
        initDOMElements();
        
        // Check if all required DOM elements are available
        if (!validateDOMElements()) {
            console.error("Critical DOM elements are missing. The game cannot be initialized.");
            return;
        }
        
        attachEventListeners();
        updateScoreboard();
        resetBoard({ restartTimer: false });
        
        // Use setTimeout to ensure the modal shows after everything else is ready
        setTimeout(() => {
            showPlayerModal({ prefill: false });
        }, 100);
    } catch (error) {
        console.error("Error initializing game:", error);
    }
}

// Check if all required DOM elements are available
function validateDOMElements() {
    // Define critical elements that need to exist
    const criticalElements = [
        { name: 'boxes', element: boxes },
        { name: 'boxtexts', element: boxtexts },
        { name: 'info', element: info },
        { name: 'resetBtn', element: resetBtn },
        { name: 'newGameBtn', element: newGameBtn },
        { name: 'playerModal', element: playerModal },
        { name: 'startGameBtn', element: startGameBtn },
        { name: 'playerXElement', element: playerXElement },
        { name: 'playerOElement', element: playerOElement }
    ];
    
    // Check if any critical element is missing
    const missingElements = criticalElements.filter(item => !item.element);
    
    if (missingElements.length > 0) {
        console.error("Missing critical DOM elements:", 
            missingElements.map(item => item.name).join(', '));
        return false;
    }
    
    return true;
}

function attachEventListeners() {
    if (listenersAttached) return; // Prevent duplicate bindings after hot reloads
    
    // Safely add event listeners only if elements exist
    if (startGameBtn) startGameBtn.addEventListener('click', startGame);
    if (resetBtn) resetBtn.addEventListener('click', resetGame);
    if (newGameBtn) newGameBtn.addEventListener('click', newGame);
    if (playAgainBtn) playAgainBtn.addEventListener('click', playAgain);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

    // Only attach box listeners if boxes exist
    if (boxes && boxes.length > 0) {
        Array.from(boxes).forEach((element, index) => {
            element.addEventListener('click', () => handleBoxClick(index));
        });
    }

    listenersAttached = true;
}

function showModal(modal) {
    modal.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('active'));
}

function hideModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, MODAL_TRANSITION_MS);
}

function showPlayerModal({ prefill = true } = {}) {
    // Make sure player inputs exist before accessing them
    if (player1Input && player2Input) {
        if (prefill) {
            player1Input.value = playerX !== 'Player X' ? playerX : '';
            player2Input.value = playerO !== 'Player O' ? playerO : '';
        } else {
            player1Input.value = '';
            player2Input.value = '';
        }
    }
    
    if (playerModal) {
        showModal(playerModal);
        // Focus on input after modal is visible
        setTimeout(() => {
            if (player1Input) player1Input.focus();
        }, 100);
    }
}

function startGame() {
    playerX = (player1Input.value || '').trim() || 'Player X';
    playerO = (player2Input.value || '').trim() || 'Player O';

    playerXName.textContent = playerX;
    playerOName.textContent = playerO;

    hideModal(playerModal);
    resetBoard({ restartTimer: true });
    
    // Make sure timer starts immediately
    startTimer();
}

function handleBoxClick(index) {
    if (gameOver || boxtexts[index].innerText !== '') return;

    playTingSound();

    boxtexts[index].innerText = turn;
    moveCount++;
    moveCountElement.textContent = moveCount;

    const winResult = checkWin();
    if (winResult) {
        endGame(winResult);
    } else if (moveCount === 9) {
        endGame('draw');
    } else {
        turn = turn === 'X' ? 'O' : 'X';
        updatePlayerTurn();
    }
}

function checkWin() {
    const wins = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < wins.length; i++) {
        const [a, b, c] = wins[i];
        if (boxtexts[a].innerText &&
            boxtexts[a].innerText === boxtexts[b].innerText &&
            boxtexts[a].innerText === boxtexts[c].innerText) {

            boxes[a].classList.add('winning-cell');
            boxes[b].classList.add('winning-cell');
            boxes[c].classList.add('winning-cell');

            drawWinningLine(i);

            return boxtexts[a].innerText;
        }
    }

    return null;
}

function drawWinningLine(lineIndex) {
    const container = document.querySelector('.container');
    const boxWidth = container.offsetWidth / 3;
    const boxHeight = container.offsetHeight / 3;
    
    // Calculate positions based on actual container dimensions
    const lineConfigs = [
        // Rows
        { 
            width: '90%', 
            transform: `translate(5%, ${boxHeight / 2}px) rotate(0deg)` 
        },
        { 
            width: '90%', 
            transform: `translate(5%, ${boxHeight * 1.5}px) rotate(0deg)` 
        },
        { 
            width: '90%', 
            transform: `translate(5%, ${boxHeight * 2.5}px) rotate(0deg)` 
        },
        
        // Columns
        { 
            width: '90%', 
            transform: `translate(${boxWidth / 2}px, 5%) rotate(90deg)` 
        },
        { 
            width: '90%', 
            transform: `translate(${boxWidth * 1.5}px, 5%) rotate(90deg)` 
        },
        { 
            width: '90%', 
            transform: `translate(${boxWidth * 2.5}px, 5%) rotate(90deg)` 
        },
        
        // Diagonals
        { 
            width: `${Math.sqrt(2) * container.offsetWidth * 0.9}px`, 
            transform: `translate(-${container.offsetWidth * 0.1}px, ${container.offsetHeight / 2 - 6}px) rotate(45deg)` 
        },
        { 
            width: `${Math.sqrt(2) * container.offsetWidth * 0.9}px`, 
            transform: `translate(-${container.offsetWidth * 0.1}px, ${container.offsetHeight / 2 - 6}px) rotate(-45deg)` 
        }
    ];

    const config = lineConfigs[lineIndex];
    lineElement.style.width = config.width;
    lineElement.style.transform = config.transform;
}

function endGame(result) {
    gameOver = true;
    stopTimer();

    if (result === 'X') {
        scores.X++;
        updateScoreboard();
        showGameOverModal(`${playerX} wins this round!`);
    } else if (result === 'O') {
        scores.O++;
        updateScoreboard();
        showGameOverModal(`${playerO} wins this round!`);
    } else {
        scores.draw++;
        updateScoreboard();
        showGameOverModal("It's a draw!", 'Draw');
    }

    celebrationImg.style.width = '150px';
}

function showGameOverModal(message, title = 'Game Over') {
    gameResult.textContent = title;
    winnerMessage.textContent = message;
    showModal(gameOverModal);
}

function updatePlayerTurn() {
    const currentPlayerName = turn === 'X' ? playerX : playerO;
    info.textContent = `Turn: ${currentPlayerName} (${turn})`;

    playerXElement.classList.toggle('active', turn === 'X');
    playerOElement.classList.toggle('active', turn === 'O');
}

function resetBoard({ restartTimer = true } = {}) {
    Array.from(boxtexts).forEach(element => {
        element.innerText = '';
    });

    Array.from(boxes).forEach(box => {
        box.classList.remove('winning-cell');
    });

    lineElement.style.width = '0';
    lineElement.style.transform = 'none';
    celebrationImg.style.width = '0';

    gameOver = false;
    turn = 'X';
    moveCount = 0;
    moveCountElement.textContent = moveCount;

    if (restartTimer) {
        restartTimerCountdown();
    } else {
        stopTimer();
        seconds = 0;
        updateTimerDisplay();
    }

    updatePlayerTurn();
}

function resetGame() {
    hideModal(gameOverModal);
    resetBoard({ restartTimer: true });
}

function newGame() {
    hideModal(gameOverModal);
    resetScores();
    resetBoard({ restartTimer: false });
    showPlayerModal();
}

function playAgain() {
    hideModal(gameOverModal);
    resetBoard({ restartTimer: true });
}

function closeModal() {
    hideModal(gameOverModal);
}

function updateScoreboard() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
    scoreDraw.textContent = scores.draw;
}

function resetScores() {
    scores.X = 0;
    scores.O = 0;
    scores.draw = 0;
    updateScoreboard();
}

function startTimer() {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        seconds++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    if (!timerInterval) return;

    clearInterval(timerInterval);
    timerInterval = null;
}

function restartTimerCountdown() {
    stopTimer();
    seconds = 0;
    updateTimerDisplay();
    startTimer();
}

function updateTimerDisplay() {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function playTingSound() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        oscillator.start(now);
        oscillator.stop(now + 0.21);
    } catch (error) {
        console.warn('Audio playback failed:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Make sure all DOM elements are available before initializing the game
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGame);
    } else {
        initGame();
    }
});
