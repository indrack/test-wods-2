/* --- START OF FILE script.js --- */

// ==========================================
// 1. CONFIGURACIÓN FIREBASE
// ==========================================
// ¡OJO! REEMPLAZA ESTO CON TUS DATOS REALES DE FIREBASE O NO FUNCIONARÁ EL MODO 8
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

// Intentar conectar la base de datos (si firebase cargó correctamente)
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
let isWGirlsMode = false;     // Tecla 9
let isCustomMode = false;     // Tecla 8 (Unificado el nombre de variable)
let firebaseWodData = [];     // Datos descargados de la nube
let timeOffset = 0;

// Escuchar cambios de Firebase
if (db) {
    db.ref('customWod').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            console.log("Datos nube recibidos");
            firebaseWodData = data;
            if (isCustomMode) cargarWOD(); // Refrescar si estamos viendo el canal 8
        }
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

  // 1. Elegir fuente de datos
  let dataSource = wods[diaNombre]; // Por defecto
  let modoString = 'normal';

  if (isCustomMode) {
    // Modo Nube (Tecla 8)
    if (firebaseWodData && firebaseWodData.length > 0) {
      dataSource = firebaseWodData;
      modoString = 'custom';
    } else {
      dataSource = [{titulo: "CONECTANDO...", contenido: "Esperando datos de la nube...\nRevisa tu conexión o el Admin."}];
    }
  } else if (isWGirlsMode) {
    // Modo Girls (Tecla 9)
    if (typeof wgirls !== 'undefined') {
      dataSource = wgirls[diaNombre];
      modoString = 'girls';
    }
  }

  // 2. Detectar cambios para no parpadear
  if (contenedor.dataset.dia !== diaNombre || contenedor.dataset.mode !== modoString || currentWodParts.length === 0) {
    
    contenedor.dataset.dia = diaNombre;
    contenedor.dataset.mode = modoString;
    
    if (Array.isArray(dataSource) && dataSource.length > 0) {
      currentWodParts = dataSource;
    } else {
      const titulo = isWGirlsMode ? "WGIRLS DESCANSO" : "DESCANSO";
      currentWodParts = [{ titulo: titulo, contenido: "Box Cerrado / Open Box" }];
    }

    currentSlideIndex = 0;
    renderSlide();

    // Si la vista completa estaba abierta, cerrarla y abrirla para actualizar
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

    wrapper.innerHTML = `<h3>${part.titulo}</h3><p>${contenidoFormateado}</p>`;
    
    // Indicador
    const ind = document.getElementById('slide-indicator');
    if (ind) ind.innerText = `${currentSlideIndex + 1} / ${currentWodParts.length}`;

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

    ajustarEscala(); // Llamamos a tu ajuste preferido
    wrapper.classList.remove('fading');
  }, 300);
}

function formatearTexto(texto) {
  if (!texto) return "";
  return texto.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
}

// ==========================================
// 5. AJUSTE DE PANTALLA (TU VERSIÓN PREFERIDA)
// ==========================================
function ajustarEscala() {
  // Si estamos en modo resumen o es móvil vertical, no escalamos igual
  if (isFullViewMode) return; 
  if (window.matchMedia("(orientation: portrait)").matches) return; 

  const wrapper = document.getElementById('wod-display');
  if (!wrapper) return;

  // 1. DEFINIR LÍMITES VISUALES (Caja Rígida / Safe Box)
  // window.innerHeight = ANCHO visual en tu pared (aprox 1920px)
  // window.innerWidth  = ALTO visual en tu pared (aprox 1080px)
  
  // Usamos márgenes de seguridad del que te gustaba
  const anchoVisualMaximo = window.innerHeight * 0.94; // 94% del ancho físico
  const altoVisualMaximo = window.innerWidth * 0.90;   // 90% del alto físico

  // 2. PREPARAR EL CONTENEDOR 
  // No forzamos un ancho fijo gigante. Decimos: "Sé tan ancho como necesites, 
  // pero NUNCA más ancho que la pantalla".
  wrapper.style.width = 'auto'; 
  wrapper.style.maxWidth = `${anchoVisualMaximo}px`;
  wrapper.style.height = 'auto';
  
  // Reseteamos escala para medir el tamaño "natural"
  wrapper.style.transform = 'scale(1)';

  // 3. MEDIR TAMAÑO REAL DEL CONTENIDO
  const anchoActual = wrapper.scrollWidth;
  const altoActual = wrapper.scrollHeight;

  // 4. CALCULAR ESCALA PERFECTA (DOBLE VERIFICACIÓN)
  
  // A) ¿Cuánto puedo crecer/encoger para encajar en el ANCHO?
  const escalaAncho = anchoVisualMaximo / anchoActual;
  
  // B) ¿Cuánto puedo crecer/encoger para encajar en el ALTO?
  const escalaAlto = altoVisualMaximo / altoActual;

  // Elegimos la MENOR de las dos.
  // Esto asegura que si el texto es muy ancho, se limita por el ancho.
  // Si es muy alto, se limita por el alto. NUNCA se saldrá.
  let escala = Math.min(escalaAncho, escalaAlto);

  // 5. LÍMITES FINALES
  // Tope máximo (1.6x) para que el Warm-up se vea grande y potente
  if (escala > 1.6) escala = 1.6; 
  
  // Tope mínimo (0.25x) para que entre cualquier biblia de texto
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
  
  // TECLA 8: CUSTOM MODE (Nube)
  if (key === '8') {
    isCustomMode = !isCustomMode;
    isWGirlsMode = false; // Apagar WGirls
    document.getElementById('wod-display').dataset.mode = ""; // Forzar refresco
    cargarWOD();
    return;
  }

  // TECLA 9: GIRLS MODE
  if (key === '9') {
    isWGirlsMode = !isWGirlsMode;
    isCustomMode = false; // Apagar Custom
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

  // --- NAVEGACIÓN (1-7) ---
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
  const slideWrapper = document.getElementById('wod-display'); // Corrección: Ocultar el wrapper directo, no container
  const indicator = document.getElementById('slide-indicator');
  const buttons = document.getElementById('nav-buttons');

  if (isFullViewMode) {
    let fullHTML = "";
    // Etiquetas de modo
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

// ==========================================
// 7. INICIALIZACIÓN
// ==========================================
window.addEventListener('load', () => {
  syncTime(); 
  cargarWOD(); 
  setTimeout(ajustarEscala, 500);
});
window.addEventListener('resize', () => setTimeout(ajustarEscala, 200));
setInterval(syncTime, 3600000); 
setInterval(updateClock, 1000);
setInterval(cargarWOD, 60000);
