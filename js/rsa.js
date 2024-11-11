// Utility functions
function computeGCD(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

function computeModInverse(e, phi) {
    let [m0, y, x] = [phi, 0, 1];

    if (phi === 1) return 0;

    while (e > 1) {
        const q = Math.floor(e / phi);
        [e, phi] = [phi, e % phi];
        [x, y] = [y, x - q * y];
    }

    return x < 0 ? x + m0 : x;
}

function modularExponentiation(base, exp, mod) {
    let result = 1n;
    base = BigInt(base) % BigInt(mod);
    exp = BigInt(exp);
    mod = BigInt(mod);

    while (exp > 0n) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exp = exp / 2n;
    }
    return Number(result);
}

// Global variables for RSA keys
let rsaN = 0;
let rsaE = 0;
let rsaD = 0;

function addStep(title, content, type) {
    const stepId = `${type}-steps`;
    // Clear the specific step container
    document.getElementById(stepId).innerHTML = '';
    
    const step = document.createElement('div');
    step.className = 'step';
    step.innerHTML = `
        <h3>${title}</h3>
        <pre>${content}</pre>
    `;
    document.getElementById(stepId).appendChild(step);
}

function generateKeys() {
    // Clear key generation steps only
    document.getElementById('key-generation-steps').innerHTML = '';
    
    // Get input values
    const p = parseInt(document.getElementById('p').value);
    const q = parseInt(document.getElementById('q').value);
    const e = parseInt(document.getElementById('e').value);

    // Calculate n and phi
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    
    // Calculate private key d
    const d = computeModInverse(e, phi);

    // Store globally
    rsaN = n;
    rsaE = e;
    rsaD = d;

    // Display keys
    document.getElementById('public-key').innerHTML = `
        e = ${e}<br>
        n = ${n}
    `;
    document.getElementById('private-key').innerHTML = `
        d = ${d}<br>
        n = ${n}
    `;

    addStep('Key Generation', 
        `Prime numbers selected:
p = ${p}
q = ${q}

Calculating n = p * q:
n = ${p} * ${q} = ${n}

Calculating φ(n) = (p-1) * (q-1):
φ(n) = ${p-1} * ${q-1} = ${phi}

Public exponent e = ${e}
Private exponent d = ${d}`,
        'key-generation'
    );
}

function encryptMessage() {
    const message = parseInt(document.getElementById('message').value);
    
    if (!rsaN || !rsaE) {
        alert('Please generate keys first!');
        return;
    }

    const ciphertext = modularExponentiation(message, rsaE, rsaN);

    addStep('Encryption',
        `Message (M) = ${message}

Encrypting using public key:
C = M^e mod n
C = ${message}^${rsaE} mod ${rsaN}
C = ${ciphertext}`,
        'encryption'
    );

    return ciphertext;
}

function decryptMessage() {
    const ciphertext = parseInt(document.getElementById('message').value);
    
    if (!rsaN || !rsaD) {
        alert('Please generate keys first!');
        return;
    }

    const decrypted = modularExponentiation(ciphertext, rsaD, rsaN);

    addStep('Decryption',
        `Ciphertext (C) = ${ciphertext}

Decrypting using private key:
M = C^d mod n
M = ${ciphertext}^${rsaD} mod ${rsaN}
M = ${decrypted}`,
        'decryption'
    );
}