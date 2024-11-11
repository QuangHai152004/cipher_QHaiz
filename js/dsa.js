function modPow(base, exp, mod) {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
        if (exp % 2 === 1) {
            result = (result * base) % mod;
        }
        exp = Math.floor(exp / 2);
        base = (base * base) % mod;
    }
    return result;
}

function modInverse(a, mod) {
    a = ((a % mod) + mod) % mod;
    for (let x = 1; x < mod; x++) {
        if ((a * x) % mod === 1) {
            return x;
        }
    }
    return -1;
}

function addStep(text) {
    const steps = document.getElementById('steps');
    const step = document.createElement('div');
    step.className = 'step';
    step.innerHTML = text;
    steps.appendChild(step);
}

function generateKeys() {
    document.getElementById('steps').innerHTML = '';
    document.getElementById('signature').innerHTML = '';
    const p = parseInt(document.getElementById('p').value);
    const q = parseInt(document.getElementById('q').value);
    const h = parseInt(document.getElementById('h').value);
    const xA = parseInt(document.getElementById('xA').value);

    // Calculate g = h^((p-1)/q) mod p
    const g = modPow(h, (p - 1) / q, p);
    addStep(`Calculated g = h<sup>(p-1)/q</sup> mod p = ${g}`);

    // Calculate public key y = g^xA mod p
    const y = modPow(g, xA, p);
    addStep(`Generated public key y = g<sup>xA</sup> mod p = ${y}`);

    document.getElementById('public-key').innerHTML = 
        `y = ${y}<br>g = ${g}<br>p = ${p}<br>q = ${q}`;
}

function sign() {
    document.getElementById('steps').innerHTML = '';
    const p = parseInt(document.getElementById('p').value);
    const q = parseInt(document.getElementById('q').value);
    const h = parseInt(document.getElementById('h').value);
    const xA = parseInt(document.getElementById('xA').value);
    const k = parseInt(document.getElementById('k').value);
    const message = parseInt(document.getElementById('message').value);

    // Calculate g
    const g = modPow(h, (p - 1) / q, p);

    // Calculate r = (g^k mod p) mod q
    const r = modPow(g, k, p) % q;
    addStep(`Calculated r = (g<sup>k</sup> mod p) mod q = ${r}`);

    // Calculate k^-1 mod q
    const kInv = modInverse(k, q);
    addStep(`Calculated k<sup>-1</sup> mod q = ${kInv}`);

    // Calculate s = k^-1(H(M) + xA * r) mod q
    const s = (kInv * (message + xA * r)) % q;
    addStep(`Calculated s = k<sup>-1</sup>(H(M) + xA * r) mod q = ${s}`);

    document.getElementById('signature').innerHTML = 
        `r = ${r}<br>s = ${s}`;
}

function verify() {
    document.getElementById('steps').innerHTML = '';
    const p = parseInt(document.getElementById('p').value);
    const q = parseInt(document.getElementById('q').value);
    const h = parseInt(document.getElementById('h').value);
    const xA = parseInt(document.getElementById('xA').value);
    const message = parseInt(document.getElementById('message').value);
    
    const g = modPow(h, (p - 1) / q, p);
    const y = modPow(g, xA, p);
    
    const signatureDiv = document.getElementById('signature').innerHTML;
    const r = parseInt(signatureDiv.split('<br>')[0].split('= ')[1]);
    const s = parseInt(signatureDiv.split('<br>')[1].split('= ')[1]);

    // Calculate w = s^-1 mod q
    const w = modInverse(s, q);
    addStep(`Calculated w = s<sup>-1</sup> mod q = ${w}`);

    // Calculate u1 = (H(M) * w) mod q
    const u1 = (message * w) % q;
    addStep(`Calculated u1 = (H(M) * w) mod q = ${u1}`);

    // Calculate u2 = (r * w) mod q
    const u2 = (r * w) % q;
    addStep(`Calculated u2 = (r * w) mod q = ${u2}`);

    // Calculate v = ((g^u1 * y^u2) mod p) mod q
    const v = ((modPow(g, u1, p) * modPow(y, u2, p)) % p) % q;
    addStep(`Calculated v = ((g<sup>u1</sup> * y<sup>u2</sup>) mod p) mod q = ${v}`);

    // Verify if v = r
    const isValid = v === r;
    addStep(`Signature is ${isValid ? 'VALID' : 'INVALID'} (v ${v} ${isValid ? '=' : '≠'} r ${r})`);
}
