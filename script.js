const MAP_BASE_WIDTH = 2048;
const MAP_BASE_HEIGHT = 2048;
const images = [
  { img: 'images/guess_imgs/guess_1.jpg', x: 535, y: 1028 },
  { img: 'images/guess_imgs/guess_2.jpg', x: 556, y: 1298 },
  { img: 'images/guess_imgs/guess_3.jpg', x: 664, y: 1271 },
  { img: 'images/guess_imgs/guess_4.jpg', x: 1252, y: 1184 },
  { img: 'images/guess_imgs/guess_5.jpg', x: 1365, y: 735 },
  { img: 'images/guess_imgs/guess_6.jpg', x: 855, y: 284 },
  { img: 'images/guess_imgs/guess_7.jpg', x: 1141, y: 658 },
  { img: 'images/guess_imgs/guess_8.jpg', x: 1773, y: 676 },
  { img: 'images/guess_imgs/guess_9.jpg', x: 1047, y: 1083 },
  { img: 'images/guess_imgs/guess_10.jpg', x: 432, y: 790 },
  { img: 'images/guess_imgs/guess_11.jpg', x: 1244, y: 795 },
  { img: 'images/guess_imgs/guess_12.jpg', x: 1385, y: 844 },
  { img: 'images/guess_imgs/guess_13.jpg', x: 1715, y: 750 },
  { img: 'images/guess_imgs/guess_14.jpg', x: 1731, y: 597 },
  { img: 'images/guess_imgs/guess_15.jpg', x: 1270, y: 340 },
  { img: 'images/guess_imgs/guess_16.jpg', x: 1159, y: 393 },
  { img: 'images/guess_imgs/guess_17.jpg', x: 688, y: 946 },
  { img: 'images/guess_imgs/guess_18.jpg', x: 820, y: 763 },
  { img: 'images/guess_imgs/guess_19.jpg', x: 986, y: 357 },
  { img: 'images/guess_imgs/guess_20.jpg', x: 918, y: 1737 },
  { img: 'images/guess_imgs/guess_21.jpg', x: 1079, y: 866 },
  { img: 'images/guess_imgs/guess_22.jpg', x: 1328, y: 847 },
  { img: 'images/guess_imgs/guess_23.jpg', x: 1807, y: 788 },
  { img: 'images/guess_imgs/guess_24.jpg', x: 1351, y: 1127 },
  { img: 'images/guess_imgs/guess_25.jpg', x: 1128, y: 1291 },
  { img: 'images/guess_imgs/guess_26.jpg', x: 974, y: 1193 },
  { img: 'images/guess_imgs/guess_27.jpg', x: 817, y: 478 },
  { img: 'images/guess_imgs/guess_28.jpg', x: 900, y: 374 },
  { img: 'images/guess_imgs/guess_29.jpg', x: 1207, y: 207 },
  { img: 'images/guess_imgs/guess_30.jpg', x: 1463, y: 323 },
  { img: 'images/guess_imgs/guess_31.jpg', x: 1496, y: 614 },
  { img: 'images/guess_imgs/guess_32.jpg', x: 1153, y: 1104 },
  { img: 'images/guess_imgs/guess_33.jpg', x: 432, y: 794 },
  { img: 'images/guess_imgs/guess_34.jpg', x: 1196, y: 739 },
  { img: 'images/guess_imgs/guess_35.jpg', x: 1470, y: 1085 },
  { img: 'images/guess_imgs/guess_36.jpg', x: 1607, y: 1680 },
  { img: 'images/guess_imgs/guess_37.jpg', x: 1024, y: 622 },
  { img: 'images/guess_imgs/guess_38.jpg', x: 1159, y: 380 },
  { img: 'images/guess_imgs/guess_39.jpg', x: 1375, y: 562 },
  { img: 'images/guess_imgs/guess_40.jpg', x: 696, y: 1105 },
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
let totalImages = 10; // Siempre 10 rondas
let guessedCount = 0;
let gameFinished = false;
let distanceStats = { under25: 0, under50: 0, under75: 0, under100: 0 };
let preGame = true; // Nueva bandera para la fase de "Comenzar"

// Nuevo: array de imágenes para la partida
let gameImages = [];

function getRandomImages(arr, n) {
  // Devuelve un array con n elementos aleatorios de arr, sin repetidos
  const copy = arr.slice();
  const result = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return result;
}

function updateProgress() {
  let progress = document.getElementById('progress-text');
  let timerDiv = document.getElementById('timer-div');
  if (!progress) {
    progress = document.createElement('div');
    progress.id = 'progress-text';
    progress.style = 'color:#ffd166;font-size:1.3rem;font-weight:bold;margin:10px 0;text-align:center;';
    clueImage.parentNode.insertBefore(progress, clueImage);
  }
  if (preGame) {
    progress.textContent = '';
  } else {
    progress.textContent = `(${guessedCount + 1}/${totalImages})`;
  }
  // Crear contenedor inline-flex para alinear contador y temporizador
  let progressTimerWrap = document.getElementById('progress-timer-wrap');
  if (!progressTimerWrap) {
    progressTimerWrap = document.createElement('div');
    progressTimerWrap.id = 'progress-timer-wrap';
    progressTimerWrap.style = 'display:inline-flex;align-items:center;justify-content:center;width:100%;margin-bottom:4px;';
    progress.parentNode.insertBefore(progressTimerWrap, progress);
    progressTimerWrap.appendChild(progress);
  } else if (progress.parentNode !== progressTimerWrap) {
    progressTimerWrap.appendChild(progress);
  }
  if (timerDiv) {
    timerDiv.style.display = preGame ? 'none' : 'inline-block';
    timerDiv.style.marginLeft = '16px';
    timerDiv.style.marginTop = '0';
    timerDiv.style.verticalAlign = 'middle';
    if (timerDiv.parentNode !== progressTimerWrap) {
      progressTimerWrap.appendChild(timerDiv);
    }
  }
  if (preGame) {
    progress.textContent = '';
  } else {
    progress.textContent = `(${guessedCount}/${gameMode === 'total' ? images.length : 10})`;
  }
}

function setPreGameState() {
  preGame = true;
  canGuess = false;
  gameFinished = false;
  guessedCount = 0;
  score = 0;
  distanceStats = { under25: 0, under50: 0, under75: 0, under100: 0, fail: 0 };
  clueImage.style.display = 'none';
  clearMarkers();
  resultDiv.textContent = '';
  scoreDiv.textContent = '';
  // Limpiar detalles de puntuación y resumen de distancia si existen
  const scoreDetails = document.getElementById('score-details');
  if (scoreDetails) scoreDetails.textContent = '';
  const distanceSummary = document.querySelector('.distance-summary');
  if (distanceSummary) distanceSummary.remove();
  updateProgress();
  modeSelector.disabled = false;
  submitBtn.textContent = lang === 'es' ? 'Comenzar' : 'Start';
  submitBtn.style.background = '#ffd166';
  submitBtn.style.color = '#222';
  submitBtn.disabled = false;
  // No mostrar corazones en preGame
  hideLives();
  showStartInstruction(); // Mostrar texto de instrucciones
}

function startGame() {
  preGame = false;
  score = 0;
  guessedCount = 0;
  canGuess = true;
  gameFinished = false;
  hideStartInstruction(); // Ocultar texto de instrucciones SIEMPRE al iniciar partida
  // Seleccionar imágenes según el modo
  if (gameMode === 'total') {
    gameImages = images.slice(); // Todas las imágenes
    totalImages = images.length;
  } else {
    gameImages = getRandomImages(images, 10);
    totalImages = 10;
  }
  remainingImages = gameImages.map((_, i) => i);
  distanceStats = { under25: 0, under50: 0, under75: 0, under100: 0, fail: 0 };
  if (timerInterval) hideTimer();
  if (gameMode === 'lives') {
    lives = 3;
    showLives();
  } else {
    hideLives();
  }
  lastGameWasLives = false;
  updateProgress();
  clueImage.style.display = '';
  scoreDiv.textContent = `${texts[lang].score}: ${score}`;
  scoreDiv.innerHTML += `<div id='score-details' class='score-details'></div>`;
  modeSelector.disabled = true;
  submitBtn.style.background = '#21c97a';
  submitBtn.style.color = '#fff';
  loadImage();
}

// Cuando termina la partida en modo vidas, los corazones deben seguir visibles
function endGame() {
  gameFinished = true;
  canGuess = false;
  // Guardar si la partida terminada fue en modo vidas
  lastGameWasLives = (gameMode === 'lives');
  // Mostrar corazones si el modo era vidas
  if (gameMode === 'lives') {
    showLives();
  }
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
  markerOverlay.style.width = '100%';
  markerOverlay.style.height = '100%';
  markerOverlay.style.left = '0';
  markerOverlay.style.top = '0';
}
window.addEventListener('resize', updateOverlaySize);
window.addEventListener('DOMContentLoaded', () => {
  // Ya no insertes el progreso arriba del título
  setPreGameState();
  updateOverlaySize();
});

// --- ZOOM SOLO SOBRE LA IMAGEN, NO SOBRE EL DIV ---
// Asume que el fondo del div#map es la imagen del mapa
// Cambia para usar una <img id="map-img"> dentro de #map y aplicar el zoom solo a esa imagen y al overlay

// Si no existe, crea la imagen del mapa dentro del div#map
let mapImg = document.getElementById('map-img');
if (!mapImg) {
  mapImg = document.createElement('img');
  mapImg.id = 'map-img';
  mapImg.src = 'images/map_gateway.png';
  mapImg.alt = 'Mapa';
  mapImg.style.width = '100%';
  mapImg.style.height = '100%';
  mapImg.style.position = 'absolute';
  mapImg.style.left = '0';
  mapImg.style.top = '0';
  mapImg.style.zIndex = '1';
  mapImg.style.userSelect = 'none';
  mapImg.draggable = false;
  map.appendChild(mapImg);
}
markerOverlay.style.position = 'absolute';
markerOverlay.style.left = '0';
markerOverlay.style.top = '0';
markerOverlay.style.width = '100%';
markerOverlay.style.height = '100%';
markerOverlay.style.zIndex = '2';

let mapScale = 1;
const mapMinScale = 1;
const mapMaxScale = 4;

function setMapImageTransform(originX = 0.5, originY = 0.5) {
  mapImg.style.transformOrigin = `${originX * 100}% ${originY * 100}%`;
  mapImg.style.transform = `scale(${mapScale})`;
  markerOverlay.style.transformOrigin = mapImg.style.transformOrigin;
  markerOverlay.style.transform = mapImg.style.transform;
}

// Mouse wheel zoom (centrado en el puntero)
map.addEventListener('wheel', function(e) {
  e.preventDefault();
  const rect = map.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  const originX = mouseX / rect.width;
  const originY = mouseY / rect.height;
  let delta = e.deltaY < 0 ? 1.1 : 0.9;
  mapScale = Math.max(mapMinScale, Math.min(mapMaxScale, mapScale * delta));
  setMapImageTransform(originX, originY);
}, { passive: false });

// Pinch-to-zoom (centrado en el centro del marco)
let lastTouchDist = null;
map.addEventListener('touchstart', function(e) {
  if (e.touches.length === 2) {
    lastTouchDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
  }
}, { passive: false });
map.addEventListener('touchmove', function(e) {
  if (e.touches.length === 2 && lastTouchDist) {
    const newDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    let scaleDelta = newDist / lastTouchDist;
    mapScale = Math.max(mapMinScale, Math.min(mapMaxScale, mapScale * scaleDelta));
    setMapImageTransform(); // centrado
    lastTouchDist = newDist;
  }
}, { passive: false });
map.addEventListener('touchend', function(e) {
  if (e.touches.length < 2) lastTouchDist = null;
});

// --- NUEVA LÓGICA DE CLICK Y MARCADORES CON ZOOM Y PAN ---
function getMapClickCoords(e) {
  const rect = map.getBoundingClientRect();
  // Obtener transformOrigin y scale actuales
  const origin = mapImg.style.transformOrigin.split(' ');
  const originX = parseFloat(origin[0]) / 100;
  const originY = parseFloat(origin[1]) / 100;
  // Posición del click relativa al marco
  const clickX = (e.clientX - rect.left);
  const clickY = (e.clientY - rect.top);
  // Centro del marco
  const cx = rect.width * originX;
  const cy = rect.height * originY;
  // Trasladar el click al sistema de la imagen escalada y paneada
  const px = (clickX - cx) / mapScale + cx;
  const py = (clickY - cy) / mapScale + cy;
  // Convertir a la escala base del mapa
  const x = (px / rect.width) * MAP_BASE_WIDTH;
  const y = (py / rect.height) * MAP_BASE_HEIGHT;
  return { x, y, px, py };
}

map.addEventListener('click', e => {
  if (wasDragging) {
    wasDragging = false;
    return;
  }
  if (!canGuess) return;
  // Bounding box de la imagen
  const imgRect = mapImg.getBoundingClientRect();
  // Verifica que el click esté dentro de la imagen
  if (
    e.clientX < imgRect.left ||
    e.clientX > imgRect.right ||
    e.clientY < imgRect.top ||
    e.clientY > imgRect.bottom
  ) return;
  const clickX = e.clientX - imgRect.left;
  const clickY = e.clientY - imgRect.top;
  const x = (clickX / imgRect.width) * MAP_BASE_WIDTH;
  const y = (clickY / imgRect.height) * MAP_BASE_HEIGHT;
  guessCoords = { x, y };
  guess = { x, y };
  clearMarkers(); // Elimina todos los marcadores antes de agregar uno nuevo
  playSound('pop'); // Sonido al colocar marcador
  drawGuessMarker();
  console.log(`Coordenadas para array: x: ${Math.round(x)}, y: ${Math.round(y)}`);
});

// Sobrescribe placeMarker para usar coordenadas relativas al marco
function placeMarker(px, py, isReal = false) {
  const marker = document.createElement('div');
  marker.className = 'marker';
  if (isReal) marker.classList.add('real-marker');
  marker.style.left = `${px}px`;
  marker.style.top = `${py}px`;
  markerOverlay.appendChild(marker);
}
// --- Fin de zoom solo imagen ---

// --- PAN SOLO SOBRE LA IMAGEN, NO SOBRE EL DIV ---
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let imgOrigin = { x: 0.5, y: 0.5 };
let wasDragging = false; // Para controlar si hubo drag antes del click

map.addEventListener('mousedown', function(e) {
  if (e.button !== 0) return; // solo click izquierdo
  isDragging = true;
  wasDragging = false;
  dragStart = { x: e.clientX, y: e.clientY };
  // Guardar el origen actual de la imagen
  const origin = mapImg.style.transformOrigin.split(' ');
  imgOrigin = {
    x: parseFloat(origin[0]) / 100,
    y: parseFloat(origin[1]) / 100
  };
});
document.addEventListener('mousemove', function(e) {
  if (!isDragging) return;
  const rect = map.getBoundingClientRect();
  // Calcular el desplazamiento relativo al tamaño del marco
  const dx = (e.clientX - dragStart.x) / rect.width;
  const dy = (e.clientY - dragStart.y) / rect.height;
  let newOriginX = imgOrigin.x - dx / mapScale;
  let newOriginY = imgOrigin.y - dy / mapScale;
  // Limitar el origen entre 0 y 1 para que no se salga
  newOriginX = Math.max(0, Math.min(1, newOriginX));
  newOriginY = Math.max(0, Math.min(1, newOriginY));
  setMapImageTransform(newOriginX, newOriginY);
  if (Math.abs(e.clientX - dragStart.x) + Math.abs(e.clientY - dragStart.y) > 3) {
    wasDragging = true;
  }
});
document.addEventListener('mouseup', function(e) {
  if (!isDragging) return;
  isDragging = false;
  // Solo colocar marcador si el mouseup fue sobre el mapa y el movimiento fue mínimo
  const rect = map.getBoundingClientRect();
  const moved = Math.abs(e.clientX - dragStart.x) + Math.abs(e.clientY - dragStart.y);
  if (
    e.target === map &&
    moved < 5 &&
    canGuess
  ) {
    wasDragging = false;
  }
});

// Eliminar el handler de click para el marcador
// --- Fin de pan solo imagen ---

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
    support: 'Si te gusta el juego, por favor considera apoyar el proyecto en <a href="https://paypal.me/RobinsonFredes" target="_blank" style="color:#7fffa6;text-decoration:underline;font-weight:bold;">PayPal</a> o <a href="https://ko-fi.com/robinsonfredes" target="_blank" style="color:#ffd166;text-decoration:underline;font-weight:bold;">Ko-fi</a>.'
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
  document.getElementById('support-message').className = 'support-message';
  document.getElementById('support-message').innerHTML = texts[lang].support;
  modeLabel.textContent = lang === 'es' ? 'Modo' : 'Mode';
  modeSelector.innerHTML = getModeOptions(lang);
  modeSelector.value = gameMode;
  // Actualizar texto de instrucciones si está visible
  if (preGame) {
    const startInstruction = document.getElementById('start-instruction');
    if (startInstruction) {
      startInstruction.textContent = lang === 'es'
        ? 'Selecciona el modo de juego que prefieras y luego presiona Comenzar para iniciar.'
        : 'Select your preferred game mode and then press Start to begin.';
    }
    submitBtn.textContent = lang === 'es' ? 'Comenzar' : 'Start';
    submitBtn.style.background = '#ffd166';
    submitBtn.style.color = '#222';
    scoreDiv.textContent = '';
    scoreDiv.style.display = gameMode === 'lives' ? 'none' : '';
    hideLives();
    updateProgress();
    // No mostrar corazones en preGame
    // if (gameMode === 'lives') showLives();
    resultDiv.innerHTML = '';
  } else if (submitBtn.textContent === texts['es'].send || submitBtn.textContent === texts['en'].send) {
    submitBtn.textContent = texts[lang].send;
    submitBtn.style.background = '';
    submitBtn.style.color = '';
    scoreDiv.textContent = `${texts[lang].score}: ${score}`;
    scoreDiv.innerHTML += `<div id='score-details' class='score-details'></div>`;
    scoreDiv.style.display = gameMode === 'lives' ? 'none' : '';
    hideLives();
    if (gameMode === 'lives') showLives();
    resultDiv.innerHTML = '';
  } else if (gameFinished) {
    clueImage.style.display = 'none'; // Oculta la imagen al finalizar el juego
    submitBtn.textContent = lang === 'es' ? 'Reiniciar' : 'Restart';
    submitBtn.style.background = '#ffd166'; // Amarillo como 'Comenzar'
    submitBtn.style.color = '#222';
    if (gameMode === 'lives') {
      // Mostrar corazones y ocultar puntuación, sin sobrescribir el área
      scoreDiv.style.display = 'none';
      showLives();
      // No modificar resultDiv ni volver a escribir el mensaje de resultado aquí
    } else {
      // Mostrar puntuación y ocultar corazones
      scoreDiv.style.display = '';
      hideLives();
      let resumen = `<div id='score-details' class='score-details' style='text-align:center;'>`;
      if (lang === 'es') {
        let maxScore = totalImages * 10;
        resumen += `Tu puntuación final es: <strong style='color:#fff;font-size:1.7rem;'>${score}/${maxScore}</strong></div>`;
        resumen += `<div class='distance-summary' style='margin:12px auto 0 auto;text-align:center;display:inline-block;font-size:1.1rem;color:#ffd166;'>`;
        resumen += `Ubicaciones acertadas a menos de 25 metros: <strong style='color:rgba(60,200,60,0.85);'>${distanceStats.under25}</strong><br>`;
        resumen += `Ubicaciones acertadas a menos de 50 metros: <strong style='color:rgba(50,180,255,0.85);'>${distanceStats.under50}</strong><br>`;
        resumen += `Ubicaciones acertadas a menos de 75 metros: <strong style='color:rgba(255,220,50,0.85);'>${distanceStats.under75}</strong><br>`;
        resumen += `Ubicaciones acertadas a menos de 100 metros: <strong style='color:rgba(255,140,0,0.85);'>${distanceStats.under100}</strong><br>`;
        resumen += `Ubicaciones no acertadas: <strong style='color:rgba(220,40,40,0.85);'>${distanceStats.fail}</strong>`;
        resumen += `</div>`;
      } else {
        let maxScore = totalImages * 10;
        resumen += `Your final score is: <strong style='color:#fff;font-size:1.7rem;'>${score}/${maxScore}</strong></div>`;
        resumen += `<div class='distance-summary' style='margin:12px auto 0 auto;text-align:center;display:inline-block;font-size:1.1rem;color:#ffd166;'>`;
        resumen += `Locations guessed under 25 meters: <strong style='color:rgba(60,200,60,0.85);'>${distanceStats.under25}</strong><br>`;
        resumen += `Locations guessed under 50 meters: <strong style='color:rgba(50,180,255,0.85);'>${distanceStats.under50}</strong><br>`;
        resumen += `Locations guessed under 75 meters: <strong style='color:rgba(255,220,50,0.85);'>${distanceStats.under75}</strong><br>`;
        resumen += `Locations guessed under 100 meters: <strong style='color:rgba(255,140,0,0.85);'>${distanceStats.under100}</strong><br>`;
        resumen += `Locations not guessed: <strong style='color:rgba(220,40,40,0.85);'>${distanceStats.fail}</strong>`;
        resumen += `</div>`;
      }
      scoreDiv.innerHTML = resumen;
    }
    // No llamar hideLives() aquí, para no ocultar corazones si el modo es 'lives'
  } else {
    // --- NUEVO BLOQUE: traducir score-details si existe y hay datos ---
    const scoreDetails = document.getElementById('score-details');
    if (scoreDetails && scoreDetails.innerHTML.trim() !== '') {
      // Extraer distancia y puntos usando RegExp
      const distMatch = scoreDetails.innerHTML.match(/([0-9]+)\s*metros|([0-9]+)\s*meters/i);
      const ptsMatch = scoreDetails.innerHTML.match(/<strong[^>]*>([0-9]+)<\/strong>/i);
      let dist = distMatch ? (distMatch[1] || distMatch[2]) : null;
      let pts = ptsMatch ? ptsMatch[1] : null;
      // Renderizar traducido si ambos existen
      if (dist && pts) {
        scoreDiv.textContent = `${texts[lang].score}: ${score}`;
        scoreDiv.innerHTML += `<div id='score-details' class='score-details'>${texts[lang].distance}: <span style='color:#ffd166'>${dist} ${lang === 'es' ? 'metros' : 'meters'}</span><br>${texts[lang].points}: <strong style='color:#fff;font-size:1.7rem;'>${pts}</strong></div>`;
      } else {
        // Si no se puede extraer, dejarlo vacío
        scoreDiv.textContent = `${texts[lang].score}: ${score}`;
        scoreDiv.innerHTML += `<div id='score-details' class='score-details'></div>`;
      }
    } else {
      scoreDiv.textContent = `${texts[lang].score}: ${score}`;
      scoreDiv.innerHTML += `<div id='score-details' class='score-details'></div>`;
    }
    scoreDiv.style.display = gameMode === 'lives' ? 'none' : '';
    hideLives();
    if (gameMode === 'lives') showLives();
    resultDiv.innerHTML = '';
  }
  updateProgress();
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

// Agregar texto "modo" o "mode" y mejorar visibilidad del menú
const langEs = document.getElementById('lang-es');
const langEn = document.getElementById('lang-en');
const langContainer = langEs.parentNode;

let modeLabel = document.createElement('span');
modeLabel.id = 'mode-label';
modeLabel.style = `
  margin-left: 18px;
  margin-right: 7px;
  font-size: 1.08rem;
  font-weight: bold;
  color: #ffd166;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 8px #000b, 0 1px 0 #fff1;
  vertical-align: middle;
`;
modeLabel.textContent = 'Modo';
langContainer.appendChild(modeLabel);

const modeSelector = document.createElement('select');
modeSelector.id = 'mode-selector';
modeSelector.style = `
  padding: 9px 28px 9px 14px;
  border-radius: 10px;
  border: 2.5px solid #ffd166;
  background: #181b22;
  color: #ffd166;
  font-size: 1.08rem;
  font-weight: 700;
  box-shadow: 0 4px 16px 0 #000b, 0 1px 0 #fff1;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border 0.2s, box-shadow 0.2s, background 0.2s;
  margin-left: 0;
  margin-right: 0;
  vertical-align: middle;
`;
modeSelector.className = 'modern-dropdown';

function getModeOptions(lang) {
  if (lang === 'es') {
    return `
      <option value="standard">Estándar</option>
      <option value="timer">Contrarreloj</option>
      <option value="lives">Intentos limitados</option>
      <option value="total">Total</option>
    `;
  } else {
    return `
      <option value="standard">Standard</option>
      <option value="timer">Timer</option>
      <option value="lives">Limited lives</option>
      <option value="total">Total</option>
    `;
  }
}
modeSelector.innerHTML = getModeOptions('es');
langContainer.appendChild(modeSelector);

let gameMode = 'standard';
let timerInterval = null;
let timeLeft = 10;
let lives = 3;

// Asegurar que el contenedor de corazones exista siempre
let livesDiv = document.getElementById('lives-div');
if (!livesDiv) {
  livesDiv = document.createElement('div');
  livesDiv.id = 'lives-div';
  livesDiv.style.display = 'none';
  livesDiv.style.fontSize = '2rem';
  livesDiv.style.fontWeight = 'bold';
  livesDiv.style.color = '#ffd166';
  livesDiv.style.margin = '18px 0 0 0';
  livesDiv.style.textAlign = 'center';
  // Insertar después del scoreDiv
  scoreDiv.parentNode.insertBefore(livesDiv, scoreDiv.nextSibling);
}

modeSelector.addEventListener('change', function() {
  // Efecto de sonido para menú desplegable, 20% más despacio
  if (sounds.button) {
    sounds.button.pause();
    sounds.button.currentTime = 0;
    sounds.button.playbackRate = 0.8;
    sounds.button.play();
  }
  // Permitir cambiar el modo si está en preGame o si el juego ya terminó
  if (!preGame && !gameFinished) { return; }
  gameMode = this.value;
  // Siempre ocultar corazones al cambiar de modo, excepto si la última partida terminada fue en modo vidas
  if (gameFinished && lastGameWasLives) {
    showLives();
  } else {
    hideLives();
  }
  // Si el juego no terminó, limpiar pantalla y mostrar preGame
  if (!gameFinished) {
    resultDiv.textContent = '';
    scoreDiv.textContent = '';
    const scoreDetails = document.getElementById('score-details');
    if (scoreDetails) scoreDetails.textContent = '';
    const distanceSummary = document.querySelector('.distance-summary');
    if (distanceSummary) distanceSummary.remove();
    setPreGameState();
  }
  // Si el juego terminó, mantener estadísticas y botón de reinicio, y mostrar corazones solo si la última partida fue en vidas
});

function showTimer() {
  let timerDiv = document.getElementById('timer-div');
  if (!timerDiv) {
    timerDiv = document.createElement('div');
    timerDiv.id = 'timer-div';
    timerDiv.style = 'font-size:1.2rem;font-weight:bold;margin:8px 0;color:#ffd166;text-align:center;';
    // Insertar el temporizador justo antes del progreso, arriba de la imagen
    const progress = document.getElementById('progress-text');
    if (progress && progress.parentNode) {
      progress.parentNode.insertBefore(timerDiv, progress.nextSibling);
    } else {
      // Fallback: después de clueImage
      clueImage.parentNode.insertBefore(timerDiv, clueImage.nextSibling);
    }
  }
  timerDiv.textContent = `⏰ ${timeLeft}s`;
}
function hideTimer() {
  const timerDiv = document.getElementById('timer-div');
  if (timerDiv) timerDiv.remove();
}
function showLives() {
  let hearts = '❤️'.repeat(lives) + '🖤'.repeat(3 - lives);
  let label = lang === 'es' ? (lives === 1 ? 'vida' : 'vidas') : (lives === 1 ? 'life' : 'lives');
  livesDiv.textContent = `${lives} ${label}: ${hearts}`;
  livesDiv.style.display = 'block';
}
function hideLives() {
  livesDiv.style.display = 'none';
}

function clearMarkers() {
  // Elimina todos los divs .marker dentro de #map
  document.querySelectorAll('#map .marker').forEach(el => el.remove());
  // Elimina la línea SVG si existe
  const svg = document.getElementById('guess-line-svg');
  if (svg) svg.remove();
}

function loadImage() {
  guessCoords = null;
  realCoords = null;
  if (timerInterval) clearInterval(timerInterval);
  hideTimer();
  hideLives();
  if (remainingImages.length === 0 || (gameMode === 'lives' && lives <= 0)) {
    clueImage.style.display = 'none'; // Oculta la imagen al finalizar la ronda
    gameFinished = true;
    clearMarkers();
    // Mostrar mensaje de condición centrado en resultDiv en modo vidas
    if (gameMode === 'lives') {
      resultDiv.innerHTML = `<span style='font-size:2.2rem;color:${lives > 0 ? '#7fffa6' : '#ff4d4d'};font-weight:bold;display:block;margin:32px 0 24px 0;text-align:center;'>${lang === 'es' ? (lives > 0 ? '¡Ganaste!' : 'Perdiste') : (lives > 0 ? 'You won!' : 'You lost')}</span>`;
      // Mostrar corazones debajo del mensaje final
      let livesDiv = document.getElementById('lives-div');
      if (!livesDiv) {
        livesDiv = document.createElement('div');
        livesDiv.id = 'lives-div';
        livesDiv.style = 'font-size:1.6rem;font-weight:bold;margin:16px 0 16px 0;color:#ffd166;text-align:center;transition:all 0.2s;letter-spacing:0.5px;';
        resultDiv.appendChild(livesDiv);
      }
      let hearts = '❤️'.repeat(lives) + '🖤'.repeat(3 - lives);
      let label = lang === 'es' ? (lives === 1 ? 'vida' : 'vidas') : (lives === 1 ? 'life' : 'lives');
      livesDiv.textContent = `${lives} ${label}: ${hearts}`;
      livesDiv.style.display = 'block';
      // Ocultar puntuación
      scoreDiv.style.display = 'none';
    } else {
      let resumen = `<div id='score-details' class='score-details' style='text-align:center;'>`;
      if (lang === 'es') {
        let maxScore = totalImages * 10;
        resumen += `Tu puntuación final es: <strong style='color:#fff;font-size:1.7rem;'>${score}/${maxScore}</strong></div>`;
        resumen += `<div class='distance-summary' style='margin:12px auto 0 auto;text-align:center;display:inline-block;font-size:1.1rem;color:#ffd166;'>`;
        resumen += `Ubicaciones acertadas a menos de 25 metros: <strong style='color:rgba(60,200,60,0.85);'>${distanceStats.under25}</strong><br>`;
        resumen += `Ubicaciones acertadas a menos de 50 metros: <strong style='color:rgba(50,180,255,0.85);'>${distanceStats.under50}</strong><br>`;
        resumen += `Ubicaciones acertadas a menos de 75 metros: <strong style='color:rgba(255,220,50,0.85);'>${distanceStats.under75}</strong><br>`;
        resumen += `Ubicaciones acertadas a menos de 100 metros: <strong style='color:rgba(255,140,0,0.85);'>${distanceStats.under100}</strong><br>`;
        resumen += `Ubicaciones no acertadas: <strong style='color:rgba(220,40,40,0.85);'>${distanceStats.fail}</strong>`;
        resumen += `</div>`;
      } else {
        let maxScore = totalImages * 10;
        resumen += `Your final score is: <strong style='color:#fff;font-size:1.7rem;'>${score}/${maxScore}</strong></div>`;
        resumen += `<div class='distance-summary' style='margin:12px auto 0 auto;text-align:center;display:inline-block;font-size:1.1rem;color:#ffd166;'>`;
        resumen += `Locations guessed under 25 meters: <strong style='color:rgba(60,200,60,0.85);'>${distanceStats.under25}</strong><br>`;
        resumen += `Locations guessed under 50 meters: <strong style='color:rgba(50,180,255,0.85);'>${distanceStats.under50}</strong><br>`;
        resumen += `Locations guessed under 75 meters: <strong style='color:rgba(255,220,50,0.85);'>${distanceStats.under75}</strong><br>`;
        resumen += `Locations guessed under 100 meters: <strong style='color:rgba(255,140,0,0.85);'>${distanceStats.under100}</strong><br>`;
        resumen += `Locations not guessed: <strong style='color:rgba(220,40,40,0.85);'>${distanceStats.fail}</strong>`;
        resumen += `</div>`;
      }
      scoreDiv.innerHTML = resumen;
      scoreDiv.style.display = '';
    }
    submitBtn.textContent = lang === 'es' ? 'Reiniciar' : 'Restart';
    submitBtn.disabled = false;
    modeSelector.disabled = false;
    submitBtn.style.background = '#ffd166';
    submitBtn.style.color = '#222';
    updateProgress();
    return;
  }
  currentImageIndex = getRandomImageIndexNoRepeat();
  const { img } = gameImages[currentImageIndex];
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
  if (gameMode === 'timer') {
    timeLeft = 5;
    showTimer();
    updateProgress(); // Para asegurar posición
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft === 3) {
        playSound('timer');
        if (sounds.timer) {
          sounds.timer.volume = 1.0;
          timerSoundPlaying = true;
        }
      }
      showTimer();
      updateProgress();
      if (timeLeft <= 0) {
        if (sounds.timer && timerSoundPlaying) {
          sounds.timer.pause();
          sounds.timer.currentTime = 0;
          timerSoundPlaying = false;
        }
        playSound('fail');
        clearInterval(timerInterval);
        canGuess = false;
        distanceStats.fail++;
        // NO incrementar guessedCount aquí, solo al pasar a la siguiente imagen
        submitBtn.textContent = texts[lang].next;
        submitBtn.disabled = false;
        scoreDiv.innerHTML += `<div id='score-details' class='score-details' style='color:#ffd166;'>${lang === 'es' ? '¡Tiempo agotado!' : 'Time is up!'}</div>`;
      }
    }, 1000);
  }
  if (gameMode === 'lives') {
    showLives();
  }
  // Cambiar color del botón según el estado
  if (submitBtn.textContent === (lang === 'es' ? 'Comenzar' : 'Start') || submitBtn.textContent === (lang === 'es' ? 'Reiniciar' : 'Restart')) {
    submitBtn.style.background = '#ffd166';
    submitBtn.style.color = '#222';
  } else if (submitBtn.textContent === texts[lang].send || submitBtn.textContent === texts[lang].next) {
    submitBtn.style.background = '#21c97a';
    submitBtn.style.color = '#fff';
  }
}

