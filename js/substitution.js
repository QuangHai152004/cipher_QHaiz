document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('input');
    const outputText = document.getElementById('output');
    const keyInput = document.getElementById('key');
    const encodeTab = document.getElementById('encodeTab');
    const decodeTab = document.getElementById('decodeTab');
    const plainAlphabet = document.getElementById('plainAlphabet');
    const cipherAlphabet = document.getElementById('cipherAlphabet');
    const arrowRow = document.getElementById('arrowRow');

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let isEncoding = true;

    // Initialize the alphabet display
    function setupAlphabetDisplay() {
        // Clear existing content
        plainAlphabet.innerHTML = '';
        cipherAlphabet.innerHTML = '';
        arrowRow.innerHTML = '';

        // Add original alphabet cells
        for (let char of alphabet) {
            const cell = document.createElement('div');
            cell.className = 'alphabet-cell';
            cell.textContent = char;
            plainAlphabet.appendChild(cell);

            // Add arrow
            const arrowCell = document.createElement('div');
            arrowCell.className = 'arrow-cell';
            arrowCell.textContent = '↓';
            arrowRow.appendChild(arrowCell);

            // Add substitution alphabet cell (initially empty)
            const subCell = document.createElement('div');
            subCell.className = 'alphabet-cell';
            subCell.textContent = '';
            cipherAlphabet.appendChild(subCell);
        }
    }

    // Update the substitution display
    function refreshSubstitutionDisplay(key) {
        const cipherCells = cipherAlphabet.getElementsByClassName('alphabet-cell');
        const arrows = arrowRow.getElementsByClassName('arrow-cell');
        
        for (let i = 0; i < alphabet.length; i++) {
            if (i < key.length) {
                cipherCells[i].textContent = key[i];
                arrows[i].textContent = '↓';
            } else {
                cipherCells[i].textContent = '';
                arrows[i].textContent = '';
            }
        }
    }

    // Process the input text
    function processText() {
        const key = keyInput.value.toUpperCase();
        const text = inputText.value.toUpperCase();
        let result = '';

        if (isEncoding) {
            result = encodeText(text, key);
        } else {
            result = decodeText(text, key);
        }

        outputText.value = result;
        refreshSubstitutionDisplay(key);
    }

    // Encode the text
    function encodeText(text, key) {
        const keyMap = createKeyMap(key);
        return text.split('').map(char => keyMap[char] || char).join('');
    }

    // Decode the text
    function decodeText(text, key) {
        const keyMap = createKeyMap(key);
        const reverseKeyMap = Object.fromEntries(Object.entries(keyMap).map(([k, v]) => [v, k]));
        return text.split('').map(char => reverseKeyMap[char] || char).join('');
    }

    // Create a key map for substitution
    function createKeyMap(key) {
        const keyMap = {};
        for (let i = 0; i < alphabet.length; i++) {
            keyMap[alphabet[i]] = key[i] || alphabet[i];
        }
        return keyMap;
    }

    // Set the mode (encode/decode)
    function setMode(encode) {
        isEncoding = encode;
        encodeTab.classList.toggle('active', encode);
        decodeTab.classList.toggle('active', !encode);
        processText();
    }

    // Initialize event listeners
    function initializeEventListeners() {
        ['input', 'change'].forEach(event => {
            inputText.addEventListener(event, processText);
            keyInput.addEventListener(event, processText);
        });

        encodeTab.addEventListener('click', () => setMode(true));
        decodeTab.addEventListener('click', () => setMode(false));
    }

    // Initialize the application
    function initialize() {
        setupAlphabetDisplay();
        initializeEventListeners();
        processText();
    }

    initialize();
});