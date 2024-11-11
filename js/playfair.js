class PlayfairCipher {
    constructor() {
        this.input = document.getElementById('input');
        this.output = document.getElementById('output');
        this.key = document.getElementById('key');
        this.encodeTab = document.getElementById('encodeTab');
        this.decodeTab = document.getElementById('decodeTab');
        this.matrixGrid = document.getElementById('matrixGrid');
        this.isDecryptMode = false;
        this.matrix = [];
        this.initializeEventListeners();
        this.updateMatrix();
    }

    initializeEventListeners() {
        ['input', 'change'].forEach(event => {
            this.input.addEventListener(event, () => this.process());
            this.key.addEventListener(event, () => {
                this.updateMatrix();
                this.process();
            });
        });

        this.encodeTab.addEventListener('click', () => this.setMode(false));
        this.decodeTab.addEventListener('click', () => this.setMode(true));
    }

    setMode(isDecryptMode) {
        this.isDecryptMode = isDecryptMode;
        this.encodeTab.classList.toggle('active', !isDecryptMode);
        this.decodeTab.classList.toggle('active', isDecryptMode);
        this.process();
    }

    updateMatrix() {
        const key = this.key.value;
        this.matrix = this.generatePlayfairMatrix(key);
        this.displayMatrix();
    }

    generatePlayfairMatrix(key) {
        const matrix = Array.from({ length: 5 }, () => Array(5).fill(''));
        const used = new Set();
        const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // I/J combined

        let index = 0;

        // Fill with key
        const processedKey = this.processKey(key);
        for (const char of processedKey) {
            if (!used.has(char)) {
                matrix[Math.floor(index / 5)][index % 5] = char;
                used.add(char);
                index++;
            }
        }

        // Fill with remaining letters
        for (const char of alphabet) {
            if (!used.has(char)) {
                matrix[Math.floor(index / 5)][index % 5] = char;
                used.add(char);
                index++;
            }
        }

        return matrix;
    }

    processKey(key) {
        return key.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
    }

    displayMatrix() {
        this.matrixGrid.innerHTML = this.matrix.map(row => 
            `<div class="matrix-row">${row.map(char => `<div class="matrix-cell">${char}</div>`).join('')}</div>`
        ).join('');
    }

    process() {
        const text = this.input.value;
        const processedText = this.isDecryptMode ? this.decrypt(text) : this.encrypt(text);
        this.output.value = processedText;
    }

    encrypt(text) {
        return this.processText(text, false);
    }

    decrypt(text) {
        return this.processText(text, true);
    }

    processText(text, isDecrypt) {
        const processedText = this.prepareText(text);
        let result = '';

        for (let i = 0; i < processedText.length; i += 2) {
            const [char1, char2] = [processedText[i], processedText[i + 1]];
            const [row1, col1] = this.findPosition(char1);
            const [row2, col2] = this.findPosition(char2);

            if (row1 === row2) {
                result += this.matrix[row1][(col1 + (isDecrypt ? -1 : 1) + 5) % 5];
                result += this.matrix[row2][(col2 + (isDecrypt ? -1 : 1) + 5) % 5];
            } else if (col1 === col2) {
                result += this.matrix[(row1 + (isDecrypt ? -1 : 1) + 5) % 5][col1];
                result += this.matrix[(row2 + (isDecrypt ? -1 : 1) + 5) % 5][col2];
            } else {
                result += this.matrix[row1][col2];
                result += this.matrix[row2][col1];
            }
        }

        return result;
    }

    prepareText(text) {
        const processedText = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
        let result = '';

        for (let i = 0; i < processedText.length; i += 2) {
            let char1 = processedText[i];
            let char2 = processedText[i + 1] || 'X';

            if (char1 === char2) {
                char2 = 'X';
                i--;
            }

            result += char1 + char2;
        }

        return result;
    }

    findPosition(char) {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (this.matrix[row][col] === char) {
                    return [row, col];
                }
            }
        }
        return [-1, -1];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PlayfairCipher();
});