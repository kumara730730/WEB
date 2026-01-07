// Game Data
const trainingData = [
    { name: "Cat", type: "Living" },
    { name: "Chair", type: "Object" },
    { name: "Tree", type: "Living" },
    { name: "Laptop", type: "Object" }
];

const aiTestData = [
    { name: "Dog", type: "Living" },
    { name: "Phone", type: "Object" },
    { name: "Flower", type: "Living" }
];

let currentIndex = 0;
let isAiTurn = false;

// DOM Elements
const itemDisplay = document.getElementById('item-display');
const statusDisplay = document.getElementById('game-status');
const btnLiving = document.getElementById('btn-living');
const btnObject = document.getElementById('btn-object');

function startGame() {
    currentIndex = 0;
    isAiTurn = false;
    loadItem();
    statusDisplay.textContent = "Your Turn: Teach the AI!";
}

function loadItem() {
    const currentSet = isAiTurn ? aiTestData : trainingData;
    
    if (currentIndex < currentSet.length) {
        itemDisplay.textContent = currentSet[currentIndex].name;
        
        if (isAiTurn) {
            disableButtons(true);
            setTimeout(aiPlay, 1000);
        } else {
            disableButtons(false);
        }
    } else {
        if (!isAiTurn) {
            // Switch to AI turn
            isAiTurn = true;
            currentIndex = 0;
            statusDisplay.textContent = "AI is learning from your data...";
            itemDisplay.textContent = "⚙️ Processing...";
            disableButtons(true);
            setTimeout(() => {
                statusDisplay.textContent = "AI's Turn: Executing learned logic";
                loadItem();
            }, 2000);
        } else {
            // Game Over
            itemDisplay.textContent = "🎉";
            statusDisplay.textContent = "Training Complete! AI successfully learned.";
            disableButtons(true);
        }
    }
}

function classifyItem(type) {
    // In a real app, we would store this data to train a model.
    // Here we just proceed to the next item.
    currentIndex++;
    loadItem();
}

function aiPlay() {
    const currentItem = aiTestData[currentIndex];
    const correctBtn = currentItem.type === 'Living' ? btnLiving : btnObject;
    
    // Simulate AI "clicking"
    correctBtn.classList.add('highlight');
    setTimeout(() => {
        correctBtn.classList.remove('highlight');
        currentIndex++;
        loadItem();
    }, 1000);
}

function disableButtons(disable) {
    btnLiving.disabled = disable;
    btnObject.disabled = disable;
}

// Initialize
startGame();
