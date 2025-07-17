const display = document.querySelector('.display');
const startBtn = document.querySelector('.start');
const lapBtn = document.querySelector('.lap');
const resetBtn = document.querySelector('.reset');
const laps = document.querySelector('.laps');

let startTime = 0;
let elapsedTime = 0;
let interval = null;
let isRunning = false;

let lastLapTime = 0;
let lapCount = 0;
const lapTimes = [];

function formatTime(ms) {
    const date = new Date(ms);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const centiseconds = String(Math.floor(date.getUTCMilliseconds() / 10)).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}.${centiseconds}`;
}

function updateDisplay() {
    display.textContent = formatTime(elapsedTime);
}

function startStopwatch() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        interval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateDisplay();
        }, 10);
        startBtn.textContent = 'Pause';
        isRunning = true;
    } else {
        clearInterval(interval);
        startBtn.textContent = 'Start';
        isRunning = false;
    }
}

function resetStopwatch() {
  clearInterval(interval);
  elapsedTime = 0;
  updateDisplay();
  startBtn.textContent = 'Start';
  isRunning = false;
  document.querySelector('.laps tbody').innerHTML = '';
  lastLapTime = 0;
  lapCount = 0;
  lapTimes.length = 0;

  // 🔄 Clear summary text
  document.getElementById('fastest').textContent = 'Fastest: -';
  document.getElementById('slowest').textContent = 'Slowest: -';
}


function recordLap() {
  if (!isRunning) return;

  const lapTableBody = document.querySelector('.laps tbody');
  lapCount++;

  const total = elapsedTime;
  const lapTime = total - lastLapTime;
  lastLapTime = total;

  lapTimes.push({ lap: lapCount, time: lapTime }); // store objects

  // Create table row
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${lapCount}</td>
    <td>${formatTime(lapTime)}</td>
    <td>${formatTime(total)}</td>
  `;
  lapTableBody.insertBefore(row, lapTableBody.firstChild);

  // Remove previous highlight classes
  Array.from(lapTableBody.children).forEach(row => {
    row.classList.remove('fastest', 'slowest');
  });

  // Identify fastest and slowest
  let fastest = lapTimes[0];
  let slowest = lapTimes[0];

  for (let lap of lapTimes) {
    if (lap.time < fastest.time) fastest = lap;
    if (lap.time > slowest.time) slowest = lap;
  }

  
  Array.from(lapTableBody.children).forEach((row, index) => {
  const thisLap = lapTimes[lapTimes.length - 1 - index]; // newest lap is at top

  if (thisLap.lap === fastest.lap) {
    row.classList.add('fastest');
  }
  if (thisLap.lap === slowest.lap) {
    row.classList.add('slowest');
  }
});


  document.getElementById('fastest').textContent = `Fastest: Lap ${fastest.lap} - ${formatTime(fastest.time)}`;
  document.getElementById('slowest').textContent = `Slowest: Lap ${slowest.lap} - ${formatTime(slowest.time)}`;
}

document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  document.getElementById('theme-toggle').textContent = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
});



startBtn.addEventListener('click', startStopwatch);
resetBtn.addEventListener('click', resetStopwatch);
lapBtn.addEventListener('click', recordLap);
