/* --- START OF FILE script.js --- */

// --- RELOJ DIGITAL ---
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
updateClock();

// --- VARIABLES GLOBALES ---
const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
let currentSlideIndex = 0;
let currentWodParts = [];
let isFullViewMode = false;

// --- NUEVO: VARIABLE DE ESTADO PARA WGIRLS ---
let isWGirlsMode = false; 

// --- CARGAR WOD (MODIFICADO PARA SOPORTAR WGIRLS) ---
function cargarWOD() {
  // Verificación de seguridad
  if (typeof wods === 'undefined') return;

  const hoyIndex = new Date().getDay();
  const diaNombre = dias[hoyIndex];
  const contenedor = document.getElementById('wod-display');

  // --- NUEVO: SELECCIÓN DE BASE DE DATOS ---
  // Si estamos en modo Girls, usamos la variable 'wgirls', si no, usamos 'wods'
  let dataSource = wods; // Por defecto
  
  if (isWGirlsMode) {
    // Verificamos que el archivo WGirls.js se haya cargado bien
    if (typeof wgirls !== 'undefined') {
      dataSource = wgirls;
    } else {
      console.error("WGirls.js no está cargado o tiene errores");
    }
  }

  // Si cambia el día, la base de datos (modo), o carga inicial
  // Agregamos una marca al dataset para saber en qué modo estamos visualmente en código
  const modoActual = isWGirlsMode ? 'girls' : 'normal';

  if (contenedor.dataset.dia !== diaNombre || contenedor.dataset.mode !== modoActual || currentWodParts.length === 0) {
    
    contenedor.dataset.dia = diaNombre;
    contenedor.dataset.mode = modoActual; // Guardamos el modo actual
    
    const datosDia = dataSource[diaNombre];

    if (Array.isArray(datosDia) && datosDia.length > 0) {
      currentWodParts = datosDia;
    } else {
      // Mensaje de descanso (personalizado según el modo si quieres)
      const tituloDescanso = isWGirlsMode ? "WGIRLS DESCANSO" : "DESCANSO";
      currentWodParts = [{ titulo: tituloDescanso, contenido: "Box Cerrado / Open Box" }];
    }

    currentSlideIndex = 0;
    renderSlide();

    // Si estábamos en vista completa, refrescar
    if (isFullViewMode) {
      isFullViewMode = false;
      toggleFullView(); 
    }
  }
}

// --- RENDERIZAR SLIDE ---
function renderSlide() {
  if (isFullViewMode) return;

  const wrapper = document.getElementById('wod-display');
  wrapper.classList.add('fading');

  setTimeout(() => {
    const part = currentWodParts[currentSlideIndex];

    // 1. APLICAR FORMATO NEGRITA
    const contenidoFormateado = formatearTexto(part.contenido);

    // 2. INYECTAR HTML
    wrapper.innerHTML = `<h3>${part.titulo}</h3><p>${contenidoFormateado}</p>`;

    // Actualizar indicador
    document.getElementById('slide-indicator').innerText = `${currentSlideIndex + 1} / ${currentWodParts.length}`;

    // Actualizar botones
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

// --- HELPER NEGRITA ---
function formatearTexto(texto) {
  if (!texto) return "";
  return texto.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
}

// --- MODO VISTA COMPLETA ---
function toggleFullView() {
  isFullViewMode = !isFullViewMode;

  const fullContainer = document.getElementById('full-view-container');
  const slideWrapper = document.getElementById('wod-display-container'); 
  const indicator = document.getElementById('slide-indicator');
  const buttons = document.getElementById('nav-buttons');

  if (isFullViewMode) {
    let fullHTML = "";
    currentWodParts.forEach(part => {
      const contenidoFormateado = formatearTexto(part.contenido);
      fullHTML += `
        <div class="full-section">
          <h3>${part.titulo}</h3>
          <p>${contenidoFormateado}</p>
        </div>
      `;
    });
    fullContainer.innerHTML = fullHTML;

    fullContainer.classList.remove('d-none');
    if (slideWrapper) slideWrapper.classList.add('d-none');
    if (buttons) buttons.classList.add('d-none');
  } else {
    fullContainer.classList.add('d-none');
    if (slideWrapper) slideWrapper.classList.remove('d-none');
    if (buttons) buttons.classList.remove('d-none');
    setTimeout(ajustarEscala, 100);
  }
}

function cambiarSlide(direccion) {
  if (isFullViewMode) return;
  const nuevoIndex = currentSlideIndex + direccion;
  if (nuevoIndex >= 0 && nuevoIndex < currentWodParts.length) {
    currentSlideIndex = nuevoIndex;
    renderSlide();
  }
}

// --- AJUSTAR ESCALA ---
function ajustarEscala() {
  if (isFullViewMode) return;
  if (window.matchMedia("(orientation: portrait)").matches) return;

  const wrapper = document.getElementById('wod-display');
  if (!wrapper) return;

  wrapper.style.transform = 'scale(1)';
  wrapper.style.height = 'auto'; 
  
  // Usamos el 94% del ancho visual (Tv rotada = innerHeight)
  const anchoVisualTotal = window.innerHeight * 0.94;
  
  // Usamos el 65% del alto visual (Tv rotada = innerWidth) para dejar espacio abajo
  const altoVisualTotal = window.innerWidth * 0.65; 

  wrapper.style.width = `${anchoVisualTotal}px`;

  const alturaContenido = wrapper.scrollHeight;

  let escala = altoVisualTotal / alturaContenido;

  if (escala > 1.6) escala = 1.6;
  if (escala < 0.35) escala = 0.35;

  wrapper.style.transform = `scale(${escala})`;
}

// --- CONTROL DE TECLADO ---
document.addEventListener('keydown', function (event) {
  const key = event.key;

  // --- NUEVO: TECLA 9 PARA CAMBIAR MODO ---
  if (key === '9') {
    isWGirlsMode = !isWGirlsMode; // Alternar true/false
    
    // Forzamos la recarga inmediata del contenido
    const contenedor = document.getElementById('wod-display');
    contenedor.dataset.mode = ""; // Limpiamos para forzar el if de cargarWOD
    cargarWOD();
    
    return;
  }

  if (key === '0') {
    toggleFullView();
    return;
  }

  if (isFullViewMode) {
    if (key === 'Escape' || key === 'Backspace' || key === '0') toggleFullView();
    return;
  }

  if (key >= '1' && key <= '8') { // Cambiado a 8 porque el 9 ahora es toggle
    const targetIndex = parseInt(key) - 1;
    if (targetIndex >= 0 && targetIndex < currentWodParts.length) {
      currentSlideIndex = targetIndex;
      renderSlide();
    }
  }

  if (key === 'ArrowLeft') cambiarSlide(-1);
  if (key === 'ArrowRight' || key === 'Enter') cambiarSlide(1);
});

// Inicialización
window.addEventListener('load', () => {
  cargarWOD();
  setTimeout(ajustarEscala, 500);
});
window.addEventListener('resize', () => setTimeout(ajustarEscala, 200));
setInterval(cargarWOD, 60000);
