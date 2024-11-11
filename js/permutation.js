document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('input');
    const outputText = document.getElementById('output');
    const keyInput = document.getElementById('key');
    const encodeTab = document.getElementById('encodeTab');
    const decodeTab = document.getElementById('decodeTab');
    const matrixGrid = document.getElementById('matrixGrid');

    let isEncoding = true;

    // Event listeners
    inputText.addEventListener('input', handleTextChange);
    keyInput.addEventListener('input', handleTextChange);
    
    encodeTab.addEventListener('click', () => {
        setMode(true);
    });

    decodeTab.addEventListener('click', () => {
        setMode(false);
    });

    function setMode(encode) {
        isEncoding = encode;
        encodeTab.classList.toggle('active', encode);
        decodeTab.classList.toggle('active', !encode);
        handleTextChange();
    }

    function handleTextChange() {
        const text = inputText.value;
        const key = parseInt(keyInput.value, 10);
        if (isNaN(key) || key <= 0) {
            outputText.value = 'Invalid key';
            return;
        }

        const processedText = isEncoding ? encodeText(text, key) : decodeText(text, key);
        outputText.value = processedText;
        updateGrid(text, key);
    }

    function encodeText(text, key) {
        const numRows = Math.ceil(text.length / key);
        let encodedText = '';

        for (let col = 0; col < key; col++) {
            for (let row = 0; row < numRows; row++) {
                const index = row * key + col;
                if (index < text.length) {
                    encodedText += text[index];
                }
            }
        }

        return encodedText;
    }

    function decodeText(text, key) {
        const numRows = Math.ceil(text.length / key);
        const numCols = key;
        let decodedText = Array(text.length).fill('');

        let index = 0;
        for (let col = 0; col < numCols; col++) {
            for (let row = 0; row < numRows; row++) {
                const pos = row * numCols + col;
                if (pos < text.length) {
                    decodedText[pos] = text[index++];
                }
            }
        }

        return decodedText.join('');
    }

    function updateGrid(text, key) {
        const numRows = Math.ceil(text.length / key);
        matrixGrid.style.gridTemplateColumns = `repeat(${key}, 1fr)`;
        matrixGrid.innerHTML = '';

        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < key; col++) {
                const index = row * key + col;
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.textContent = text[index] || '';
                matrixGrid.appendChild(cell);
            }
        }
    }

    // Initialize the application
    function initialize() {
        handleTextChange();
    }

    initialize();
});