// --- SONIDOS ---
const sounds = {
  guessed: new Audio('sounds/guessed.mp3'),
  fail: new Audio('sounds/fail.mp3'),
  win: new Audio('sounds/win.mp3'),
  timer: new Audio('sounds/timer-ticks.mp3'),
  button: new Audio('sounds/button.mp3'),
  start: new Audio('sounds/game-start.mp3'), // Sonido de inicio de partida
  pop: new Audio('sounds/pop.mp3'), // Sonido para colocar marcador
};

// Variable global para controlar el sonido timer-ticks
let timerSoundPlaying = false;

function playSound(name) {
  if (sounds[name]) {
    sounds[name].currentTime = 0;
    sounds[name].play();
  }
}

// Efecto de sonido para todos los botones
const allButtons = document.querySelectorAll('button');
allButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // Si el sonido timer-ticks está activo, cancelarlo
    if (sounds.timer && timerSoundPlaying) {
      sounds.timer.pause();
      sounds.timer.currentTime = 0;
      timerSoundPlaying = false;
    }
    if (sounds.button) {
      sounds.button.pause();
      sounds.button.currentTime = 0;
      sounds.button.volume = 0.3; // 40% más bajo
      sounds.button.playbackRate = 1.0;
      sounds.button.play();
    }
  });
});

