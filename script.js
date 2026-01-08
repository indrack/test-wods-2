/* --- START OF FILE script.js --- */


// --- RELOJ DIGITAL & SINCRONIZACIÓN WEB ---
let timeOffset = 0; // Desfase en milisegundos (Server Time - Local System Time)

// Helper para obtener la fecha corregida (Bolivia)
function getBoliviaDate() {
  return new Date(Date.now() + timeOffset);
}

// Sincronizar con hora de internet (La Paz)
function syncTime() {
  fetch('http://worldtimeapi.org/api/timezone/America/La_Paz')
    .then(response => response.json())
    .then(data => {
      // data.datetime es la hora real en Bolivia
      const serverTime = new Date(data.datetime).getTime();
      const localTime = Date.now();
      timeOffset = serverTime - localTime;
      console.log(`Hora sincronizada. Offset: ${timeOffset}ms`);

      // Actualizar inmediatamente para evitar lag visual
      updateClock();
      cargarWOD();
    })
    .catch(err => {
      console.error("Error sincronizando hora, usando hora del sistema:", err);
      // En caso de error, el offset se mantiene en 0 (u otro valor previo si hubo éxito antes)
    });
}

function updateClock() {
  const now = getBoliviaDate(); // Usamos la hora sincronizada
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
// Sincronizar al inicio y luego cada hora
setInterval(syncTime, 3600000);

// --- VARIABLES GLOBALES ---
const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
let currentSlideIndex = 0;
let currentWodParts = [];
let isFullViewMode = false;
let isWGirlsMode = false; // Variable para controlar el modo WGirls

// --- CARGAR WOD ---
function cargarWOD() {
  // Verificación de seguridad básica
  if (typeof wods === 'undefined') return;

  const hoyIndex = getBoliviaDate().getDay(); // Usamos la hora sincronizada
  const diaNombre = dias[hoyIndex];
  const contenedor = document.getElementById('wod-display');

  // Seleccionar la base de datos correcta (Wods o WGirls)
  let dataSource = wods;
  if (isWGirlsMode) {
    if (typeof wgirls !== 'undefined') {
      dataSource = wgirls;
    } else {
      console.error("Error: WGirls.js no se ha cargado.");
    }
  }

  // Detectar cambio de día, cambio de modo (Girls/Normal) o carga inicial
  const modoActual = isWGirlsMode ? 'girls' : 'normal';

  if (contenedor.dataset.dia !== diaNombre || contenedor.dataset.mode !== modoActual || currentWodParts.length === 0) {

    contenedor.dataset.dia = diaNombre;
    contenedor.dataset.mode = modoActual; // Guardamos el modo para no recargar innecesariamente

    const datosDia = dataSource[diaNombre];

    if (Array.isArray(datosDia) && datosDia.length > 0) {
      currentWodParts = datosDia;
    } else {
      const tituloDescanso = isWGirlsMode ? "WGIRLS DESCANSO" : "DESCANSO";
      currentWodParts = [{ titulo: tituloDescanso, contenido: "Box Cerrado / Open Box" }];
    }

    currentSlideIndex = 0;
    renderSlide();

    // Si tenías abierta la vista completa (0), la actualizamos automáticamente con los nuevos datos
    if (isFullViewMode) {
      isFullViewMode = false; // Lo apagamos momentáneamente
      toggleFullView();       // Lo volvemos a encender para repintar
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

    // Aplicar formato negrita
    const contenidoFormateado = formatearTexto(part.contenido);

    // Inyectar HTML
    wrapper.innerHTML = `<h3>${part.titulo}</h3><p>${contenidoFormateado}</p>`;

    // Indicador (Ej: 1/3)
    document.getElementById('slide-indicator').innerText = `${currentSlideIndex + 1} / ${currentWodParts.length}`;

    // Estado de botones
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

// --- MODO VISTA COMPLETA (TECLA 0) ---
function toggleFullView() {
  isFullViewMode = !isFullViewMode;

  const fullContainer = document.getElementById('full-view-container');
  const slideWrapper = document.getElementById('wod-display');
  const indicator = document.getElementById('slide-indicator');
  const buttons = document.getElementById('nav-buttons');

  if (isFullViewMode) {
    // Generar el HTML de TODOS los bloques
    let fullHTML = "";

    // Título opcional para saber en qué modo estamos
    if (isWGirlsMode) {
      fullHTML += `<div class="text-center text-secondary mb-3" style="font-family:var(--font-tech); letter-spacing:3px;">-- WGIRLS MODE --</div>`;
    }

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

    // Mostrar capa completa, ocultar slides
    fullContainer.classList.remove('hidden');
    if (slideWrapper) slideWrapper.classList.add('hidden');
    if (buttons) buttons.classList.add('hidden');
    if (indicator) indicator.classList.add('hidden');
  } else {
    // Ocultar capa completa, mostrar slides
    fullContainer.classList.add('hidden');
    if (slideWrapper) slideWrapper.classList.remove('hidden');
    if (buttons) buttons.classList.remove('hidden');
    if (indicator) indicator.classList.remove('hidden');
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

// --- AJUSTAR ESCALA (Corrección de Texto Angosto y Centrado Superior) ---
function ajustarEscala() {
  if (isFullViewMode) return;
  // Respetamos la vista móvil original (no escala igual)
  if (window.matchMedia("(orientation: portrait)").matches) return;

  const wrapper = document.getElementById('wod-display');
  if (!wrapper) return;

  // 1. DEFINIR LÍMITES VISUALES
  // window.innerHeight = ANCHO visual en tu pared (aprox 1920px)
  // window.innerWidth  = ALTO visual en tu pared (aprox 1080px)

  const anchoVisualMaximo = window.innerHeight * 0.94; // 94% del ancho físico
  const altoVisualMaximo = window.innerWidth * 0.90;   // 90% del alto físico

  // 2. PREPARAR EL CONTENEDOR
  // Usamos width: auto para que el div tome su tamaño natural
  wrapper.style.width = 'auto';
  wrapper.style.maxWidth = `${anchoVisualMaximo}px`;
  wrapper.style.height = 'auto';

  wrapper.style.transform = 'scale(1)';

  // 3. MEDIR TAMAÑO REAL
  const anchoActual = wrapper.scrollWidth;
  const altoActual = wrapper.scrollHeight;

  // 4. CALCULAR ESCALA PERFECTA
  // A) Escala para encajar ANCHO
  const escalaAncho = anchoVisualMaximo / anchoActual;

  // B) Escala para encajar ALTO
  const escalaAlto = altoVisualMaximo / altoActual;

  // Elegimos la MENOR de las dos para asegurar que entre completo
  let escala = Math.min(escalaAncho, escalaAlto);

  // 5. LÍMITES
  if (escala > 1.6) escala = 1.6;
  if (escala < 0.25) escala = 0.25;

  wrapper.style.transform = `scale(${escala})`;
}

// --- CONTROL DE TECLADO ---
document.addEventListener('keydown', function (event) {
  const key = event.key;

  // TECLA 9: Alternar entre WODs Normales y WGirls
  if (key === '9') {
    isWGirlsMode = !isWGirlsMode;

    // Limpiamos el dataset para obligar a cargarWOD a repintar todo
    const contenedor = document.getElementById('wod-display');
    contenedor.dataset.mode = "";

    cargarWOD();
    return;
  }

  // TECLA 0: Activar/Desactivar Vista Completa
  if (key === '0') {
    toggleFullView();
    return;
  }

  // TECLA 8: Mostrar/Ocultar Custom Workout (LocalStorage)
  if (key === '8') {
    toggleCustomView();
    return;
  }

  // Si está en CUSTOM MODE, salir con Escape, Borrar o 8
  if (isCustomViewMode) {
    if (key === 'Escape' || key === 'Backspace' || key === '8') toggleCustomView();
    // Bloquear el resto de navegación mientras está este modo
    return;
  }

  // Si está en vista completa, salir con Escape, Borrar o 0
  if (isFullViewMode) {
    if (key === 'Escape' || key === 'Backspace' || key === '0') toggleFullView();
    return;
  }

  // Teclas 1-7 para ir directo a un slide (La 8 ahora es reservada)
  if (key >= '1' && key <= '7') {
    const targetIndex = parseInt(key) - 1;
    if (targetIndex >= 0 && targetIndex < currentWodParts.length) {
      currentSlideIndex = targetIndex;
      renderSlide();
    }
  }

  // Flechas de navegación
  if (key === 'ArrowLeft') cambiarSlide(-1);
  if (key === 'ArrowRight' || key === 'Enter') cambiarSlide(1);
});

/* --- CUSTOM WORKOUT LOGIC --- */
let isCustomViewMode = false;

function toggleCustomView() {
  const existingOverlay = document.getElementById('custom-overlay');

  if (isCustomViewMode && existingOverlay) {
    // Apagar
    existingOverlay.remove();
    isCustomViewMode = false;
  } else {
    // Encender
    // 1. Leer datos
    const saved = localStorage.getItem('customWod');
    if (!saved) {
      alert("No hay Custom WOD guardado. Usa la página de admin para crear uno.");
      return;
    }

    let data;
    try { data = JSON.parse(saved); } catch (e) { return; }

    // 2. Crear Overlay
    const overlay = document.createElement('div');
    overlay.id = 'custom-overlay';
    overlay.className = 'custom-wod-overlay';

    // 3. Formatear contenido
    const textFormatted = formatearTexto(data.contenido);

    overlay.innerHTML = `
      <h3>${data.titulo}</h3>
      <p>${textFormatted}</p>
    `;

    document.body.appendChild(overlay);
    isCustomViewMode = true;
  }
}

// Inicialización
window.addEventListener('load', () => {
  syncTime(); // Sincronización inicial
  // cargarWOD() se llama dentro de syncTime cuando termina, 
  // pero también lo dejamos aquí por si syncTime falla o se demora mucho, 
  // aunque lo ideal es esperar.
  // Para simplificar, lo llamamos de todas formas, y syncTime lo actualizará luego.
  cargarWOD(); // Carga inicial con hora local mientras llega la de internet
  setTimeout(ajustarEscala, 500);
});
window.addEventListener('resize', () => setTimeout(ajustarEscala, 200));
setInterval(cargarWOD, 60000);


