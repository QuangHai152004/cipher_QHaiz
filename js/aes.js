// Format a word as hex string
function formatHex(word) {
    return word.toString(16).padStart(8, '0').toUpperCase();
}

// Create a visual matrix display
function createMatrixDisplay(state, title) {
    const container = document.createElement('div');
    container.innerHTML = `<h3>${title}</h3>`;
    
    const grid = document.createElement('div');
    grid.className = 'matrix-grid';
    
    for (let i = 0; i < 4; i++) {
        const cell = document.createElement('div');
        cell.className = 'matrix-cell';
        cell.textContent = formatHex(state[i]);
        grid.appendChild(cell);
    }
    
    container.appendChild(grid);
    return container;
}

// Add a step to the display
function addStep(title, content) {
    const stepsContainer = document.getElementById('steps');
    const step = document.createElement('div');
    step.className = 'step';
    step.innerHTML = `<h4>${title}</h4>`;
    step.appendChild(content);
    stepsContainer.appendChild(step);
}

function startEncryption() {
    // Clear previous steps
    clearSteps();

    // Get input values
    const { keyHex, plaintextHex } = getInputValues();

    // Convert hex to state array
    const { key, state } = convertHexToState(keyHex, plaintextHex);

    // Show initial state
    displayInitialState(key, state);

    // Perform key expansion with visualization
    const w = showKeyExpansion(key);

    // Perform encryption with visualization
    performEncryption(state, w);
}

function clearSteps() {
    document.getElementById('steps').innerHTML = '';
    document.getElementById('keyExpansionSteps').innerHTML = '';
}

function getInputValues() {
    const keyHex = document.getElementById('key').value.replace(/\s/g, '');
    const plaintextHex = document.getElementById('plaintext').value.replace(/\s/g, '');
    return { keyHex, plaintextHex };
}

function convertHexToState(keyHex, plaintextHex) {
    const key = new Uint32Array(4);
    const state = new Uint32Array(4);

    for (let i = 0; i < 4; i++) {
        key[i] = parseInt(keyHex.substr(i * 8, 8), 16);
        state[i] = parseInt(plaintextHex.substr(i * 8, 8), 16);
    }

    return { key, state };
}

function displayInitialState(key, state) {
    addStep('Initial State', createMatrixDisplay(state, 'Input Block'));
    addStep('Initial Key', createMatrixDisplay(key, 'Encryption Key'));
}

function performEncryption(state, w) {
    let temp = AddRoundKey(state, w.slice(0, 4));
    addStep('Round 0', createMatrixDisplay(temp, 'After Initial Round Key Addition'));

    for (let round = 1; round <= 10; round++) {
        addStep(`Round ${round}`, document.createElement('div'));

        temp = SubBytes(temp);
        addStep('SubBytes', createMatrixDisplay(temp, `After SubBytes`));

        temp = ShiftRows(temp);
        addStep('ShiftRows', createMatrixDisplay(temp, `After ShiftRows`));

        if (round < 10) {
            temp = MixColumns(temp);
            addStep('MixColumns', createMatrixDisplay(temp, `After MixColumns`));
        }

        temp = AddRoundKey(temp, w.slice(round * 4, (round + 1) * 4));
        addStep('AddRoundKey', createMatrixDisplay(temp, `After AddRoundKey`));
    }
}

// Original AES functions remain the same but without console.log statements
// ... (keep all the existing AES functions but remove console.log statements)


// Hàm hiển thị word dưới dạng hex
function ShowWord(w) {
    let result = '';
    for (let i = 1; i <= 8; i++) {
        const hexan = (w >>> (32 - i * 4)) & 0xF;
        result += hexan.toString(16).toUpperCase();
    }
    console.log(result);
}

function RotWord(w) {
    const byte1 = (w >>> 24) & 0xFF;
    const byte234 = w & 0xFFFFFF;
    const rot = (byte234 << 8) | byte1;
    console.log("\tRotWord(" + w.toString(16).toUpperCase() + ") = ");
    ShowWord(rot);
    return rot >>> 0;  // Đảm bảo kết quả là số nguyên không dấu
}