// Modificar submitBtn para modos
submitBtn.addEventListener('click', () => {
  if (preGame || gameFinished) {
    playSound('start'); // Sonido de inicio de partida
    hideStartInstruction(); // Ocultar texto de instrucciones al reiniciar
    // Resetear correctamente todas las variables de estado
    score = 0;
    guessedCount = 0;
    canGuess = true;
    gameFinished = false;
    // Seleccionar imágenes según el modo
    if (gameMode === 'total') {
      gameImages = images.slice();
      totalImages = images.length;
    } else {
      gameImages = getRandomImages(images, 10);
      totalImages = 10;
    }
    remainingImages = gameImages.map((_, i) => i);
    distanceStats = { under25: 0, under50: 0, under75: 0, under100: 0, fail: 0 };
    lives = 3;
    preGame = false;
    hideTimer();
    hideLives();
    updateProgress();
    clueImage.style.display = '';
    scoreDiv.textContent = `${texts[lang].score}: ${score}`;
    scoreDiv.innerHTML += `<div id='score-details' class='score-details'></div>`;
    // Mostrar u ocultar scoreDiv según el modo
    scoreDiv.style.display = gameMode === 'lives' ? 'none' : '';
    if (gameMode === 'lives') showLives();
    modeSelector.disabled = true;
    submitBtn.style.background = '#21c97a'; // Verde
    submitBtn.style.color = '#fff';
    loadImage();
    return;
  }
  if (submitBtn.textContent === texts[lang].next) {
    guessedCount++;
    loadImage();
    canGuess = true;
    return;
  }
  // PREVENIR enviar si no hay guess en cualquier modo
  if (!guess) {
    alert(texts[lang].alert);
    return;
  }
  if (timerInterval) clearInterval(timerInterval);
  // Convertir coordenadas reales a la escala visual actual
  const real = gameImages[currentImageIndex];
  clearMarkers(); // Limpia todos los marcadores antes de dibujar
  drawGuessMarker(); // Dibuja el marcador rojo del usuario
  drawRealMarker(real.x, real.y); // Dibuja el marcador verde de la ubicación real
  drawLineBaseCoords(guess.x, guess.y, real.x, real.y); // Dibuja la línea
  const dist = calculateDistance(guess.x, guess.y, real.x, real.y);
  const points = calculatePoints(dist);
  score += points;
  // Contador de distancias
  if (dist < 25) distanceStats.under25++;
  else if (dist < 50) distanceStats.under50++;
  else if (dist < 75) distanceStats.under75++;
  else if (dist < 100) distanceStats.under100++;
  else distanceStats.fail++;

  // --- SONIDOS ---
  if (points > 0) {
    playSound('guessed');
  } else {
    playSound('fail');
  }

  // --- LÓGICA CORREGIDA PARA MODO VIDAS ---
  if (gameMode === 'lives') {
    if (dist >= 75) {
      lives--;
    }
    showLives();
    if (lives <= 0) {
      playSound('fail'); // Sonido de perder
      canGuess = false;
      guessedCount++;
      loadImage();
      return;
    }
    // No mostrar puntos ni detalles en modo vidas
    scoreDiv.textContent = '';
    resultDiv.innerHTML = '';
    submitBtn.textContent = texts[lang].next;
    submitBtn.disabled = false;
    canGuess = false;
    return;
  }
  // --- FIN LÓGICA VIDAS ---

  // Sonido de victoria si es la última ronda
  if (guessedCount + 1 === totalImages) {
    playSound('win');
  }

  scoreDiv.textContent = `${texts[lang].score}: ${score}`;
  scoreDiv.innerHTML += `<div id='score-details' class='score-details'>${texts[lang].distance}: <span style='color:#ffd166'>${Math.round(dist)} metros</span><br>${texts[lang].points}: <strong style='color:#fff;font-size:1.7rem;'>${points}</strong></div>`;
  resultDiv.innerHTML = '';
  submitBtn.textContent = texts[lang].next;
  submitBtn.disabled = false;
  canGuess = false;
});

