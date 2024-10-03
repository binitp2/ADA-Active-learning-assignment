document.getElementById('rabinKarpButton').addEventListener('click', visualizeRabinKarp);
document.getElementById('resetButton').addEventListener('click', resetVisualizer);

function visualizeRabinKarp() {
    resetVisualizer();
    const inputString = document.getElementById('inputString').value;
    const pattern = document.getElementById('patternString').value;
    const d = 256; // Number of characters in the input alphabet
    const q = 101; // A prime number for hashing
    const resultMessage = document.getElementById('resultMessage');
    let matchCount = 0; // Initialize match counter
    let found = false;

    createBoxes(inputString);
    let h = 1; 
    let p = 0; // Hash value for pattern
    let t = 0; // Hash value for text window

    // Precompute h = pow(d, M-1) % q
    for (let i = 0; i < pattern.length - 1; i++) h = (h * d) % q;

    // Calculate the hash value of pattern and first window of text
    for (let i = 0; i < pattern.length; i++) {
        p = (d * p + pattern.charCodeAt(i)) % q;
        t = (d * t + inputString.charCodeAt(i)) % q;
    }

    for (let i = 0; i <= inputString.length - pattern.length; i++) {
        setTimeout(() => {
            highlightWindow(i, pattern.length, false);
            showHashes(p, t);

            // Check for hash match
            if (p === t) {
                if (inputString.substr(i, pattern.length) === pattern) {
                    found = true;
                    highlightWindow(i, pattern.length, true);
                    matchCount++; // Increment match counter
                    resultMessage.innerHTML = `Pattern found at index ${i}. Total matches: ${matchCount}`;
                } else {
                    highlightWindow(i, pattern.length, false, true); // Handle hash collision
                }
            }

            // Update the hash value for the next window
            if (i < inputString.length - pattern.length) {
                t = (d * (t - inputString.charCodeAt(i) * h) + inputString.charCodeAt(i + pattern.length)) % q;
                if (t < 0) t += q; // Ensure t is positive
            }
        }, i * 1000);
    }

    if (!found) {
        resultMessage.innerHTML = 'Pattern not found!';
    }
}

function highlightWindow(startIndex, length, isMatch, hashCollision = false) {
    // Remove previous traversal borders
    document.querySelectorAll('.box').forEach(box => {
        box.classList.remove('black-border');
    });

    for (let i = startIndex; i < startIndex + length; i++) {
        const box = document.getElementById(`box-${i}`);
        box.classList.add('black-border'); // Add black border to current window

        if (isMatch) {
            box.classList.add('green'); // Stay green if matched
        } else if (!box.classList.contains('green')) { 
            // Turn red and vibrate if not matched
            box.classList.add('red', 'vibrate'); 
        }
    }
}

function showHashes(patternHash, windowHash) {
    const hashDisplay = document.getElementById('hashDisplay');
    hashDisplay.innerHTML = `Pattern Hash: ${patternHash} | Window Hash: ${windowHash}`;
    hashDisplay.style.opacity = 1; // Show the hash values
}

function resetVisualizer() {
    document.getElementById('visualizer').innerHTML = '';
    document.getElementById('hashDisplay').style.opacity = 0;
    document.getElementById('resultMessage').innerHTML = '';
}

function createBoxes(inputString) {
    const visualizer = document.getElementById('visualizer');
    for (let i = 0; i < inputString.length; i++) {
        const box = document.createElement('div');
        box.classList.add('box');
        box.id = `box-${i}`;
        box.innerHTML = inputString[i];
        visualizer.appendChild(box);
    }
}
