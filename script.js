/* --- START OF FILE script.js --- */

// ==========================================
// 1. CONFIGURACIÓN FIREBASE
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyCC3idHLHcFFcGOAbdJGtuWYsrV0PFf8Oc",
  authDomain: "crosssfit--3640-tv.firebaseapp.com",
  databaseURL: "https://crosssfit--3640-tv-default-rtdb.firebaseio.com",
  projectId: "crosssfit--3640-tv",
  storageBucket: "crosssfit--3640-tv.firebasestorage.app",
  messagingSenderId: "908256000888",
  appId: "1:908256000888:web:09e4bffb19519b8784668d"
};

// Inicializar Firebase de forma segura
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Intentar conectar la base de datos
let db;
try {
  db = firebase.database();
} catch (e) {
  console.error("Firebase no está configurado o scripts no cargados en index.html");
}

// ==========================================
// 2. VARIABLES GLOBALES
// ==========================================
const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
let currentSlideIndex = 0;
let currentWodParts = [];
let isFullViewMode = false;

// MODOS
// 'miraflores' (7) | 'calacoto' (8) | 'wgirls' (9) | null (Normal)
let activeMode = null;

let firebaseDataMiraflores = [];
let firebaseDataCalacoto = [];
let timeOffset = 0;

// Escuchar cambios de Firebase (AMBAS SEDES)
if (db) {
  // Miraflores -> customWodMiraflores
  db.ref('customWodMiraflores').on('value', (snapshot) => {
    firebaseDataMiraflores = snapshot.val() || [];
    if (activeMode === 'miraflores') cargarWOD();
  });

  // Calacoto -> customWodCalacoto
  db.ref('customWodCalacoto').on('value', (snapshot) => {
    firebaseDataCalacoto = snapshot.val() || [];
    if (activeMode === 'calacoto') cargarWOD();
  });
}

// ==========================================
// 3. SINCRONIZACIÓN Y RELOJ
// ==========================================
function getBoliviaDate() {
  return new Date(Date.now() + timeOffset);
}

function syncTime() {
  fetch('http://worldtimeapi.org/api/timezone/America/La_Paz')
    .then(response => response.json())
    .then(data => {
      const serverTime = new Date(data.datetime).getTime();
      const localTime = Date.now();
      timeOffset = serverTime - localTime;
      updateClock();
      cargarWOD();
    })
    .catch(err => console.log("Usando hora del sistema (Offline o error API)"));
}

function updateClock() {
  const now = getBoliviaDate();
  const dia = String(now.getDate()).padStart(2, '0');
  const mes = String(now.getMonth() + 1).padStart(2, '0');
  const anio = now.getFullYear();

  const elDate = document.getElementById('date-display');
  if (elDate) elDate.innerText = `${dia}/${mes}/${anio}`;

  const horas = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const seg = String(now.getSeconds()).padStart(2, '0');

  const elTime = document.getElementById('time-display');
  if (elTime) elTime.innerText = `${horas}:${min}:${seg}`;
}

// ==========================================
// 4. LÓGICA PRINCIPAL (CARGAR WOD)
// ==========================================
function cargarWOD() {
  if (typeof wods === 'undefined') return;

  const hoyIndex = getBoliviaDate().getDay();
  const diaNombre = dias[hoyIndex];
  const contenedor = document.getElementById('wod-display');

  // 1. Elegir fuente de datos según MODO
  let dataSource = wods[diaNombre]; // Por defecto (WOD Normal del js)
  let modoDisplay = 'normal';

  if (activeMode === 'miraflores') {
    dataSource = (firebaseDataMiraflores.length > 0) ? firebaseDataMiraflores : [{ titulo: "MIRAFLORES", contenido: "Esperando WOD..." }];
    modoDisplay = 'custom-mira'; // Usado para CSS si quisieras
  }
  else if (activeMode === 'calacoto') {
    dataSource = (firebaseDataCalacoto.length > 0) ? firebaseDataCalacoto : [{ titulo: "CALACOTO", contenido: "Esperando WOD..." }];
    modoDisplay = 'custom-cala';
  }
  else if (activeMode === 'wgirls') {
    if (typeof wgirls !== 'undefined') {
      dataSource = wgirls[diaNombre];
      modoDisplay = 'girls';
    }
  }

  // 2. Detectar cambios para no parpadear
  if (contenedor.dataset.dia !== diaNombre || contenedor.dataset.mode !== modoDisplay || currentWodParts.length === 0) {

    contenedor.dataset.dia = diaNombre;
    contenedor.dataset.mode = modoDisplay;

    if (Array.isArray(dataSource) && dataSource.length > 0) {
      currentWodParts = dataSource;
    } else {
      const titulo = (activeMode === 'wgirls') ? "WGIRLS DESCANSO" : "DESCANSO";
      currentWodParts = [{ titulo: titulo, contenido: "Box Cerrado / Open Box" }];
    }

    // Reiniciar slide
    currentSlideIndex = 0;
    renderSlide();

    // Actualizar vista completa si está abierta
    if (isFullViewMode) {
      isFullViewMode = false;
      toggleFullView(); // Cerrar y reabrir (opcional, aquí solo cierro para evitar bugs visuales)
    }
  }
}

