/* --- START OF FILE script.js --- */

// ==========================================
// 1. VARIABLES GLOBALES Y CONFIGURACIÓN
// ==========================================
const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
let currentSlideIndex = 0;
let currentWodParts = [];
let isFullViewMode = false;
let isWGirlsMode = false;     // Controla el modo WGirls (Tecla 9)
let isCustomViewMode = false; // Controla el modo Custom (Tecla 8)
let timeOffset = 0;

// ==========================================
// 2. SINCRONIZACIÓN Y RELOJ
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
      console.log(`Sincronizado. Offset: ${timeOffset}ms`);
      updateClock();
      cargarWOD(); // Recargar WOD con fecha confirmada
    })
    .catch(err => console.log("Usando hora del sistema."));
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
// 3. LÓGICA DE CARGA DE WODS
// ==========================================
function cargarWOD() {
  if (typeof wods === 'undefined') return;

  const hoyIndex = getBoliviaDate().getDay();
  const diaNombre = dias[hoyIndex];
  const contenedor = document.getElementById('wod-display');

  // Seleccionar fuente de datos
  let dataSource = wods;
  if (isWGirlsMode) {
    if (typeof wgirls !== 'undefined') dataSource = wgirls;
  }

  const modoActual = isWGirlsMode ? 'girls' : 'normal';

  // Solo actualizar si algo cambió
  if (contenedor.dataset.dia !== diaNombre || contenedor.dataset.mode !== modoActual || currentWodParts.length === 0) {
    
    contenedor.dataset.dia = diaNombre;
    contenedor.dataset.mode = modoActual;
    
    const datosDia = dataSource[diaNombre];

    if (Array.isArray(datosDia) && datosDia.length > 0) {
      currentWodParts = datosDia;
    } else {
      const tituloDescanso = isWGirlsMode ? "WGIRLS DESCANSO" : "DESCANSO";
      currentWodParts = [{ titulo: tituloDescanso, contenido: "Box Cerrado / Open Box" }];
    }

    currentSlideIndex = 0;
    renderSlide();

    // Refrescar vista completa si está abierta
    if (isFullViewMode) {
      isFullViewMode = false; 
      toggleFullView();
    }
  }
}

function renderSlide() {
  if (isFullViewMode || isCustomViewMode) return; // No renderizar slides si hay overlays

  const wrapper = document.getElementById('wod-display');
  wrapper.classList.add('fading');

  setTimeout(() => {
    const part = currentWodParts[currentSlideIndex];
    const contenidoFormateado = formatearTexto(part.contenido);

    wrapper.innerHTML = `<h3>${part.titulo}</h3><p>${contenidoFormateado}</p>`;
    
    // Indicador
    const ind = document.getElementById('slide-indicator');
    if(ind) ind.innerText = `${currentSlideIndex + 1} / ${currentWodParts.length}`;

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

// ==========================================
// 4. VISTAS ESPECIALES (Full & Custom)
// ==========================================

// --- VISTA COMPLETA (0) ---
function toggleFullView() {
  isFullViewMode = !isFullViewMode;
  const fullContainer = document.getElementById('full-view-container');
  const slideWrapper = document.getElementById('wod-display');
  const indicator = document.getElementById('slide-indicator');
  const buttons = document.getElementById('nav-buttons');

  if (isFullViewMode) {
    let fullHTML = "";
    if (isWGirlsMode) fullHTML += `<div style="text-align:center; color:#ccc; letter-spacing:3px; margin-bottom:20px;">-- WGIRLS MODE --</div>`;
    
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

// --- VISTA CUSTOM (8) ---
function toggleCustomView() {
  const existingOverlay = document.getElementById('custom-overlay');

  if (isCustomViewMode && existingOverlay) {
    existingOverlay.remove();
    isCustomViewMode = false;
  } else {
    const saved = localStorage.getItem('customWod');
    if (!saved) {
      alert("No hay WOD personalizado guardado. Usa /admin.html para crear uno.");
      return;
    }
    
    let data;
    try { data = JSON.parse(saved); } catch(e) { return; }

    const overlay = document.createElement('div');
    overlay.id = 'custom-overlay';
    overlay.className = 'custom-wod-overlay'; // REQUIERE EL CSS NUEVO
    overlay.innerHTML = `<h3>${data.titulo}</h3><p>${formatearTexto(data.contenido)}</p>`;
    
    document.body.appendChild(overlay);
    isCustomViewMode = true;
  }
}

// ==========================================
// 5. AJUSTE DE PANTALLA
// ==========================================
function ajustarEscala() {
  if (isFullViewMode || isCustomViewMode) return;
  if (window.matchMedia("(orientation: portrait)").matches) return;

  const wrapper = document.getElementById('wod-display');
  if (!wrapper) return;

  // Reset
  wrapper.style.transform = 'scale(1)';
  wrapper.style.height = 'auto'; 
  
  const anchoVisual = window.innerHeight * 0.94; 
  const altoVisual = window.innerWidth * 0.90; 

  wrapper.style.width = `${anchoVisual}px`;
  wrapper.style.maxWidth = `${anchoVisual}px`;

  // Medir
  const alturaContenido = wrapper.scrollHeight;
  const anchoContenido = wrapper.scrollWidth; // Debería ser igual al estilo width

  // Calcular escalas
  const escalaAlto = altoVisual / alturaContenido;
  const escalaAncho = anchoVisual / anchoContenido; // Por si acaso

  // Usar la más restrictiva
  let escala = Math.min(escalaAlto, escalaAncho);

  // Límites
  if (escala > 1.6) escala = 1.6;
  if (escala < 0.25) escala = 0.25;

  wrapper.style.transform = `scale(${escala})`;
}

// ==========================================
// 6. CONTROL DE ENTRADA (TECLADO)
// ==========================================
document.addEventListener('keydown', function (event) {
  const key = event.key;

  // --- PRIORIDAD 1: SALIR DE MODOS ESPECIALES ---
  if (isCustomViewMode) {
    if (key === 'Escape' || key === 'Backspace' || key === '8') toggleCustomView();
    return; // Bloquea todo lo demás
  }
  
  if (isFullViewMode) {
    if (key === 'Escape' || key === 'Backspace' || key === '0') toggleFullView();
    return; // Bloquea todo lo demás
  }

  // --- PRIORIDAD 2: ACTIVAR MODOS ---
  if (key === '9') { // Toggle Girls
    isWGirlsMode = !isWGirlsMode;
    document.getElementById('wod-display').dataset.mode = ""; // Forzar recarga
    cargarWOD();
    return;
  }

  if (key === '0') { toggleFullView(); return; }
  if (key === '8') { toggleCustomView(); return; }

  // --- PRIORIDAD 3: NAVEGACIÓN NORMAL (1-7 y Flechas) ---
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

// ==========================================
// 7. INICIALIZACIÓN
// ==========================================
function cambiarSlide(direccion) {
  const nuevoIndex = currentSlideIndex + direccion;
  if (nuevoIndex >= 0 && nuevoIndex < currentWodParts.length) {
    currentSlideIndex = nuevoIndex;
    renderSlide();
  }
}

window.addEventListener('load', () => {
  syncTime(); 
  cargarWOD(); 
  setTimeout(ajustarEscala, 500);
});
window.addEventListener('resize', () => setTimeout(ajustarEscala, 200));
setInterval(syncTime, 3600000); // Sync cada hora
setInterval(updateClock, 1000);
setInterval(cargarWOD, 60000); // Chequeo cambio día
