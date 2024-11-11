document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('input');
    const outputText = document.getElementById('output');
    const keyInput = document.getElementById('key');
    const encodeTab = document.getElementById('encodeTab');
    const decodeTab = document.getElementById('decodeTab');
    const demoText = document.getElementById('demoText');
    const demoInitialKey = document.getElementById('demoInitialKey');
    const demoGeneratedKey = document.getElementById('demoGeneratedKey');

    let isEncoding = true;

    function createRepeatedKey(text, key) {
        if (key.length === 0) return '';
        return key.repeat(Math.ceil(text.length / key.length)).slice(0, text.length);
    }

    function createAutoKey(text, key) {
        if (key.length === 0) return '';
        return key + text.slice(0, text.length - key.length);
    }

    function vigenereCipher(text, key, isDecrypt = false) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const textCharCode = text.charCodeAt(i) - 65;
            const keyCharCode = key.charCodeAt(i) - 65;
            const shift = isDecrypt ? -keyCharCode : keyCharCode;
            const charCode = ((textCharCode + shift + 26) % 26) + 65;
            result += String.fromCharCode(charCode);
        }
        return result;
    }

    function processText() {
        const text = inputText.value.toUpperCase().replace(/[^A-Z]/g, '');
        const key = keyInput.value.toUpperCase().replace(/[^A-Z]/g, '');
        const generatedKey = createRepeatedKey(text, key);

        demoText.textContent = text;
        demoInitialKey.textContent = key;
        demoGeneratedKey.textContent = generatedKey;

        const result = isEncoding ? vigenereCipher(text, generatedKey) : vigenereCipher(text, generatedKey, true);
        outputText.value = result;
    }

    function setMode(encode) {
        isEncoding = encode;
        encodeTab.classList.toggle('active', encode);
        decodeTab.classList.toggle('active', !encode);
        processText();
    }

    function initializeEventListeners() {
        ['input', 'change'].forEach(event => {
            inputText.addEventListener(event, processText);
            keyInput.addEventListener(event, processText);
        });

        encodeTab.addEventListener('click', () => setMode(true));
        decodeTab.addEventListener('click', () => setMode(false));
    }

    function initialize() {
        initializeEventListeners();
        processText();
    }

    initialize();
});