function renderSlide() {
  if (isFullViewMode) return;

  const wrapper = document.getElementById('wod-display');
  wrapper.classList.add('fading');

  setTimeout(() => {
    // Protección de índice
    if (currentSlideIndex >= currentWodParts.length) currentSlideIndex = 0;

    const part = currentWodParts[currentSlideIndex];
    const contenidoFormateado = formatearTexto(part.contenido);

    wrapper.innerHTML = `<h3>${part.titulo}</h3><p>${contenidoFormateado}</p>`;

    // Indicador
    const ind = document.getElementById('slide-indicator');

    // Texto del indicador con el modo
    let modeLabel = "";
    if (activeMode === 'miraflores') modeLabel = "MIRAFLORES ";
    if (activeMode === 'calacoto') modeLabel = "CALACOTO ";
    if (activeMode === 'wgirls') modeLabel = "WGIRLS ";

    if (ind) ind.innerText = `${modeLabel} ${currentSlideIndex + 1} / ${currentWodParts.length}`;

    // Botones
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    if (btnPrev) {
      btnPrev.disabled = (currentSlideIndex === 0);
      btnPrev.style.opacity = (currentSlideIndex === 0) ? "0.3" : "1";
    }
    if (btnNext) {
      btnNext.disabled = (currentSlideIndex === currentWodParts.length - 1);
      btnNext.style.opacity = (currentSlideIndex === currentWodParts.length - 1) ? "0.3" : "1";
    }

    ajustarEscala();
    wrapper.classList.remove('fading');
  }, 300);
}

function formatearTexto(texto) {
  if (!texto) return "";
  // Negrita con asteriscos *texto*
  return texto.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
}

// ==========================================
// 5. AJUSTE DE PANTALLA (NO TOCAR)
// ==========================================
function ajustarEscala() {
  if (isFullViewMode) return;
  if (window.matchMedia("(orientation: portrait)").matches) return;

  const wrapper = document.getElementById('wod-display');
  if (!wrapper) return;

  const anchoVisualMaximo = window.innerHeight * 0.94;
  const altoVisualMaximo = window.innerWidth * 0.90;

  wrapper.style.width = 'auto';
  wrapper.style.maxWidth = `${anchoVisualMaximo}px`;
  wrapper.style.height = 'auto';
  wrapper.style.transform = 'scale(1)';

  const anchoActual = wrapper.scrollWidth;
  const altoActual = wrapper.scrollHeight;

  const escalaAncho = anchoVisualMaximo / anchoActual;
  const escalaAlto = altoVisualMaximo / altoActual;

  let escala = Math.min(escalaAncho, escalaAlto);

  if (escala > 1.6) escala = 1.6;
  if (escala < 0.25) escala = 0.25;

  wrapper.style.transform = `scale(${escala})`;
}

// ==========================================
// 6. CONTROL DE ENTRADA (TECLADO)
// ==========================================
function cambiarSlide(direccion) {
  const nuevoIndex = currentSlideIndex + direccion;
  if (nuevoIndex >= 0 && nuevoIndex < currentWodParts.length) {
    currentSlideIndex = nuevoIndex;
    renderSlide();
  }
}

