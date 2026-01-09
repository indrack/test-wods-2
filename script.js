/* --- START OF FILE script.js --- */

// --- 1. CONFIGURACIÓN FIREBASE (PEGA LO MISMO QUE EN ADMIN.JS) ---
const firebaseConfig = {
    apiKey: "TU_API_KEY_AQUI", // <--- REEMPLAZA
    authDomain: "TU_PROYECTO.firebaseapp.com",
    databaseURL: "https://TU_PROYECTO-default-rtdb.firebaseio.com",
    projectId: "TU_PROYECTO",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
};

// Inicializar solo si no existe ya
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// VARIABLES
let firebaseWodData = []; // Aquí guardaremos lo que venga de la nube
let isCustomMode = false; // Tecla 8 activada?

// --- ESCUCHAR CAMBIOS EN TIEMPO REAL ---
// Esto se ejecuta solo cada vez que cambias algo en el Admin
db.ref('customWod').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        console.log("Datos recibidos de la nube:", data);
        firebaseWodData = data;
        
        // Si la TV ya está en el canal 8, refrescar al instante
        if (isCustomMode) {
            cargarWOD(); 
        }
    }
});


// ==========================================
// RESTO DEL SISTEMA (Reloj, WODs, Slides)
// ==========================================

const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
let currentSlideIndex = 0;
let currentWodParts = [];
let isFullViewMode = false;
let isWGirlsMode = false; 
let timeOffset = 0;

