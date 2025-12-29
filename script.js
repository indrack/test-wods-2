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
    if (isFullViewMode) {
      isFullViewMode = false;
      toggleFullView(); // Re-toggle to update content
    }
  }
}

// --- RENDERIZAR SLIDE (CON NEGRITA) ---
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
  }, 400); // Matches CSS transition duration
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
  const slideWrapper = document.getElementById('wod-display-container'); // Using the bootstrap container
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

    fullContainer.classList.remove('d-none'); // Bootstrap toggle
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

// --- AJUSTAR ESCALA (Refined for Rotated View) ---
function ajustarEscala() {
  if (isFullViewMode) return;
  if (window.matchMedia("(orientation: portrait)").matches) return;

  const wrapper = document.getElementById('wod-display');
  if (!wrapper) return;

  // 1. LIMPIEZA INICIAL
  wrapper.style.transform = 'scale(1)';
  wrapper.style.height = 'auto'; 
  
  // 2. CÁLCULO DEL ESPACIO "VISUAL" (Considerando la rotación de TV)
  // window.innerHeight = Es el ANCHO visual (de izquierda a derecha en tu pared)
  // window.innerWidth  = Es el ALTO visual (de arriba a abajo en tu pared)

  // Usamos el 94% del ancho para aprovechar la pantalla al máximo sin tocar bordes
  const anchoVisualTotal = window.innerHeight * 0.94;
  
  // Usamos el 75% del alto (dejando hueco para logo y reloj arriba, y botones abajo)
  const altoVisualTotal = window.innerWidth * 0.75;

  // 3. FORZAR EL ANCHO (La clave para que no se vea angosto)
  // Le decimos al div: "Mide 1800px de ancho". 
  // Así el texto se estira a los lados y baja su altura.
  wrapper.style.width = `${anchoVisualTotal}px`;

  // 4. MEDIR LA ALTURA RESULTANTE
  const alturaContenido = wrapper.scrollHeight;

  // 5. CALCULAR EL ZOOM
  // Como ya fijamos el ancho para que quepa perfecto, solo nos preocupa la altura.
  let escala = altoVisualTotal / alturaContenido;

  // 6. LÍMITES DE ZOOM
  // Máximo 1.6x para que no sea absurdo en textos cortos
  if (escala > 1.6) escala = 1.6;
  
  // Mínimo 0.35x para que siempre entre todo
  if (escala < 0.35) escala = 0.35;

  // 7. APLICAR
  wrapper.style.transform = `scale(${escala})`;
}

// --- CONTROL DE TECLADO ---
document.addEventListener('keydown', function (event) {
  const key = event.key;

  if (key === '0') {
    toggleFullView();
    return;
  }

  if (isFullViewMode) {
    if (key === 'Escape' || key === 'Backspace' || key === '0') toggleFullView();
    return;
  }

  if (key >= '1' && key <= '9') {
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