document.addEventListener('keydown', function (event) {
  const key = event.key;

  // --- MODOS ESPECIALES ---

  // TECLA 7: MIRAFLORES
  if (key === '7') {
    activeMode = (activeMode === 'miraflores') ? null : 'miraflores';
    document.getElementById('wod-display').dataset.mode = ""; // Forzar refresco
    cargarWOD();
    return;
  }

  // TECLA 8: CALACOTO
  if (key === '8') {
    activeMode = (activeMode === 'calacoto') ? null : 'calacoto';
    document.getElementById('wod-display').dataset.mode = "";
    cargarWOD();
    return;
  }

  // TECLA 9: GIRLS MODE
  if (key === '9') {
    activeMode = (activeMode === 'wgirls') ? null : 'wgirls';
    document.getElementById('wod-display').dataset.mode = "";
    cargarWOD();
    return;
  }

  // TECLA 0: VISTA COMPLETA
  if (key === '0') {
    toggleFullView();
    return;
  }

  // SALIR DE FULL VIEW
  if (isFullViewMode && (key === 'Escape' || key === 'Backspace' || key === '0')) {
    toggleFullView(); return;
  }

  // --- NAVEGACIÓN DIRECTA (1-6) ---
  // Nota: Quitamos el 7 de la navegación directa porque ahora es Miraflores
  if (key >= '1' && key <= '6') {
    const targetIndex = parseInt(key) - 1;
    if (targetIndex >= 0 && targetIndex < currentWodParts.length) {
      currentSlideIndex = targetIndex;
      renderSlide();
    }
  }

  // FLECHAS
  if (key === 'ArrowLeft') cambiarSlide(-1);
  if (key === 'ArrowRight' || key === 'Enter') cambiarSlide(1);
});

// --- VISTA COMPLETA (0) ---
function toggleFullView() {
  isFullViewMode = !isFullViewMode;
  const fullContainer = document.getElementById('full-view-container');
  const slideWrapper = document.getElementById('wod-display');
  const indicator = document.getElementById('slide-indicator');
  const buttons = document.getElementById('nav-buttons');

  if (isFullViewMode) {
    let fullHTML = "";
    // Etiquetas de modo
    if (activeMode === 'miraflores') fullHTML += `<div style="text-align:center; color:#ff0000; letter-spacing:3px; margin-bottom:20px;">-- MIRAFLORES --</div>`;
    else if (activeMode === 'calacoto') fullHTML += `<div style="text-align:center; color:#39ff14; letter-spacing:3px; margin-bottom:20px;">-- CALACOTO --</div>`;
    else if (activeMode === 'wgirls') fullHTML += `<div style="text-align:center; color:#ff00d4; letter-spacing:3px; margin-bottom:20px;">-- WGIRLS MODE --</div>`;

    currentWodParts.forEach(part => {
      fullHTML += `<div class="full-section"><h3>${part.titulo}</h3><p>${formatearTexto(part.contenido)}</p></div>`;
    });
    fullContainer.innerHTML = fullHTML;

    fullContainer.classList.remove('hidden');
    if (slideWrapper) slideWrapper.classList.add('hidden');
    if (buttons) buttons.classList.add('hidden');
    if (indicator) indicator.classList.add('hidden');
  } else {
    fullContainer.classList.add('hidden');
    if (slideWrapper) slideWrapper.classList.remove('hidden');
    if (buttons) buttons.classList.remove('hidden');
    if (indicator) indicator.classList.remove('hidden');
    setTimeout(ajustarEscala, 100);
  }
}

// ==========================================
// 7. INICIALIZACIÓN
// ==========================================
window.addEventListener('load', () => {
  syncTime();
  cargarWOD();
  setTimeout(ajustarEscala, 500);
  initAnniversaryOverlay(); // Iniciar overlay
});
window.addEventListener('resize', () => setTimeout(ajustarEscala, 200));
setInterval(syncTime, 3600000);
setInterval(updateClock, 1000);
setInterval(cargarWOD, 60000);

// ==========================================
// 8. ANNIVERSARY OVERLAY
// ==========================================
const ANNIVERSARY_INTERVAL = 35000; // 15 seconds (Test Mode)
const ANNIVERSARY_DURATION = 3000; // 2.5 seconds

function initAnniversaryOverlay() {
  setInterval(showAnniversaryOverlay, ANNIVERSARY_INTERVAL);
}

function showAnniversaryOverlay() {
  const overlay = document.getElementById('anniversary-overlay');
  if (overlay) {
    overlay.classList.remove('hidden');

    // Auto-hide
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, ANNIVERSARY_DURATION);
  }
}


