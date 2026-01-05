// --- RELOJ DIGITAL ---
function updateClock() {
  const now = new Date();
  const dia = String(now.getDate()).padStart(2, '0');
  const mes = String(now.getMonth() + 1).padStart(2, '0');
  const anio = now.getFullYear();
  const elDate = document.getElementById('date-display');
  if(elDate) elDate.innerText = `${dia}/${mes}/${anio}`;

  const horas = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const seg = String(now.getSeconds()).padStart(2, '0');
  const elTime = document.getElementById('time-display');
  if(elTime) elTime.innerText = `${horas}:${min}:${seg}`;
}
setInterval(updateClock, 1000);
updateClock();

// --- VARIABLES GLOBALES ---
const dias = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];
let currentSlideIndex = 0;
let currentWodParts = [];
let isFullViewMode = false;

// --- CARGAR WOD ---
function cargarWOD() {
  if (typeof wods === 'undefined') return;

  const hoyIndex = new Date().getDay();
  const diaNombre = dias[hoyIndex];
  const contenedor = document.getElementById('wod-display');
  
  // Si cambia el día o carga inicial
  if (contenedor.dataset.dia !== diaNombre || currentWodParts.length === 0) {
    contenedor.dataset.dia = diaNombre;
    const datosDia = wods[diaNombre];
    
    if (Array.isArray(datosDia)) {
      currentWodParts = datosDia;
    } else {
      currentWodParts = [{ titulo: "DESCANSO", contenido: "Box Cerrado / Open Box" }];
    }
    
    currentSlideIndex = 0;
    renderSlide();
    
    // Si estábamos en modo full, refrescar contenido
    if(isFullViewMode) {
        toggleFullView(); 
        // Pequeño hack para que no se cierre y vuelva a abrir, sino que renderice
        isFullViewMode = !isFullViewMode; 
        toggleFullView();
    }
  }
}

// --- RENDERIZAR SLIDE (CON NEGRITA) ---
function renderSlide() {
  if(isFullViewMode) return; 

  const wrapper = document.getElementById('wod-display');
  wrapper.classList.add('fading');

  setTimeout(() => {
    const part = currentWodParts[currentSlideIndex];
    
    // 1. APLICAR FORMATO NEGRITA
    const contenidoFormateado = formatearTexto(part.contenido);

    // 2. INYECTAR HTML
    wrapper.innerHTML = `<h3>${part.titulo}</h3><p>${contenidoFormateado}</p>`;

    document.getElementById('slide-indicator').innerText = `${currentSlideIndex + 1} / ${currentWodParts.length}`;
    
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    if(btnPrev) {
        btnPrev.disabled = (currentSlideIndex === 0);
        btnPrev.style.opacity = (currentSlideIndex === 0) ? "0" : "1";
    }
    if(btnNext) {
        btnNext.disabled = (currentSlideIndex === currentWodParts.length - 1);
        btnNext.style.opacity = (currentSlideIndex === currentWodParts.length - 1) ? "0" : "1";
    }

    ajustarEscala(); // Llama a la versión "Fit"
    wrapper.classList.remove('fading');
  }, 300);
}

// --- HELPER NEGRITA ---
function formatearTexto(texto) {
  if (!texto) return "";
  // Convierte *texto* en <strong>texto</strong>
  return texto.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
}

// --- MODO VISTA COMPLETA ---
function toggleFullView() {
  isFullViewMode = !isFullViewMode; 
  
  const fullContainer = document.getElementById('full-view-container');
  const slideWrapper = document.getElementById('wod-display');
  const indicator = document.getElementById('slide-indicator');
  const buttons = document.getElementById('nav-buttons');

  if (isFullViewMode) {
    // Generar HTML con negrita
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

    fullContainer.classList.remove('hidden');
    slideWrapper.classList.add('hidden');
    indicator.classList.add('hidden');
    buttons.classList.add('hidden');

  } else {
    fullContainer.classList.add('hidden');
    slideWrapper.classList.remove('hidden');
    indicator.classList.remove('hidden');
    buttons.classList.remove('hidden');
    
    setTimeout(ajustarEscala, 100);
  }
}

function cambiarSlide(direccion) {
  if(isFullViewMode) return; 
  const nuevoIndex = currentSlideIndex + direccion;
  if (nuevoIndex >= 0 && nuevoIndex < currentWodParts.length) {
    currentSlideIndex = nuevoIndex;
    renderSlide();
  }
}

// --- AJUSTAR ESCALA (VERSIÓN "STRICT FIT" DE LA PANTALLA AJUSTADA) ---
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
document.addEventListener('keydown', function(event) {
  const key = event.key; 
  const code = event.keyCode; 

  if (key === '0' || code === 48 || code === 96) {
    toggleFullView();
    return;
  }

  if (isFullViewMode) {
     if(key === 'Escape' || key === 'Backspace') toggleFullView();
     return; 
  }

  if (key >= '1' && key <= '9') {
    const targetIndex = parseInt(key) - 1;
    if (targetIndex >= 0 && targetIndex < currentWodParts.length) {
      currentSlideIndex = targetIndex;
      renderSlide();
    }
  }

  if (key === 'ArrowLeft' || code === 37) cambiarSlide(-1);
  if (key === 'ArrowRight' || code === 39) cambiarSlide(1);
  if (key === 'Enter' || code === 13) cambiarSlide(1);
});

// Inicialización
window.addEventListener('load', () => { cargarWOD(); setTimeout(ajustarEscala, 500); });
window.addEventListener('resize', () => setTimeout(ajustarEscala, 100));
setInterval(cargarWOD, 60000);