function SubWord(w) {
    const S = new Uint8Array([
        0x63, 0x7C, 0x77, 0x7B, 0xF2, 0x6B, 0x6F, 0xC5, 0x30, 0x01, 0x67, 0x2B, 0xFE, 0xD7, 0xAB, 0x76,
        0xCA, 0x82, 0xC9, 0x7D, 0xFA, 0x59, 0x47, 0xF0, 0xAD, 0xD4, 0xA2, 0xAF, 0x9C, 0xA4, 0x72, 0xC0,
        0xB7, 0xFD, 0x93, 0x26, 0x36, 0x3F, 0xF7, 0xCC, 0x34, 0xA5, 0xE5, 0xF1, 0x71, 0xD8, 0x31, 0x15,
        0x04, 0xC7, 0x23, 0xC3, 0x18, 0x96, 0x05, 0x9A, 0x07, 0x12, 0x80, 0xE2, 0xEB, 0x27, 0xB2, 0x75,
        0x09, 0x83, 0x2C, 0x1A, 0x1B, 0x6E, 0x5A, 0xA0, 0x52, 0x3B, 0xD6, 0xB3, 0x29, 0xE3, 0x2F, 0x84,
        0x53, 0xD1, 0x00, 0xED, 0x20, 0xFC, 0xB1, 0x5B, 0x6A, 0xCB, 0xBE, 0x39, 0x4A, 0x4C, 0x58, 0xCF,
        0xD0, 0xEF, 0xAA, 0xFB, 0x43, 0x4D, 0x33, 0x85, 0x45, 0xF9, 0x02, 0x7F, 0x50, 0x3C, 0x9F, 0xA8,
        0x51, 0xA3, 0x40, 0x8F, 0x92, 0x9D, 0x38, 0xF5, 0xBC, 0xB6, 0xDA, 0x21, 0x10, 0xFF, 0xF3, 0xD2,
        0xCD, 0x0C, 0x13, 0xEC, 0x5F, 0x97, 0x44, 0x17, 0xC4, 0xA7, 0x7E, 0x3D, 0x64, 0x5D, 0x19, 0x73,
        0x60, 0x81, 0x4F, 0xDC, 0x22, 0x2A, 0x90, 0x88, 0x46, 0xEE, 0xB8, 0x14, 0xDE, 0x5E, 0x0B, 0xDB,
        0xE0, 0x32, 0x3A, 0x0A, 0x49, 0x06, 0x24, 0x5C, 0xC2, 0xD3, 0xAC, 0x62, 0x91, 0x95, 0xE4, 0x79,
        0xE7, 0xC8, 0x37, 0x6D, 0x8D, 0xD5, 0x4E, 0xA9, 0x6C, 0x56, 0xF4, 0xEA, 0x65, 0x7A, 0xAE, 0x08,
        0xBA, 0x78, 0x25, 0x2E, 0x1C, 0xA6, 0xB4, 0xC6, 0xE8, 0xDD, 0x74, 0x1F, 0x4B, 0xBD, 0x8B, 0x8A,
        0x70, 0x3E, 0xB5, 0x66, 0x48, 0x03, 0xF6, 0x0E, 0x61, 0x35, 0x57, 0xB9, 0x86, 0xC1, 0x1D, 0x9E,
        0xE1, 0xF8, 0x98, 0x11, 0x69, 0xD9, 0x8E, 0x94, 0x9B, 0x1E, 0x87, 0xE9, 0xCE, 0x55, 0x28, 0xDF,
        0x8C, 0xA1, 0x89, 0x0D, 0xBF, 0xE6, 0x42, 0x68, 0x41, 0x99, 0x2D, 0x0F, 0xB0, 0x54, 0xBB, 0x16
    ]);
    
    let kq = 0;
    for (let i = 1; i <= 4; i++) {
        const bytei = (w >>> (32 - i * 8)) & 0xFF;
        const subB = S[bytei];
        kq = (kq << 8) | subB;
    }
    console.log("\tSubWord(" + w.toString(16).toUpperCase() + ") = ");
    ShowWord(kq);
    return kq >>> 0;
}

