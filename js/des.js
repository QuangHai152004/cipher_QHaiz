
function hexToBinary(hex) {
    let binary = '';
    for (let i = 0; i < hex.length; i++) {
        binary += parseInt(hex[i], 16).toString(2).padStart(4, '0');
    }
    return binary;
}

function binaryToHex(binary) {
    let hex = '';
    for (let i = 0; i < binary.length; i += 4) {
        hex += parseInt(binary.substr(i, 4), 2).toString(16).toUpperCase();
    }
    return hex;
}

function xorBinary(a, b) {
    let result = '';
    for (let i = 0; i < a.length; i++) {
        result += a[i] === b[i] ? '0' : '1';
    }
    return result;
}

// Constants (PC1, PC2, IP, E, P, IP_INV, S-boxes) - same as in your code
const PC1 = [
    57, 49, 41, 33, 25, 17, 9, 1,
    58, 50, 42, 34, 26, 18, 10, 2,
    59, 51, 43, 35, 27, 19, 11, 3,
    60, 52, 44, 36, 63, 55, 47, 39,
    31, 23, 15, 7, 62, 54, 46, 38,
    30, 22, 14, 6, 61, 53, 45, 37,
    29, 21, 13, 5, 28, 20, 12, 4
];

const PC2 = [
    14, 17, 11, 24, 1, 5, 3, 28,
    15, 6, 21, 10, 23, 19, 12, 4,
    26, 8, 16, 7, 27, 20, 13, 2,
    41, 52, 31, 37, 47, 55, 30, 40,
    51, 45, 33, 48, 44, 49, 39, 56,
    34, 53, 46, 42, 50, 36, 29, 32
];

const IP = [
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6,
    64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17, 9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7
];

const E = [
    32, 1, 2, 3, 4, 5,
    4, 5, 6, 7, 8, 9,
    8, 9, 10, 11, 12, 13,
    12, 13, 14, 15, 16, 17,
    16, 17, 18, 19, 20, 21,
    20, 21, 22, 23, 24, 25,
    24, 25, 26, 27, 28, 29,
    28, 29, 30, 31, 32, 1
];

const P = [
    16, 7, 20, 21, 29, 12, 28, 17,
    1, 15, 23, 26, 5, 18, 31, 10,
    2, 8, 24, 14, 32, 27, 3, 9,
    19, 13, 30, 6, 22, 11, 4, 25
];

const IP_INV = [
    40, 8, 48, 16, 56, 24, 64, 32,
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28,
    35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26,
    33, 1, 41, 9, 49, 17, 57, 25
];