function calculateDistance(x1, y1, x2, y2) {
  // Devuelve la distancia en la escala base (px)
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// --- MARCADOR SIEMPRE EN COORDENADAS BASE (x, y) ---
let guessCoords = null; // {x, y} en base 2048x2048
let realCoords = null; // Guarda la ubicación real en base 2048x2048

function getBaseCoordsFromClick(e) {
  // Bounding box de la imagen
  const imgRect = mapImg.getBoundingClientRect();
  const clickX = e.clientX - imgRect.left;
  const clickY = e.clientY - imgRect.top;
  const x = (clickX / imgRect.width) * MAP_BASE_WIDTH;
  const y = (clickY / imgRect.height) * MAP_BASE_HEIGHT;
  return { x, y };
}

function getVisualCoordsFromBase(x, y) {
  // Convierte coordenadas base (2048x2048) a px en el overlay/mapa actual
  const imgRect = mapImg.getBoundingClientRect();
  const mapRect = map.getBoundingClientRect();
  const visualW = imgRect.width;
  const visualH = imgRect.height;
  const offsetX = imgRect.left - mapRect.left;
  const offsetY = imgRect.top - mapRect.top;
  const px = (x / MAP_BASE_WIDTH) * visualW + offsetX;
  const py = (y / MAP_BASE_HEIGHT) * visualH + offsetY;
  return { px, py };
}

map.addEventListener('click', e => {
  if (!canGuess) return;
  // Obtener coordenadas base exactamente como en el log
  const { x, y } = getBaseCoordsFromClick(e);
  guessCoords = { x, y };
  guess = { x, y };
  clearMarkers();
  drawGuessMarker();
  console.log(`Coordenadas para array: x: ${Math.round(x)}, y: ${Math.round(y)}`);
});

function calculatePoints(distance) {
  if (distance < 25) return 10;
  if (distance < 50) return 5;
  if (distance < 75) return 3;
  if (distance < 100) return 1;
  return 0;
}

function drawGuessMarker() {
  if (!guessCoords) return;
  const { px, py } = getVisualCoordsFromBase(guessCoords.x, guessCoords.y);
  // Crear el div marcador y agregarlo directamente a #map
  const marker = document.createElement('div');
  marker.className = 'marker';
  marker.style.position = 'absolute';
  marker.style.left = `${px}px`;
  marker.style.top = `${py}px`;
  marker.style.pointerEvents = 'none';
  map.appendChild(marker);
}

function drawRealMarker(x, y) {
  realCoords = { x, y };
  const { px, py } = getVisualCoordsFromBase(x, y);
  const marker = document.createElement('div');
  marker.className = 'marker real-marker';
  marker.style.position = 'absolute';
  marker.style.left = `${px}px`;
  marker.style.top = `${py}px`;
  marker.style.pointerEvents = 'none';
  map.appendChild(marker);
}

function drawLineBaseCoords(x1, y1, x2, y2) {
  // Elimina el SVG anterior si existe
  let oldSvg = document.getElementById('guess-line-svg');
  if (oldSvg) oldSvg.remove();
  // Crea un nuevo SVG
  let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('id', 'guess-line-svg');
  svg.setAttribute('width', map.offsetWidth);
  svg.setAttribute('height', map.offsetHeight);
  svg.style.position = 'absolute';
  svg.style.left = '0';
  svg.style.top = '0';
  svg.style.pointerEvents = 'none';
  svg.style.zIndex = '1';
  // Calcula las posiciones visuales
  const { px: px1, py: py1 } = getVisualCoordsFromBase(x1, y1);
  const { px: px2, py: py2 } = getVisualCoordsFromBase(x2, y2);
  // Crea la línea
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', px1);
  line.setAttribute('y1', py1);
  line.setAttribute('x2', px2);
  line.setAttribute('y2', py2);
  line.setAttribute('stroke', '#ffd166');
  line.setAttribute('stroke-width', '3');
  svg.appendChild(line);
  map.appendChild(svg);
}

// Redibujar marcadores y línea al hacer zoom/pan
const origSetMapImageTransform = setMapImageTransform;
setMapImageTransform = function(originX = 0.5, originY = 0.5) {
  origSetMapImageTransform(originX, originY);
  clearMarkers();
  drawGuessMarker();
  if (realCoords) drawRealMarker(realCoords.x, realCoords.y);
  if (guessCoords && realCoords) drawLineBaseCoords(guessCoords.x, guessCoords.y, realCoords.x, realCoords.y);
};

// --- Restaurar funciones de instrucciones de inicio ---
function showStartInstruction() {
  let startInstruction = document.getElementById('start-instruction');
  if (!startInstruction) {
    startInstruction = document.createElement('div');
    startInstruction.id = 'start-instruction';
    startInstruction.style = `
      font-size: 1.45rem;
      font-weight: bold;
      color: #ffd166;
      text-align: center;
      margin: 60px 0 60px 0;
      line-height: 1.3;
      letter-spacing: 0.5px;
    `;
    // Insertar después de desc2-text y antes de la imagen
    const desc2 = document.getElementById('desc2-text');
    desc2.parentNode.insertBefore(startInstruction, clueImage);
  }
  startInstruction.textContent = lang === 'es'
    ? 'Selecciona el modo de juego que prefieras y luego presiona Comenzar para iniciar.'
    : 'Select your preferred game mode and then press Start to begin.';
  startInstruction.style.display = 'block';
}
function hideStartInstruction() {
  const startInstruction = document.getElementById('start-instruction');
  if (startInstruction) startInstruction.style.display = 'none';
}
