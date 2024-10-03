document.getElementById('naiveButton').addEventListener('click', visualizeNaive);
document.getElementById('resetButton').addEventListener('click', resetVisualizer);

let matchCount = 0; // Initialize match counter

function visualizeNaive() {
  resetVisualizer();
  const inputString = document.getElementById('inputString').value;
  const pattern = document.getElementById('patternString').value;
  let resultMessage = document.getElementById('resultMessage');

  createBoxes(inputString);
  matchCount = 0; // Reset the match counter

  for (let i = 0; i <= inputString.length - pattern.length; i++) {
    setTimeout(() => {
      highlightWindow(i, pattern.length, false);

      if (inputString.substr(i, pattern.length) === pattern) {
        matchCount++; // Increment match counter
        highlightWindow(i, pattern.length, true);
        resultMessage.innerHTML = `Pattern found at index ${i} <br> Total matches: ${matchCount}`;
      }

      // If this is the last iteration and no matches found
      if (i === inputString.length - pattern.length && matchCount === 0) {
        resultMessage.innerHTML = 'Pattern not found!';
      }

    }, i * 1000);
  }
}

function highlightWindow(startIndex, length, isMatch) {
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
      // Turn red and vibrate if not matched, but don't override green ones
      box.classList.add('red', 'vibrate'); 
    }
  }
}

function resetVisualizer() {
  document.getElementById('visualizer').innerHTML = '';
  document.getElementById('resultMessage').innerHTML = '';
  matchCount = 0; // Reset the match counter on reset
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
