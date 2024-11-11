class CaesarCipher {
    constructor() {
        this.input = document.getElementById('input');
        this.output = document.getElementById('output');
        this.shift = document.getElementById('shift');
        this.encodeTab = document.getElementById('encodeTab');
        this.decodeTab = document.getElementById('decodeTab');
        this.isDecryptMode = false;
        this.initializeEventListeners();
        this.updateAlphabetDisplay(this.getShiftValue());
    }

    initializeEventListeners() {
        ['input', 'change'].forEach(event => {
            this.input.addEventListener(event, () => this.processInput());
            this.shift.addEventListener(event, () => {
                this.processInput();
                this.updateAlphabetDisplay(this.getShiftValue());
            });
        });

        this.encodeTab.addEventListener('click', () => this.setMode(false));
        this.decodeTab.addEventListener('click', () => this.setMode(true));
    }

    setMode(isDecryptMode) {
        this.isDecryptMode = isDecryptMode;
        this.encodeTab.classList.toggle('active', !isDecryptMode);
        this.decodeTab.classList.toggle('active', isDecryptMode);
        this.processInput();
    }

    getShiftValue() {
        return parseInt(this.shift.value) || 3;
    }

    validateShiftValue(shiftValue) {
        if (isNaN(shiftValue) || shiftValue < 1 || shiftValue > 25) {
            this.output.value = 'Shift value must be between 1 and 25';
            return false;
        }
        return true;
    }

    processInput() {
        const shiftValue = this.getShiftValue();
        if (!this.validateShiftValue(shiftValue)) return;
        const text = this.input.value;
        const result = this.caesarCipher(text, shiftValue, this.isDecryptMode);
        this.output.value = result;
    }

    caesarCipher(text, shift, decrypt = false) {
        if (!text) return '';
        const shiftAmount = decrypt ? -shift : shift;
        return text.split('').map(char => this.shiftChar(char, shiftAmount)).join('');
    }

    shiftChar(char, shift) {
        const isUpperCase = char >= 'A' && char <= 'Z';
        const isLowerCase = char >= 'a' && char <= 'z';
        if (!isUpperCase && !isLowerCase) return char;

        const base = isUpperCase ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
        const charCode = char.charCodeAt(0);
        const newCharCode = ((charCode - base + shift + 26) % 26) + base;
        return String.fromCharCode(newCharCode);
    }

    updateAlphabetDisplay(shift) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const shiftedAlphabet = alphabet.split('').map(char => this.shiftChar(char, shift)).join('');
        document.querySelector('.alphabet-table .shifted-row').innerHTML = `
            <th>Shifted:</th>
            ${shiftedAlphabet.split('').map(char => `<td>${char}</td>`).join('')}
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CaesarCipher();
});