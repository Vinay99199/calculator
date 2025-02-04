const display = document.getElementById('display');
const historyContainer = document.getElementById('history');
let history = [];
let currentHistoryIndex = -1;
let undoStack = [];
let redoStack = [];

function appendValue(value) {
    display.innerText += value;  // Append the value clicked
    saveToUndo();  // Save the current state for undo functionality
}

function clearDisplay() {
    display.innerText = '';  // Clear the display
    saveToUndo();
}

function deleteLast() {
    display.innerText = display.innerText.slice(0, -1);  // Remove the last character
    saveToUndo();
}

function calculateResult() {
    try {
        let expr = display.innerText.replace(/(\d+)!/g, (match, num) => {
            return `factorial(${num})`;
        });

        expr = expr.replace(/Math\.pow\((\d+),/g, 'Math.pow($1,');
        expr = expr.replace(/(\d+)\^(\d+)/g, 'Math.pow($1, $2)');

        const result = eval(expr);
        const timestamp = new Date().toLocaleString();

        // Add to history
        history.push({ expression: display.innerText, result, timestamp });
        currentHistoryIndex = history.length - 1;
        if (history.length > 5) history.shift(); // Keep the last 5 entries
        updateHistory();

        display.innerText = result;
        saveToUndo();
    } catch (e) {
        display.innerText = 'Error';
    }
}

function factorial(n) {
    if (n === 0 || n === 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

Math.factorial = factorial;

function saveToUndo() {
    // Clear redo stack if we have made new changes
    redoStack = [];
    undoStack.push(display.innerText);
}

function undo() {
    if (undoStack.length > 0) {
        const lastState = undoStack.pop();
        redoStack.push(display.innerText); // Push current state to redo stack
        display.innerText = lastState;
    }
}

function redo() {
    if (redoStack.length > 0) {
        const redoState = redoStack.pop();
        undoStack.push(display.innerText); // Push current state to undo stack
        display.innerText = redoState;
    }
}

function updateHistory() {
    historyContainer.innerHTML = '<h4>History</h4>';
    history.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.innerHTML = `
            <span>${item.expression} = ${item.result} <small>(${item.timestamp})</small></span>
            <button onclick="deleteHistoryItem(${index})">X</button>
        `;
        historyContainer.appendChild(historyItem);
    });
}

function deleteHistoryItem(index) {
    history.splice(index, 1); // Remove the item from the history array
    updateHistory(); // Update the displayed history
}