function XorRcon(w, j) {
    const Rc = new Uint8Array([
        0x8d, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d, 0x9a,
        0x2f, 0x5e, 0xbc, 0x63, 0xc6, 0x97, 0x35, 0x6a, 0xd4, 0xb3, 0x7d, 0xfa, 0xef, 0xc5, 0x91, 0x39
    ]);

    const byte1 = (w >>> 24) & 0xFF;
    const kqXor = (byte1 ^ Rc[j]) & 0xFF;
    const byte234 = w & 0xFFFFFF;
    return ((kqXor << 24) | byte234) >>> 0;
}

function G(w, j) {
    const rotW = RotWord(w);
    const subW = SubWord(rotW);
    const kq = XorRcon(subW, j);
    console.log("\tG(" + w.toString(16).toUpperCase() + ") = ");
    ShowWord(kq);
    return kq;
}

function KeyExpansion(Key) {
    const w = new Uint32Array(44);
    w[0] = Key[0];
    w[1] = Key[1];
    w[2] = Key[2];
    w[3] = Key[3];
    
    for (let i = 4; i < 44; i++) {
        if (i % 4 === 0)
            w[i] = G(w[i - 1], i/4) ^ w[i - 4];
        else 
            w[i] = w[i - 1] ^ w[i - 4];
        console.log("w[" + i + "] = ");
        ShowWord(w[i]);
    }
    return w;
}


function AddRoundKey(state, k) {
    const kq = new Uint32Array(4);
    for (let i = 0; i < 4; i++) {
        kq[i] = state[i] ^ k[i];
    }
    
    console.log("Add Round Key");
    for (let i = 0; i < 4; i++) {
        console.log("\t");
        ShowWord(kq[i]);
    }
    return kq;
}

function SubBytes(state) {
    const kq = new Uint32Array(4);
    for (let i = 0; i < 4; i++) {
        kq[i] = SubWord(state[i]);
    }
    console.log("SubBytes");
    for (let i = 0; i < 4; i++) {
        console.log("\t");
        ShowWord(kq[i]);
    }
    return kq;
}

function ShiftRows(state) {
    const kq = new Uint32Array(4);
    for (let i = 0; i < 4; i++) {
        const byte1 = (state[i] >>> 24) & 0xFF;
        const byte2 = (state[(i + 1) % 4] >>> 16) & 0xFF;
        const byte3 = (state[(i + 2) % 4] >>> 8) & 0xFF;
        const byte4 = state[(i + 3) % 4] & 0xFF;

        kq[i] = ((byte1 << 24) | (byte2 << 16) | (byte3 << 8) | byte4) >>> 0;
    }
    console.log("Shift Rows");
    for (let i = 0; i < 4; i++) {
        console.log("\t");
        ShowWord(kq[i]);
    }
    return kq;
}

function Nhan2(w) {
    let kq = w << 1;
    if (kq >= 0x100) 
        kq = kq ^ 0x11B;
    return kq & 0xFF;
}

function Nhan3(w) {
    return (Nhan2(w) ^ w) & 0xFF;
}

function NhanCot(w) {
    const byte1 = (w >>> 24) & 0xFF;
    const byte2 = (w >>> 16) & 0xFF;
    const byte3 = (w >>> 8) & 0xFF;
    const byte4 = w & 0xFF;
    
    const kq1 = Nhan2(byte1) ^ Nhan3(byte2) ^ byte3 ^ byte4;
    const kq2 = byte1 ^ Nhan2(byte2) ^ Nhan3(byte3) ^ byte4;
    const kq3 = byte1 ^ byte2 ^ Nhan2(byte3) ^ Nhan3(byte4);
    const kq4 = Nhan3(byte1) ^ byte2 ^ byte3 ^ Nhan2(byte4);
    
    return ((kq1 << 24) | (kq2 << 16) | (kq3 << 8) | kq4) >>> 0;
}

