let targetWord = "";
let currentRow = 0;
let guesses = [];
let validWordsCache = []; // Cache for validated words

async function getRandom5LetterWord() {
    try {
        const response = await fetch('https://api.datamuse.com/words?sp=?????&max=1000');
        const words = await response.json();
        if (words.length > 0) {
            const word = words[Math.floor(Math.random() * words.length)].word;
            validWordsCache.push(word); // Cache the target word
            return word;
        }
        return getLocalWord();
    } catch (error) {
        console.error("Error fetching words:", error);
        return getLocalWord();
    }
}

function getLocalWord() {
    const localWords = ["apple", "grape", "lemon", "mango", "berry", "peach", "melon"];
    return localWords[Math.floor(Math.random() * localWords.length)];
}

async function validateWord(word) {
    word = word.toLowerCase().trim();
    // Check cache first
    if (validWordsCache.includes(word)) {
        console.log(`Word ${word} found in cache.`);
        return true;
    }
    // Check local words (offline fallback)
    const localWords = ["apple", "grape", "lemon", "mango", "berry", "peach", "melon"];
    if (localWords.includes(word)) {
        console.log(`Word ${word} found in local words.`);
        validWordsCache.push(word);
        return true;
    }
    // Check Datamuse API
    try {
        const response = await fetch(`https://api.datamuse.com/words?sp=${word}&max=1`);
        const words = await response.json();
        if (words.length > 0 && words[0].word === word) {
            console.log(`Word ${word} validated via API.`);
            validWordsCache.push(word);
            return true;
        }
        console.log(`Word ${word} not found in API.`);
        return false;
    } catch (error) {
        console.error(`Error validating word ${word}:`, error);
        return localWords.includes(word); // Fallback to local words on error
    }
}

function showModal(message) {
    const modal = document.getElementById("modal");
    const modalMessage = document.getElementById("modal-message");
    const modalClose = document.getElementById("modal-close");
    modalMessage.textContent = message;
    modal.style.display = "flex";
    modalClose.focus();
    modalClose.onclick = () => {
        modal.style.display = "none";
        document.getElementById("guess").focus();
    };
}

function resetGame() {
    console.log("resetGame triggered");
    const grid = document.getElementById("grid");
    const guessInput = document.getElementById("guess");
    
    // Clear UI and reset state
    grid.innerHTML = '';
    guessInput.value = '';
    guessInput.disabled = false;
    guessInput.readOnly = false;
    guessInput.style.pointerEvents = 'auto';
    guessInput.style.opacity = '1';
    guessInput.style.caretColor = 'black';
    guessInput.removeAttribute('disabled');
    guessInput.removeAttribute('readonly');
    currentRow = 0;
    guesses = [];
    console.log("Game reset: Grid cleared, input fully reset. Input attributes:", {
        disabled: guessInput.disabled,
        readOnly: guessInput.readOnly,
        pointerEvents: guessInput.style.pointerEvents,
        opacity: guessInput.style.opacity,
        caretColor: guessInput.style.caretColor,
        visibility: guessInput.style.visibility
    });

    // Start new game
    getRandom5LetterWord().then(secretWord => {
        console.log("The secret word is:", secretWord);
        startGame(secretWord);
        setTimeout(() => {
            guessInput.focus();
            console.log("New game started, input focused. Input state:", {
                focused: document.activeElement === guessInput,
                disabled: guessInput.disabled,
                pointerEvents: guessInput.style.pointerEvents,
                caretColor: guessInput.style.caretColor
            });
        }, 100);
    }).catch(error => {
        console.error("Failed to start new game:", error);
        const fallbackWord = getLocalWord();
        console.log("Using fallback word:", fallbackWord);
        startGame(fallbackWord);
        setTimeout(() => {
            guessInput.focus();
            console.log("New game started with fallback, input focused. Input state:", {
                focused: document.activeElement === guessInput,
                disabled: guessInput.disabled,
                pointerEvents: guessInput.style.pointerEvents,
                caretColor: guessInput.style.caretColor
            });
        }, 100);
    });

    // Reattach keypress event listener
    guessInput.removeEventListener('keypress', handleKeypress);
    guessInput.addEventListener('keypress', handleKeypress);
}

function handleKeypress(event) {
    if (event.key === "Enter" && document.getElementById("guess").value.length === 5) {
        submitGuess();
    }
}

function startGame(secretWord) {
    targetWord = secretWord.toLowerCase();
    const grid = document.getElementById("grid");
    grid.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            grid.appendChild(cell);
        }
    }
    console.log("Grid initialized with new cells.");
}

async function submitGuess() {
    const guessInput = document.getElementById("guess");
    const guess = guessInput.value.toLowerCase().trim();
    if (guess.length !== 5 || !/^[a-z]{5}$/.test(guess)) {
        showModal("Please enter a 5-letter word containing only letters!");
        return;
    }
    const isValidWord = await validateWord(guess);
    if (!isValidWord) {
        showModal("Please enter a valid English word!");
        return;
    }
    guesses.push(guess);
    const rowCells = document.querySelectorAll(`.grid .cell:nth-child(n+${currentRow * 5 + 1}):nth-child(-n+${(currentRow + 1) * 5})`);
    for (let i = 0; i < 5; i++) {
        rowCells[i].textContent = guess[i];
        if (guess[i] === targetWord[i]) {
            rowCells[i].classList.add("correct");
        } else if (targetWord.includes(guess[i])) {
            rowCells[i].classList.add("present");
        } else {
            rowCells[i].classList.add("absent");
        }
    }
    console.log(`Guess ${guess} submitted, row ${currentRow} updated.`);
    if (guess === targetWord) {
        showModal("You won!");
        resetGame();
        return;
    }
    currentRow++;
    guessInput.value = "";
    if (currentRow >= 6) {
        showModal(`Game over! The word was ${targetWord}`);
        resetGame();
    }
}

document.getElementById("startNewGameButton").addEventListener("click", () => {
    console.log("Start New Game button clicked");
    resetGame();
});
document.getElementById("submitGuessButton").addEventListener("click", submitGuess);
document.getElementById("guess").addEventListener("keypress", handleKeypress);

getRandom5LetterWord().then(secretWord => {
    console.log("Initial secret word is:", secretWord);
    startGame(secretWord);
    document.getElementById("guess").focus();
}).catch(error => {
    console.error("Failed to start initial game:", error);
    const fallbackWord = getLocalWord();
    console.log("Using fallback word:", fallbackWord);
    startGame(fallbackWord);
    document.getElementById("guess").focus();
});