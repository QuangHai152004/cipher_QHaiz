function modulo(a, b, m) {
    let res = 1n;
    a = BigInt(a) % BigInt(m);
    b = BigInt(b);
    while (b > 0) {
        if (b % 2n === 1n) {
            res = (res * a) % BigInt(m);
        }
        b = b / 2n;
        a = (a * a) % BigInt(m);
    }
    return res;
}

function modInverse(a, m) {
    a = BigInt(a);
    m = BigInt(m);
    let m0 = m;
    let x0 = 0n;
    let x1 = 1n;
    
    if (m === 1n) return 0n;
    
    while (a > 1n) {
        const q = a / m;
        let t = m;
        m = a % m;
        a = t;
        t = x0;
        x0 = x1 - q * x0;
        x1 = t;
    }
    
    if (x1 < 0n) x1 += m0;
    return x1;
}

function clearSteps() {
    document.getElementById('steps').innerHTML = '';
    document.getElementById('public-key').innerHTML = '';
    document.getElementById('private-key').innerHTML = '';
}

function generateKeys() {
    clearSteps();
    const q = BigInt(document.getElementById('q').value);
    const a = BigInt(document.getElementById('a').value);
    const x = BigInt(document.getElementById('x').value);
    
    const y = modulo(a, x, q);
    
    document.getElementById('public-key').innerHTML = 
        `{q = ${q}, a = ${a}, y = ${y}}`;
    document.getElementById('private-key').innerHTML = 
        `{x = ${x}}`;
        
    addStep('Key Generation', `Public Key (PU): {q = ${q}, a = ${a}, y = ${y}}<br>Private Key (PR): {x = ${x}}`);
}

function encryptMessage() {
    clearSteps();
    const q = BigInt(document.getElementById('q').value);
    const a = BigInt(document.getElementById('a').value);
    const y = modulo(a, document.getElementById('x').value, q);
    const k = BigInt(document.getElementById('k').value);
    const M = BigInt(document.getElementById('message').value);
    
    const C1 = modulo(a, k, q);
    const C2 = (M * modulo(y, k, q)) % q;
    
    addStep('Encryption', `C1 = ${C1}<br>C2 = ${C2}`);
}

function decryptMessage() {
    clearSteps();
    const q = BigInt(document.getElementById('q').value);
    const x = BigInt(document.getElementById('x').value);
    const C1 = modulo(document.getElementById('a').value, document.getElementById('k').value, q);
    const C2 = (BigInt(document.getElementById('message').value) * 
                modulo(modulo(document.getElementById('a').value, document.getElementById('x').value, q), 
                       document.getElementById('k').value, q)) % q;
    
    const C1_inv = modInverse(C1, q);
    const M = (C2 * modulo(C1_inv, x, q)) % q;
    
    addStep('Decryption', `M = ${M}`);
}

function addStep(title, content) {
    const stepsDiv = document.getElementById('steps');
    const step = document.createElement('div');
    step.className = 'step';
    step.innerHTML = `<h3>${title}</h3><p>${content}</p>`;
    stepsDiv.appendChild(step);
}
