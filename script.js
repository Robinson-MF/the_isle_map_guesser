const MAP_BASE_WIDTH = 2048;
const MAP_BASE_HEIGHT = 2048;
const images = [
  { img: 'images/guess_1.jpg', x: 535, y: 1028 },
  { img: 'images/guess_2.jpg', x: 556, y: 1298 },
  { img: 'images/guess_3.jpg', x: 664, y: 1271 },
  { img: 'images/guess_4.jpg', x: 1252, y: 1184 },
  { img: 'images/guess_5.jpg', x: 1365, y: 735 },
  { img: 'images/guess_6.jpg', x: 855, y: 284 },
  { img: 'images/guess_2.jpg', x: 122, y: 156 },
];
const clueImage = document.getElementById('clue-image');
const map = document.getElementById('map');
const submitBtn = document.getElementById('submit-btn');
const scoreDiv = document.getElementById('score');
const resultDiv = document.getElementById('result');
const markerOverlay = document.getElementById('marker-overlay');

// Funciones para obtener el tamaño actual del mapa (responsivo)
function getMapSize() {
  return map.offsetWidth;
}
function getMapRefSize() {
  return map.offsetWidth;
}
let currentImageIndex = 0;
let guess = null;
let score = 0;
let canGuess = true;
let remainingImages = [];
let totalImages = images.length;
let guessedCount = 0;
let gameFinished = false;
let distanceStats = { under25: 0, under50: 0, under100: 0, fail: 0 };

function updateProgress() {
  // Mueve el progreso arriba de la imagen a adivinar
  let progress = document.getElementById('progress-text');
  if (!progress) {
    progress = document.createElement('div');
    progress.id = 'progress-text';
    progress.style = 'font-size:1.1rem;font-weight:bold;margin:8px 0 4px 0;color:#ffd166;text-align:center;';
    // Insertar justo antes de la imagen a adivinar
    const clueImg = document.getElementById('clue-image');
    clueImg.parentNode.insertBefore(progress, clueImg);
  }
  progress.textContent = `(${guessedCount}/${totalImages})`;
}

function startGame() {
  score = 0;
  guessedCount = 0;
  canGuess = true;
  gameFinished = false;
  remainingImages = images.map((_, i) => i);
  distanceStats = { under25: 0, under50: 0, under100: 0, fail: 0 };
  updateProgress();
  clueImage.style.display = '';
  scoreDiv.textContent = `${texts[lang].score}: ${score}`;
  scoreDiv.innerHTML += `<div id='score-details' class='score-details'></div>`;
  loadImage();
}

function getRandomImageIndexNoRepeat() {
  if (remainingImages.length === 0) return null;
  const idx = Math.floor(Math.random() * remainingImages.length);
  const imageIdx = remainingImages[idx];
  remainingImages.splice(idx, 1);
  return imageIdx;
}

function updateOverlaySize() {
  // Ajusta el overlay al tamaño y posición del mapa
  const rect = map.getBoundingClientRect();
  markerOverlay.style.width = map.offsetWidth + 'px';
  markerOverlay.style.height = map.offsetHeight + 'px';
  markerOverlay.style.left = map.offsetLeft + 'px';
  markerOverlay.style.top = map.offsetTop + 'px';
}
window.addEventListener('resize', updateOverlaySize);
window.addEventListener('DOMContentLoaded', () => {
  // Ya no insertes el progreso arriba del título
  startGame();
  updateOverlaySize();
});

map.addEventListener('click', e => {
  if (!canGuess) return;
  updateOverlaySize();
  const rect = map.getBoundingClientRect();
  // Convertir el click a la escala base del mapa
  const x = ((e.clientX - rect.left) / rect.width) * MAP_BASE_WIDTH;
  const y = ((e.clientY - rect.top) / rect.height) * MAP_BASE_HEIGHT;
  guess = { x, y };
  clearMarkers();
  // Para mostrar el marcador en la posición correcta en pantalla:
  const markerX = (x / MAP_BASE_WIDTH) * map.offsetWidth;
  const markerY = (y / MAP_BASE_HEIGHT) * map.offsetHeight;
  placeMarker(markerX, markerY);
  // Mostrar coordenadas en consola en escala base
  console.log(`Coordenadas para array: x: ${Math.round(x)}, y: ${Math.round(y)}`);
});