const S = [
    [
        [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
        [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
        [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
        [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
    ],
    [
        [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
        [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
        [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
        [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
    ],
    [
        [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
        [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
        [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
        [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
    ],
    [
        [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
        [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
        [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
        [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
    ],
    [
        [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
        [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
        [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
        [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
    ],
    [
        [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
        [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
        [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
        [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
    ],
    [
        [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
        [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
        [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
        [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
    ],
    [
        [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
        [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
        [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
        [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
    ]
];

function performPC1(key) {
    let binaryKey = hexToBinary(key);
    let permuted = '';
    for (let i = 0; i < 56; i++) {
        permuted += binaryKey[PC1[i] - 1];
    }
    return [permuted.substr(0, 28), permuted.substr(28, 28)];
}

function leftCircularShift(s, shift) {
    return s.substr(shift) + s.substr(0, shift);
}

function generateSubkey(C, D) {
    let combined = C + D;
    let subkey = '';
    for (let i = 0; i < 48; i++) {
        subkey += combined[PC2[i] - 1];
    }
    return subkey;
}

function performIP(message) {
    let binaryMsg = hexToBinary(message);
    let permuted = '';
    for (let i = 0; i < 64; i++) {
        permuted += binaryMsg[IP[i] - 1];
    }
    return [permuted.substr(0, 32), permuted.substr(32, 32)];
}

function expandR(R) {
    let expanded = '';
    for (let i = 0; i < 48; i++) {
        expanded += R[E[i] - 1];
    }
    return expanded;
}

function sBoxSubstitution(input) {
    let output = '';
    for (let i = 0; i < 8; i++) {
        let block = input.substr(i * 6, 6);
        let row = parseInt(block[0] + block[5], 2);
        let col = parseInt(block.substr(1, 4), 2);
        let val = S[i][row][col];
        output += val.toString(2).padStart(4, '0');
    }
    return output;
}

function performP(input) {
    let output = '';
    for (let i = 0; i < 32; i++) {
        output += input[P[i] - 1];
    }
    return output;
}

function performFinalPermutation(combined) {
    let output = '';
    for (let i = 0; i < 64; i++) {
        output += combined[IP_INV[i] - 1];
    }
    return output;
}

function addStep(title, content) {
    const stepsContainer = document.getElementById('steps');
    const step = document.createElement('div');
    step.className = 'step';
    step.innerHTML = `
        <h3>${title}</h3>
        <pre>${content}</pre>
    `;
    stepsContainer.appendChild(step);
}

function startEncryption() {
    // Clear previous steps
    document.getElementById('steps').innerHTML = '';

    // Get input values
    const key = document.getElementById('key').value;
    const plaintext = document.getElementById('plaintext').value;

    // Validate input
    if (!/^[0-9A-Fa-f]{16}$/.test(key) || !/^[0-9A-Fa-f]{16}$/.test(plaintext)) {
        alert('Please enter valid 64-bit hexadecimal values (16 characters)');
        return;
    }

    // Step 1: Initial key processing
    const [C0, D0] = performPC1(key);
    addStep('Initial Key Processing',
        `Key (hex): ${key}\n` +
        `Key (binary): ${hexToBinary(key)}\n` +
        `After PC-1:\n` +
        `C0: ${C0}\n` +
        `D0: ${D0}`
    );

    // Step 2: Initial permutation of plaintext
    const [L0, R0] = performIP(plaintext);
    addStep('Initial Permutation',
        `Plaintext (hex): ${plaintext}\n` +
        `Plaintext (binary): ${hexToBinary(plaintext)}\n` +
        `After IP:\n` +
        `L0: ${L0}\n` +
        `R0: ${R0}`
    );

    // Step 3: Generate and show all subkeys
    let C = C0;
    let D = D0;
    const shifts = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
    const subkeys = [];

    for (let i = 0; i < 16; i++) {
        C = leftCircularShift(C, shifts[i]);
        D = leftCircularShift(D, shifts[i]);
        const subkey = generateSubkey(C, D);
        subkeys.push(subkey);
        addStep(`Subkey ${i + 1}`,
            `C${i + 1}: ${C}\n` +
            `D${i + 1}: ${D}\n` +
            `K${i + 1}: ${subkey}`
        );
    }

    // Step 4: Main rounds
    let L = L0;
    let R = R0;

    for (let i = 0; i < 16; i++) {
        const ER = expandR(R);
        const A = xorBinary(ER, subkeys[i]);
        const B = sBoxSubstitution(A);
        const F = performP(B);
        const newR = xorBinary(L, F);
        L = R;
        R = newR;

        addStep(`Round ${i + 1}`,
            `Expansion E(R${i}): ${ER}\n` +
            `XOR with K${i + 1}: ${A}\n` +
            `S-box output: ${B}\n` +
            `P-box output: ${F}\n` +
            `L${i + 1}: ${L}\n` +
            `R${i + 1}: ${R}`
        );
    }

    // Step 5: Final permutation
    const preOutput = R + L;  // Note the swap
    const output = performFinalPermutation(preOutput);
    const ciphertext = binaryToHex(output);

    addStep('Final Result',
        `Pre-output block: ${preOutput}\n` +
        `After final permutation: ${output}\n` +
        `Ciphertext (hex): ${ciphertext}`
    );
}