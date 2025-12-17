// 1. RELOJ DIGITAL
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

// 2. VARIABLES GLOBALES
const dias = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];
let currentSlideIndex = 0;
let currentWodParts = [];
let isFullViewMode = false; // Nueva variable de estado

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
    
    // Si estábamos en modo full, regenerarlo por si cambió el día
    if(isFullViewMode) renderFullView();
  }
}

// Renderiza un solo slide (Modo normal)
function renderSlide() {
  if(isFullViewMode) return; 

  const wrapper = document.getElementById('wod-display');
  wrapper.classList.add('fading');

  setTimeout(() => {
    const part = currentWodParts[currentSlideIndex];
    wrapper.innerHTML = `<h3>${part.titulo}</h3><p>${part.contenido}</p>`;

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

    ajustarEscala();
    wrapper.classList.remove('fading');
  }, 300);
}

// 3. NUEVA FUNCIÓN: MODO VISTA COMPLETA
function toggleFullView() {
  isFullViewMode = !isFullViewMode; // Alternar estado
  
  const fullContainer = document.getElementById('full-view-container');
  const slideWrapper = document.getElementById('wod-display');
  const indicator = document.getElementById('slide-indicator');
  const buttons = document.getElementById('nav-buttons');

  if (isFullViewMode) {
    // ACTIVAR MODO RESUMEN
    
    // 1. Generar contenido HTML concatenando todo
    let fullHTML = "";
    currentWodParts.forEach(part => {
      fullHTML += `
        <div class="full-section">
          <h3>${part.titulo}</h3>
          <p>${part.contenido}</p>
        </div>
      `;
    });
    fullContainer.innerHTML = fullHTML;

    // 2. Mostrar/Ocultar elementos
    fullContainer.classList.remove('hidden');
    slideWrapper.classList.add('hidden');
    indicator.classList.add('hidden');
    buttons.classList.add('hidden');

  } else {
    // VOLVER A MODO SLIDES
    fullContainer.classList.add('hidden');
    slideWrapper.classList.remove('hidden');
    indicator.classList.remove('hidden');
    buttons.classList.remove('hidden');
    
    // Re-ajustar escala por si acaso
    setTimeout(ajustarEscala, 100);
  }
}

function cambiarSlide(direccion) {
  if(isFullViewMode) return; // Bloquear cambios si estamos en resumen
  const nuevoIndex = currentSlideIndex + direccion;
  if (nuevoIndex >= 0 && nuevoIndex < currentWodParts.length) {
    currentSlideIndex = nuevoIndex;
    renderSlide();
  }
}

/* script.js - Reemplaza ajustarEscala() por esta versión V5 (Strict Fit) */

function ajustarEscala() {
  if (isFullViewMode) return; 
  if (window.matchMedia("(orientation: portrait)").matches) return; 

  const wrapper = document.getElementById('wod-display');
  if (!wrapper) return;

  // 1. DEFINIR EL ÁREA SEGURA (SAFE ZONE)
  // Al estar rotado -90deg:
  // innerHeight es tu ANCHO visual (lado a lado en la pared)
  // innerWidth es tu ALTO visual (arriba a abajo en la pared)
  
  // Dejamos un margen del 10% a los lados (ancho visual) para que no toque bordes
  const anchoVisualSeguro = window.innerHeight * 0.90; 
  
  // Dejamos un margen del 10% arriba y abajo (alto visual)
  const altoVisualSeguro = window.innerWidth * 0.90;

  // 2. CONFIGURAR LA CAJA
  // Forzamos al contenedor a tener EXACTAMENTE el ancho disponible seguro.
  // Esto obliga al texto (Warm up o Accesorio) a hacer saltos de línea aquí.
  wrapper.style.width = `${anchoVisualSeguro}px`;
  wrapper.style.height = "auto"; // La altura es libre por ahora
  wrapper.style.transform = 'scale(1)'; // Reset

  // 3. MEDIR EL DESBORDAMIENTO VERTICAL
  // Como ya fijamos el ancho, el texto solo puede crecer hacia "abajo" (CSS height)
  const alturaRealDelTexto = wrapper.scrollHeight;

  // 4. CALCULAR EL ZOOM NECESARIO
  // ¿Cabe la altura del texto en la altura disponible de la TV?
  let escala = 1;
  
  if (alturaRealDelTexto > altoVisualSeguro) {
    // Si es más alto que la pantalla, reducimos la escala
    escala = altoVisualSeguro / alturaRealDelTexto;
  }

  // 5. AJUSTES FINALES
  // Si el texto es muy corto (Warmup), la escala será 1.
  // Pero si quieres que el Warmup se vea GIGANTE, podemos permitir crecer un poco.
  // Si alturaReal es muy chica comparada con la pantalla, aumentamos escala.
  
  // Opcional: Si sobra mucho espacio vertical, agrandar hasta un máximo de 1.5
  const espacioSobrante = altoVisualSeguro / alturaRealDelTexto;
  if (espacioSobrante > 1) {
      escala = Math.min(espacioSobrante, 1.5); // Tope de 1.5x
  }

  // Límite inferior de seguridad (para que no sea ilegible)
  if (escala < 0.25) escala = 0.25;

  // 6. APLICAR
  wrapper.style.transform = `scale(${escala})`;
}

// 4. CONTROL DE TECLADO
document.addEventListener('keydown', function(event) {
  const key = event.key; 
  const code = event.keyCode; 

  // --- TECLA 0: TOGGLE VISTA COMPLETA ---
  if (key === '0' || code === 48 || code === 96) {
    toggleFullView();
    return;
  }

  // Si estamos en modo Full View, ignorar navegación normal
  if (isFullViewMode) {
     // Opcional: Permitir salir con Escape o Enter
     if(key === 'Escape' || key === 'Backspace') toggleFullView();
     return; 
  }

  // --- NAVEGACIÓN NORMAL (Slides) ---
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

// Init
window.addEventListener('load', () => { cargarWOD(); setTimeout(ajustarEscala, 500); });
window.addEventListener('resize', () => setTimeout(ajustarEscala, 100));
setInterval(cargarWOD, 60000);