const texts = {
  es: {
    title: '¿Dónde está este lugar?',
    desc1: 'Haz clic en el mapa para adivinar la ubicación de la imagen mostrada.',
    desc2: '¡Intenta adivinar lo más cerca posible!',
    send: 'Enviar',
    next: 'Siguiente',
    score: 'Puntuación',
    distance: 'Distancia',
    points: 'Puntos obtenidos',
    alert: 'Haz clic en el mapa para adivinar primero.',
    support: 'Para poder mantener el juego activo, por favor apoya al proyecto en <a href="https://paypal.me/RobinsonFredes" target="_blank" style="color:#7fffa6;text-decoration:underline;font-weight:bold;">PayPal</a> o <a href="https://ko-fi.com/robinsonfredes" target="_blank" style="color:#ffd166;text-decoration:underline;font-weight:bold;">Ko-fi</a>.'
  },
  en: {
    title: 'Where is this place?',
    desc1: 'Click on the map to guess the location of the shown image.',
    desc2: 'Try to guess as close as possible!',
    send: 'Submit',
    next: 'Next',
    score: 'Score',
    distance: 'Distance',
    points: 'Points earned',
    alert: 'Click on the map to make a guess first.',
    support: 'If you enjoy the game, please consider supporting the project on <a href="https://paypal.me/RobinsonFredes" target="_blank" style="color:#7fffa6;text-decoration:underline;font-weight:bold;">PayPal</a> or <a href="https://ko-fi.com/robinsonfredes" target="_blank" style="color:#ffd166;text-decoration:underline;font-weight:bold;">Ko-fi</a>.'
  }
};
let lang = 'es';
function setLanguage(l) {
  lang = l;
  document.getElementById('title-text').className = 'desc-text';
  document.getElementById('title-text').textContent = texts[lang].title;
  document.getElementById('desc1-text').className = 'desc-text';
  document.getElementById('desc1-text').textContent = texts[lang].desc1;
  document.getElementById('desc2-text').className = 'desc-text';
  document.getElementById('desc2-text').textContent = texts[lang].desc2;
  scoreDiv.textContent = `${texts[lang].score}: ${score}`;
  scoreDiv.innerHTML += `<div id='score-details' class='score-details'></div>`;
  document.getElementById('support-message').className = 'support-message';
  document.getElementById('support-message').innerHTML = texts[lang].support;
  if (submitBtn.textContent === texts['es'].send || submitBtn.textContent === texts['en'].send) {
    submitBtn.textContent = texts[lang].send;
  } else if (gameFinished) {
    submitBtn.textContent = lang === 'es' ? 'Reiniciar' : 'Restart';
    // Volver a mostrar el resumen final en el idioma correcto
    let resumen = `<div id='score-details' class='score-details' style='text-align:center;'>`;
    if (lang === 'es') {
      resumen += `Tu puntuación final es: <strong style='color:#fff;font-size:1.7rem;'>${score}</strong></div>`;
      resumen += `<div class='distance-summary' style='margin:12px auto 0 auto;text-align:center;display:inline-block;font-size:1.1rem;color:#ffd166;'>`;
      resumen += `Ubicaciones acertadas a menos de 25 metros: <strong style='color:rgba(60,200,60,0.85);'>${distanceStats.under25}</strong><br>`;
      resumen += `Ubicaciones acertadas a menos de 50 metros: <strong style='color:rgba(255,220,50,0.85);'>${distanceStats.under50}</strong></span><br>`;
      resumen += `Ubicaciones acertadas a menos de 100 metros: <strong style='color:rgba(255,140,0,0.85);'>${distanceStats.under100}</strong></span><br>`;
      resumen += `Ubicaciones no acertadas: <strong style='color:rgba(220,40,40,0.85);'>${distanceStats.fail}</strong></span>`;
      resumen += `</div>`;
    } else {
      resumen += `Your final score is: <strong style='color:#fff;font-size:1.7rem;'>${score}</strong></div>`;
      resumen += `<div class='distance-summary' style='margin:12px auto 0 auto;text-align:center;display:inline-block;font-size:1.1rem;color:#ffd166;'>`;
      resumen += `Locations guessed under 25 meters: <strong style='color:rgba(60,200,60,0.85);'>${distanceStats.under25}</strong><br>`;
      resumen += `Locations guessed under 50 meters: <strong style='color:rgba(255,220,50,0.85);'>${distanceStats.under50}</strong><br>`;
      resumen += `Locations guessed under 100 meters: <strong style='color:rgba(255,140,0,0.85);'>${distanceStats.under100}</strong><br>`;
      resumen += `Locations not guessed: <strong style='color:rgba(220,40,40,0.85);'>${distanceStats.fail}</strong>`;
      resumen += `</div>`;
    }
    scoreDiv.innerHTML = resumen;
  } else {
    submitBtn.textContent = texts[lang].next;
  }
  // No mostrar resultado en resultDiv, solo en score-details
}
document.getElementById('lang-es').onclick = () => setLanguage('es');
document.getElementById('lang-en').onclick = () => setLanguage('en');

