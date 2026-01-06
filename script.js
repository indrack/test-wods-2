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
let isWGirlsMode = false; // Variable para controlar el modo WGirls

// --- CARGAR WOD ---
function cargarWOD() {
  // Verificación de seguridad básica
  if (typeof wods === 'undefined') return;

  const hoyIndex = new Date().getDay();
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
  const slideWrapper = document.getElementById('wod-display-container'); 
  const indicator = document.getElementById('slide-indicator');
  const buttons = document.getElementById('nav-buttons');

  if (isFullViewMode) {
    // Generar el HTML de TODOS los bloques
    let fullHTML = "";
    
    // Título opcional para saber en qué modo estamos
    if(isWGirlsMode) {
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
    fullContainer.classList.remove('d-none');
    if (slideWrapper) slideWrapper.classList.add('d-none');
    if (buttons) buttons.classList.add('d-none');
  } else {
    // Ocultar capa completa, mostrar slides
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

// --- AJUSTAR ESCALA (Corrección de Texto Angosto y Centrado Superior) ---
function ajustarEscala() {
  if (isFullViewMode) return;
  if (window.matchMedia("(orientation: portrait)").matches) return;

  const wrapper = document.getElementById('wod-display');
  if (!wrapper) return;

  wrapper.style.transform = 'scale(1)';
  wrapper.style.height = 'auto'; 
  
  // Usamos el 94% del ancho visual (Tv rotada)
  const anchoVisualTotal = window.innerHeight * 0.94;
  
  // Usamos el 65% del alto visual para evitar chocar con los botones de abajo
  const altoVisualTotal = window.innerWidth * 0.65; 

  // Forzamos el ancho para que el texto no se haga angosto
  wrapper.style.width = `${anchoVisualTotal}px`;

  const alturaContenido = wrapper.scrollHeight;

  // Calculamos zoom basado en la altura
  let escala = altoVisualTotal / alturaContenido;

  // Límites
  if (escala > 1.6) escala = 1.6;
  if (escala < 0.35) escala = 0.35;

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

  // Si está en vista completa, salir con Escape, Borrar o 0
  if (isFullViewMode) {
    if (key === 'Escape' || key === 'Backspace' || key === '0') toggleFullView();
    return;
  }

  // Teclas 1-8 para ir directo a un slide
  if (key >= '1' && key <= '8') {
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

// Inicialización
window.addEventListener('load', () => {
  cargarWOD();
  setTimeout(ajustarEscala, 500);
});
window.addEventListener('resize', () => setTimeout(ajustarEscala, 200));
setInterval(cargarWOD, 60000);