function MixColumns(state) {
    const kq = new Uint32Array(4);
    console.log("Mix Columns");
    for (let i = 0; i < 4; i++) {
        kq[i] = NhanCot(state[i]);
        console.log("\t");
        ShowWord(kq[i]);
    }
    return kq;
}

function ShowMatrix(w) {
    for (let i = 0; i < 4; i++) {
        console.log("\t");
        ShowWord(w[i]);
    }
}

function MahoaAES(state, key) {
    const w = KeyExpansion(key);
    let temp = AddRoundKey(state, w.slice(0, 4));
    
    for (let j = 1; j <= 9; j++) {
        temp = SubBytes(temp);
        temp = ShiftRows(temp);
        temp = MixColumns(temp);
        temp = AddRoundKey(temp, w.slice(4*j, 4*j + 4));
        
        console.log("Round " + j + ":");
        ShowMatrix(temp);
    }
    
    console.log("Round 10:");
    temp = SubBytes(temp);
    temp = ShiftRows(temp);
    temp = AddRoundKey(temp, w.slice(40, 44));
    
    return temp;
}

// Hàm main và xử lý dữ liệu
function main() {
    // Dữ liệu từ file AES.txt
    const Key = new Uint32Array([
        0x2b7e1516, 0x28aed2a6, 0xabf71588, 0x09cf4f3c
    ]);
    
    const state = new Uint32Array([
        0xCFD61D48, 0x9E7C48BC, 0x46C9F875, 0xC1F04E1B
    ]);

    console.log("Key:");
    ShowMatrix(Key);
    console.log("\nState:");
    ShowMatrix(state);
    
    const C = MahoaAES(state, Key);
    console.log("\nBản mã:");
    ShowMatrix(C);
}

function formatHexWord(word) {
    return word.toString(16).padStart(8, '0').toUpperCase();
}

function addKeyExpansionStep(index, details) {
    const container = document.getElementById('keyExpansionSteps');
    const step = document.createElement('div');
    step.className = 'expansion-step';
    step.innerHTML = `
        <h4>W${index}</h4>
        ${details}
    `;
    container.appendChild(step);
}

function showKeyExpansion(Key) {
    const w = new Uint32Array(44);
    
    // Initial key words
    for(let i = 0; i < 4; i++) {
        w[i] = Key[i] >>> 0;  // Ensure unsigned 32-bit
        addKeyExpansionStep(i, `
            <div class="formula">W${i} = Initial key word ${i}: ${formatHexWord(w[i])}</div>
        `);
    }
    
    // Calculate remaining words
    for(let i = 4; i < 44; i++) {
        let details = '';
        
        if(i % 4 === 0) {
            const temp = w[i-1] >>> 0;
            const rotw = RotWord(temp) >>> 0;
            const subw = SubWord(rotw) >>> 0;
            const rcon = i/4;
            const g = XorRcon(subw, rcon) >>> 0;
            const final = (g ^ w[i-4]) >>> 0;
            
            details = `
                <div class="formula">
                    temp = W${i-1} = ${formatHexWord(temp)}<br>
                    <span class="operation">RotWord</span>(temp) = ${formatHexWord(rotw)}<br>
                    <span class="operation">SubWord</span>(RotWord) = ${formatHexWord(subw)}<br>
                    <span class="operation">XorRcon</span>(${formatHexWord(subw)}, ${rcon}) = ${formatHexWord(g)}<br>
                    W${i} = G(W[${i-1}]) ⊕ W[${i-4}]<br>
                    ${formatHexWord(g)} ⊕ ${formatHexWord(w[i-4])} = ${formatHexWord(final)}
                </div>
            `;
            w[i] = final >>> 0;
        } else {
            const final = (w[i-1] ^ w[i-4]) >>> 0;
            details = `
                <div class="formula">
                    W${i} = W${i-1} ⊕ W${i-4}<br>
                    ${formatHexWord(w[i-1])} ⊕ ${formatHexWord(w[i-4])} = ${formatHexWord(final)}
                </div>
            `;
            w[i] = final >>> 0;
        }
        
        addKeyExpansionStep(i, details);
    }
    
    return w;
}

// Chạy chương trình
main();