function getRandomImageIndex() {
  let available = images.map((_, i) => i).filter(i => !lastImages.includes(i));
  if (available.length === 0) {
    // Si ya salieron todas en los últimos 3 ciclos, resetea la lista menos la última
    lastImages = lastImages.slice(-2);
    available = images.map((_, i) => i).filter(i => !lastImages.includes(i));
  }
  const idx = available[Math.floor(Math.random() * available.length)];
  lastImages.push(idx);
  if (lastImages.length > 3) lastImages.shift();
  return idx;
}

function loadImage() {
  if (remainingImages.length === 0) {
    gameFinished = true;
    clearMarkers();
    resultDiv.innerHTML = '';
    // Mostrar solo la puntuación final, ocultar el label de puntuación
    let resumen = `<div id='score-details' class='score-details' style='text-align:center;'>`;
    if (lang === 'es') {
      resumen += `Tu puntuación final es: <strong style='color:#fff;font-size:1.7rem;'>${score}</strong></div>`;
      resumen += `<div class='distance-summary' style='margin:12px auto 0 auto;text-align:center;display:inline-block;font-size:1.1rem;color:#ffd166;'>`;
      resumen += `Ubicaciones acertadas a menos de 25 metros: <strong style='color:rgba(60,200,60,0.85);'>${distanceStats.under25}</strong></span><br>`;
      resumen += `Ubicaciones acertadas a menos de 50 metros: <strong style='color:rgba(255,220,50,0.85);'>${distanceStats.under50}</strong></span><br>`;
      resumen += `Ubicaciones acertadas a menos de 100 metros: <strong style='color:rgba(255,140,0,0.85);'>${distanceStats.under100}</strong></span><br>`;
      resumen += `Ubicaciones no acertadas: <strong style='color:rgba(220,40,40,0.85);'>${distanceStats.fail}</strong></span>`;
      resumen += `</div>`;
    } else {
      resumen += `Your final score is: <strong style='color:#fff;font-size:1.7rem;'>${score}</strong></div>`;
      resumen += `<div class='distance-summary' style='margin:12px auto 0 auto;text-align:center;display:inline-block;font-size:1.1rem;color:#ffd166;'>`;
      resumen += `Locations guessed under 25 meters: <strong style='color:rgba(60,200,60,0.85);'>${distanceStats.under25}</strong><br>`;
      resumen += `Locations guessed under 50 meters: <strong style='color:rgba(255,220,50,0.85);'>${distanceStats.under50}</strong><br>`;
      resumen += `Locations guessed under 100 meters: <strong style='color:rgba(255,140,0,0.85);'>${distanceStats.under100}</strong><br>`;
      resumen += `Locations not guessed: <strong style='color:rgba(220,40,40,0.85);'>${distanceStats.fail}</strong>`;
      resumen += `</div>`;
    }
    scoreDiv.innerHTML = resumen;
    submitBtn.textContent = lang === 'es' ? 'Reiniciar' : 'Restart';
    submitBtn.disabled = false;
    updateProgress();
    return;
  }
  currentImageIndex = getRandomImageIndexNoRepeat();
  const { img } = images[currentImageIndex];
  clueImage.removeAttribute('style');
  clueImage.style.display = '';
  clueImage.src = img;
  clueImage.onerror = function() {
    clueImage.style.display = 'none';
    clueImage.alt = 'No se pudo cargar la imagen: ' + img;
    alert('No se pudo cargar la imagen: ' + img + '\nVerifica que la ruta y el nombre sean correctos.');
  };
  guess = null;
  clearMarkers();
  resultDiv.textContent = '';
  scoreDiv.textContent = `${texts[lang].score}: ${score}`;
  scoreDiv.innerHTML += `<div id='score-details' class='score-details'></div>`;
  submitBtn.textContent = texts[lang].send;
  submitBtn.disabled = false;
  canGuess = true;
  updateProgress();
}

