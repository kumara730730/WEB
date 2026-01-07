const items = [
    { id: 'dog', emoji: '🐶', type: 'animal' },
    { id: 'cat', emoji: '🐱', type: 'animal' },
    { id: 'frog', emoji: '🐸', type: 'animal' },
    { id: 'car', emoji: '🚗', type: 'object' },
    { id: 'ball', emoji: '⚽', type: 'object' },
    { id: 'guitar', emoji: '🎸', type: 'object' }
];

const testItems = [
    { id: 'lion', emoji: '🦁', type: 'animal' },
    { id: 'toaster', emoji: '🍞', type: 'object' }
];

let placedItems = {};

// Initialize Game
window.onload = function() {
    const container = document.getElementById('source-container');
    items.forEach(item => {
        const el = document.createElement('div');
        el.className = 'draggable-item';
        el.innerText = item.emoji;
        el.id = item.id;
        el.draggable = true;
        el.ondragstart = drag;
        container.appendChild(el);
    });
};

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    
    // Ensure we drop into the box, not on top of another child element
    let target = ev.target;
    if (!target.classList.contains('drop-box')) {
        target = target.closest('.drop-box');
    }
    
    if (target) {
        target.appendChild(draggedElement);
        // Record where the child put the item
        const boxType = target.id === 'box-animal' ? 'animal' : 'object';
        placedItems[data] = boxType;
    }
}

function startAIRound() {
    // 1. Check if all items are placed
    if (Object.keys(placedItems).length < items.length) {
        alert("Please drag all pictures to the boxes first!");
        return;
    }

    // 2. Analyze Child's Teaching (Did they make mistakes?)
    let childMistakes = 0;
    items.forEach(item => {
        if (placedItems[item.id] !== item.type) {
            childMistakes++;
        }
    });

    // 3. AI Simulation
    // If child made mistakes, AI learns the "wrong" pattern (Garbage In, Garbage Out)
    // If child was perfect, AI is perfect.
    
    const modal = document.getElementById('result-modal');
    const title = document.getElementById('modal-title');
    const msg = document.getElementById('modal-message');
    const exp = document.getElementById('modal-explanation');

    modal.classList.remove('hidden');

    if (childMistakes === 0) {
        // Success Scenario
        title.innerText = "Yay! You mentored the AI properly! 🎉";
        msg.innerText = "Gemini looked at your examples and correctly sorted the next items (Lion and Toaster)!";
        exp.innerText = "Explanation: Computers learn from data. Because you gave it 'Clean Data' (correct answers), the AI became smart!";
        
        // Visualise AI doing it right (Optional animation logic could go here)
        simulateAIDrop(true);
    } else {
        // Failure Scenario
        title.innerText = "The computer did exactly what it was taught. 🤖";
        msg.innerText = "Oops! You put some items in the wrong box, so Gemini got confused and made mistakes too.";
        exp.innerText = "Explanation: This is called 'Garbage In, Garbage Out'. If the data you teach an AI is wrong, the AI will be wrong too. Try again!";
        
        simulateAIDrop(false);
    }
}

function simulateAIDrop(isCorrect) {
    // Clear board for AI demo
    document.getElementById('source-container').innerHTML = "<strong>Gemini is playing now...</strong>";
    
    testItems.forEach(item => {
        const el = document.createElement('div');
        el.className = 'draggable-item';
        el.innerText = item.emoji;
        el.style.animation = "popIn 0.5s";
        
        // Determine destination based on AI logic
        let destId;
        if (isCorrect) destId = item.type === 'animal' ? 'box-animal' : 'box-object';
        else destId = item.type === 'animal' ? 'box-object' : 'box-animal'; // Deliberate error

        document.getElementById(destId).appendChild(el);
    });
}
