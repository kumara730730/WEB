const items = [
    { id: 'dog', image: 'dog.png', type: 'animal' },
    { id: 'cat', image: 'cat.png', type: 'animal' },
    { id: 'frog', image: 'frog.png', type: 'animal' },
    { id: 'car', image: 'car.png', type: 'object' },
    { id: 'ball', image: 'ball.png', type: 'object' },
    { id: 'guitar', image: 'guitar.png', type: 'object' }
];

const testItems = [
    { id: 'lion', image: 'lion.png', type: 'animal' },
    { id: 'toaster', image: 'toaster.png', type: 'object' },
    { id: 'bull', image: 'bull.png', type: 'animal' },
    { id: 'pen', image: 'pen.png', type: 'animal' }
];

let placedItems = {};

// Initialize Game
window.onload = function() {
    const container = document.getElementById('source-container');
    items.forEach(item => {
        const el = document.createElement('img');
        el.src = item.image;
        el.className = 'draggable-item';
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
    
    const isCorrect = childMistakes === 0;

    // Show simulation first (Cinematic view)
    simulateAIDrop(isCorrect);

    // Wait 5 seconds then show popup
    setTimeout(() => {
        const modal = document.getElementById('result-modal');
        const title = document.getElementById('modal-title');
        const msg = document.getElementById('modal-message');
        const exp = document.getElementById('modal-explanation');

        modal.classList.remove('hidden');

        if (isCorrect) {
            // Success Scenario
            title.innerText = "Yay! You mentored the AI properly! 🎉";
            msg.innerText = "Gemini looked at your examples and correctly sorted the next items (Lion and Toaster)!";
            exp.innerText = "Explanation: Computers learn from data. Because you gave it 'Clean Data' (correct answers), the AI became smart!";
        } else {
            // Failure Scenario
            title.innerText = "Good try! AI is still learning. 🤖";
            msg.innerText = "It looks like Gemini got a bit confused. That's okay! AI learns from the examples we give it.";
            exp.innerText = "Explanation: If we put an item in the wrong box, the AI might think that's the correct rule. Let's try again to teach it perfectly!";
        }
    }, 5000);
}

function simulateAIDrop(isCorrect) {
    // Clear board for AI demo
    document.getElementById('source-container').innerHTML = "<strong>Gemini is playing now...</strong>";

    // Clear user placed items from boxes so AI can show its learning clearly
    ['box-animal', 'box-object'].forEach(id => {
        const box = document.getElementById(id);
        const items = box.getElementsByClassName('draggable-item');
        while(items.length > 0){
            items[0].parentNode.removeChild(items[0]);
        }
    });
    
    testItems.forEach(item => {
        const el = document.createElement('img');
        el.src = item.image;
        el.className = 'draggable-item';
        el.style.animation = "popIn 0.5s";
        
        // Determine destination based on AI logic
        let destId;
        if (isCorrect) destId = item.type === 'animal' ? 'box-animal' : 'box-object';
        else destId = item.type === 'animal' ? 'box-object' : 'box-animal'; // Deliberate error

        document.getElementById(destId).appendChild(el);
    });
}