submitBtn.addEventListener('click', () => {
  if (gameFinished) {
    startGame();
    return;
  }
  if (submitBtn.textContent === texts[lang].next) {
    guessedCount++;
    loadImage();
    canGuess = true;
    return;
  }
  if (!guess) return alert(texts[lang].alert);
  // Convertir coordenadas reales a la escala visual actual
  const real = images[currentImageIndex];
  const realX = (real.x / MAP_BASE_WIDTH) * map.offsetWidth;
  const realY = (real.y / MAP_BASE_HEIGHT) * map.offsetHeight;
  placeMarker(realX, realY, true);
  drawLine((guess.x / MAP_BASE_WIDTH) * map.offsetWidth, (guess.y / MAP_BASE_HEIGHT) * map.offsetHeight, realX, realY);
  const dist = calculateDistance(guess.x, guess.y, real.x, real.y);
  const points = calculatePoints(dist);
  score += points;
  // Contador de distancias
  if (dist < 25) distanceStats.under25++;
  else if (dist < 50) distanceStats.under50++;
  else if (dist < 100) distanceStats.under100++;
  else distanceStats.fail++;
  scoreDiv.textContent = `${texts[lang].score}: ${score}`;
  scoreDiv.innerHTML += `<div id='score-details' class='score-details'>${texts[lang].distance}: <span style='color:#ffd166'>${Math.round(dist)} metros</span><br>${texts[lang].points}: <strong style='color:#fff;font-size:1.7rem;'>${points}</strong></div>`;
  resultDiv.innerHTML = '';
  submitBtn.textContent = texts[lang].next;
  submitBtn.disabled = false;
  canGuess = false;
});

function clearMarkers() {
  markerOverlay.innerHTML = '';
  document.querySelectorAll('svg.guess-line').forEach(e => e.remove());
}
function placeMarker(x, y, isReal = false) {
  const marker = document.createElement('div');
  marker.className = 'marker';
  if (isReal) marker.classList.add('real-marker');
  marker.style.left = `${x}px`;
  marker.style.top = `${y}px`;
  markerOverlay.appendChild(marker);
}
function drawLine(x1, y1, x2, y2) {
  // Línea sigue en el mapa para no superponer el overlay
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.classList.add('guess-line');
  svg.setAttribute('width', map.offsetWidth);
  svg.setAttribute('height', map.offsetHeight);
  svg.setAttribute('style', `position:absolute;top:0;left:0;width:${map.offsetWidth}px;height:${map.offsetHeight}px;pointer-events:none;`);
  const line = document.createElementNS(svgNS, 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('stroke', '#ffd166');
  line.setAttribute('stroke-width', '3');
  svg.appendChild(line);
  map.appendChild(svg);
}
function calculateDistance(x1, y1, x2, y2) {
  // Devuelve la distancia en la escala base (px)
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
function calculatePoints(distance) {
  if (distance < 25) return 5;
  if (distance < 50) return 3;
  if (distance < 100) return 1;
  return 0;
}
loadImage();
updateOverlaySize();