function updateClock() {
  const now = new Date();
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
setInterval(updateClock, 1000);

// --- CARGAR WOD (LÓGICA MAESTRA) ---
function cargarWOD() {
  if (typeof wods === 'undefined') return;

  const hoyIndex = new Date().getDay();
  const diaNombre = dias[hoyIndex];
  const contenedor = document.getElementById('wod-display');

  // 1. DEFINIR FUENTE DE DATOS
  let dataSource = wods[diaNombre]; // Por defecto: Wods Normales del día
  let modoString = 'normal';

  if (isCustomMode) {
    // MODO TECLA 8: Usamos los datos de Firebase
    if (firebaseWodData && firebaseWodData.length > 0) {
      dataSource = firebaseWodData;
      modoString = 'custom';
    } else {
      dataSource = [{titulo: "CARGANDO...", contenido: "Conectando con la nube...\nO no hay WOD personalizado aún."}];
    }
  } else if (isWGirlsMode) {
    // MODO TECLA 9: Usamos WGirls.js
    if (typeof wgirls !== 'undefined') {
      dataSource = wgirls[diaNombre];
      modoString = 'girls';
    }
  }

  // 2. DETECTAR CAMBIOS Y RENDERIZAR
  if (contenedor.dataset.dia !== diaNombre || contenedor.dataset.mode !== modoString || currentWodParts.length === 0) {
    
    contenedor.dataset.dia = diaNombre;
    contenedor.dataset.mode = modoString;
    
    if (Array.isArray(dataSource) && dataSource.length > 0) {
      currentWodParts = dataSource;
    } else {
      const titulo = isWGirlsMode ? "WGIRLS DESCANSO" : "DESCANSO";
      currentWodParts = [{ titulo: titulo, contenido: "Box Cerrado / Open Box" }];
    }

    // Resetear al slide 1
    currentSlideIndex = 0;
    renderSlide();

    // Si estaba la vista completa, refrescarla
    if (isFullViewMode) {
      isFullViewMode = false;
      toggleFullView();
    }
  }
}

function renderSlide() {
  if (isFullViewMode) return;

  const wrapper = document.getElementById('wod-display');
  wrapper.classList.add('fading');

  setTimeout(() => {
    const part = currentWodParts[currentSlideIndex];
    const contenidoFormateado = formatearTexto(part.contenido);

    // Inyectar HTML (Manteniendo estilos originales)
    wrapper.innerHTML = `<h3>${part.titulo}</h3><p>${contenidoFormateado}</p>`;
    
    document.getElementById('slide-indicator').innerText = `${currentSlideIndex + 1} / ${currentWodParts.length}`;

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
  return texto.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
}

// --- AJUSTE DE PANTALLA ---
function ajustarEscala() {
  if (isFullViewMode) return;
  if (window.matchMedia("(orientation: portrait)").matches) return;

  const wrapper = document.getElementById('wod-display');
  if (!wrapper) return;

  wrapper.style.transform = 'scale(1)';
  wrapper.style.height = 'auto'; 
  
  const anchoVisualTotal = window.innerHeight * 0.94;
  const altoVisualTotal = window.innerWidth * 0.65; 

  wrapper.style.width = `${anchoVisualTotal}px`;

  const alturaContenido = wrapper.scrollHeight;
  let escala = altoVisualTotal / alturaContenido;

  if (escala > 1.6) escala = 1.6;
  if (escala < 0.35) escala = 0.35;

  wrapper.style.transform = `scale(${escala})`;
}

// --- TECLADO ---
function cambiarSlide(direccion) {
  const nuevoIndex = currentSlideIndex + direccion;
  if (nuevoIndex >= 0 && nuevoIndex < currentWodParts.length) {
    currentSlideIndex = nuevoIndex;
    renderSlide();
  }
}

document.addEventListener('keydown', function (event) {
  const key = event.key;

  // TECLA 8: CUSTOM MODE (Nube)
  if (key === '8') {
    isCustomMode = !isCustomMode;
    isWGirlsMode = false; // Apagar otros modos
    document.getElementById('wod-display').dataset.mode = ""; 
    cargarWOD(); // Esto ahora usará firebaseWodData
    return;
  }

  // TECLA 9: GIRLS MODE
  if (key === '9') {
    isWGirlsMode = !isWGirlsMode;
    isCustomMode = false;
    document.getElementById('wod-display').dataset.mode = "";
    cargarWOD();
    return;
  }

  if (key === '0') { toggleFullView(); return; }

  // Si estamos en Full View, salir
  if (isFullViewMode && (key === 'Escape' || key === 'Backspace' || key === '0')) {
    toggleFullView(); return;
  }

  // Navegación 1-7
  if (key >= '1' && key <= '7') {
    const targetIndex = parseInt(key) - 1;
    if (targetIndex >= 0 && targetIndex < currentWodParts.length) {
      currentSlideIndex = targetIndex;
      renderSlide();
    }
  }

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
    if (isCustomMode) fullHTML += `<div style="text-align:center; color:#39ff14; letter-spacing:3px; margin-bottom:20px;">-- CUSTOM / NUBE --</div>`;
    else if (isWGirlsMode) fullHTML += `<div style="text-align:center; color:#ff00d4; letter-spacing:3px; margin-bottom:20px;">-- WGIRLS MODE --</div>`;
    
    currentWodParts.forEach(part => {
      fullHTML += `<div class="full-section"><h3>${part.titulo}</h3><p>${formatearTexto(part.contenido)}</p></div>`;
    });
    fullContainer.innerHTML = fullHTML;

    fullContainer.classList.remove('hidden');
    if(slideWrapper) slideWrapper.classList.add('hidden');
    if(buttons) buttons.classList.add('hidden');
    if(indicator) indicator.classList.add('hidden');
  } else {
    fullContainer.classList.add('hidden');
    if(slideWrapper) slideWrapper.classList.remove('hidden');
    if(buttons) buttons.classList.remove('hidden');
    if(indicator) indicator.classList.remove('hidden');
    setTimeout(ajustarEscala, 100);
  }
}

// Init
window.addEventListener('load', () => {
  cargarWOD();
  setTimeout(ajustarEscala, 500);
});
window.addEventListener('resize', () => setTimeout(ajustarEscala, 200));
setInterval(cargarWOD, 60000);
